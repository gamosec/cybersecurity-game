/*
 * وضع "الرحلة" التفاعلي: عالم واحد مرسوم (مثل مقهى) والكاميرا تنتقل بين مشاهده، وفي كل مشهد
 * يتفاعل المتدرب مع أشياء حقيقية في العالم، ثم يرسل قراره ويرى النتيجة قبل الانتقال للمشهد التالي.
 *
 * أنواع التفاعل (scene.kind):
 *   choice  اضغط الشيء في العالم (scene.focus) فيفتح جهازًا (device: 'call' | 'camera') وخيارات مصورة 4، ثم إرسال.
 *   items   اضغط الأغراض مباشرة في العالم لتحديد ما ستأخذه معك، ثم زر الإرسال في الأسفل.
 *   wifi    اضغط الهاتف فتظهر قائمة شبكات واي فاي؛ اختر شبكة وقرّر تفعيل VPN، ثم اتصال.
 * بنية البيانات الكاملة في docs/ARCHITECTURE.md.
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;
  const U = CE.util;
  const Sound = CE.Sound;
  const icons = CE.icons;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  let root = null;
  const S = {
    j: null, idx: 0, timeLeft: 0, timerId: null, paused: false, over: false, busy: false,
    score: 0, results: [], items: new Set(), net: null, vpn: false, pick: new Set(),
    cam: null, raf: 0, markerT: 0
  };

  const el = (id) => root.querySelector('#' + id);
  const scene = () => S.j.scenes[S.idx];
  const fluid = () => document.body.classList.contains('fluid');
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- أدوات رسم يستعملها ملف العالم ---------------- */

  // حلقة تحديد داخل مجموعة عنصر قابل للتحديد (تُظهر ✓ عند اختياره)
  function ring(cx, cy, rx, ry) {
    return '<ellipse class="j-ring" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>';
  }

  // رمز QR شكلي (ليس رمزًا حقيقيًا) بحجم size عند (x0, y0)
  function qrSvg(x0, y0, size) {
    const n = 21, c = size / n;
    let seed = 11;
    const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const inFinder = (i, j) => (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
    let s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + size + '" height="' + size + '" fill="#fff"/>';
    for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) {
      if (!inFinder(i, k) && rand() < 0.48) s += '<rect x="' + (x0 + i * c).toFixed(2) + '" y="' + (y0 + k * c).toFixed(2) + '" width="' + c.toFixed(2) + '" height="' + c.toFixed(2) + '"/>';
    }
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach((p) => {
      const fx = x0 + p[0] * c, fy = y0 + p[1] * c;
      s += '<rect x="' + fx + '" y="' + fy + '" width="' + 7 * c + '" height="' + 7 * c + '"/>' +
        '<rect x="' + (fx + c) + '" y="' + (fy + c) + '" width="' + 5 * c + '" height="' + 5 * c + '" fill="#fff"/>' +
        '<rect x="' + (fx + 2 * c) + '" y="' + (fy + 2 * c) + '" width="' + 3 * c + '" height="' + 3 * c + '"/>';
    });
    return '<g fill="#1d232a">' + s + '</g>';
  }

  /* ---------------- إنشاء الشاشة ---------------- */

  function ensureRoot() {
    if (root) return root;
    root = document.createElement('section');
    root.id = 'screen-journey';
    root.className = 'screen';
    root.innerHTML =
      '<div class="j-world" id="j-world"></div>' +
      '<div class="j-marker" id="j-marker" hidden aria-hidden="true"><i></i><i></i><svg viewBox="0 0 24 24"><path d="M9 11V5a2 2 0 0 1 4 0v5l5 1.3a2 2 0 0 1 1.5 2.4l-.9 4.6a3 3 0 0 1-2.9 2.4h-4.8a3 3 0 0 1-2.4-1.2L5 15.5a1.7 1.7 0 0 1 2.5-2.3L9 14Z"/></svg></div>' +
      '<div class="hud j-hud">' +
      '<div class="hud-stats" role="status" aria-live="polite">' +
      '<div class="stat"><span class="stat-label">عداد الوقت</span><span class="stat-value" id="j-time">00:00</span></div>' +
      '<div class="stat-sep" aria-hidden="true"></div>' +
      '<div class="stat"><span class="stat-label">الدرجة</span><span class="stat-value" id="j-score">0</span></div></div>' +
      '<div class="hud-shields" id="j-shields"></div></div>' +
      '<div class="j-chip" id="j-chip"></div>' +
      '<div class="j-story" id="j-story"></div>' +
      '<div class="j-dock" id="j-dock" hidden></div>' +
      '<button class="side-btn side-btn-left j-hintbtn" id="j-hint" type="button" aria-label="تلميح">' + icons.bell + '</button>' +
      '<div class="toast" id="j-toast" role="status" aria-live="polite"></div>' +
      '<div class="modal j-overlay" id="j-overlay" hidden></div>' +
      '<div class="j-curtain" id="j-curtain" hidden></div>';
    document.getElementById('stage').appendChild(root);

    el('j-hint').addEventListener('click', onHint);
    const world = el('j-world');
    world.addEventListener('click', onWorldClick);
    world.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onWorldClick(e); }
    });
    window.addEventListener('resize', () => { if (S.j && !S.over) { setCam(camFor(scene()), true); placeMarker(); } });
    return root;
  }

  /* ---------------- بدء الرحلة ---------------- */

  function start(j) {
    ensureRoot();
    stopTimer();
    window.cancelAnimationFrame(S.raf);
    Object.assign(S, { j: j, idx: 0, timeLeft: j.timeLimit, paused: false, over: false, busy: false, score: 0, results: [], items: new Set(), net: null, vpn: false, pick: new Set() });
    if (CE.engine && CE.engine.show) CE.engine.show('screen-journey');
    el('j-world').innerHTML = '<svg viewBox="' + camFor(j.scenes[0]).join(' ') + '" xmlns="' + SVG_NS +
      '" preserveAspectRatio="xMidYMid slice" focusable="false">' + j.renderScene(new CE.Iso(j.isoOrigin[0], j.isoOrigin[1])) + '</svg>';
    S.cam = camFor(j.scenes[0]).slice();
    addHits();
    el('j-shields').innerHTML = j.scenes.map((s, i) => '<span class="shield-badge" data-slot="' + i + '">' + icons.shield + '</span>').join('');
    el('j-overlay').hidden = true;
    el('j-curtain').hidden = true;
    el('j-dock').hidden = true;
    el('j-chip').textContent = '';
    el('j-story').innerHTML = '';
    updateHud();
    briefing();
  }

  function addHits() {
    const svg = el('j-world').querySelector('svg');
    svg.querySelectorAll('[data-focus],[data-item]').forEach((g) => {
      const bb = g.getBBox();
      const pad = 6;
      const r = document.createElementNS(SVG_NS, 'rect');
      r.setAttribute('class', 'hit');
      r.setAttribute('x', bb.x - pad); r.setAttribute('y', bb.y - pad);
      r.setAttribute('width', bb.width + pad * 2); r.setAttribute('height', bb.height + pad * 2);
      r.setAttribute('rx', 8);
      g.appendChild(r);   // منطقة النقر الشفافة فوق الرسم لتستقبل النقر دائمًا
      g.classList.add('j-hot');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', g.dataset.name || 'عنصر');
    });
  }

  /* ---------------- الكاميرا ---------------- */

  function camFor(sc) {
    return (fluid() && sc.camMobile) || sc.cam || [0, 0, 1600, 900];
  }

  function setCam(rect, instant, cb) {
    const svg = el('j-world').querySelector('svg');
    if (!svg) return;
    window.cancelAnimationFrame(S.raf);
    if (instant || reduceMotion()) {
      S.cam = rect.slice();
      svg.setAttribute('viewBox', rect.map((n) => n.toFixed(1)).join(' '));
      if (cb) cb();
      return;
    }
    const from = S.cam.slice(), t0 = performance.now(), ms = 900;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      S.cam = from.map((v, i) => v + (rect[i] - v) * e);
      svg.setAttribute('viewBox', S.cam.map((n) => n.toFixed(1)).join(' '));
      if (k < 1) S.raf = window.requestAnimationFrame(step); else if (cb) cb();
    };
    S.raf = window.requestAnimationFrame(step);
  }

  // علامة نقر نابضة فوق الشيء المطلوب (نقطة ضغط)
  function placeMarker() {
    const m = el('j-marker');
    const sc = S.j && scene();
    if (!sc || S.over || (sc.kind === 'items') || !sc.focus || !el('j-overlay').hidden || S.busy) { m.hidden = true; return; }
    const g = el('j-world').querySelector('[data-focus="' + sc.focus + '"]');
    if (!g) { m.hidden = true; return; }
    const r = g.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    m.style.left = (r.left - rr.left + r.width / 2) / (stageScale()) + 'px';
    m.style.top = (r.top - rr.top + r.height / 2) / (stageScale()) + 'px';
    m.hidden = false;
  }

  // المسرح يُحجَّم بـ transform في الوضع العادي؛ نحوّل إحداثيات الشاشة إلى إحداثيات الجذر غير المحجَّمة
  function stageScale() {
    return root.getBoundingClientRect().width / root.offsetWidth || 1;
  }

  /* ---------------- النوافذ ---------------- */

  function overlay(html, cls, keepRunning) {
    const o = el('j-overlay');
    o.className = 'modal j-overlay' + (cls ? ' ' + cls : '');
    o.innerHTML = html;
    o.hidden = false;
    S.paused = !keepRunning;
    el('j-marker').hidden = true;
    return o;
  }
  function closeOverlay() { el('j-overlay').hidden = true; S.paused = false; placeMarker(); }

  const nextBtn = (id) => '<button class="btn-pill btn-back" id="' + id + '" type="button" aria-label="متابعة">' + icons.chevron + '</button>';

  function briefing() {
    const b = S.j.briefing;
    overlay('<div class="modal-card j-brief"><h2 class="modal-title">' + U.escape(b.title) + '</h2>' +
      '<div class="modal-body">' + b.paragraphs.map((p) => '<p>' + U.escape(p) + '</p>').join('') + '</div>' +
      '<div class="modal-foot">' + nextBtn('j-go') + '</div></div>');
    el('j-go').addEventListener('click', () => { Sound.click(); closeOverlay(); startTimer(); enter(0, true); });
  }

  /* ---------------- دخول المشهد ---------------- */

  function enter(i, first) {
    S.idx = i;
    S.items = new Set(); S.net = null; S.vpn = false; S.pick = new Set();
    const sc = scene();
    root.setAttribute('data-scene', String(i));
    el('j-chip').textContent = sc.caption;
    el('j-story').innerHTML = '<span class="j-story-n" dir="ltr">' + (i + 1) + ' / ' + S.j.scenes.length + '</span><p>' + U.escape(sc.narration) + '</p>';
    el('j-story').classList.remove('in'); void el('j-story').offsetWidth; el('j-story').classList.add('in');
    el('j-world').querySelectorAll('.j-picked,.j-lost,.j-extra,.j-ok').forEach((g) => g.classList.remove('j-picked', 'j-lost', 'j-extra', 'j-ok'));
    if (sc.kind === 'items') { renderDock(); } else { el('j-dock').hidden = true; }
    S.busy = true;
    setCam(camFor(sc), !!first, () => { S.busy = false; placeMarker(); });   // أول مشهد بلا تحريك
  }

  function renderDock() {
    const sc = scene();
    const d = el('j-dock');
    d.hidden = false;
    d.innerHTML = '<span class="j-count">الأشياء التي ستأخذها: <b id="j-n" dir="ltr">0</b></span>' +
      '<button class="m-send j-sendbtn" id="j-dock-send" type="button" disabled>' + icons.check + '<span>' + U.escape(sc.sendLabel || 'إرسال') + '</span></button>';
    el('j-dock-send').addEventListener('click', submit);
  }

  /* ---------------- النقر على العالم ---------------- */

  function onWorldClick(e) {
    if (S.over || S.busy || !el('j-overlay').hidden) return;
    const t = e.target.closest ? e.target : e.target.parentElement;
    const item = t.closest('[data-item]');
    const focus = t.closest('[data-focus]');
    const sc = scene();
    if (sc.kind === 'items' && item) { toggleItem(item); return; }
    if (focus && sc.focus === focus.dataset.focus) { Sound.open(); openInteraction(); return; }
    if (focus || item) { Sound.click(); toast('ليس هذا هو المطلوب الآن. اقرأ الموقف أمامك.'); }
  }

  function toggleItem(g) {
    const id = g.dataset.item;
    if (S.items.has(id)) { S.items.delete(id); g.classList.remove('j-picked'); } else { S.items.add(id); g.classList.add('j-picked'); }
    Sound.click();
    el('j-n').textContent = S.items.size;
    el('j-dock-send').disabled = S.items.size === 0;
  }

  /* ---------------- واجهات الأجهزة ---------------- */

  function callDevice(info) {
    return '<div class="j-phone j-call"><div class="j-ptop">اتصال وارد</div>' +
      '<div class="j-avatar"><span>' + U.escape(info.initial) + '</span><i></i><i></i></div>' +
      '<div class="j-cname">' + U.escape(info.name) + '</div><div class="j-csub">' + U.escape(info.sub) + '</div>' +
      '<div class="j-cbtns"><span class="red"><svg viewBox="0 0 24 24"><path d="M5 15c4-4 10-4 14 0l-2 3-3-1.5v-2a8 8 0 0 0-4 0v2L7 18Z"/></svg></span>' +
      '<span class="green"><svg viewBox="0 0 24 24"><path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"/></svg></span></div></div>';
  }

  function cameraDevice(info) {
    return '<div class="j-phone j-cam"><div class="j-vf"><svg viewBox="0 0 200 200" aria-hidden="true">' +
      '<rect width="200" height="200" fill="#d9c9ad"/><rect x="30" y="30" width="140" height="140" rx="6" fill="#fff"/>' + qrSvg(44, 44, 112) +
      '<g fill="none" stroke="#ffd84d" stroke-width="5" stroke-linecap="round"><path d="M20 50V24h26M154 24h26v26M180 150v26h-26M46 176H20v-26"/></g>' +
      '</svg><span class="j-scanline"></span></div>' +
      '<div class="j-found">تم العثور على رمز QR</div>' +
      '<div class="j-link" dir="ltr">' + U.escape(info.link) + '</div></div>';
  }

  /* ---------------- فتح التفاعل ---------------- */

  function openInteraction() {
    const sc = scene();
    S.pick = new Set();
    if (sc.kind === 'wifi') return openWifi(sc);
    const dev = sc.device === 'camera' ? cameraDevice(sc.deviceInfo) : callDevice(sc.deviceInfo);
    const opts = shuffle(sc.options.map((o, i) => i)).map((i) => {
      const o = sc.options[i];
      return '<button type="button" class="j-opt" data-i="' + i + '"><span class="j-opt-ic">' + CE.Icons.forOption(o) + '</span><span class="j-opt-tx">' + U.escape(o.text) + '</span><span class="j-opt-ck" aria-hidden="true">' + icons.check + '</span></button>';
    }).join('');
    overlay('<div class="j-panel j-panel-choice">' + dev + '<div class="j-ctrl">' +
      '<p class="j-prompt">' + U.escape(sc.prompt) + '</p>' +
      '<div class="j-opts" id="j-opts">' + opts + '</div>' +
      '<div class="j-pfoot"><button class="m-send" id="j-send" type="button" disabled>' + icons.check + '<span>إرسال</span></button>' +
      '<button class="j-back" id="j-back" type="button">رجوع</button></div></div></div>', 'j-panel-ov', true);
    el('j-opts').addEventListener('click', (e) => {
      const b = e.target.closest('.j-opt');
      if (!b) return;
      Sound.click();
      const i = Number(b.dataset.i);
      if (sc.multi) { if (S.pick.has(i)) S.pick.delete(i); else S.pick.add(i); } else { S.pick = new Set([i]); }
      el('j-opts').querySelectorAll('.j-opt').forEach((x) => x.classList.toggle('on', S.pick.has(Number(x.dataset.i))));
      el('j-send').disabled = S.pick.size === 0;
    });
    el('j-send').addEventListener('click', submit);
    el('j-back').addEventListener('click', () => { Sound.click(); closeOverlay(); });
  }

  function openWifi(sc) {
    const bars = (n) => '<span class="j-bars" aria-hidden="true">' + [1, 2, 3, 4].map((k) => '<i class="' + (k <= n ? 'on' : '') + '" style="height:' + (5 + k * 4) + 'px"></i>').join('') + '</span>';
    const list = shuffle(sc.networks.map((n, i) => i)).map((i) => {
      const n = sc.networks[i];
      return '<button type="button" class="j-net" data-i="' + i + '">' + bars(n.bars || 3) +
        '<span class="j-net-tx"><b dir="ltr">' + U.escape(n.name) + '</b><small>' + U.escape(n.sub) + '</small></span>' +
        '<span class="j-net-lock" aria-hidden="true">' + (n.secure ? icons.lock : '') + '</span></button>';
    }).join('');
    overlay('<div class="j-panel j-panel-wifi"><div class="j-phone j-wifi"><div class="j-ptop">الواي فاي</div>' +
      '<div class="j-wtoggle"><span>الواي فاي</span><i class="on"></i></div><div class="j-nets" id="j-nets">' + list + '</div></div>' +
      '<div class="j-ctrl"><p class="j-prompt">' + U.escape(sc.prompt) + '</p>' +
      '<div class="j-receipt"><b>إيصال المقهى</b><span>' + U.escape(sc.receipt) + '</span></div>' +
      '<div class="j-vpnrow" id="j-vpnrow"><span class="j-vpn-ic">' + CE.Icons.get('vpn') + '</span><span class="j-vpn-tx"><b>تفعيل الشبكة الافتراضية الخاصة (VPN)</b><small>تشفّر اتصالك بعد الاتصال بالشبكة</small></span>' +
      '<button type="button" class="j-switch" id="j-vpn" role="switch" aria-checked="false"><i></i></button></div>' +
      '<div class="j-pfoot"><button class="m-send" id="j-send" type="button" disabled>' + icons.check + '<span>اتصال</span></button>' +
      '<button class="j-back" id="j-back" type="button">رجوع</button></div></div></div>', 'j-panel-ov', true);
    el('j-nets').addEventListener('click', (e) => {
      const b = e.target.closest('.j-net');
      if (!b) return;
      Sound.click();
      S.net = Number(b.dataset.i);
      el('j-nets').querySelectorAll('.j-net').forEach((x) => x.classList.toggle('on', Number(x.dataset.i) === S.net));
      el('j-send').disabled = false;
    });
    el('j-vpn').addEventListener('click', () => {
      Sound.click();
      S.vpn = !S.vpn;
      el('j-vpn').setAttribute('aria-checked', String(S.vpn));
      el('j-vpn').classList.toggle('on', S.vpn);
    });
    el('j-send').addEventListener('click', submit);
    el('j-back').addEventListener('click', () => { Sound.click(); closeOverlay(); });
  }

  /* ---------------- التقييم ---------------- */

  function evaluate(sc) {
    if (sc.kind === 'items') {
      const need = sc.items.filter((x) => x.take).map((x) => x.id);
      return need.length === S.items.size && need.every((id) => S.items.has(id));
    }
    if (sc.kind === 'wifi') {
      const n = sc.networks[S.net];
      return !!(n && n.trusted && S.vpn);
    }
    return sc.options.every((o, i) => !!o.correct === S.pick.has(i));
  }

  function submit() {
    const sc = scene();
    if (S.busy) return;
    const ok = evaluate(sc);
    S.results.push({ id: sc.id, correct: ok });
    if (ok) { S.score += S.j.pointsPerChallenge; Sound.correct(); } else Sound.wrong();
    const slot = el('j-shields').querySelector('[data-slot="' + S.idx + '"]');
    slot.classList.add(ok ? 'correct' : 'wrong', 'pop');
    slot.innerHTML = ok ? icons.shieldCheck : icons.shieldOff;
    updateHud();
    if (sc.kind === 'items') markItems(sc);
    el('j-dock').hidden = true;
    feedback(sc, ok);
  }

  // بعد الإرسال: الأغراض الصحيحة المأخوذة خضراء، والمنسية المهمة حمراء، والزائدة برتقالية
  function markItems(sc) {
    sc.items.forEach((it) => {
      const g = el('j-world').querySelector('[data-item="' + it.id + '"]');
      if (!g) return;
      g.classList.remove('j-picked');
      if (it.take && S.items.has(it.id)) g.classList.add('j-ok');
      else if (it.take) g.classList.add('j-lost');
      else if (S.items.has(it.id)) g.classList.add('j-extra');
    });
  }

  function feedback(sc, ok) {
    let extra = '';
    if (sc.kind === 'items') {
      extra = '<ul class="j-itemres">' + sc.items.map((it) => {
        const had = S.items.has(it.id);
        const good = it.take === had;
        const tag = it.take ? (had ? 'أخذته ✓' : 'نسيته! ✗') : (had ? 'لا حاجة له' : 'تركته ✓');
        return '<li class="' + (good ? 'ok' : 'bad') + '"><span class="ic">' + CE.Icons.forOption(it) + '</span><span class="tx"><b>' + U.escape(it.text) + '</b><small>' + U.escape(it.why) + '</small></span><em>' + tag + '</em></li>';
      }).join('') + '</ul>';
    } else if (sc.kind === 'wifi') {
      const n = sc.networks[S.net];
      extra = '<p class="j-answer-key"><b>' + U.escape(n.name) + '</b>: ' + U.escape(n.why) + (S.vpn ? '' : ' — ولم تفعّل VPN.') + '</p>';
    } else if (!ok) {
      extra = '<p class="j-answer-key">الإجابة الصحيحة: <b>' + sc.options.filter((o) => o.correct).map((o) => U.escape(o.text)).join('، ') + '</b></p>';
    }
    const tips = (sc.feedback.tips || []).map((t) => '<li>' + U.escape(t) + '</li>').join('');
    overlay('<div class="modal-card j-fb"><h2 class="modal-title ' + (ok ? 'ok' : 'bad') + '">' + (ok ? 'أحسنت صنعًا!' : 'إجابة غير صحيحة') + '</h2>' +
      '<div class="modal-body">' + extra + '<p>' + U.escape(sc.feedback.summary) + '</p>' + (tips ? '<ul>' + tips + '</ul>' : '') + '</div>' +
      '<div class="modal-foot">' + nextBtn('j-next') + '</div></div>', 'j-fb-ov');
    el('j-next').addEventListener('click', () => { Sound.click(); closeOverlay(); advance(); });
  }

  function advance() {
    if (S.idx + 1 >= S.j.scenes.length) { finish(false); return; }
    const nx = S.j.scenes[S.idx + 1];
    const cu = el('j-curtain');
    cu.innerHTML = '<div><span>' + U.escape(nx.transition || '') + '</span><b>' + U.escape(nx.caption) + '</b></div>';
    cu.hidden = false;
    S.paused = true; S.busy = true;
    window.setTimeout(() => {
      cu.hidden = true;
      S.paused = false;
      enter(S.idx + 1);
    }, reduceMotion() ? 200 : 1300);
  }

  /* ---------------- المؤقت والـ HUD ---------------- */

  function startTimer() {
    stopTimer();
    S.timerId = window.setInterval(() => {
      if (S.paused || S.over) return;
      S.timeLeft -= 1;
      if (S.timeLeft <= 10 && S.timeLeft > 0) Sound.tick();
      updateHud();
      if (S.timeLeft <= 0) { S.over = true; stopTimer(); Sound.timeUp(); timeUpNotice(); }
    }, 1000);
  }
  function stopTimer() { if (S.timerId) window.clearInterval(S.timerId); S.timerId = null; }

  function updateHud() {
    el('j-time').textContent = U.formatTime(Math.max(0, S.timeLeft));
    el('j-score').textContent = S.score;
    root.querySelector('.hud-stats').classList.toggle('warn', S.timeLeft <= 15);
    root.querySelector('.hud-stats').classList.toggle('j-warn', S.timeLeft <= 15);
  }

  function timeUpNotice() {
    S.busy = true;
    overlay('<div class="modal-card"><h2 class="modal-title bad">انتهى الوقت!</h2><div class="modal-body"><p>لم تُكمل جميع المواقف في الوقت المحدد. في العمل الحقيقي، القرار الأمني السريع والصحيح هو الأهم.</p></div><div class="modal-foot">' + nextBtn('j-tu') + '</div></div>');
    el('j-tu').addEventListener('click', () => { Sound.click(); closeOverlay(); finish(true); });
  }

  let toastTimer = null;
  function toast(msg) {
    const t = el('j-toast');
    t.textContent = msg;
    t.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => t.classList.remove('visible'), 2800);
  }

  function onHint() {
    if (S.over || S.busy || !el('j-overlay').hidden) return;
    Sound.click();
    toast('تلميح: ' + scene().hint);
    const sel = scene().kind === 'items' ? '[data-item]' : '[data-focus="' + scene().focus + '"]';
    el('j-world').querySelectorAll(sel).forEach((g) => {
      g.classList.remove('j-pulse'); void g.getBBox(); g.classList.add('j-pulse');
      window.setTimeout(() => g.classList.remove('j-pulse'), 2400);
    });
  }

  /* ---------------- النتيجة (تستعمل شاشة النتائج المشتركة) ---------------- */

  function finish(timedOut) {
    S.over = true;
    stopTimer();
    const j = S.j, n = j.scenes.length;
    const correct = S.results.filter((r) => r.correct).length;
    const qPts = correct * j.pointsPerChallenge, qMax = n * j.pointsPerChallenge;
    const bonus = Math.round((Math.max(0, S.timeLeft) / j.timeLimit) * j.timeBonusMax);
    const total = qPts + bonus, max = qMax + j.timeBonusMax;
    const pass = correct >= Math.ceil(n * (j.passRatio || 0.6));
    const $ = (id) => document.getElementById(id);

    $('results-title').textContent = pass ? 'تهانينا!' : (timedOut ? 'انتهى الوقت!' : 'حاول مرة أخرى!');
    $('results-title').className = pass ? 'ok' : 'bad';
    $('results-sub').textContent = pass ? 'أحسنت حماية بياناتك أثناء العمل عن بُعد.' : 'راجع النصائح الأمنية وأعد المحاولة لتحسين نتيجتك.';
    $('results-shields').innerHTML = j.scenes.map((s, i) => {
      const r = S.results.find((x) => x.id === s.id);
      const ok = !!(r && r.correct);
      return '<span class="shield-badge big ' + (ok ? 'correct' : 'wrong') + (r ? '' : ' missed') + '" title="' + U.escape(s.title) + '">' + (ok ? icons.shieldCheck : icons.shieldOff) + '</span>';
    }).join('');
    $('r-correct').textContent = correct + ' / ' + n;
    $('r-correct-pts').innerHTML = qPts + ' / ' + qMax + ' <small>نقطة</small>';
    $('r-time').textContent = U.formatTime(Math.max(0, S.timeLeft));
    $('r-time-pts').innerHTML = bonus + ' / ' + j.timeBonusMax + ' <small>نقطة</small>';
    $('r-total').innerHTML = total + ' / ' + max + ' <small>نقطة</small>';
    const key = 'cyberEscape.best.' + j.id;
    const prev = parseInt(U.storageGet(key), 10);
    if (isNaN(prev) || total > prev) { U.storageSet(key, String(total)); $('results-best').textContent = isNaN(prev) ? '' : 'رقم قياسي جديد! 🎉'; }
    else $('results-best').textContent = 'أفضل نتيجة سابقة: ' + prev;
    if (pass) Sound.finish();
    CE.engine.show('screen-results');
    $('results-bg').innerHTML = CE.engine.sceneSvg(j);
    $('btn-finish').focus();
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; }
    return a;
  }

  CE.Journey = { start: start, ring: ring, qrSvg: qrSvg };
})();
