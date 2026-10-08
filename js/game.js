/* محرك اللعبة: التنقل بين الشاشات، المؤقت، النقاط، التحديات والنتائج */
(function () {
  'use strict';

  const CE = window.CyberEscape;
  const U = CE.util;
  const Sound = CE.Sound;
  const icons = CE.icons;
  const $ = (id) => document.getElementById(id);
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const stage = $('stage');

  const cardIcons = {
    mail: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="16" width="48" height="34" rx="5" fill="#3fa2e0"/><path d="m10 19 22 17 22-17" fill="none" stroke="#fff" stroke-width="4"/><path d="M44 40v10a5 5 0 0 1-10 0" fill="none" stroke="#f6c23e" stroke-width="4" stroke-linecap="round"/></svg>',
    key: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="32" r="12" fill="none" stroke="#f6c23e" stroke-width="6"/><path d="M34 32h22M48 32v9M55 32v7" stroke="#f6c23e" stroke-width="6" stroke-linecap="round"/></svg>',
    users: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="24" cy="24" r="9" fill="#3fa2e0"/><path d="M8 52c0-10 7-16 16-16s16 6 16 16Z" fill="#3fa2e0"/><circle cx="44" cy="26" r="7" fill="#e8679f"/><path d="M34 52c1-8 5-13 10-13s11 5 12 13Z" fill="#e8679f"/></svg>'
  };

  // مرشحات SVG لإبراز العناصر (تمرير الفأرة، صحيح، خاطئ، تلميح)
  function outlineFilter(id, color, radius) {
    return '<filter id="' + id + '" x="-25%" y="-25%" width="150%" height="150%">' +
      '<feMorphology in="SourceAlpha" operator="dilate" radius="' + radius + '" result="d"/>' +
      '<feFlood flood-color="' + color + '"/>' +
      '<feComposite in2="d" operator="in" result="o"/>' +
      '<feGaussianBlur in="o" stdDeviation="1.2" result="ob"/>' +
      '<feMerge><feMergeNode in="ob"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  }
  const FILTERS = '<defs>' +
    outlineFilter('hs-hover', '#ffffff', 4) +
    outlineFilter('hs-correct', '#19c463', 5) +
    outlineFilter('hs-wrong', '#ef4352', 5) +
    outlineFilter('hs-hint', '#ffd84d', 6) +
    '</defs>';

  // ملاحظة: معرّفات SVG (التدرجات والمرشحات) يجب ألا تتكرر في الصفحة؛ لذلك تُفرَّغ
  // رسومات الشاشات غير النشطة في show()، ولا تُضاف المرشحات إلا لمشهد اللعب.
  function sceneSvg(scenario, cls, withFilters) {
    const iso = new CE.Iso(scenario.isoOrigin[0], scenario.isoOrigin[1]);
    return '<svg class="' + (cls || '') + '" viewBox="' + scenario.viewBox + '" xmlns="' + SVG_NS +
      '" preserveAspectRatio="xMidYMid meet" focusable="false">' + (withFilters ? FILTERS : '') +
      scenario.renderScene(iso) + '</svg>';
  }

  const state = {
    scenario: null,
    scale: 1,
    timeLeft: 0,
    timerId: null,
    paused: false,
    over: false,
    answers: {},
    order: [],
    score: 0,
    active: null,
    modalOnClose: null,
    timeUp: false
  };

  /* ---------------- التحجيم والشاشات ---------------- */

  // وضعان للعرض: مسرح ثابت 1600×900 يتم تحجيمه (الشاشات الأفقية)، أو تخطيط مرن
  // للشاشات العمودية (الهواتف) حيث تعيد CSS ترتيب العناصر ويمكن سحب الغرفة أفقيًا.
  function isFluid() {
    return document.body.classList.contains('fluid');
  }

  function fit() {
    const fluid = window.innerWidth / window.innerHeight < 1.1;
    document.body.classList.toggle('fluid', fluid);
    if (fluid) {
      state.scale = 1;
      stage.style.transform = 'none';
    } else {
      const s = Math.min(window.innerWidth / CE.STAGE_W, window.innerHeight / CE.STAGE_H);
      state.scale = s;
      stage.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
    }
    const svg = $('scene').querySelector('svg');
    if (svg && state.scenario) {
      svg.setAttribute('viewBox', sceneViewBox(state.scenario));
      centerScene();
    }
  }

  // في الوضع المرن تُقصّ المساحة الفارغة حول الغرفة
  function sceneViewBox(s) {
    return isFluid() ? (s.mobileViewBox || '240 10 1120 840') : s.viewBox;
  }

  function centerScene() {
    const scene = $('scene');
    scene.scrollLeft = (scene.scrollWidth - scene.clientWidth) / 2;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const screenArt = {
    'screen-menu': ['scenario-list'],
    'screen-intro': ['intro-art', 'intro-panel-bg'],
    'screen-game': ['scene'],
    'screen-results': ['results-bg'],
    'screen-mission': ['m-scene'],
    'screen-journey': ['j-world']
  };

  function show(id) {
    document.querySelectorAll('.screen').forEach((el) => {
      el.classList.toggle('active', el.id === id);
      if (el.id !== id) (screenArt[el.id] || []).forEach((c) => { $(c).innerHTML = ''; });
    });
  }

  /* ---------------- القائمة ---------------- */

  function renderMenu() {
    const list = $('scenario-list');
    list.classList.toggle('many', CE.scenarios.length > 6); // قائمة مدمجة بأربعة أعمدة عند كثرة السيناريوهات
    list.innerHTML = CE.scenarios.map((s) => {
      const best = U.storageGet('cyberEscape.best.' + s.id);
      const status = s.comingSoon ? 'قريبًا' : (best ? 'أفضل نتيجة: ' + best : 'ابدأ الآن ←');
      return '<button type="button" class="scenario-card' + (s.comingSoon ? ' locked' : '') + '" data-id="' + U.escape(s.id) + '"' +
        (s.comingSoon ? ' disabled aria-disabled="true"' : '') + '>' +
        '<span class="card-thumb">' + (s.comingSoon ? (cardIcons[s.icon] || '') + '<span class="card-lock">' + icons.lock + '</span>' : sceneSvg(s)) +
        (s.isNew ? '<span class="card-new">جديد</span>' : '') + '</span>' +
        '<span class="card-num">السيناريو ' + s.number + '</span>' +
        '<span class="card-title">' + U.escape(s.title) + '</span>' +
        '<span class="card-sub">' + U.escape(s.heading || '') + '</span>' +
        '<span class="card-status">' + status + '</span>' +
        '</button>';
    }).join('');
  }

  $('scenario-list').addEventListener('click', (e) => {
    const card = e.target.closest('.scenario-card');
    if (!card || card.disabled) return;
    Sound.click();
    openIntro(CE.getScenario(card.dataset.id));
  });

  /* ---------------- شاشة البداية ---------------- */

  function openIntro(s) {
    state.scenario = s;
    $('intro-kicker').textContent = s.kicker || '';
    $('intro-heading').textContent = s.heading || s.title;
    $('intro-scenario').textContent = 'السيناريو ' + s.number + ': ' + s.title;
    $('intro-desc').textContent = s.description || '';
    $('intro-art').innerHTML = s.renderIntroArt ? s.renderIntroArt() : sceneSvg(s);
    $('intro-panel-bg').innerHTML = s.renderIntroArt ? sceneSvg(s) : '';
    show('screen-intro');
    $('btn-start').focus();
  }

  $('btn-start').addEventListener('click', () => {
    Sound.click();
    if (state.scenario.type === 'mission') { CE.Mission.start(state.scenario); return; }
    if (state.scenario.type === 'journey') { CE.Journey.start(state.scenario); return; }
    startGame(state.scenario);
  });
  $('btn-intro-back').addEventListener('click', () => { Sound.click(); renderMenu(); show('screen-menu'); });

  /* ---------------- اللعب ---------------- */

  function challengeById(id) {
    return state.scenario.challenges.find((c) => c.id === id);
  }

  function startGame(s) {
    stopTimer();
    Object.assign(state, {
      scenario: s, timeLeft: s.timeLimit, paused: false, over: false,
      answers: {}, order: [], score: 0, active: null, timeUp: false
    });
    closePopup();
    closeModal(true);

    show('screen-game');
    const scene = $('scene');
    scene.innerHTML = sceneSvg(s, 'scene-svg', true);
    const svg = scene.querySelector('svg');
    svg.setAttribute('viewBox', sceneViewBox(s));
    setupHotspots(svg);
    centerScene();

    $('hud-shields').innerHTML = s.challenges.map((c, i) =>
      '<span class="shield-badge" data-slot="' + i + '">' + icons.shield + '</span>').join('');
    updateHud();
    if (isFluid()) toast('اسحب الغرفة يمينًا ويسارًا لاستكشاف جميع العناصر');
    state.timerId = window.setInterval(tick, 1000);
  }

  function setupHotspots(svg) {
    svg.querySelectorAll('[data-hotspot]').forEach((g) => {
      const ch = challengeById(g.dataset.hotspot);
      if (!ch) return;
      g.classList.add('hotspot');
      // data-hit="self": المجموعة تحدد منطقة النقر بنفسها (عناصر .hit) بدل المستطيل التلقائي
      if (g.dataset.hit === 'self') {
        bindHotspot(g, ch);
        return;
      }
      const bb = g.getBBox();
      const pad = 12;
      const hit = document.createElementNS(SVG_NS, 'rect');
      hit.setAttribute('class', 'hit');
      hit.setAttribute('x', bb.x - pad);
      hit.setAttribute('y', bb.y - pad);
      hit.setAttribute('width', bb.width + pad * 2);
      hit.setAttribute('height', bb.height + pad * 2);
      hit.setAttribute('rx', 12);
      g.insertBefore(hit, g.firstChild);
      bindHotspot(g, ch);
    });
  }

  function bindHotspot(g, ch) {
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', ch.title);
    g.addEventListener('click', (e) => { e.stopPropagation(); openChallenge(ch.id); });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChallenge(ch.id); }
    });
  }

  function hotspotEls(id) {
    return $('scene').querySelectorAll('[data-hotspot="' + id + '"]');
  }

  function tick() {
    if (state.paused || state.over) return;
    state.timeLeft -= 1;
    if (state.timeLeft <= 10 && state.timeLeft > 0) Sound.tick();
    updateHud();
    if (state.timeLeft <= 0) onTimeUp();
  }

  function stopTimer() {
    if (state.timerId) window.clearInterval(state.timerId);
    state.timerId = null;
  }

  function updateHud() {
    $('hud-time').textContent = U.formatTime(state.timeLeft);
    $('hud-score').textContent = state.score;
    document.querySelector('.hud-stats').classList.toggle('warn', state.timeLeft <= 15);
  }

  /* ---------------- نافذة التحدي ---------------- */

  const popup = $('popup');

  function openChallenge(id) {
    if (state.over || state.paused) return;
    if (state.answers[id] !== undefined) {
      toast('لقد فحصت هذا العنصر بالفعل. ابحث عن عناصر أخرى!');
      return;
    }
    const ch = challengeById(id);
    $('toast').classList.remove('visible');
    Sound.open();
    state.active = id;
    $('popup-title').textContent = ch.title;
    // ترتيب الخيارات عشوائي في كل مرة حتى لا يُحفظ موضع الإجابة الصحيحة
    const order = shuffle(ch.options.map((o, i) => i));
    $('popup-options').innerHTML = order.map((i) => ch.options[i]).map((o, k) =>
      '<li><label class="opt">' +
      '<input type="checkbox" value="' + order[k] + '">' +
      '<span class="opt-card">' +
      '<span class="opt-ic" aria-hidden="true">' + CE.Icons.forOption(o) + '</span>' +
      '<span class="opt-text">' + U.escape(o.text) + '</span>' +
      '<span class="opt-box" aria-hidden="true">' + icons.check + '</span>' +
      '</span>' +
      '</label></li>').join('');
    popup.hidden = false;
    popup.classList.remove('shake');
    positionPopup(id);
    const first = popup.querySelector('input');
    if (first) first.focus();
  }

  function positionPopup(id) {
    if (isFluid()) { // في الهاتف تظهر النافذة كلوحة سفلية عبر CSS
      popup.style.left = '';
      popup.style.top = '';
      return;
    }
    const sr = stage.getBoundingClientRect();
    const k = state.scale;
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    hotspotEls(id).forEach((el) => {
      const rc = el.getBoundingClientRect();
      l = Math.min(l, rc.left); t = Math.min(t, rc.top);
      r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
    });
    const box = { left: (l - sr.left) / k, top: (t - sr.top) / k, right: (r - sr.left) / k, bottom: (b - sr.top) / k };
    const pw = popup.offsetWidth;
    const ph = popup.offsetHeight;
    const W = CE.STAGE_W, H = CE.STAGE_H, margin = 140;
    let left = box.right + 20;
    if (left + pw > W - margin) left = box.left - 20 - pw;
    if (left < margin) left = Math.max(margin, Math.min(W - margin - pw, (box.left + box.right) / 2 - pw / 2));
    let top = (box.top + box.bottom) / 2 - ph / 2;
    top = Math.max(150, Math.min(H - 20 - ph, top));
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  function closePopup() {
    popup.hidden = true;
    state.active = null;
  }

  function submitAnswer() {
    const id = state.active;
    if (!id) return;
    const ch = challengeById(id);
    const inputs = Array.from(popup.querySelectorAll('input'));
    if (!inputs.some((i) => i.checked)) {
      popup.classList.remove('shake');
      void popup.offsetWidth; // إعادة تشغيل الحركة
      popup.classList.add('shake');
      toast('اختر خيارًا واحدًا على الأقل');
      return;
    }
    const picked = inputs.filter((i) => i.checked).map((i) => Number(i.value));
    const correct = ch.options.every((o, i) => !!o.correct === picked.includes(i));
    state.answers[id] = correct;
    state.order.push(id);
    if (correct) state.score += state.scenario.pointsPerChallenge;

    const slot = $('hud-shields').querySelector('[data-slot="' + (state.order.length - 1) + '"]');
    if (slot) {
      slot.classList.add(correct ? 'correct' : 'wrong', 'pop');
      slot.innerHTML = correct ? icons.shieldCheck : icons.shieldOff;
    }
    hotspotEls(id).forEach((el) => el.classList.add(correct ? 'is-correct' : 'is-wrong'));
    updateHud();
    closePopup();
    if (correct) Sound.correct(); else Sound.wrong();
    showFeedback(ch, correct);
  }

  $('popup-confirm').innerHTML = icons.check;
  $('popup-confirm').addEventListener('click', submitAnswer);
  $('popup-close').addEventListener('click', () => { Sound.click(); closePopup(); });
  popup.addEventListener('click', (e) => e.stopPropagation());
  $('scene').addEventListener('click', () => { if (!popup.hidden) closePopup(); });

  /* ---------------- النوافذ المنبثقة ---------------- */

  const modal = $('modal');

  function openModal(opts) {
    state.paused = true;
    state.modalOnClose = opts.onClose || null;
    const title = $('modal-title');
    title.textContent = opts.title;
    title.className = 'modal-title' + (opts.tone ? ' ' + opts.tone : '');
    $('modal-body').innerHTML = opts.html;
    modal.hidden = false;
    $('modal-close').focus();
  }

  function closeModal(silent) {
    if (modal.hidden) return;
    modal.hidden = true;
    const cb = state.modalOnClose;
    state.modalOnClose = null;
    state.paused = false;
    if (!silent && cb) cb();
  }

  $('modal-close').innerHTML = icons.chevron;
  $('modal-close').addEventListener('click', () => { Sound.click(); closeModal(); });

  function showFeedback(ch, correct) {
    let html = '';
    if (!correct) {
      const right = ch.options.filter((o) => o.correct).map((o) => U.escape(o.text)).join('، ');
      html += '<p class="answer-key">الإجابات الصحيحة: <strong>' + right + '</strong></p>';
    }
    html += '<p>' + U.escape(ch.feedback.summary) + '</p>';
    if (ch.feedback.tips && ch.feedback.tips.length) {
      html += '<ul>' + ch.feedback.tips.map((t) => '<li>' + U.escape(t) + '</li>').join('') + '</ul>';
    }
    openModal({
      title: correct ? 'أحسنت صنعًا!' : 'إجابة غير صحيحة',
      tone: correct ? 'ok' : 'bad',
      html,
      onClose: () => {
        if (state.order.length === state.scenario.challenges.length) finish();
      }
    });
  }

  function onTimeUp() {
    state.timeLeft = 0;
    state.over = true;
    state.timeUp = true;
    stopTimer();
    closePopup();
    updateHud();
    Sound.timeUp();
    const missed = state.scenario.challenges.length - state.order.length;
    openModal({
      title: 'انتهى الوقت!',
      tone: 'bad',
      html: '<p>لم تتمكن من فحص ' + missed + ' من العناصر الخطرة في الوقت المحدد.</p>' +
        '<p>تذكّر: الحفاظ على مكتب نظيف وآمن يحمي معلوماتك من السرقة والاختراق.</p>',
      onClose: finish
    });
  }

  /* ---------------- النتائج ---------------- */

  function finish() {
    stopTimer();
    state.over = true;
    const s = state.scenario;
    const n = s.challenges.length;
    const correctCount = state.order.filter((id) => state.answers[id]).length;
    const qPts = correctCount * s.pointsPerChallenge;
    const qMax = n * s.pointsPerChallenge;
    const bonus = Math.round((Math.max(0, state.timeLeft) / s.timeLimit) * s.timeBonusMax);
    const total = qPts + bonus;
    const max = qMax + s.timeBonusMax;
    const pass = correctCount >= Math.ceil(n * (s.passRatio || 0.6));

    $('results-title').textContent = pass ? 'تهانينا!' : (state.timeUp ? 'انتهى الوقت!' : 'حاول مرة أخرى!');
    $('results-title').className = pass ? 'ok' : 'bad';
    $('results-sub').textContent = pass
      ? 'لقد نجحت في اكتشاف مخاطر أمن المعلومات في هذه الغرفة.'
      : 'راجع النصائح الأمنية وحاول تحسين نتيجتك.';

    const ids = state.order.concat(s.challenges.map((c) => c.id).filter((id) => !state.order.includes(id)));
    $('results-shields').innerHTML = ids.map((id) => {
      const ok = state.answers[id] === true;
      const missed = state.answers[id] === undefined;
      return '<span class="shield-badge big ' + (ok ? 'correct' : 'wrong') + (missed ? ' missed' : '') +
        '" title="' + U.escape(challengeById(id).title) + '">' + (ok ? icons.shieldCheck : icons.shieldOff) + '</span>';
    }).join('');

    $('r-correct').textContent = correctCount + ' / ' + n;
    $('r-correct-pts').innerHTML = qPts + ' / ' + qMax + ' <small>نقطة</small>';
    $('r-time').textContent = U.formatTime(state.timeLeft);
    $('r-time-pts').innerHTML = bonus + ' / ' + s.timeBonusMax + ' <small>نقطة</small>';
    $('r-total').innerHTML = total + ' / ' + max + ' <small>نقطة</small>';

    const key = 'cyberEscape.best.' + s.id;
    const prev = parseInt(U.storageGet(key), 10);
    if (isNaN(prev) || total > prev) {
      U.storageSet(key, String(total));
      $('results-best').textContent = isNaN(prev) ? '' : 'رقم قياسي جديد! 🎉';
    } else {
      $('results-best').textContent = 'أفضل نتيجة سابقة: ' + prev;
    }

    $('results-bg').innerHTML = sceneSvg(s);
    if (pass) Sound.finish();
    show('screen-results');
    $('btn-finish').focus();
  }

  $('btn-retry').addEventListener('click', () => {
    Sound.click();
    if (state.scenario.type === 'journey') CE.Journey.start(state.scenario); else startGame(state.scenario);
  });
  $('btn-finish').addEventListener('click', () => { Sound.click(); renderMenu(); show('screen-menu'); });

  /* ---------------- أزرار جانبية ---------------- */

  let toastTimer = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove('visible'), 2600);
  }

  $('btn-hint').innerHTML = icons.bell;
  $('btn-hint').addEventListener('click', () => {
    if (state.over) return;
    Sound.click();
    const remaining = state.scenario.challenges.filter((c) => state.answers[c.id] === undefined);
    toast('تبقّى ' + remaining.length + ' من ' + state.scenario.challenges.length + ' عناصر خطرة. ابحث عن العناصر المتوهجة!');
    remaining.forEach((c) => hotspotEls(c.id).forEach((el) => {
      el.classList.remove('is-hint');
      void el.getBBox();
      el.classList.add('is-hint');
      window.setTimeout(() => el.classList.remove('is-hint'), 2400);
    }));
  });

  function renderSoundBtn() {
    const btn = $('btn-sound');
    btn.innerHTML = Sound.enabled ? icons.soundOn : icons.soundOff;
    btn.setAttribute('aria-pressed', String(!Sound.enabled));
    btn.setAttribute('aria-label', Sound.enabled ? 'كتم الصوت' : 'تشغيل الصوت');
  }
  Sound.enabled = U.storageGet('cyberEscape.sound') !== 'off';
  renderSoundBtn();
  $('btn-sound').addEventListener('click', () => {
    Sound.enabled = !Sound.enabled;
    U.storageSet('cyberEscape.sound', Sound.enabled ? 'on' : 'off');
    renderSoundBtn();
    Sound.click();
  });

  $('btn-help').innerHTML = icons.help;
  $('btn-help').addEventListener('click', () => {
    if (state.over) return;
    Sound.click();
    closePopup();
    const s = state.scenario;
    openModal({
      title: 'كيف تلعب؟',
      html: '<ul>' +
        '<li>ابحث في الغرفة عن <strong>' + s.challenges.length + '</strong> عناصر قد تشكّل خطرًا على أمن المعلومات.</li>' +
        '<li>انقر على العنصر، ثم اختر <strong>جميع</strong> المخاطر المرتبطة به واضغط زر التأكيد الأخضر.</li>' +
        '<li>انتبه: قد يكون خيار واحد صحيحًا، أو أكثر، أو جميع الخيارات. ولا تُحتسب الإجابة إلا إذا كانت مطابقة تمامًا.</li>' +
        '<li>تحصل على <strong>' + s.pointsPerChallenge + '</strong> نقطة لكل إجابة صحيحة بالكامل، ونقاط إضافية (حتى ' + s.timeBonusMax + ') حسب الوقت المتبقي.</li>' +
        '<li>استخدم زر الجرس للحصول على تلميح بمواقع العناصر المتبقية. يتوقف المؤقت أثناء قراءة هذه النافذة.</li>' +
        '</ul>'
    });
  });

  /* ---------------- لوحة المفاتيح والتهيئة ---------------- */

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal();
    else if (!popup.hidden) closePopup();
  });

  window.addEventListener('resize', () => {
    fit();
    if (!popup.hidden && state.active) positionPopup(state.active);
  });

  CE.engine = { show: show, renderMenu: renderMenu, sceneSvg: sceneSvg };

  fit();
  renderMenu();
  show('screen-menu');
})();
