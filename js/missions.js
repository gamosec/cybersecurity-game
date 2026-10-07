/*
 * وضع "المهمة" التفاعلي (الفريق الأحمر / الفريق الأزرق).
 * يختلف عن سيناريوهات الغرفة العادية: يتجول اللاعب في البيئة، يجد محطة الفريق
 * الأحمر (جهاز أحمر) فيخوض تحديات "كيف يتجاوز حماية الفريق الأزرق" بأسلوب التوعية
 * (اختيار نوع الأسلوب لا تفاصيله)، ثم ينتقل إلى محطة الفريق الأزرق فيضع أساليب
 * الحماية المناسبة عبر السحب والإفلات. الهدف تعليمي دفاعي بحت.
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
    red: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h10l-2 3 2 3H4Z" fill="#ef4352"/><path d="M4 4v16" stroke="#ef4352" stroke-width="2" stroke-linecap="round"/></svg>',
    blue: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 19.4 5.4V11c0 5-3.1 8.9-7.4 10.5C7.7 19.9 4.6 16 4.6 11V5.4Z" fill="#3fa2e0"/><path d="m8.6 12 2.4 2.4 4.4-4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  let root;          // عنصر #screen-mission
  const S = {
    mission: null,
    scale: 1,
    timeLeft: 0,
    timerId: null,
    paused: false,
    over: false,
    phase: 'red',    // red ثم blue
    idx: 0,          // رقم التحدي ضمن الفريق الحالي
    results: [],     // { team, id, correct }
    score: 0
  };

  /* ---------------- إنشاء الشاشة ---------------- */

  function ensureRoot() {
    if (root) return root;
    root = document.createElement('section');
    root.id = 'screen-mission';
    root.className = 'screen';
    root.innerHTML =
      '<div class="m-scene" id="m-scene"></div>' +
      '<div class="m-topbar"><span class="m-title" id="m-title"></span>' +
      '<span class="m-time">عداد الوقت: <b id="m-time">00:00</b></span></div>' +
      '<div class="m-side">' +
      '<div class="m-stat"><span>النقاط</span><b id="m-score">0</b></div>' +
      '<button class="m-stat m-hint" id="m-hint" type="button"><span>تلميحات</span>' + bulb + '</button>' +
      '</div>' +
      '<div class="m-toast" id="m-toast" role="status" aria-live="polite"></div>' +
      '<div class="m-overlay" id="m-overlay" hidden></div>';
    document.getElementById('stage').appendChild(root);
    root.querySelector('#m-hint').addEventListener('click', onHint);
    root.querySelector('#m-scene').addEventListener('click', (e) => {
      const g = e.target.closest('[data-station]');
      if (g) onStation(g.dataset.station);
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
    S.mission = mission;
    S.timeLeft = mission.timeLimit;
    S.paused = false;
    S.over = false;
    S.phase = 'red';
    S.idx = 0;
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
    fitScene();
    refreshStations();
  }

  function fitScene() {
    // المشهد يملأ العرض ويُقص في الوضع العمودي (مثل سيناريوهات الغرفة)
    const svg = el('m-scene') && el('m-scene').querySelector('svg');
    if (!svg) return;
    const fluid = window.innerWidth / window.innerHeight < 1.1;
    svg.setAttribute('viewBox', fluid ? (S.mission.mobileViewBox || '260 20 1080 820') : S.mission.viewBox);
  }

  function refreshStations() {
    const svg = el('m-scene').querySelector('svg');
    if (!svg) return;
    ['red', 'blue'].forEach((team) => {
      svg.querySelectorAll('[data-station="' + team + '"]').forEach((g) => {
        const done = S.results.some((r) => r.team === team) &&
          S.results.filter((r) => r.team === team).length >= S.mission.teams[team].challenges.length;
        const active = team === S.phase && !done;
        g.classList.toggle('m-station-active', active);
        g.classList.toggle('m-station-done', done);
        g.classList.toggle('m-station-locked', !active && !done);
        g.style.cursor = active ? 'pointer' : 'default';
      });
    });
  }

  /* ---------------- النوافذ (مقدمة/انتقال/نتيجة) ---------------- */

  function overlay(html, cls) {
    const o = el('m-overlay');
    o.className = 'm-overlay' + (cls ? ' ' + cls : '');
    o.innerHTML = html;
    o.hidden = false;
    S.paused = true;
    return o;
  }
  function closeOverlay() { el('m-overlay').hidden = true; S.paused = false; }

  function briefing() {
    const m = S.mission;
    const paras = (m.briefing.paragraphs || []).map((p) => '<p>' + U.escape(p) + '</p>').join('');
    overlay(
      '<div class="m-card m-brief">' +
      '<div class="m-card-head">' + icons.help + '<span>' + U.escape(m.briefing.title || 'مقدمة') + '</span></div>' +
      '<div class="m-card-body">' + paras + '</div>' +
      '<div class="m-card-foot"><button class="m-next" id="m-brief-next" type="button">' + icons.chevron + '<span>التالي</span></button></div>' +
      '</div>');
    el('m-brief-next').addEventListener('click', () => {
      Sound.click();
      closeOverlay();
      startTimer();
      teamIntro(S.phase);
    });
  }

  function teamIntro(team) {
    const t = S.mission.teams[team];
    overlay(
      '<div class="m-card m-team-' + team + '">' +
      '<div class="m-card-head">' + teamIcon[team] + '<span>' + U.escape(t.title) + '</span></div>' +
      '<div class="m-card-body"><p>' + U.escape(t.intro) + '</p>' +
      '<p class="m-find">ابحث في البيئة عن <b>محطة ' + (team === 'red' ? 'الفريق الأحمر (الجهاز الأحمر)' : 'الفريق الأزرق (الجهاز الأزرق)') + '</b> واضغط عليها لبدء التحديات.</p></div>' +
      '<div class="m-card-foot"><button class="m-next" id="m-ti-next" type="button">' + icons.chevron + '<span>فهمت</span></button></div>' +
      '</div>', 'm-intro-' + team);
    el('m-ti-next').addEventListener('click', () => { Sound.click(); closeOverlay(); S.paused = false; });
    S.paused = false; // المؤقت يعمل أثناء البحث عن المحطة
    el('m-overlay').classList.add('m-pass'); // لا يوقف المؤقت
  }

  /* ---------------- النقر على محطة ---------------- */

  function onStation(team) {
    if (S.over) return;
    const done = S.results.filter((r) => r.team === team).length >= S.mission.teams[team].challenges.length;
    if (team !== S.phase || done) {
      toast(team === S.phase ? 'أكملت هذه المحطة.' : 'أكمل محطة الفريق ' + (S.phase === 'red' ? 'الأحمر' : 'الأزرق') + ' أولًا.');
      return;
    }
    Sound.open();
    challenge();
  }

  /* ---------------- عرض التحدي ---------------- */

  function challenge() {
    const team = S.phase;
    const ch = S.mission.teams[team].challenges[S.idx];
    const order = shuffle(ch.options.map((o, i) => i));
    const chips = order.map((i) => {
      const o = ch.options[i];
      return '<button type="button" class="m-chip" data-i="' + i + '" draggable="true">' + U.escape(o.text) + '</button>';
    }).join('');

    const isDnd = ch.ui === 'dnd';
    const body = isDnd
      ? '<div class="m-dnd">' +
          '<div class="m-tray" id="m-tray" aria-label="الخيارات">' + chips + '</div>' +
          '<div class="m-drop-wrap"><span class="m-drop-label">' + U.escape(ch.instruction || 'اسحب الإجابات الصحيحة إلى هنا') + '</span>' +
          '<div class="m-drop" id="m-drop" aria-label="صندوق الإجابة"></div></div>' +
        '</div>'
      : '<div class="m-opts" id="m-tray">' + chips + '</div>';

    overlay(
      '<div class="m-win m-win-' + team + '">' +
      '<div class="m-win-bar"><span class="m-win-title">' + teamIcon[team] + ' ' + U.escape(S.mission.teams[team].title) + '</span>' +
      '<span class="m-win-steps">' + (S.idx + 1) + ' / ' + S.mission.teams[team].challenges.length + '</span></div>' +
      '<div class="m-win-body">' +
      '<p class="m-prompt">' + U.escape(ch.prompt) + '</p>' +
      (ch.note ? '<p class="m-note">' + U.escape(ch.note) + '</p>' : '') +
      body +
      '<div class="m-win-foot"><button class="m-send" id="m-send" type="button" disabled>' + icons.check + '<span>إرسال</span></button></div>' +
      '</div></div>', 'm-win-overlay');
    el('m-overlay').classList.remove('m-pass');
    S.paused = false; // المؤقت يستمر أثناء الإجابة، ويتوقف فقط أثناء قراءة المقدمة والتغذية الراجعة
    wireChallenge(ch, isDnd);
  }

  function wireChallenge(ch, isDnd) {
    const send = el('m-send');
    const tray = el('m-tray');
    const drop = isDnd ? el('m-drop') : null;

    function selected() {
      if (isDnd) return Array.from(drop.querySelectorAll('.m-chip')).map((c) => Number(c.dataset.i));
      return Array.from(tray.querySelectorAll('.m-chip.on')).map((c) => Number(c.dataset.i));
    }
    function refresh() { send.disabled = selected().length === 0; }

    if (isDnd) {
      const move = (chip, to) => { to.appendChild(chip); refresh(); };
      tray.addEventListener('click', (e) => { const c = e.target.closest('.m-chip'); if (c) { Sound.click(); move(c, drop); } });
      drop.addEventListener('click', (e) => { const c = e.target.closest('.m-chip'); if (c) { Sound.click(); move(c, tray); } });
      // سحب وإفلات أصلي (تحسين لأجهزة سطح المكتب)
      let dragged = null;
      root.querySelectorAll('.m-chip').forEach((c) => {
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
        const c = e.target.closest('.m-chip');
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
    overlay(
      '<div class="m-card ' + (correct ? 'm-ok' : 'm-bad') + '">' +
      '<div class="m-card-head">' + (correct ? icons.shieldCheck : icons.shieldOff) +
      '<span>' + (correct ? 'إجابة صحيحة!' : 'إجابة غير صحيحة') + '</span></div>' +
      '<div class="m-card-body">' +
      (correct ? '' : '<p class="m-answer-key">الإجابات الصحيحة: <b>' + right + '</b></p>') +
      '<p>' + U.escape(ch.feedback.summary) + '</p>' +
      (tips ? '<ul>' + tips + '</ul>' : '') +
      '</div>' +
      '<div class="m-card-foot"><button class="m-next" id="m-fb-next" type="button">' + icons.chevron + '<span>متابعة</span></button></div>' +
      '</div>', correct ? 'm-ok-ov' : 'm-bad-ov');
    el('m-fb-next').addEventListener('click', () => { Sound.click(); closeOverlay(); advance(); });
  }

  function advance() {
    const team = S.phase;
    S.idx += 1;
    refreshStations();
    if (S.idx < S.mission.teams[team].challenges.length) {
      challenge();                    // التحدي التالي لنفس الفريق
      return;
    }
    if (team === 'red') {              // انتهى الفريق الأحمر → انتقل للأزرق
      S.phase = 'blue';
      S.idx = 0;
      refreshStations();
      overlay(
        '<div class="m-card m-team-blue">' +
        '<div class="m-card-head">' + teamIcon.blue + '<span>أحسنت! انتهت مهمة الفريق الأحمر</span></div>' +
        '<div class="m-card-body"><p>الآن بدّل القبّعة: انضم إلى <b>الفريق الأزرق</b> لبناء الدفاعات التي توقف تلك الهجمات.</p>' +
        '<p class="m-find">ابحث عن <b>محطة الفريق الأزرق (الجهاز الأزرق)</b> في البيئة واضغط عليها.</p></div>' +
        '<div class="m-card-foot"><button class="m-next" id="m-sw-next" type="button">' + icons.chevron + '<span>إلى الفريق الأزرق</span></button></div>' +
        '</div>', 'm-intro-blue m-pass');
      el('m-sw-next').addEventListener('click', () => { Sound.click(); closeOverlay(); S.paused = false; toast('اضغط على محطة الفريق الأزرق للمتابعة'); });
      S.paused = false;
      return;
    }
    finish();                         // انتهى الفريقان
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
    toastTimer = window.setTimeout(() => t.classList.remove('on'), 2600);
  }

  function onHint() {
    if (S.over) return;
    Sound.click();
    const team = S.phase;
    const left = S.mission.teams[team].challenges.length - S.results.filter((r) => r.team === team).length;
    toast('أنت الآن في الفريق ' + (team === 'red' ? 'الأحمر' : 'الأزرق') + '. تبقّى ' + left + ' تحديات. ابحث عن المحطة المتوهجة.');
    const svg = el('m-scene').querySelector('svg');
    svg && svg.querySelectorAll('[data-station="' + team + '"]').forEach((g) => {
      g.classList.remove('m-pulse'); void g.getBBox(); g.classList.add('m-pulse');
      window.setTimeout(() => g.classList.remove('m-pulse'), 2400);
    });
  }

  /* ---------------- النتائج ---------------- */

  function finish(timedOut) {
    S.over = true;
    stopTimer();
    closeOverlay();
    const m = S.mission;
    const total = m.teams.red.challenges.length + m.teams.blue.challenges.length;
    const correct = S.results.filter((r) => r.correct).length;
    const qPts = correct * m.pointsPerChallenge;
    const qMax = total * m.pointsPerChallenge;
    const pass = !timedOut && correct >= Math.ceil(total * (m.passRatio || 0.6));
    // مكافأة الوقت تُمنح فقط عند اجتياز المهمة
    const bonus = pass ? Math.round((Math.max(0, S.timeLeft) / m.timeLimit) * m.timeBonusMax) : 0;
    const grand = qPts + bonus;
    const max = qMax + m.timeBonusMax;

    const row = (team) => {
      const chs = m.teams[team].challenges;
      const c = S.results.filter((r) => r.team === team && r.correct).length;
      const done = S.results.filter((r) => r.team === team).length;
      return '<div class="m-res-team m-team-' + team + '">' + teamIcon[team] +
        '<span class="m-res-name">' + U.escape(m.teams[team].title) + '</span>' +
        '<span class="m-res-num">' + c + ' / ' + chs.length + (done < chs.length ? ' (لم يكتمل)' : '') + '</span></div>';
    };

    const key = 'cyberEscape.best.' + m.id;
    const prev = parseInt(U.storageGet(key), 10);
    let best = '';
    if (isNaN(prev) || grand > prev) { U.storageSet(key, String(grand)); best = isNaN(prev) ? '' : 'رقم قياسي جديد! 🎉'; }
    else best = 'أفضل نتيجة سابقة: ' + prev;

    overlay(
      '<div class="m-card m-result ' + (pass ? 'm-ok' : 'm-bad') + '">' +
      '<h2 class="m-res-title">' + (pass ? 'نجحت في المهمة!' : (timedOut ? 'انتهى الوقت!' : 'لم تكتمل المهمة')) + '</h2>' +
      '<p class="m-res-sub">' + (pass ? 'أتقنت التفكير الهجومي والدفاعي معًا.' : 'راجع الدفاعات الصحيحة وحاول مجددًا.') + '</p>' +
      row('red') + row('blue') +
      '<div class="m-res-rows">' +
      '<div><span>الإجابات الصحيحة</span><b>' + correct + ' / ' + total + '</b><em>' + qPts + ' / ' + qMax + '</em></div>' +
      '<div><span>مكافأة الوقت</span><b>' + U.formatTime(Math.max(0, S.timeLeft)) + '</b><em>' + bonus + ' / ' + m.timeBonusMax + '</em></div>' +
      '<div class="m-res-total"><span>الدرجة النهائية</span><b></b><em>' + grand + ' / ' + max + '</em></div>' +
      '</div>' +
      review() +
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
    return '<details class="m-review"' + (S.results.every((r) => r.correct) ? '' : ' open') + '>' +
      '<summary>مراجعة إجاباتك</summary><ul>' + items + '</ul></details>';
  }

  function exit() {
    stopTimer();
    closeOverlay();
    if (CE.engine) { CE.engine.renderMenu(); CE.engine.show('screen-menu'); }
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  CE.Mission = { start };
})();
