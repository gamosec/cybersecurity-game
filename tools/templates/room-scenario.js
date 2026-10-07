/*
 * السيناريو __NUM__: __TITLE__ — __HEADING__
 *
 * ملف مولَّد من tools/new-scenario.js. هو صالح ويجتاز الفحوص كما هو؛ استبدل العناصر الموسومة بـ TODO.
 * الدليل: docs/CONTENT-GUIDE.md  |  قواعد المحتوى: CLAUDE.md
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;

  /* ------------------------------------------------------------------ */
  /* المحتوى (TODO: اكتب 5 تحديات؛ 4 خيارات لكل تحدٍ؛ عدد الصحيح يتنوع: 1 / 2 / 3 / الكل)  */
  /* ------------------------------------------------------------------ */

  const challenges = [
    {
      id: 'item1',
      title: 'TODO: عنصر 1',
      options: [
        { text: 'TODO خيار صحيح', icon: 'doc+alert', correct: true },
        { text: 'TODO خيار صحيح آخر', icon: 'lock+x', correct: true },
        { text: 'TODO خيار صحيح ثالث', icon: 'bug', correct: true },
        { text: 'TODO تهديد حقيقي لا ينطبق هنا', icon: 'server+x', correct: false }
      ],
      feedback: { summary: 'TODO: لماذا هذه هي المخاطر؟ ولماذا لا ينطبق الخيار الخاطئ؟', tips: ['TODO نصيحة 1', 'TODO نصيحة 2'] }
    },
    {
      id: 'item2',
      title: 'TODO: عنصر 2',
      options: [
        { text: 'TODO خيار صحيح', icon: 'mail+hook', correct: true },
        { text: 'TODO خيار صحيح آخر', icon: 'phone+alert', correct: true },
        { text: 'TODO خطأ 1', icon: 'wifi+eye', correct: false },
        { text: 'TODO خطأ 2', icon: 'camera+eye', correct: false }
      ],
      feedback: { summary: 'TODO', tips: ['TODO نصيحة 1', 'TODO نصيحة 2'] }
    },
    {
      id: 'item3',
      title: 'TODO: عنصر 3 (كل الخيارات صحيحة)',
      options: [
        { text: 'TODO صحيح 1', icon: 'key+bolt', correct: true },
        { text: 'TODO صحيح 2', icon: 'card+alert', correct: true },
        { text: 'TODO صحيح 3', icon: 'house+eye', correct: true },
        { text: 'TODO صحيح 4', icon: 'users+x', correct: true }
      ],
      feedback: { summary: 'TODO', tips: ['TODO نصيحة 1', 'TODO نصيحة 2'] }
    },
    {
      id: 'item4',
      title: 'TODO: عنصر 4 (إجابة صحيحة واحدة)',
      options: [
        { text: 'TODO الصحيح الوحيد', icon: 'monitor+eye', correct: true },
        { text: 'TODO خطأ 1', icon: 'tv+eye', correct: false },
        { text: 'TODO خطأ 2', icon: 'usb+alert', correct: false },
        { text: 'TODO خطأ 3', icon: 'disk+x', correct: false }
      ],
      feedback: { summary: 'TODO', tips: ['TODO نصيحة 1', 'TODO نصيحة 2'] }
    },
    {
      id: 'item5',
      title: 'TODO: عنصر 5',
      options: [
        { text: 'TODO صحيح', icon: 'cloud+stop', correct: true },
        { text: 'TODO صحيح آخر', icon: 'db+out', correct: true },
        { text: 'TODO خطأ 1', icon: 'plane+x', correct: false },
        { text: 'TODO خطأ 2', icon: 'cart+alert', correct: false }
      ],
      feedback: { summary: 'TODO', tips: ['TODO نصيحة 1', 'TODO نصيحة 2'] }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* رسم المشهد (TODO: استبدل الصناديق برسوم حقيقية؛ ارسم من الخلف إلى الأمام) */
  /* كل عنصر قابل للنقر داخل <g data-hotspot="<id التحدي>">. معرّفات SVG تبدأ بـ __PFX__-.   */
  /* ------------------------------------------------------------------ */

  function renderScene(I) {
    const S = 520, H = 270, T = 18;
    let s = '';

    s += '<defs><linearGradient id="__PFX__-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcdcf5"/><stop offset="1" stop-color="#eef7fd"/></linearGradient></defs>';

    // الأرضية والجداران
    s += I.box(0, 0, -T, S, S, T, '#cfd5dc', { top: '#eceef1', left: '#cfd5dc', right: '#b9c1ca' });
    s += I.box(-T, -T, 0, T, S + T, H, '#cfd8e0', { left: '#c3ccd5', right: '#dde5ec', top: '#f6f8fa' });
    s += I.box(0, -T, 0, S, T, H, '#cfd8e0', { left: '#e6edf3', right: '#bcc6d0', top: '#f6f8fa' });

    // نافذة على الجدار الأيمن (مثال لاستخدام onPlaneY)
    s += '<g transform="' + I.onPlaneY(60, 0.6, 236) + '"><rect width="120" height="120" fill="#f6f8fa"/><rect x="8" y="8" width="104" height="104" fill="url(#__PFX__-sky)"/></g>';

    // سجادة
    s += I.poly([[120, 140, 0.3], [400, 140, 0.3], [400, 400, 0.3], [120, 400, 0.3]], '#a9bccf');

    // TODO: عناصر الخطر الخمسة (استبدل كل صندوق بنموذج مرسوم). من الخلف إلى الأمام.
    s += '<g data-hotspot="item1">' + I.box(60, 40, 0, 60, 60, 90, '#e8679f') + '</g>';
    s += '<g data-hotspot="item2">' + I.box(200, 30, 0, 80, 50, 70, '#3fa2e0') + '</g>';
    s += '<g data-hotspot="item3">' + I.box(360, 40, 0, 70, 70, 80, '#f6c23e') + '</g>';
    s += '<g data-hotspot="item4">' + I.box(150, 250, 0, 80, 70, 60, '#2db46d') + '</g>';
    s += '<g data-hotspot="item5">' + I.box(340, 260, 0, 70, 70, 100, '#8e5bd6') + '</g>';

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* شاشة البداية (TODO: ارسم مشهدًا معبّرًا؛ 800×900)                   */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="__PFX__i-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcdcf5"/><stop offset="1" stop-color="#eef7fd"/></linearGradient></defs>' +
      '<rect width="800" height="900" fill="url(#__PFX__i-bg)"/>' +
      '<circle cx="400" cy="420" r="180" fill="#3fa2e0" opacity=".25"/>' +
      '<path d="M400 250 540 305v110c0 90-60 150-140 180-80-30-140-90-140-180V305Z" fill="#3fa2e0"/>' +
      '<path d="m340 420 45 45 90-100" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  CE.registerScenario({
    id: '__ID__',
    number: __NUM__,
    kicker: 'تحديات الأمن السيبراني',
    heading: '__HEADING__',
    title: '__TITLE__',
    description: 'TODO: جملتان تصفان المكان والمهمة.',
    timeLimit: 150,
    pointsPerChallenge: 50,
    timeBonusMax: 30,
    passRatio: 0.6,
    isNew: true,
    viewBox: '0 0 1600 900',
    isoOrigin: [800, 300],
    challenges,
    renderScene,
    renderIntroArt
  });
})();
