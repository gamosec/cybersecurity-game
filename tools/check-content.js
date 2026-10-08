#!/usr/bin/env node
/*
 * فحص ثابت للمحتوى والبنية (بدون متصفح): node tools/check-content.js
 * يخرج بالرمز 1 عند وجود أي خطأ. شغّله قبل كل commit.
 *
 * يفحص: أرقام الإصدار ?v= في index.html، تطابق الملفات مع وسوم script، قواعد المحتوى
 * (4 خيارات، إجابة صحيحة واحدة على الأقل، أيقونة لكل خيار)، التعليم data-hotspot / data-station،
 * تكرار معرّفات SVG بين المشاهد، واختبارات الأخطاء التي وقعنا فيها سابقًا (انظر docs/LESSONS.md).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

/* ---------- 1) index.html ---------- */
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const tags = [...html.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)\?v=(\d+)"/g)].map((m) => ({ file: m[1], v: m[2] }));
const versions = new Set(tags.map((t) => t.v));
if (versions.size !== 1) err('أرقام الإصدار ?v= غير موحّدة في index.html: ' + [...versions].join(', '));
const listed = new Set(tags.map((t) => t.file));
const onDisk = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p); else if (/\.js$/.test(f)) onDisk.push(path.relative(root, p).replace(/\\/g, '/'));
  }
})(path.join(root, 'js'));
onDisk.forEach((f) => { if (!listed.has(f)) err('ملف js غير مُضمَّن في index.html: ' + f); });
listed.forEach((f) => { if (!fs.existsSync(path.join(root, f))) err('وسم يشير إلى ملف غير موجود: ' + f); });
const order = tags.map((t) => t.file);
['js/core.js', 'js/iso.js', 'js/icon-lib.js', 'js/audio.js', 'js/missions.js', 'js/journeys.js'].forEach((f) => {
  if (order.indexOf(f) > order.indexOf('js/game.js') || order.indexOf(f) < 0) err('ترتيب الوسوم خاطئ: ' + f + ' يجب أن يسبق js/game.js');
});
if (order.indexOf('js/game.js') !== order.length - 1) err('js/game.js يجب أن يكون آخر وسم script');

/* ---------- 2) تحميل السيناريوهات في Node ---------- */
global.window = { addEventListener() {} };
global.document = { getElementById() { return null; } };
['core', 'iso', 'icon-lib', 'journeys'].forEach((f) => require(path.join(root, 'js', f + '.js')));
const CE = window.CyberEscape;
const files = onDisk.filter((f) => f.startsWith('js/scenarios/') && !/upcoming/.test(f));
files.forEach((f) => { try { require(path.join(root, f)); } catch (e) { err(f + ': فشل التحميل: ' + e.message); } });
try { require(path.join(root, 'js/scenarios/upcoming.js')); } catch (e) { err('upcoming.js: ' + e.message); }

const ids = new Set();
const numbers = new Set();
const svgIds = new Map();           // معرّف SVG → السيناريو الذي عرّفه
const COLOR_LEAK = /(باللون|لونه|لونها|الجهاز الأحمر|الجهاز الأزرق|جهاز أحمر|جهاز أزرق|المحطة الحمراء|المحطة الزرقاء)/;
const RIYAL = /ريال/;

CE.scenarios.forEach((s) => {
  const tag = '[' + s.id + '] ';
  if (ids.has(s.id)) err(tag + 'معرّف السيناريو مكرر');
  ids.add(s.id);
  if (s.number != null) { if (numbers.has(s.number)) err(tag + 'رقم السيناريو مكرر: ' + s.number); numbers.add(s.number); }
  if (s.comingSoon) return;

  ['title', 'heading', 'description', 'timeLimit', 'pointsPerChallenge', 'timeBonusMax', 'viewBox', 'isoOrigin', 'renderScene', 'renderIntroArt'].forEach((k) => {
    if (s[k] == null) err(tag + 'حقل ناقص: ' + k);
  });

  // معرّفات SVG في المشهد (تظهر كل المشاهد معًا في القائمة، فلا يجوز تكرار معرّف بين سيناريوهين)
  let scene = '';
  try { scene = s.renderScene(new CE.Iso(s.isoOrigin[0], s.isoOrigin[1])); } catch (e) { err(tag + 'renderScene فشل: ' + e.message); }
  [...scene.matchAll(/\bid="([^"]+)"/g)].forEach((m) => {
    if (svgIds.has(m[1]) && svgIds.get(m[1]) !== s.id) err(tag + 'معرّف SVG مكرر مع ' + svgIds.get(m[1]) + ': ' + m[1] + ' (ابدأ المعرّفات ببادئة السيناريو)');
    svgIds.set(m[1], s.id);
  });
  if (/text-anchor="end"/.test(scene)) warn(tag + 'text-anchor="end" في مشهد RTL: يعني الحافة اليسرى! استخدم start أو middle (docs/LESSONS.md)');

  if (s.type === 'journey') {
    const iconOk = (t, o) => {
      if (o.icon) { const [b, bd] = o.icon.split('+'); if (!CE.Icons.names.includes(b) || (bd && !CE.Icons.badges.includes(bd))) err(t + 'أيقونة غير معرّفة: ' + o.icon); }
      else if (!CE.Icons.forText(o.text)) err(t + 'لا توجد أيقونة: ' + o.text);
    };
    if (!s.scenes || s.scenes.length < 2) err(tag + 'المشاهد ناقصة');
    const focuses = new Set([...scene.matchAll(/data-focus="([^"]+)"/g)].map((m) => m[1]));
    const items = new Set([...scene.matchAll(/data-item="([^"]+)"/g)].map((m) => m[1]));
    (s.scenes || []).forEach((sc) => {
      const t = tag + 'scene:' + sc.id + ' ';
      ['caption', 'narration', 'hint', 'cam', 'camMobile', 'kind', 'feedback'].forEach((k) => { if (sc[k] == null) err(t + 'حقل ناقص: ' + k); });
      if (!sc.feedback || !sc.feedback.summary || !sc.feedback.tips || !sc.feedback.tips.length) err(t + 'التغذية الراجعة ناقصة');
      const every = [sc.narration, sc.hint, sc.prompt, sc.feedback && sc.feedback.summary, ...((sc.feedback && sc.feedback.tips) || [])];
      every.forEach((x) => { if (x && RIYAL.test(x)) warn(t + 'العملة (ريال)'); });
      if (sc.kind === 'choice') {
        if (!sc.options || sc.options.length !== 4) err(t + 'يجب 4 خيارات');
        if (!(sc.options || []).some((o) => o.correct)) err(t + 'لا إجابة صحيحة');
        (sc.options || []).forEach((o) => iconOk(t, o));
        if (!focuses.has(sc.focus)) err(t + 'المشهد بلا data-focus="' + sc.focus + '"');
      } else if (sc.kind === 'items') {
        (sc.items || []).forEach((o) => { iconOk(t + o.id + ' ', o); if (!items.has(o.id)) err(t + 'العنصر ' + o.id + ' بلا data-item في المشهد'); if (!o.why) err(t + o.id + ' بلا why'); });
        if (!(sc.items || []).some((o) => o.take) || !(sc.items || []).some((o) => !o.take)) err(t + 'يلزم عناصر تؤخذ وأخرى تُترك');
      } else if (sc.kind === 'wifi') {
        if (!sc.networks || sc.networks.length < 3) err(t + 'شبكات قليلة');
        if (!(sc.networks || []).some((n) => n.trusted)) err(t + 'لا شبكة موثوقة');
        if (!(sc.networks || []).some((n) => !n.trusted)) err(t + 'لا شبكة غير موثوقة');
        if (!focuses.has(sc.focus)) err(t + 'المشهد بلا data-focus="' + sc.focus + '"');
      } else err(t + 'نوع غير معروف: ' + sc.kind);
    });
    return;
  }
  const groups = s.type === 'mission' ? [['red', s.teams.red.challenges], ['blue', s.teams.blue.challenges]] : [['room', s.challenges]];
  const seen = new Set();
  groups.forEach(([g, list]) => {
    list.forEach((c) => {
      const t = tag + g + ':' + c.id + ' ';
      if (seen.has(c.id)) err(t + 'معرّف التحدي مكرر');
      seen.add(c.id);
      if (!c.options || c.options.length !== 4) err(t + 'يجب أن يحتوي التحدي على 4 خيارات (الموجود: ' + (c.options && c.options.length) + ')');
      const right = (c.options || []).filter((o) => o.correct).length;
      if (right < 1) err(t + 'لا توجد إجابة صحيحة');
      if (!c.feedback || !c.feedback.summary || !c.feedback.tips || !c.feedback.tips.length) err(t + 'التغذية الراجعة ناقصة (summary + tips)');
      (c.options || []).forEach((o) => {
        if (!o.text) err(t + 'خيار بلا نص');
        if (RIYAL.test(o.text || '')) warn(t + 'العملة: استخدم الدينار افتراضيًا: ' + o.text);
        if (o.icon) { const svg = CE.Icons.get(o.icon); const [b, bd] = o.icon.split('+'); if (!CE.Icons.names.includes(b) || (bd && !CE.Icons.badges.includes(bd))) err(t + 'أيقونة غير معرّفة: ' + o.icon); void svg; }
        else if (!CE.Icons.forText(o.text)) err(t + 'لا توجد أيقونة لهذا الخيار (أضف icon: أو قاعدة في icon-lib.js): ' + o.text);
      });
      [c.feedback && c.feedback.summary, ...((c.feedback && c.feedback.tips) || [])].forEach((x) => { if (x && RIYAL.test(x)) warn(t + 'العملة (ريال) في التغذية الراجعة'); });
      if (s.type === 'mission' && g === 'blue' && c.ui !== 'dnd') warn(t + 'تحديات الفريق الأزرق تُصمَّم عادة بالسحب والإفلات (ui: "dnd")');
    });
  });

  if (s.type === 'mission') {
    ['red', 'blue'].forEach((k) => {
      const team = s.teams[k];
      ['title', 'intro', 'find', 'hint', 'email'].forEach((f) => { if (!team[f]) err(tag + k + ': حقل ناقص ' + f); });
      [team.intro, team.find, team.hint, s.briefing && s.briefing.paragraphs.join(' '), s.switchText].forEach((txt) => {
        if (txt && COLOR_LEAK.test(txt)) err(tag + k + ': النص يكشف لون المحطة (يجب أن يبحث المتدرب بنفسه): ' + txt.slice(0, 50));
      });
    });
    ['red', 'blue', 'decoy'].forEach((k) => { if (!new RegExp('data-station="' + k + '"').test(scene)) err(tag + 'المشهد لا يحتوي data-station="' + k + '"'); });
    if (!/class="hit"/.test(scene)) err(tag + 'المحطات تحتاج عنصر class="hit" لمنطقة النقر');
    const decoys = (scene.match(/data-station="decoy"/g) || []).length;
    if (decoys < 2) warn(tag + 'محطات التمويه قليلة (' + decoys + ')، والأفضل 4 فأكثر');
  } else {
    // كل challenge يجب أن يقابله data-hotspot في المشهد والعكس
    const hs = new Set([...scene.matchAll(/data-hotspot="([^"]+)"/g)].map((m) => m[1]));
    s.challenges.forEach((c) => { if (!hs.has(c.id)) err(tag + 'التحدي ' + c.id + ' بلا data-hotspot في المشهد'); });
    hs.forEach((h) => { if (!s.challenges.some((c) => c.id === h)) err(tag + 'data-hotspot="' + h + '" بلا تحدي مقابل'); });
    if (s.challenges.length !== 5) warn(tag + 'عدد التحديات ' + s.challenges.length + ' (المعتاد 5 لتطابق شاشة الدروع والنقاط 280)');
    const counts = s.challenges.map((c) => c.options.filter((o) => o.correct).length);
    if (new Set(counts).size < 3) warn(tag + 'تنوّع عدد الإجابات الصحيحة قليل: ' + counts.join(','));
  }
});

/* ---------- 3) أخطاء الشيفرة المعروفة ---------- */
onDisk.forEach((f) => {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  if (/\bconsole\.log\(/.test(src)) warn(f + ': console.log متبقٍ');
  if (/\balert\(/.test(src)) err(f + ': لا تستخدم alert()');
});

/* ---------- تقرير ---------- */
const real = CE.scenarios.filter((s) => !s.comingSoon);
console.log('السيناريوهات: ' + real.length + ' | المهام: ' + real.filter((s) => s.type === 'mission').length + ' | الأيقونات: ' + CE.Icons.names.length + ' رسمًا و' + CE.Icons.badges.length + ' شارة | الإصدار v=' + [...versions][0]);
warns.forEach((w) => console.log('تحذير: ' + w));
errors.forEach((e) => console.log('خطأ:   ' + e));
console.log(errors.length ? '\n✗ فشل الفحص: ' + errors.length + ' خطأ' : '\n✓ نجح الفحص' + (warns.length ? ' (مع ' + warns.length + ' تحذير)' : ''));
process.exit(errors.length ? 1 : 0);
