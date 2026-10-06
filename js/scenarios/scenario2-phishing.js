/*
 * السيناريو 2: رسائل التصيّد الاحتيالي — اكشف فخاخ التصيّد في مكتب العمل
 * البنية مماثلة للسيناريو 1 (راجع README.md).
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;

  /* ------------------------------------------------------------------ */
  /* المحتوى التعليمي                                                    */
  /* ------------------------------------------------------------------ */

  // كل عنصر له 4 خيارات؛ عدد الإجابات الصحيحة يختلف (1، 2، 3 أو الكل)،
  // والخيارات الخاطئة تهديدات حقيقية لكنها لا تنطبق على هذا العنصر. يُخلط الترتيب عند العرض.
  const challenges = [
    {
      id: 'email',
      title: 'بريد إلكتروني عاجل من "الدعم الفني"',
      options: [
        { text: 'سرقة بيانات تسجيل الدخول', correct: true },
        { text: 'تثبيت برامج ضارة عبر الرابط أو المرفق', correct: true },
        { text: 'اختراق بريدك واستخدامه لخداع زملائك', correct: true },
        { text: 'هجوم حجب الخدمة (DDoS) على جهازك', correct: false }
      ],
      feedback: {
        summary: 'رسائل التصيّد تنتحل صفة جهات موثوقة وتستخدم الاستعجال والتهديد لدفعك إلى النقر على رابط مزيف أو فتح مرفق ضار. وإذا سُرقت بيانات بريدك، يستخدمه المهاجم لإرسال رسائل تصيّد إلى زملائك.',
        tips: [
          'تحقّق من عنوان المرسل بدقة: نطاق مثل micr0soft-help.co ليس نطاق الشركة الحقيقي.',
          'مرّر مؤشر الفأرة فوق الرابط قبل النقر لمعرفة وجهته الحقيقية.',
          'لا تُدخل كلمة المرور عبر روابط البريد، وأبلغ فريق أمن المعلومات عن الرسالة.'
        ]
      }
    },
    {
      id: 'sms',
      title: 'رسالة نصية عن شحنة متوقفة',
      options: [
        { text: 'الاحتيال المالي', correct: true },
        { text: 'سرقة بيانات البطاقة البنكية', correct: true },
        { text: 'برامج الفدية على خادم الشركة', correct: false },
        { text: 'التنصّت على شبكة Wi-Fi', correct: false }
      ],
      feedback: {
        summary: 'التصيّد عبر الرسائل النصية (Smishing) يطلب منك دفع رسوم بسيطة مثل دينار واحد عبر رابط مزيف، والهدف الحقيقي هو سرقة بيانات بطاقتك وسحب مبالغ أكبر منها.',
        tips: [
          'لا تفتح الروابط في الرسائل غير المتوقعة، حتى لو بدت من شركة شحن أو بنك معروف.',
          'تحقّق من حالة الشحنة عبر التطبيق أو الموقع الرسمي الذي تكتبه بنفسك.',
          'احذف الرسالة وأبلغ عنها، ولا تُرسل رموز التحقق لأي جهة.'
        ]
      }
    },
    {
      id: 'call',
      title: 'مكالمة من "الدعم الفني" تطلب رمز التحقق',
      options: [
        { text: 'التصيّد الصوتي لكشف رمز التحقق (OTP)', correct: true },
        { text: 'التصيّد عبر البريد الإلكتروني', correct: false },
        { text: 'هجوم الوسيط (Man-in-the-Middle)', correct: false },
        { text: 'برامج التجسس على الهاتف', correct: false }
      ],
      feedback: {
        summary: 'هذا تصيّد صوتي (Vishing): متصل ينتحل صفة الدعم الفني أو البنك ليقنعك بكشف كلمة المرور أو رمز التحقق. لا يحتاج إلى بريد إلكتروني أو برامج تجسس، بل يعتمد على خداعك مباشرة.',
        tips: [
          'الدعم الفني الحقيقي لن يطلب منك أبدًا كلمة المرور أو رمز التحقق.',
          'أنهِ المكالمة واتصل بالجهة عبر الرقم الرسمي المعروف لديك.',
          'لا تستجب للضغط أو التهديد بإيقاف الحساب خلال دقائق.'
        ]
      }
    },
    {
      id: 'usb',
      title: 'ذاكرة USB مجهولة عند الباب',
      options: [
        { text: 'البرامج الضارة', correct: true },
        { text: 'اختراق شبكة الشركة', correct: true },
        { text: 'سرقة البيانات من جهازك', correct: true },
        { text: 'الطُّعم (Baiting) كأسلوب هندسة اجتماعية', correct: true }
      ],
      feedback: {
        summary: 'جميع الخيارات صحيحة: يترك المهاجمون ذاكرات USB بعناوين مغرية مثل "رواتب 2026" كطُعم، وبمجرد توصيلها قد تثبّت برامج ضارة تسرق بياناتك وتفتح الطريق إلى شبكة الشركة.',
        tips: [
          'لا توصل أي ذاكرة USB مجهولة المصدر بجهازك أبدًا.',
          'سلّم الأجهزة التي تجدها إلى فريق تقنية المعلومات أو أمن المعلومات.',
          'استخدم فقط وسائط التخزين المعتمدة من جهة عملك.'
        ]
      }
    },
    {
      id: 'qr',
      title: 'ملصق رمز QR لـ "واي فاي مجاني"',
      options: [
        { text: 'التوجيه إلى موقع مزيف', correct: true },
        { text: 'سرقة بيانات تسجيل الدخول', correct: true },
        { text: 'التنصّت عبر شبكة واي فاي مزيفة', correct: true },
        { text: 'هجوم القوة الغاشمة (Brute Force)', correct: false }
      ],
      feedback: {
        summary: 'التصيّد عبر رموز QR (Quishing) يخفي رابطًا خبيثًا يوجّهك إلى صفحة مزيفة تطلب بيانات حسابك، وقد يوصلك بشبكة واي فاي يتحكم بها المهاجم ليتنصّت على اتصالاتك.',
        tips: [
          'تأكد من مصدر أي ملصق QR قبل مسحه، خاصة الملصقات الملصوقة فوق ملصقات أخرى.',
          'افحص عنوان الموقع الذي يظهر بعد المسح قبل فتحه.',
          'لا تتصل بشبكات واي فاي مجهولة، ولا تُدخل بيانات حساب العمل في صفحات تصل إليها عبر رموز QR.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* رسم مكتب العمل                                                      */
  /* ------------------------------------------------------------------ */

  // نمط رمز QR ثابت (شكلي فقط وليس رمزًا حقيقيًا)
  function qrPattern(x0, y0, size) {
    const n = 21;
    const c = size / n;
    let seed = 11;
    const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const inFinder = (i, j) => (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
    let s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + size + '" height="' + size + '" fill="#fff"/>';
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!inFinder(i, j) && rand() < 0.48) {
          s += '<rect x="' + (x0 + i * c).toFixed(2) + '" y="' + (y0 + j * c).toFixed(2) + '" width="' + c.toFixed(2) + '" height="' + c.toFixed(2) + '"/>';
        }
      }
    }
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach(([i, j]) => {
      const fx = x0 + i * c, fy = y0 + j * c;
      s += '<rect x="' + fx + '" y="' + fy + '" width="' + 7 * c + '" height="' + 7 * c + '"/>' +
        '<rect x="' + (fx + c) + '" y="' + (fy + c) + '" width="' + 5 * c + '" height="' + 5 * c + '" fill="#fff"/>' +
        '<rect x="' + (fx + 2 * c) + '" y="' + (fy + 2 * c) + '" width="' + 3 * c + '" height="' + 3 * c + '"/>';
    });
    return '<g fill="#1d232a">' + s + '</g>';
  }

  function renderScene(I) {
    const S = 520;
    const H = 270;
    const T = 18;
    const P = (x, y, z) => I.p(x, y, z);
    const blink = '<animate attributeName="opacity" values="1;.15;1" dur="1s" repeatCount="indefinite"/>';
    let s = '';

    s += '<defs>' +
      '<linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcdcf5"/><stop offset="1" stop-color="#eef7fd"/></linearGradient>' +
      '<linearGradient id="s2-bottle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fd0f5"/><stop offset="1" stop-color="#4aa8e0"/></linearGradient>' +
      '</defs>';

    // الأرضية والجدران
    s += I.box(0, 0, -T, S, S, T, '#cfd5dc', { top: '#eceef1', left: '#cfd5dc', right: '#b9c1ca' });
    s += I.box(-T, -T, 0, T, S + T, H, '#cfd8e0', { left: '#c3ccd5', right: '#dde5ec', top: '#f6f8fa' });
    s += I.box(0, -T, 0, S, T, H, '#cfd8e0', { left: '#e6edf3', right: '#bcc6d0', top: '#f6f8fa' });
    s += I.poly([[0.5, 0, 0], [0.5, S, 0], [0.5, S, 10], [0.5, 0, 10]], '#c3ccd5');
    s += I.poly([[0, 0.5, 0], [S, 0.5, 0], [S, 0.5, 10], [0, 0.5, 10]], '#d3dbe3');

    // السجادة
    s += I.poly([[110, 180, 0.3], [400, 180, 0.3], [400, 465, 0.3], [110, 465, 0.3]], '#a9bccf');
    s += I.poly([[122, 192, 0.4], [388, 192, 0.4], [388, 453, 0.4], [122, 453, 0.4]], '#a9bccf', 'stroke="#c3d2e0" stroke-width="2" fill-opacity="0"');

    // الجدار الأيمن: نافذة بستائر، ساعة، سبورة
    s += '<g transform="' + I.onPlaneY(40, 0.6, 238) + '">' +
      '<rect width="130" height="125" fill="#f6f8fa"/>' +
      '<rect x="8" y="8" width="114" height="109" fill="url(#s2-sky)"/>' +
      '<path d="M20 100 50 40M50 108 96 30" stroke="#fff" stroke-width="8" opacity=".5"/>' +
      '<g stroke="#dfe5eb" stroke-width="4">' +
      '<path d="M8 14h114M8 22h114M8 30h114M8 38h114M8 46h114"/></g>' +
      '<rect x="8" y="8" width="114" height="4" fill="#cfd8e0"/>' +
      '<path d="M65 8v109" stroke="#f6f8fa" stroke-width="5"/>' +
      '</g>';
    s += I.box(36, 0, 107, 138, 10, 6, '#f1f4f7');
    s += '<g transform="' + I.onPlaneY(196, 0.6, 246) + '">' +
      '<circle cx="18" cy="18" r="18" fill="#fff" stroke="#3a4552" stroke-width="3"/>' +
      '<path d="M18 18V7M18 18l8 5" stroke="#3a4552" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="18" cy="18" r="2" fill="#ef4352"/>' +
      '</g>';
    s += '<g transform="' + I.onPlaneY(300, 0.6, 258) + '">' +
      '<rect width="160" height="62" rx="3" fill="#fff" stroke="#9aa5b1" stroke-width="4"/>' +
      '<path d="M14 18q14-10 28 0t28 0" stroke="#3c8fdc" stroke-width="2.5" fill="none"/>' +
      '<path d="M14 32h50M14 42h36" stroke="#3c8fdc" stroke-width="2.5"/>' +
      '<circle cx="118" cy="30" r="14" fill="none" stroke="#e84a4a" stroke-width="2.5"/>' +
      '<path d="M84 46h56" stroke="#2db46d" stroke-width="2.5"/>' +
      '<rect x="60" y="62" width="40" height="4" fill="#9aa5b1"/>' +
      '</g>';

    // الجدار الأيسر: الباب
    s += '<g transform="' + I.onPlaneX(0.6, 455, 208) + '">' +
      '<rect width="96" height="208" fill="#8a6a4f"/>' +
      '<rect x="7" y="7" width="82" height="201" fill="#b98559"/>' +
      '<rect x="17" y="20" width="62" height="70" rx="3" fill="none" stroke="#a37249" stroke-width="3"/>' +
      '<rect x="17" y="104" width="62" height="88" rx="3" fill="none" stroke="#a37249" stroke-width="3"/>' +
      '<rect x="72" y="100" width="12" height="5" rx="2" fill="#e3c27a"/>' +
      '</g>';

    // ملصق QR (عنصر خطر)
    s += '<g data-hotspot="qr"><g transform="' + I.onPlaneX(0.6, 250, 240) + '">' +
      '<rect x="3" y="3" width="96" height="128" fill="#000" opacity=".12"/>' +
      '<rect width="96" height="128" fill="#fff"/>' +
      '<rect width="96" height="24" fill="#f08a2a"/>' +
      '<text x="48" y="16.5" font-size="11.5" font-weight="700" fill="#fff" text-anchor="middle">واي فاي مجاني!</text>' +
      qrPattern(17, 32, 62) +
      '<text x="48" y="110" font-size="8.4" font-weight="700" fill="#1e2d3d" text-anchor="middle">امسح الرمز وسجّل الدخول</text>' +
      '<text x="48" y="121" font-size="7" fill="#5a6675" text-anchor="middle">بحساب العمل</text>' +
      '</g></g>';

    // خزانة الملفات ونبتة صغيرة
    s += I.box(0, 30, 0, 56, 72, 125, '#9aa7b4', { top: '#b5c0cb', left: '#8794a2', right: '#a9b5c1' });
    [28, 68, 108].forEach((z) => {
      s += I.poly([[56.4, 34, z - 26], [56.4, 98, z - 26], [56.4, 98, z - 25], [56.4, 34, z - 25]], '#8794a2');
      s += I.poly([[56.5, 56, z - 6], [56.5, 76, z - 6], [56.5, 76, z - 2], [56.5, 56, z - 2]], '#4b5563');
    });
    (function () {
      const [cx, cy] = P(28, 66, 125);
      s += '<g>' +
        '<ellipse cx="' + (cx - 8) + '" cy="' + (cy - 34) + '" rx="6" ry="16" fill="#2a8a70" transform="rotate(-25 ' + (cx - 8) + ' ' + (cy - 34) + ')"/>' +
        '<ellipse cx="' + (cx + 9) + '" cy="' + (cy - 34) + '" rx="6" ry="16" fill="#1f6f5c" transform="rotate(25 ' + (cx + 9) + ' ' + (cy - 34) + ')"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 40) + '" rx="6" ry="18" fill="#2a8a70"/>' +
        '<path d="M' + (cx - 14) + ' ' + (cy - 24) + 'h28l-4 24h-20Z" fill="#e8679f"/>' +
        '</g>';
    })();

    // مبرّد الماء
    s += I.box(6, 286, 0, 40, 40, 88, '#e9edf1', { right: '#d3d9e0', top: '#f7f8fa' });
    s += I.poly([[46.4, 296, 60], [46.4, 316, 60], [46.4, 316, 74], [46.4, 296, 74]], '#3a4552');
    (function () {
      const [cx, cy] = P(26, 306, 88);
      s += '<g>' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 4) + 'v-50a20 8 0 0 1 40 0v50Z" fill="url(#s2-bottle)" opacity=".9"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 54) + '" rx="20" ry="7" fill="#b3e1fa"/>' +
        '<rect x="' + (cx - 6) + '" y="' + (cy - 66) + '" width="12" height="10" rx="2" fill="#3c8fdc"/>' +
        '</g>';
    })();

    // ذاكرة USB على الأرض (عنصر خطر)
    s += '<g data-hotspot="usb">' +
      '<g transform="' + I.onPlaneZ(44, 420, 0.6) + '"><g transform="rotate(-8 20 10)">' +
      '<rect width="40" height="22" rx="2" fill="#fff" stroke="#c4cbd4" stroke-width="1"/>' +
      '<text x="20" y="15" font-size="9" font-weight="700" fill="#c0392b" text-anchor="middle">رواتب 2026</text>' +
      '</g></g>' +
      '<path d="M' + P(64, 418, 1)[0] + ' ' + P(64, 418, 1)[1] + 'Q' + (P(70, 412, 1)[0] + 8) + ' ' + P(70, 412, 1)[1] + ' ' + P(74, 408, 4)[0] + ' ' + P(74, 408, 4)[1] + '" stroke="#3c8fdc" stroke-width="2.5" fill="none"/>' +
      I.box(74, 398, 0.5, 34, 14, 8, '#e84a4a') +
      I.box(108, 401, 0.5, 11, 8, 5, '#c9d0d9') +
      '</g>';

    // طاولة الاجتماعات والكراسي
    function chair(x, y, color, backSide) {
      let c = I.box(x + 17, y + 19, 0, 8, 8, 40, '#2b333c');
      c += I.box(x + 2, y + 21, 0, 38, 4, 4, '#2b333c') + I.box(x + 19, y + 4, 0, 4, 38, 4, '#2b333c');
      if (backSide === 'far') c += I.box(x - 6, y, 51, 6, 46, 50, CE.shade(color, -0.1));
      c += I.box(x, y, 44, 42, 46, 7, color);
      if (backSide === 'near') c += I.box(x + 42, y, 51, 6, 46, 50, CE.shade(color, -0.1));
      return c;
    }
    s += chair(100, 262, '#3c8fdc', 'far');
    s += I.box(200, 265, 0, 50, 50, 4, '#8b97a5');
    s += I.box(218, 283, 4, 14, 14, 66, '#8b97a5');
    s += I.box(150, 230, 70, 150, 120, 7, '#f1f3f6', { left: '#d9dee5', right: '#c9d0d9', top: '#f7f8fa' });
    s += '<g transform="' + I.onPlaneZ(176, 250, 77.3) + '"><g transform="rotate(10 20 14)">' +
      '<rect width="40" height="30" fill="#fff"/><path d="M5 7h28M5 13h22M5 19h30M5 25h18" stroke="#c4cbd4" stroke-width="1.4"/></g></g>';
    s += '<g transform="' + I.onPlaneZ(226, 296, 77.3) + '"><rect width="34" height="26" fill="#fff"/><path d="M4 6h24M4 12h20M4 18h26" stroke="#c4cbd4" stroke-width="1.4"/></g>';
    (function () {
      const [cx, cy] = P(262, 262, 77);
      s += '<g><path d="M' + (cx - 9) + ' ' + cy + 'v-18h18v18a9 3 0 0 1-18 0Z" fill="#f3f0e8"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 18) + '" rx="9" ry="3" fill="#7a4b2a"/>' +
        '<path d="M' + (cx + 9) + ' ' + (cy - 14) + 'c7 0 7 10 0 10" stroke="#f3f0e8" stroke-width="3" fill="none"/></g>';
    })();
    s += chair(310, 262, '#3c8fdc', 'near');

    // المكتب — الأرجل الخلفية
    const deskLeg = '#3a434e';
    s += I.box(266, 2, 0, 6, 6, 90, deskLeg);
    s += I.box(476, 2, 0, 6, 6, 90, deskLeg);
    s += I.box(266, 2, 20, 216, 3, 60, '#d9dee5');
    s += I.box(266, 104, 0, 6, 6, 90, deskLeg);
    s += I.box(476, 104, 0, 6, 6, 90, deskLeg);
    s += I.box(262, 0, 90, 224, 112, 6, '#f1f3f6', { left: '#d9dee5', right: '#c9d0d9', top: '#f7f8fa' });

    // هاتف المكتب يرنّ (عنصر خطر)
    (function () {
      const h = P(290, 60, 112);
      s += '<g data-hotspot="call">' +
        I.box(276, 40, 96, 50, 42, 8, '#2f3b48', { top: '#3a4552' }) +
        '<g transform="' + I.onPlaneZ(302, 46, 104.2) + '">' +
        '<rect x="0" y="2" width="20" height="10" rx="1" fill="#9fe3b8"/>' +
        '<g fill="#8995a3"><rect x="2" y="16" width="5" height="4"/><rect x="9" y="16" width="5" height="4"/><rect x="16" y="16" width="5" height="4"/>' +
        '<rect x="2" y="23" width="5" height="4"/><rect x="9" y="23" width="5" height="4"/><rect x="16" y="23" width="5" height="4"/>' +
        '<rect x="2" y="30" width="5" height="4"/><rect x="9" y="30" width="5" height="4"/><rect x="16" y="30" width="5" height="4"/></g>' +
        '</g>' +
        I.box(280, 44, 104, 16, 34, 7, '#1f2933', { top: '#2b3440' }) +
        '<g stroke="#ef4352" stroke-width="3.4" fill="none" stroke-linecap="round">' + blink +
        '<path d="M' + (h[0] - 30) + ' ' + (h[1] - 14) + 'q-8-12 0-24M' + (h[0] - 40) + ' ' + (h[1] - 8) + 'q-12-18 0-36"/>' +
        '<path d="M' + (h[0] + 30) + ' ' + (h[1] - 14) + 'q8-12 0-24M' + (h[0] + 40) + ' ' + (h[1] - 8) + 'q12-18 0-36"/>' +
        '</g>' +
        '</g>';
    })();

    // الشاشة وبريد التصيّد (عنصر خطر)
    s += '<g data-hotspot="email">' +
      I.box(365, 26, 96, 34, 22, 3, '#2f3b48') +
      I.box(379, 31, 99, 6, 6, 22, '#2f3b48') +
      I.box(322, 36, 111, 122, 7, 74, '#2a3542') +
      '<g transform="' + I.onPlaneY(326, 43.3, 181) + '">' +
      '<rect width="114" height="66" fill="#fff"/>' +
      '<rect width="114" height="7" fill="#2b579a"/>' +
      '<rect x="80" y="7" width="34" height="59" fill="#eef2f6"/>' +
      '<rect x="80" y="9" width="34" height="11" fill="#fde3e5"/>' +
      '<rect x="80" y="9" width="2" height="11" fill="#ef4352"/>' +
      '<path d="M85 13h25M88 17h22M85 25h25M88 29h22M85 37h25M88 41h22M85 49h25M88 53h22" stroke="#b9c7d4" stroke-width="1.2"/>' +
      '<path d="M85 13h25" stroke="#ef4352" stroke-width="1.6"/>' +
      '<text x="40" y="15" font-size="5.4" font-weight="700" fill="#c0392b" text-anchor="middle">عاجل: سيتم إيقاف حسابك!</text>' +
      '<text x="4" y="22" font-size="4.3" fill="#5a6675" direction="ltr">it-support@micr0soft-help.co</text>' +
      '<path d="M8 30h66M14 35h60M8 40h66M24 45h50" stroke="#c4cbd4" stroke-width="1.4"/>' +
      '<rect x="30" y="50" width="40" height="11" rx="2" fill="#ef4352"/>' +
      '<text x="50" y="57.6" font-size="5.6" font-weight="700" fill="#fff" text-anchor="middle">تحقق الآن</text>' +
      '<path d="M10 52l6-10 6 10Z" fill="#f6c23e"/><path d="M16 46v3" stroke="#1e2d3d" stroke-width="1.2"/>' +
      '</g>' +
      I.box(345, 62, 96, 72, 24, 2.4, '#d9dee5') +
      '<g transform="' + I.onPlaneZ(347, 64, 98.6) + '"><path d="M0 4h68M0 10h68M0 16h68M8 0v20M16 0v20M24 0v20M32 0v20M40 0v20M48 0v20M56 0v20" stroke="#b6bec8" stroke-width="1"/></g>' +
      I.box(424, 66, 96, 9, 13, 3, '#d9dee5') +
      '</g>';

    // الهاتف الذكي ورسالة التصيّد النصية (عنصر خطر)
    (function () {
      const b = P(453, 78, 99);
      const bx = b[0] + 26, by = b[1] - 92;
      s += '<g data-hotspot="sms" data-hit="self">' +
        '<ellipse class="hit" cx="' + (b[0] + 2) + '" cy="' + (b[1] + 2) + '" rx="30" ry="20"/>' +
        I.box(445, 64, 96, 16, 28, 2.5, '#1f2933', { top: '#1f2933' }) +
        '<g transform="' + I.onPlaneZ(446.5, 65.5, 98.6) + '"><rect width="13" height="25" rx="1.5" fill="#5db2ee"/>' +
        '<rect x="2" y="4" width="9" height="5" rx="1" fill="#fff"/><rect x="2" y="11" width="7" height="4" rx="1" fill="#fff" opacity=".8"/></g>' +
        '<path d="M' + (bx + 8) + ' ' + (by + 44) + 'L' + (b[0] + 4) + ' ' + (b[1] - 8) + 'L' + (bx + 26) + ' ' + (by + 44) + 'Z" fill="#fff" stroke="#ef4352" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<rect x="' + bx + '" y="' + by + '" width="128" height="46" rx="14" fill="#fff" stroke="#ef4352" stroke-width="2.5"/>' +
        '<path d="M' + (bx + 9) + ' ' + (by + 42) + 'h20" stroke="#fff" stroke-width="4"/>' +
        '<text x="' + (bx + 64) + '" y="' + (by + 20) + '" font-size="13" font-weight="700" fill="#c0392b" text-anchor="middle">شحنتك متوقفة!</text>' +
        '<text x="' + (bx + 64) + '" y="' + (by + 37) + '" font-size="10" fill="#3c8fdc" text-anchor="middle">ادفع 1 دينار عبر الرابط</text>' +
        '<circle cx="' + (bx + 128) + '" cy="' + by + '" r="8" fill="#ef4352">' + blink + '</circle>' +
        '</g>';
    })();

    // كرسي المكتب
    s += I.box(375, 150, 0, 50, 6, 4, '#2b333c');
    s += I.box(397, 128, 0, 6, 50, 4, '#2b333c');
    s += I.box(396, 149, 4, 8, 8, 44, '#2b333c');
    s += I.box(368, 122, 48, 64, 58, 8, '#4b5563');
    s += I.box(370, 180, 56, 60, 7, 62, '#3a4552');

    // نبتة كبيرة
    (function () {
      const [cx, cy] = P(488, 250, 0);
      s += '<g>' +
        '<g fill="#1f6f5c">' +
        '<ellipse cx="' + (cx - 16) + '" cy="' + (cy - 70) + '" rx="9" ry="26" transform="rotate(-30 ' + (cx - 16) + ' ' + (cy - 70) + ')"/>' +
        '<ellipse cx="' + (cx + 17) + '" cy="' + (cy - 72) + '" rx="9" ry="27" transform="rotate(28 ' + (cx + 17) + ' ' + (cy - 72) + ')"/>' +
        '</g><g fill="#2a8a70">' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 82) + '" rx="9" ry="30"/>' +
        '<ellipse cx="' + (cx - 26) + '" cy="' + (cy - 50) + '" rx="7" ry="20" transform="rotate(-58 ' + (cx - 26) + ' ' + (cy - 50) + ')"/>' +
        '<ellipse cx="' + (cx + 26) + '" cy="' + (cy - 52) + '" rx="7" ry="20" transform="rotate(58 ' + (cx + 26) + ' ' + (cy - 52) + ')"/>' +
        '</g>' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 40) + 'h40l-6 40h-28Z" fill="#3a4552"/>' +
        '<path d="M' + cx + ' ' + (cy - 40) + 'h20l-6 40h-14Z" fill="#2b333c"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 40) + '" rx="20" ry="6" fill="#5b4636"/>' +
        '</g>';
    })();

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* رسم شاشة البداية                                                    */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    // مصفوفة لرسم واجهة مسطحة داخل شاشة الحاسوب المحمول (276×178)
    const screen = 'matrix(1,-0.4855,-0.146,1,176,458)';
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="800" height="900" fill="#dde6ee"/>' +
      '<path d="M500 0h300v540L500 380Z" fill="#cdd7e1"/>' +
      // خط الصنارة والرسالة المعلّقة
      '<path d="M640 0v196" stroke="#3a4552" stroke-width="3"/>' +
      '<path d="M640 196v40a22 22 0 0 1-44 0v-12" stroke="#8995a3" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M596 224l-9 12 16 2Z" fill="#8995a3"/>' +
      '<g transform="rotate(-10 610 300)">' +
      '<rect x="540" y="262" width="150" height="100" rx="8" fill="#fff" stroke="#c4cbd4" stroke-width="3"/>' +
      '<path d="M542 266l73 52 73-52" fill="none" stroke="#c4cbd4" stroke-width="4"/>' +
      '<circle cx="615" cy="318" r="22" fill="#ef4352"/>' +
      '<text x="615" y="327" font-size="26" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">@</text>' +
      '</g>' +
      // تنبيه
      '<path d="M120 170 190 290H50Z" fill="#f6c23e" stroke="#e0a91f" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M120 212v38" stroke="#1e2d3d" stroke-width="12" stroke-linecap="round"/><circle cx="120" cy="272" r="7" fill="#1e2d3d"/>' +
      // سطح المكتب
      '<path d="M0 610 480 380 800 535V900H0Z" fill="#eef1f3"/>' +
      '<path d="M0 610 480 380 800 535" fill="none" stroke="#fff" stroke-width="4"/>' +
      // الحاسوب المحمول وبريد التصيّد
      '<path d="M130 650 430 505 470 300 160 450Z" fill="#2f3b48"/>' +
      '<path d="M150 636 418 506 452 324 176 458Z" fill="#fff"/>' +
      '<g transform="' + screen + '">' +
      '<rect width="276" height="22" fill="#2b579a"/>' +
      '<rect y="22" width="276" height="34" fill="#fde3e5"/>' +
      '<text x="138" y="46" font-size="19" font-weight="700" fill="#c0392b" text-anchor="middle">عاجل: حسابك معرّض للإيقاف!</text>' +
      '<path d="M30 76h220M60 94h190M30 112h220" stroke="#c4cbd4" stroke-width="6"/>' +
      '<rect x="80" y="128" width="116" height="34" rx="8" fill="#ef4352"/>' +
      '<text x="138" y="152" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">انقر هنا</text>' +
      '</g>' +
      '<path d="M130 650 430 505 700 640 400 800Z" fill="#5b6776"/>' +
      '<path d="M130 650 400 800v14L130 664Z" fill="#3d4652"/>' +
      '<path d="M400 800 700 640v14L400 814Z" fill="#4a5462"/>' +
      '<path d="M190 652 430 536 590 616 352 736Z" fill="#3d4652"/>' +
      '<path d="M222 668 446 560M254 684 478 576M286 700 510 592M318 716 542 608" stroke="#56626f" stroke-width="5"/>' +
      '<path d="M420 760 500 720 560 750 480 790Z" fill="#76828f"/>' +
      // الهاتف الذكي ورسالة نصية
      '<g transform="rotate(-14 110 780)">' +
      '<rect x="40" y="660" width="120" height="220" rx="18" fill="#1f2933"/>' +
      '<rect x="50" y="680" width="100" height="180" rx="8" fill="#5db2ee"/>' +
      '<rect x="58" y="700" width="84" height="44" rx="10" fill="#fff"/>' +
      '<path d="M68 714h60M68 728h44" stroke="#ef4352" stroke-width="6" stroke-linecap="round"/>' +
      '<rect x="58" y="752" width="70" height="30" rx="10" fill="#fff" opacity=".85"/>' +
      '</g>' +
      // ذاكرة USB
      '<g transform="rotate(20 680 760)">' +
      '<rect x="620" y="740" width="90" height="40" rx="8" fill="#e84a4a"/>' +
      '<rect x="710" y="748" width="30" height="24" fill="#c9d0d9"/>' +
      '<path d="M720 754h6M720 766h6" stroke="#8995a3" stroke-width="4"/>' +
      '</g>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'phishing',
    number: 2,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'اكشف فخاخ التصيّد',
    title: 'رسائل التصيّد الاحتيالي',
    description: 'يتعرض مكتب العمل لمحاولات تصيّد متعددة: بريد إلكتروني، رسائل نصية، مكالمات، وطُعم مادي. اعثر على كل فخ وحدّد مخاطره قبل نفاد الوقت.',
    timeLimit: 150,
    pointsPerChallenge: 50,
    timeBonusMax: 30,
    passRatio: 0.6,
    viewBox: '0 0 1600 900',
    isoOrigin: [800, 300],
    challenges,
    renderScene,
    renderIntroArt
  });
})();
