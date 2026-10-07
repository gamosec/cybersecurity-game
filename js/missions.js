/*
 * وضع "المهمة" التفاعلي (الفريق الأحمر / الفريق الأزرق).
 *
 * الفكرة: يتجول المتدرب في بيئة محاكاة ويبحث بنفسه عن "محطة عمل الفريق الأحمر" (دون أن يُقال له
 * شكلها أو لونها)، فتفتح له رسالة بريد ثم تحديات على شاشة الحاسوب: يختار الأساليب الصحيحة
 * (على مستوى التوعية) لتجاوز ضابط أمني يضعه الفريق الأزرق. بعد إنهائها يبحث عن محطة الفريق الأزرق
 * ويبني الدفاعات بالسحب والإفلات. التركيز التعليمي النهائي دائمًا على الحماية.
 *
 * بنية بيانات المهمة موثّقة في README.md.
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;
  const U = CE.util;
  const Sound = CE.Sound;
  const icons = CE.icons;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const bulb = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z"/></svg>';

  const teamIcon = {
    red: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v18" stroke="#ef4352" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M6 4h12l-3 4 3 4H6Z" fill="#ef4352"/></svg>',
    blue: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 19.4 5.4V11c0 5-3.1 8.9-7.4 10.5C7.7 19.9 4.6 16 4.6 11V5.4Z" fill="#3fa2e0"/><path d="m8.6 12 2.4 2.4 4.4-4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  let root;
  const S = {
    mission: null,
    timeLeft: 0,
    timerId: null,
    paused: false,
    over: false,
    phase: 'red',      // red ثم blue
    idx: 0,            // رقم التحدي ضمن الفريق الحالي
    emailSeen: {},     // أُظهرت رسالة الفريق؟
    hintLevel: 0,
    results: [],       // { team, id, correct }
    score: 0
  };

  /* ---------------- مساعدات ---------------- */

  function iconFor(o) {
    if (o.icon) return CE.Icons.get(o.icon);
    return CE.Icons.forText(o.text) || '';
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function teamName(team) { return S.mission.teams[team].title; }
  function teamDone(team) { return S.results.filter((r) => r.team === team).length >= S.mission.teams[team].challenges.length; }

  /* ---------------- إنشاء الشاشة ---------------- */

  function ensureRoot() {
    if (root) return root;
    root = document.createElement('section');
    root.id = 'screen-mission';
    root.className = 'screen';
    root.innerHTML =
      '<div class="m-scene" id="m-scene"></div>' +
      '<div class="m-topbar"><span class="m-time">عداد الوقت: <b id="m-time">00:00</b></span>' +
      '<span class="m-title" id="m-title"></span></div>' +
      '<div class="m-side">' +
      '<div class="m-stat"><span>النقاط</span><b id="m-score">0</b></div>' +
      '<button class="m-stat m-hint" id="m-hint" type="button"><span>تلميحات</span>' + bulb + '</button>' +
      '</div>' +
      '<div class="m-toast" id="m-toast" role="status" aria-live="polite"></div>' +
      '<div class="m-overlay" id="m-overlay" hidden></div>';
    document.getElementById('stage').appendChild(root);
    root.querySelector('#m-hint').addEventListener('click', onHint);
    const scene = root.querySelector('#m-scene');
    scene.addEventListener('click', (e) => {
      const g = e.target.closest('[data-station]');
      if (g) onStation(g);
    });
    scene.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const g = e.target.closest && e.target.closest('[data-station]');
      if (g) { e.preventDefault(); onStation(g); }
    });
    window.addEventListener('resize', fitScene);
    return root;
  }

  function el(id) { return root.querySelector('#' + id); }

  function activate() {
    if (CE.engine && CE.engine.show) { CE.engine.show('screen-mission'); return; }
    document.querySelectorAll('.screen').forEach((sc) => sc.classList.toggle('active', sc === root));
  }

  /* ---------------- بدء المهمة ---------------- */

  function start(mission) {
    ensureRoot();
    stopTimer();
    S.mission = mission;
    S.timeLeft = mission.timeLimit;
    S.paused = false;
    S.over = false;
    S.phase = 'red';
    S.idx = 0;
    S.emailSeen = {};
    S.hintLevel = 0;
    S.results = [];
    S.score = 0;
    activate();
    renderScene();
    updateHud();
    el('m-title').textContent = mission.title;
    briefing();
  }

  function renderScene() {
    const m = S.mission;
    const iso = new CE.Iso(m.isoOrigin[0], m.isoOrigin[1]);
    el('m-scene').innerHTML = '<svg viewBox="' + m.viewBox + '" xmlns="' + SVG_NS +
      '" preserveAspectRatio="xMidYMid meet" focusable="false">' + m.renderScene(iso) + '</svg>';
    root.querySelectorAll('[data-station]').forEach((g) => {
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', g.dataset.name || 'محطة عمل');
    });
    fitScene();
    refreshStations();
  }

  function fitScene() {
    const svg = el('m-scene') && el('m-scene').querySelector('svg');
    if (!svg || !S.mission) return;
    const fluid = window.innerWidth / window.innerHeight < 1.1;
    svg.setAttribute('viewBox', fluid ? (S.mission.mobileViewBox || '240 110 1120 760') : S.mission.viewBox);
    const sc = el('m-scene');
    if (fluid) sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2;
  }

  // لا نُظهر أي إشارة (توهج/لون) على المحطة المطلوبة؛ فقط علامة ✓ بعد إنجاز محطة
  function refreshStations() {
    root.querySelectorAll('[data-station="red"],[data-station="blue"]').forEach((g) => {
      g.classList.toggle('m-station-done', teamDone(g.dataset.station));
    });
  }

  /* ---------------- النوافذ ---------------- */

  function overlay(html, cls, keepRunning) {
    const o = el('m-overlay');
    o.className = 'm-overlay' + (cls ? ' ' + cls : '');
    o.innerHTML = html;
    o.hidden = false;
    S.paused = !keepRunning;
    return o;
  }
  function closeOverlay() { el('m-overlay').hidden = true; S.paused = false; }

  function panel(headIcon, headText, body, footBtn, cls) {
    return '<div class="m-card ' + (cls || '') + '">' +
      '<div class="m-card-head">' + headIcon + '<span>' + U.escape(headText) + '</span></div>' +
      '<div class="m-card-body">' + body + '</div>' +
      '<div class="m-card-foot">' + footBtn + '</div></div>';
  }
  const nextBtn = (id, label) => '<button class="m-next" id="' + id + '" type="button">' + icons.chevron + '<span>' + label + '</span></button>';

  function briefing() {
    const m = S.mission;
    const paras = (m.briefing.paragraphs || []).map((p) => '<p>' + U.escape(p) + '</p>').join('');
    overlay(panel(bulb, m.briefing.title || 'مقدمة', paras, nextBtn('m-brief-next', 'التالي'), 'm-brief'));
    el('m-brief-next').addEventListener('click', () => {
      Sound.click();
      closeOverlay();
      startTimer();
      teamIntro(S.phase);
    });
  }

  function teamIntro(team) {
    const t = S.mission.teams[team];
    S.hintLevel = 0;
    const body = '<p>' + U.escape(t.intro) + '</p>' +
      '<p class="m-find">' + U.escape(t.find) + '</p>';
    overlay(panel(teamIcon[team], t.title, body, nextBtn('m-ti-next', 'فهمت'), 'm-team-' + team), 'm-pass', true);
    el('m-ti-next').addEventListener('click', () => {
      Sound.click();
      closeOverlay();
      if (document.body.classList.contains('fluid')) toast('اسحب المشهد يمينًا ويسارًا للبحث عن المحطة');
    });
  }

  /* ---------------- النقر على محطة ---------------- */

  function onStation(g) {
    if (S.over || !el('m-overlay').hidden) return;
    const kind = g.dataset.station;
    if (kind === 'decoy') {
      Sound.click();
      toast((g.dataset.name ? 'هذه ' + g.dataset.name + '. ' : '') + 'ليست محطة عمل ' + teamName(S.phase) + '. واصل البحث.');
      return;
    }
    if (kind !== S.phase || teamDone(kind)) {
      Sound.click();
      toast(teamDone(kind) ? 'أنجزت مهام ' + teamName(kind) + ' بالفعل.' : 'أنجز مهام ' + teamName(S.phase) + ' أولًا.');
      return;
    }
    Sound.open();
    if (!S.emailSeen[kind]) { S.emailSeen[kind] = true; showEmail(kind); } else challenge();
  }

  /* ---------------- شاشة الحاسوب ---------------- */

  const desktopIcons =
    '<div class="m-dicons" aria-hidden="true">' +
    ['monitor', 'folder', 'printer', 'trash'].map((n) =>
      '<div class="m-dicon">' + CE.Icons.get(n) + '<i></i></div>').join('') + '</div>';

  function monitor(team, innerApp, cls) {
    return '<div class="m-monitor m-mon-' + team + (cls ? ' ' + cls : '') + '">' +
      '<div class="m-wall"></div>' + desktopIcons +
      '<div class="m-app">' + innerApp + '</div></div>';
  }

  function appBar(team, title, xId) {
    return '<div class="m-app-bar">' +
      '<span class="m-ctl"><button type="button" class="m-x" ' + (xId ? 'id="' + xId + '"' : 'tabindex="-1"') + ' aria-label="إغلاق">' +
      '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<i><svg viewBox="0 0 24 24"><rect x="5" y="8" width="11" height="11" rx="1.5"/><path d="M9 8V5h10v10h-3"/></svg></i>' +
      '<i><svg viewBox="0 0 24 24"><path d="M6 18h12"/></svg></i></span>' +
      '<span class="m-app-title">' + teamIcon[team] + '<span>' + U.escape(title) + '</span></span></div>';
  }

  const appTools =
    '<div class="m-app-tools" aria-hidden="true"><span class="m-nav"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></span>' +
    '<span class="m-addr"><svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2M20 4v5h-5"/></svg></span>' +
    '<span class="m-search"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="M15 15l5 5"/></svg></span></div>';

  const sideLines = '<div class="m-side-list" aria-hidden="true">' +
    Array.from({ length: 13 }, (_, i) => '<div><i></i><b style="width:' + (62 + ((i * 17) % 34)) + '%"></b></div>').join('') + '</div>';

  function showEmail(team) {
    const t = S.mission.teams[team];
    const e = t.email;
    const app =
      appBar(team, t.title, 'm-x') + appTools +
      '<div class="m-app-main"><div class="m-mail">' +
      '<div class="m-mail-head">' +
      '<div class="m-avatar"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4.6"/><path d="M3.5 22c0-5 4-8 8.5-8s8.5 3 8.5 8Z"/></svg></div>' +
      '<div class="m-mail-meta"><div class="m-field"><em>المرسل:</em> ' + U.escape(e.from) + ' <span dir="ltr">(' + U.escape(e.address) + ')</span></div>' +
      '<div class="m-field"><em>الموضوع:</em> ' + U.escape(e.subject) + '</div></div></div>' +
      '<div class="m-mail-body">' + e.body.map((p) => '<p>' + U.escape(p) + '</p>').join('') + '</div>' +
      '<div class="m-mail-foot"><button class="m-send m-continue" id="m-mail-go" type="button">' + icons.check + '<span>متابعة</span></button></div>' +
      '</div></div>';
    overlay(monitor(team, app, 'm-mon-mail'), 'm-screen-ov', true);
    el('m-x').classList.add('m-attn');
    const go = () => { Sound.click(); challenge(); };
    el('m-x').addEventListener('click', go);
    el('m-mail-go').addEventListener('click', go);
  }

  /* ---------------- عرض التحدي ---------------- */

  function challenge() {
    const team = S.phase;
    const t = S.mission.teams[team];
    const ch = t.challenges[S.idx];
    const isDnd = ch.ui === 'dnd';
    const order = shuffle(ch.options.map((o, i) => i));

    const cards = order.map((i) => {
      const o = ch.options[i];
      return '<button type="button" class="m-opt" data-i="' + i + '"' + (isDnd ? ' draggable="true"' : '') + '>' +
        '<span class="m-opt-ic">' + iconFor(o) + '</span><span class="m-opt-tx">' + U.escape(o.text) + '</span></button>';
    }).join('');

    const body = isDnd
      ? '<div class="m-dnd">' +
          '<div class="m-pool" id="m-tray" aria-label="الخيارات">' + cards + '</div>' +
          '<div class="m-box-wrap"><span class="m-box-label">' + U.escape(ch.instruction || 'اسحب الإجابات الصحيحة إلى هنا') + '</span>' +
          '<div class="m-box" id="m-drop" aria-label="صندوق الإجابة"></div></div>' +
        '</div>'
      : '<div class="m-cards" id="m-tray">' + cards + '</div>';

    const app = appBar(team, t.title) + appTools +
      '<div class="m-app-main">' +
      '<div class="m-app-content">' +
      '<div class="m-step" dir="ltr">' + (S.idx + 1) + ' / ' + t.challenges.length + '</div>' +
      '<p class="m-prompt">' + U.escape(ch.prompt) + '</p>' +
      body +
      '<div class="m-app-foot"><button class="m-send" id="m-send" type="button" disabled>' + icons.check + '<span>إرسال</span></button></div>' +
      '</div>' + sideLines + '</div>';

    overlay(monitor(team, app), 'm-screen-ov', true);
    wireChallenge(ch, isDnd);
  }

  function wireChallenge(ch, isDnd) {
    const send = el('m-send');
    const tray = el('m-tray');
    const drop = isDnd ? el('m-drop') : null;

    const selected = () => {
      if (isDnd) return Array.from(drop.querySelectorAll('.m-opt')).map((c) => Number(c.dataset.i));
      return Array.from(tray.querySelectorAll('.m-opt.on')).map((c) => Number(c.dataset.i));
    };
    const refresh = () => { send.disabled = selected().length === 0; };

    if (isDnd) {
      const move = (chip, to) => { to.appendChild(chip); refresh(); };
      tray.addEventListener('click', (e) => { const c = e.target.closest('.m-opt'); if (c) { Sound.click(); move(c, drop); } });
      drop.addEventListener('click', (e) => { const c = e.target.closest('.m-opt'); if (c) { Sound.click(); move(c, tray); } });
      let dragged = null;
      root.querySelectorAll('.m-opt').forEach((c) => {
        c.addEventListener('dragstart', () => { dragged = c; c.classList.add('m-dragging'); });
        c.addEventListener('dragend', () => { c.classList.remove('m-dragging'); dragged = null; });
      });
      [tray, drop].forEach((zone) => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('m-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('m-over'));
        zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('m-over'); if (dragged) move(dragged, zone); });
      });
    } else {
      tray.addEventListener('click', (e) => {
        const c = e.target.closest('.m-opt');
        if (!c) return;
        Sound.click();
        c.classList.toggle('on');
        refresh();
      });
    }
    send.addEventListener('click', () => submit(ch, selected()));
  }

  function submit(ch, picked) {
    if (!picked.length) return;
    const correct = ch.options.every((o, i) => !!o.correct === (picked.indexOf(i) !== -1));
    S.results.push({ team: S.phase, id: ch.id, correct });
    if (correct) { S.score += S.mission.pointsPerChallenge; Sound.correct(); } else Sound.wrong();
    updateHud();
    feedback(ch, correct);
  }

  function feedback(ch, correct) {
    const right = ch.options.filter((o) => o.correct).map((o) => U.escape(o.text)).join('، ');
    const tips = (ch.feedback.tips || []).map((t) => '<li>' + U.escape(t) + '</li>').join('');
    const body = (correct ? '' : '<p class="m-answer-key">الإجابات الصحيحة: <b>' + right + '</b></p>') +
      '<p>' + U.escape(ch.feedback.summary) + '</p>' + (tips ? '<ul>' + tips + '</ul>' : '');
    overlay(panel(correct ? icons.shieldCheck : icons.shieldOff, correct ? 'إجابة صحيحة!' : 'إجابة غير صحيحة', body,
      nextBtn('m-fb-next', 'متابعة'), correct ? 'm-ok' : 'm-bad'), 'm-fb-ov');
    el('m-fb-next').addEventListener('click', () => { Sound.click(); closeOverlay(); advance(); });
  }

  function advance() {
    const team = S.phase;
    S.idx += 1;
    refreshStations();
    if (S.idx < S.mission.teams[team].challenges.length) { challenge(); return; }
    if (team === 'red') {
      S.phase = 'blue';
      S.idx = 0;
      const t = S.mission.teams.blue;
      S.hintLevel = 0;
      overlay(panel(teamIcon.blue, 'أحسنت! انتهت مهمة ' + S.mission.teams.red.title,
        '<p>' + U.escape(S.mission.switchText) + '</p><p class="m-find">' + U.escape(t.find) + '</p>',
        nextBtn('m-sw-next', 'إلى ' + t.title), 'm-team-blue'), 'm-pass', true);
      el('m-sw-next').addEventListener('click', () => { Sound.click(); closeOverlay(); });
      return;
    }
    finish();
  }

  /* ---------------- المؤقت والـ HUD ---------------- */

  function startTimer() {
    stopTimer();
    S.timerId = window.setInterval(() => {
      if (S.paused || S.over) return;
      S.timeLeft -= 1;
      if (S.timeLeft <= 10 && S.timeLeft > 0) Sound.tick();
      updateHud();
      if (S.timeLeft <= 0) timeUp();
    }, 1000);
  }
  function stopTimer() { if (S.timerId) window.clearInterval(S.timerId); S.timerId = null; }

  function updateHud() {
    el('m-time').textContent = U.formatTime(Math.max(0, S.timeLeft));
    el('m-score').textContent = S.score;
    root.querySelector('.m-topbar').classList.toggle('warn', S.timeLeft <= 20);
  }

  function timeUp() {
    S.over = true;
    stopTimer();
    Sound.timeUp();
    finish(true);
  }

  let toastTimer = null;
  function toast(msg) {
    const t = el('m-toast');
    t.textContent = msg;
    t.classList.add('on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => t.classList.remove('on'), 3200);
  }

  // التلميح الأول وصف للمكان فقط، والثاني يومض على المحطة المطلوبة
  function onHint() {
    if (S.over || !el('m-overlay').hidden) return;
    Sound.click();
    const team = S.phase;
    const t = S.mission.teams[team];
    S.hintLevel += 1;
    if (S.hintLevel === 1) { toast('تلميح: ' + t.hint); return; }
    toast('انظر إلى المحطة التي تومض.');
    root.querySelectorAll('[data-station="' + team + '"]').forEach((g) => {
      g.classList.remove('m-pulse'); void g.getBBox(); g.classList.add('m-pulse');
      window.setTimeout(() => g.classList.remove('m-pulse'), 2600);
    });
  }

  /* ---------------- النتائج ---------------- */

  function finish(timedOut) {
    S.over = true;
    stopTimer();
    const m = S.mission;
    const total = m.teams.red.challenges.length + m.teams.blue.challenges.length;
    const correct = S.results.filter((r) => r.correct).length;
    const qPts = correct * m.pointsPerChallenge;
    const qMax = total * m.pointsPerChallenge;
    const pass = !timedOut && correct >= Math.ceil(total * (m.passRatio || 0.6));
    const bonus = pass ? Math.round((Math.max(0, S.timeLeft) / m.timeLimit) * m.timeBonusMax) : 0;   // المكافأة عند النجاح فقط
    const grand = qPts + bonus;
    const max = qMax + m.timeBonusMax;

    const row = (team) => {
      const chs = m.teams[team].challenges;
      const c = S.results.filter((r) => r.team === team && r.correct).length;
      const done = S.results.filter((r) => r.team === team).length;
      return '<div class="m-res-team">' + teamIcon[team] +
        '<span class="m-res-name">' + U.escape(m.teams[team].title) + '</span>' +
        '<span class="m-res-num"><span dir="ltr">' + c + ' / ' + chs.length + '</span>' + (done < chs.length ? ' (لم يكتمل)' : '') + '</span></div>';
    };

    const key = 'cyberEscape.best.' + m.id;
    const prev = parseInt(U.storageGet(key), 10);
    let best;
    if (isNaN(prev) || grand > prev) { U.storageSet(key, String(grand)); best = isNaN(prev) ? '' : 'رقم قياسي جديد! 🎉'; }
    else best = 'أفضل نتيجة سابقة: ' + prev;

    overlay(
      '<div class="m-card m-result ' + (pass ? 'm-ok' : 'm-bad') + '">' +
      '<h2 class="m-res-title">' + (pass ? 'نجحت في المهمة!' : (timedOut ? 'انتهى الوقت!' : 'لم تكتمل المهمة')) + '</h2>' +
      '<p class="m-res-sub">' + (pass ? 'أتقنت التفكير الهجومي والدفاعي معًا.' : 'راجع الدفاعات الصحيحة وأعد المحاولة.') + '</p>' +
      row('red') + row('blue') +
      '<div class="m-res-rows">' +
      '<div><span>الإجابات الصحيحة</span><b dir="ltr">' + correct + ' / ' + total + '</b><em>' + qPts + ' / ' + qMax + '</em></div>' +
      '<div><span>مكافأة الوقت</span><b dir="ltr">' + U.formatTime(Math.max(0, S.timeLeft)) + '</b><em>' + bonus + ' / ' + m.timeBonusMax + '</em></div>' +
      '<div class="m-res-total"><span>الدرجة النهائية</span><b></b><em>' + grand + ' / ' + max + '</em></div>' +
      '</div>' + review() +
      '<p class="m-res-best">' + best + '</p>' +
      '<div class="m-res-actions">' +
      '<button class="m-btn" id="m-retry" type="button">إعادة المحاولة</button>' +
      '<button class="m-btn m-btn-light" id="m-exit" type="button">القائمة</button>' +
      '</div></div>', 'm-result-ov');
    if (pass) Sound.finish();
    el('m-retry').addEventListener('click', () => { Sound.click(); start(m); });
    el('m-exit').addEventListener('click', () => { Sound.click(); exit(); });
  }

  // مراجعة كل تحدٍ: ✓/✗ مع الإجابات الصحيحة لما أُخطئ فيه
  function review() {
    const m = S.mission;
    let items = '';
    ['red', 'blue'].forEach((team) => {
      m.teams[team].challenges.forEach((ch) => {
        const r = S.results.find((x) => x.team === team && x.id === ch.id);
        const state = !r ? 'skip' : (r.correct ? 'ok' : 'bad');
        const right = ch.options.filter((o) => o.correct).map((o) => U.escape(o.text)).join('، ');
        items += '<li class="m-rv-' + state + ' m-rv-' + team + '">' +
          '<span class="m-rv-mark">' + (state === 'ok' ? '✓' : (state === 'bad' ? '✗' : '–')) + '</span>' +
          '<span class="m-rv-text"><b>' + U.escape(ch.label || ch.id) + '</b>' +
          (state === 'ok' ? '' : '<small>الصحيح: ' + right + '</small>') + '</span></li>';
      });
    });
    return '<details class="m-review"' + (S.results.every((r) => r.correct) && S.results.length ? '' : ' open') + '>' +
      '<summary>مراجعة إجاباتك</summary><ul>' + items + '</ul></details>';
  }

  function exit() {
    stopTimer();
    closeOverlay();
    if (CE.engine) { CE.engine.renderMenu(); CE.engine.show('screen-menu'); }
  }

  CE.Mission = { start };
})();
