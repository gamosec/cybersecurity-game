/*
 * السيناريو 1: سياسة سطح المكتب ومخاطر أمن المعلومات — حماية مكتبك المنزلي
 *
 * كل سيناريو يتكوّن من:
 *  - بيانات وصفية (العنوان، الوقت، النقاط)
 *  - challenges: العناصر الخطرة في الغرفة، ولكل عنصر خيارات (صحيحة/خاطئة) وتغذية راجعة تعليمية
 *  - renderScene(iso): يعيد رسم SVG للغرفة. العناصر القابلة للنقر توضع داخل
 *    <g data-hotspot="معرّف_التحدي"> ويمكن تكرار المعرّف نفسه في أكثر من مجموعة.
 *  - renderIntroArt(): رسم شاشة البداية (اختياري)
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;

  /* ------------------------------------------------------------------ */
  /* المحتوى التعليمي                                                    */
  /* ------------------------------------------------------------------ */

  const challenges = [
    {
      id: 'trash',
      title: 'الورق في سلة المهملات',
      options: [
        { text: 'خرق أمان البيانات', correct: true },
        { text: 'المشكلات البيئية', correct: false },
        { text: 'السرقة', correct: true }
      ],
      feedback: {
        summary: 'يمكن سرقة المستندات المعاد تدويرها، وقد تتضمن معلومات شخصية وحساسة.',
        tips: [
          'استخدم آلة تقطيع الورق بدلًا من السلة القياسية لإعادة التدوير للمستندات الأكثر حساسية الخاصة بك.',
          'يمكن إعادة تدوير الورق المقطَّع بأمان.'
        ]
      }
    },
    {
      id: 'computer',
      title: 'الكمبيوتر والقرص الصلب',
      options: [
        { text: 'التعطل', correct: true },
        { text: 'البرامج الضارة', correct: true },
        { text: 'فقد المعلومات', correct: true }
      ],
      feedback: {
        summary: 'قد تتعطل الأجهزة أو تُصاب بالبرامج الضارة مثل برامج الفدية، مما يؤدي إلى فقد معلوماتك المهمة.',
        tips: [
          'احتفظ بنسخ احتياطية منتظمة لبياناتك على قرص خارجي أو خدمة سحابية موثوقة.',
          'ثبّت برنامج مكافحة الفيروسات وحافظ على تحديث نظام التشغيل والبرامج.',
          'شفّر القرص الصلب الخارجي واحفظه في مكان آمن بعد الاستخدام.'
        ]
      }
    },
    {
      id: 'router',
      title: 'جهاز التوجيه (الراوتر)',
      options: [
        { text: 'الوصول غير المصرّح به إلى الشبكة', correct: true },
        { text: 'التنصّت على البيانات', correct: true },
        { text: 'ارتفاع فاتورة الكهرباء', correct: false }
      ],
      feedback: {
        summary: 'قد يستغل المخترقون كلمة المرور الافتراضية للراوتر أو التشفير الضعيف للدخول إلى شبكتك والتجسس على بياناتك.',
        tips: [
          'غيّر اسم المستخدم وكلمة المرور الافتراضيين لصفحة إدارة الراوتر.',
          'استخدم تشفير WPA2 أو WPA3 مع كلمة مرور قوية لشبكة Wi-Fi.',
          'حدّث البرنامج الثابت (Firmware) للراوتر بانتظام.'
        ]
      }
    },
    {
      id: 'laptop',
      title: 'الحاسوب المحمول غير المقفل',
      options: [
        { text: 'الوصول غير المصرّح به', correct: true },
        { text: 'انخفاض سرعة الإنترنت', correct: false },
        { text: 'السرقة', correct: true }
      ],
      feedback: {
        summary: 'ترك الجهاز مفتوحًا دون قفل يتيح لأي شخص الاطلاع على بياناتك أو استخدام حساباتك، كما يسهل سرقته.',
        tips: [
          'اقفل الشاشة دائمًا عند الابتعاد عن الجهاز، مثلًا بالضغط على مفتاحَي Windows و L معًا.',
          'فعّل القفل التلقائي للشاشة بعد فترة قصيرة من عدم النشاط.',
          'لا تترك الأجهزة المحمولة دون مراقبة، واحفظها في مكان آمن ومقفل.'
        ]
      }
    },
    {
      id: 'sticky',
      title: 'كلمة المرور على ورقة لاصقة',
      options: [
        { text: 'سرقة كلمة المرور', correct: true },
        { text: 'اختراق الحسابات', correct: true },
        { text: 'تلف الشاشة', correct: false }
      ],
      feedback: {
        summary: 'كتابة كلمات المرور على أوراق لاصقة وتركها على الشاشة أو المكتب يجعلها مكشوفة لأي شخص يمر بجانبك.',
        tips: [
          'لا تدوّن كلمات المرور على الورق، واستخدم مدير كلمات مرور موثوقًا.',
          'فعّل المصادقة متعددة العوامل (MFA) لحساباتك المهمة.',
          'طبّق سياسة المكتب النظيف: لا تترك أي معلومات حساسة ظاهرة على مكتبك.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* رسم الغرفة                                                          */
  /* ------------------------------------------------------------------ */

  function renderScene(I) {
    const S = 520;   // طول ضلع الأرضية
    const H = 270;   // ارتفاع الجدران
    const T = 18;    // سماكة الجدران والأرضية
    const P = (x, y, z) => I.p(x, y, z);
    let s = '';

    s += '<defs>' +
      '<linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7e3f8"/><stop offset="1" stop-color="#f1f8fe"/></linearGradient>' +
      '<linearGradient id="s1-desktop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f8fd8"/><stop offset="1" stop-color="#76c2f2"/></linearGradient>' +
      '</defs>';

    // الأرضية والجدران
    s += I.box(0, 0, -T, S, S, T, '#d6cfbf', { top: '#f3f0e8', left: '#d6cfbf', right: '#c3bba9' });
    s += I.box(-T, -T, 0, T, S + T, H, '#d9d2c2', { left: '#cdc5b3', right: '#e5e0d3', top: '#f8f6f1' });
    s += I.box(0, -T, 0, S, T, H, '#d9d2c2', { left: '#ece8dd', right: '#c6bead', top: '#f8f6f1' });
    s += I.poly([[0.5, 0, 0], [0.5, S, 0], [0.5, S, 10], [0.5, 0, 10]], '#d3ccbb');
    s += I.poly([[0, 0.5, 0], [S, 0.5, 0], [S, 0.5, 10], [0, 0.5, 10]], '#dbd5c6');

    // النوافذ على الجدار الأيمن
    [60, 170].forEach((wx) => {
      s += '<g transform="' + I.onPlaneY(wx, 0.6, 245) + '">' +
        '<rect width="95" height="125" fill="#f8f6f1"/>' +
        '<rect x="8" y="8" width="79" height="109" fill="url(#s1-sky)"/>' +
        '<path d="M14 60 40 20M24 90 70 22M50 108 82 60" stroke="#fff" stroke-width="7" opacity=".55"/>' +
        '<path d="M47.5 8v109M8 62h79" stroke="#f8f6f1" stroke-width="5"/>' +
        '</g>';
      s += I.box(wx - 4, 0, 114, 103, 10, 6, '#f3f1ea');
    });

    // الرف والكتب
    s += '<g transform="' + I.onPlaneY(322, 12, 243) + '"><rect width="30" height="32" rx="2" fill="#e8679f"/><rect x="5" y="5" width="20" height="22" fill="#fbe3ee"/><circle cx="15" cy="14" r="4" fill="#f6c23e"/></g>';
    s += I.box(300, 0, 205, 170, 28, 6, '#eef0f3');
    s += I.box(392, 4, 211, 10, 22, 38, '#e84a4a');
    s += I.box(404, 4, 211, 9, 22, 31, '#3c8fdc');
    s += I.box(415, 4, 211, 11, 22, 40, '#f6c23e');
    s += I.box(428, 4, 211, 8, 22, 29, '#f4f4f4');

    // اللوحات على الجدار الأيسر
    s += '<g transform="' + I.onPlaneX(0.6, 150, 252) + '">' +
      '<rect width="110" height="100" fill="#6c7886"/>' +
      '<rect x="7" y="7" width="96" height="86" fill="#2db46d"/>' +
      '<path d="M7 50c20-18 34 10 52-6s30-12 44-16v22c-16 4-26 2-44 16S27 62 7 76Z" fill="#f6c23e"/>' +
      '<path d="M7 62c22-14 34 10 52-4s30-8 44-10v18c-16 4-26 2-44 14S27 76 7 88Z" fill="#e8679f"/>' +
      '<path d="M7 74c22-12 34 8 52-2s30-6 44-6v27H7Z" fill="#8e5bd6"/>' +
      '</g>';
    s += '<g transform="' + I.onPlaneX(0.6, 318, 255) + '">' +
      '<rect width="100" height="128" fill="#6c7886"/>' +
      '<rect x="7" y="7" width="86" height="114" fill="#1c2a4d"/>' +
      '<g fill="#fff" opacity=".8"><circle cx="20" cy="22" r="1.4"/><circle cx="78" cy="18" r="1.2"/><circle cx="70" cy="44" r="1.4"/><circle cx="24" cy="58" r="1"/><circle cx="84" cy="70" r="1"/><circle cx="16" cy="88" r="1.2"/></g>' +
      '<path d="M50 24c9 10 11 26 9 46H41c-2-20 0-36 9-46Z" fill="#f2f4f7"/>' +
      '<circle cx="50" cy="46" r="5.5" fill="#6fb7ee" stroke="#c9d3df" stroke-width="2"/>' +
      '<path d="M41 56 32 72h9ZM59 56l9 16h-9Z" fill="#e84a4a"/>' +
      '<path d="M44 70h12l-6 26Z" fill="#f6c23e"/><path d="M46.5 70h7l-3.5 14Z" fill="#fff4c2"/>' +
      '<g fill="#f08a2a"><circle cx="28" cy="112" r="12"/><circle cx="72" cy="112" r="12"/></g>' +
      '<g fill="#f3f0e8"><circle cx="40" cy="108" r="11"/><circle cx="60" cy="108" r="11"/><circle cx="50" cy="104" r="10"/><circle cx="15" cy="116" r="9"/><circle cx="85" cy="116" r="9"/></g>' +
      '</g>';

    // السجادة
    s += I.poly([[120, 140, 0.3], [345, 140, 0.3], [345, 432, 0.3], [120, 432, 0.3]], '#e9628f');
    s += I.poly([[132, 152, 0.4], [333, 152, 0.4], [333, 420, 0.4], [132, 420, 0.4]], '#e9628f', 'stroke="#f08db0" stroke-width="2" fill-opacity="0"');

    // النبتة في الزاوية
    (function () {
      const [cx, cy] = P(40, 40, 0);
      s += '<g>' +
        '<g fill="#1f6f5c">' +
        '<ellipse cx="' + (cx - 18) + '" cy="' + (cy - 80) + '" rx="10" ry="30" transform="rotate(-28 ' + (cx - 18) + ' ' + (cy - 80) + ')"/>' +
        '<ellipse cx="' + (cx + 20) + '" cy="' + (cy - 84) + '" rx="10" ry="32" transform="rotate(26 ' + (cx + 20) + ' ' + (cy - 84) + ')"/>' +
        '</g><g fill="#2a8a70">' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 95) + '" rx="10" ry="36"/>' +
        '<ellipse cx="' + (cx - 30) + '" cy="' + (cy - 60) + '" rx="8" ry="24" transform="rotate(-55 ' + (cx - 30) + ' ' + (cy - 60) + ')"/>' +
        '<ellipse cx="' + (cx + 30) + '" cy="' + (cy - 62) + '" rx="8" ry="24" transform="rotate(55 ' + (cx + 30) + ' ' + (cy - 62) + ')"/>' +
        '</g>' +
        '<path d="M' + (cx - 24) + ' ' + (cy - 46) + 'h48l-7 46h-34Z" fill="#f4f4f4"/>' +
        '<path d="M' + cx + ' ' + (cy - 46) + 'h24l-7 46h-17Z" fill="#dfe3e8"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 46) + '" rx="24" ry="7" fill="#5b4636"/>' +
        '</g>';
    })();

    // الأريكة
    s += I.box(0, 100, 0, 32, 280, 112, '#4a5868');
    s += I.box(10, 100, 0, 105, 22, 72, '#516070');
    s += I.box(32, 122, 0, 83, 236, 42, '#566576');
    s += I.box(32, 124, 42, 80, 116, 14, '#64748a');
    s += I.box(32, 241, 42, 80, 116, 14, '#64748a');
    s += I.box(30, 136, 56, 18, 42, 36, '#f28c38');
    s += I.box(30, 304, 56, 18, 42, 36, '#f28c38');
    s += I.box(10, 358, 0, 105, 22, 72, '#516070');

    // طاولة القهوة
    const leg = '#c3c9d1';
    s += I.box(170, 200, 0, 7, 7, 62, leg);
    s += I.box(283, 200, 0, 7, 7, 62, leg);
    s += I.box(170, 323, 0, 7, 7, 62, leg);
    s += I.box(172, 202, 16, 118, 128, 4, '#dfe3e8');
    s += I.box(283, 323, 0, 7, 7, 62, leg);
    s += I.box(165, 195, 62, 130, 140, 8, '#eef1f4', { left: '#d5dbe2', right: '#c4cbd4', top: '#f7f8fa' });
    s += I.box(268, 298, 70, 15, 27, 2, '#1f2933', { top: '#2c3a48' });

    // الحاسوب المحمول (عنصر خطر)
    s += '<g data-hotspot="laptop">' +
      I.box(200, 228, 70, 66, 62, 4, '#a7b1bc') +
      '<g transform="' + I.onPlaneZ(200, 228, 74.2) + '">' +
      '<rect x="3" y="4" width="28" height="54" rx="2" fill="#3b4652"/>' +
      '<path d="M8 4v54M13 4v54M18 4v54M23 4v54M3 13h28M3 22h28M3 31h28M3 40h28M3 49h28" stroke="#56626f" stroke-width="1"/>' +
      '<rect x="38" y="20" width="16" height="22" rx="2" fill="#8e99a5"/>' +
      '</g>' +
      I.box(196, 228, 74, 4, 62, 48, '#2f3b48') +
      '<g transform="' + I.onPlaneX(200.4, 290, 120) + '">' +
      '<rect x="3" y="3" width="56" height="40" fill="url(#s1-desktop)"/>' +
      '<rect x="9" y="8" width="30" height="22" rx="1.5" fill="#fff"/>' +
      '<rect x="9" y="8" width="30" height="4" fill="#f08a2a"/>' +
      '<path d="M12 16h20M12 20h16M12 24h22" stroke="#9aa5b1" stroke-width="1.6"/>' +
      '<circle cx="49" cy="14" r="5" fill="#fff" opacity=".9"/><circle cx="49" cy="12.6" r="2" fill="#3f8fd8"/>' +
      '<rect x="3" y="38" width="56" height="5" fill="#1e3550" opacity=".7"/>' +
      '</g>' +
      '</g>';

    // المكتب — الأرجل الخلفية
    const deskLeg = '#3a434e';
    s += I.box(300, 2, 0, 6, 6, 90, deskLeg);
    s += I.box(476, 2, 0, 6, 6, 90, deskLeg);

    // صندوق الكمبيوتر تحت المكتب (جزء من عنصر "الكمبيوتر")
    s += '<g data-hotspot="computer">' +
      I.box(418, 14, 0, 44, 74, 84, '#3b4653') +
      I.poly([[462.4, 30, 70], [462.4, 72, 70], [462.4, 72, 74], [462.4, 30, 74]], '#5bc0f8') +
      '<circle cx="' + P(462.5, 60, 58)[0] + '" cy="' + P(462.5, 60, 58)[1] + '" r="3" fill="#2ee07a"/>' +
      '</g>';

    // المكتب — الأرجل الأمامية والسطح
    s += I.box(300, 104, 0, 6, 6, 90, deskLeg);
    s += I.box(476, 104, 0, 6, 6, 90, deskLeg);
    s += I.box(296, 0, 90, 190, 112, 6, '#f1f3f6', { left: '#d9dee5', right: '#c9d0d9', top: '#f7f8fa' });

    // مصباح المكتب
    (function () {
      const [bx, by] = P(318, 22, 96);
      s += '<g>' +
        '<ellipse cx="' + bx + '" cy="' + by + '" rx="16" ry="6" fill="#4b5563"/>' +
        '<path d="M' + bx + ' ' + (by - 2) + 'L' + (bx - 14) + ' ' + (by - 70) + 'L' + (bx + 16) + ' ' + (by - 104) + '" stroke="#4b5563" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M' + (bx + 6) + ' ' + (by - 118) + 'l30 8-6 22-30-8Z" fill="#7b8794"/>' +
        '<ellipse cx="' + (bx + 23) + '" cy="' + (by - 96) + '" rx="9" ry="4" fill="#ffd84d" transform="rotate(15 ' + (bx + 23) + ' ' + (by - 96) + ')"/>' +
        '</g>';
    })();

    // الشاشة، القرص الخارجي، لوحة المفاتيح، الفأرة (عنصر "الكمبيوتر")
    s += '<g data-hotspot="computer">' +
      I.box(385, 26, 96, 34, 22, 3, '#2f3b48') +
      I.box(399, 31, 99, 6, 6, 24, '#2f3b48') +
      I.box(348, 36, 113, 104, 7, 66, '#2a3542') +
      '<g transform="' + I.onPlaneY(352, 43.3, 175) + '">' +
      '<rect width="96" height="58" fill="#eaf4fc"/>' +
      '<rect width="96" height="8" fill="#3f8fd8"/>' +
      '<path d="M8 46 22 34l12 6 14-16 14 10" fill="none" stroke="#3f8fd8" stroke-width="2.4"/>' +
      '<path d="M8 50h56" stroke="#b9c7d4" stroke-width="1"/>' +
      '<circle cx="80" cy="30" r="9" fill="none" stroke="#f08a2a" stroke-width="5" stroke-dasharray="40 17"/>' +
      '<circle cx="80" cy="30" r="9" fill="none" stroke="#3f8fd8" stroke-width="5" stroke-dasharray="17 40" stroke-dashoffset="-40"/>' +
      '</g>' +
      I.box(452, 54, 96, 24, 36, 9, '#4b5563') +
      '<circle cx="' + P(476.4, 70, 100.5)[0] + '" cy="' + P(476.4, 70, 100.5)[1] + '" r="1.8" fill="#2ee07a"/>' +
      I.box(362, 62, 96, 76, 24, 2.4, '#d9dee5') +
      '<g transform="' + I.onPlaneZ(364, 64, 98.6) + '"><path d="M0 4h72M0 10h72M0 16h72M8 0v20M16 0v20M24 0v20M32 0v20M40 0v20M48 0v20M56 0v20M64 0v20" stroke="#b6bec8" stroke-width="1"/></g>' +
      I.box(446, 68, 96, 9, 13, 3, '#d9dee5') +
      '</g>';

    // الورقة اللاصقة ومفكرة كلمة المرور (عنصر خطر)
    s += '<g data-hotspot="sticky">' +
      '<g transform="' + I.onPlaneZ(310, 58, 96.4) + '">' +
      '<rect width="42" height="36" rx="1.5" fill="#fff"/>' +
      '<rect width="42" height="5" fill="#f08a2a"/>' +
      '<path d="M5 13h30M5 19h26M5 25h32M5 31h20" stroke="#c4cbd4" stroke-width="1.2"/>' +
      '</g>' +
      '<g transform="' + I.onPlaneY(422, 43.9, 142) + '"><g transform="rotate(-5 13 13)">' +
      '<rect width="26" height="26" fill="#ffd84d"/>' +
      '<rect width="26" height="5" fill="#f6c23e"/>' +
      '<text x="13" y="15.5" font-size="6.6" font-family="Arial, sans-serif" font-weight="700" fill="#c0392b" text-anchor="middle" direction="ltr">P@ss</text>' +
      '<text x="13" y="22.5" font-size="6.6" font-family="Arial, sans-serif" font-weight="700" fill="#c0392b" text-anchor="middle" direction="ltr">1234</text>' +
      '</g></g>' +
      '</g>';

    // الكرسي
    const chairDark = '#2b333c';
    s += I.box(385, 150, 0, 50, 6, 4, chairDark);
    s += I.box(407, 128, 0, 6, 50, 4, chairDark);
    s += I.box(406, 149, 4, 8, 8, 44, chairDark);
    s += I.box(378, 122, 48, 64, 58, 8, '#f59a3d');
    s += I.box(380, 180, 56, 60, 7, 62, '#f08a2a');

    // سلة المهملات (عنصر خطر)
    (function () {
      const [cx, cy] = P(500, 150, 0);
      s += '<g data-hotspot="trash">' +
        '<ellipse cx="' + cx + '" cy="' + (cy + 2) + '" rx="30" ry="9" fill="#000" opacity=".08"/>' +
        '<path d="M' + (cx - 36) + ' ' + (cy - 78) + 'L' + (cx - 28) + ' ' + cy + 'A28 9 0 0 0 ' + (cx + 28) + ' ' + cy + 'L' + (cx + 36) + ' ' + (cy - 78) + 'Z" fill="#3d8fd8"/>' +
        '<path d="M' + cx + ' ' + (cy - 78) + 'v87A28 9 0 0 0 ' + (cx + 28) + ' ' + cy + 'L' + (cx + 36) + ' ' + (cy - 78) + 'Z" fill="#2f7bc2"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 78) + '" rx="36" ry="12" fill="#2a6dad"/>' +
        '<g fill="#fff" stroke="#d5dbe2" stroke-width="1.2">' +
        '<path d="M' + (cx - 28) + ' ' + (cy - 80) + 'l8-16 10 6 6-10 6 12-8 10Z"/>' +
        '<path d="M' + (cx - 6) + ' ' + (cy - 82) + 'l6-20 12 4 8-6 2 16-10 8Z"/>' +
        '<path d="M' + (cx + 10) + ' ' + (cy - 78) + 'l10-14 8 4 6 8-6 6Z"/>' +
        '<path d="M' + (cx - 18) + ' ' + (cy - 74) + 'l6-10 14 2 10-4 4 10-14 6Z"/>' +
        '</g>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 78) + '" rx="36" ry="12" fill="none" stroke="#5aa8ea" stroke-width="3"/>' +
        '</g>';
    })();

    // الكومودينو والراوتر (عنصر خطر)
    s += I.box(4, 400, 0, 80, 80, 78, '#4aa0da', { top: '#7cc2ee', left: '#4aa0da', right: '#3a87c0' });
    s += I.poly([[4, 480.4, 40], [84, 480.4, 40], [84, 480.4, 42], [4, 480.4, 42]], '#3a87c0');
    s += I.poly([[22, 480.5, 22], [66, 480.5, 22], [66, 480.5, 27], [22, 480.5, 27]], '#2b3440');
    s += I.poly([[22, 480.5, 58], [66, 480.5, 58], [66, 480.5, 63], [22, 480.5, 63]], '#2b3440');
    (function () {
      const a1 = P(26, 424, 88), a2 = P(62, 424, 88);
      let leds = '';
      ['#2ee07a', '#2ee07a', '#2ee07a', '#f6c23e', '#2ee07a'].forEach((c, i) => {
        const q = P(26 + i * 8, 458.5, 83);
        leds += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="1.9" fill="' + c + '"/>';
      });
      s += '<g data-hotspot="router">' +
        '<path d="M' + a1[0] + ' ' + a1[1] + 'v-52M' + a2[0] + ' ' + a2[1] + 'v-52" stroke="#1f262e" stroke-width="5" stroke-linecap="round"/>' +
        I.box(18, 418, 78, 52, 40, 10, '#2b3440', { top: '#3a4552', right: '#222a33' }) +
        leds +
        '</g>';
    })();

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* رسم شاشة البداية                                                    */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><clipPath id="s1-win"><rect x="642" y="0" width="158" height="300"/></clipPath>' +
      '<linearGradient id="s1-isky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6f8"/><stop offset="1" stop-color="#eef7fd"/></linearGradient></defs>' +
      '<rect width="800" height="900" fill="#e4ddcd"/>' +
      '<path d="M470 0h330v520L470 360Z" fill="#d6cebc"/>' +
      '<path d="M520 0h280v440L520 300Z" fill="#a69d8f" opacity=".45"/>' +
      // النافذة والمخترق
      '<rect x="620" y="0" width="180" height="330" fill="#f2efe7"/>' +
      '<rect x="642" y="0" width="158" height="300" fill="url(#s1-isky)"/>' +
      '<g clip-path="url(#s1-win)">' +
      '<path d="M600 300c10-70 60-96 120-96s110 26 120 96Z" fill="#53606e"/>' +
      '<path d="M690 216h56v34c0 12-56 12-56 0Z" fill="#e9c6a3"/>' +
      '<ellipse cx="718" cy="150" rx="56" ry="66" fill="#f2d3b1"/>' +
      '<path d="M660 140c0-56 26-84 60-84s58 28 58 84Z" fill="#5d6b79"/>' +
      '<rect x="656" y="122" width="126" height="24" rx="12" fill="#4b5866"/>' +
      '<path d="M664 112c12-6 30-8 50-8M676 92c10-4 24-6 40-6" stroke="#6e7c8a" stroke-width="6" stroke-linecap="round" fill="none"/>' +
      '<rect x="660" y="152" width="118" height="30" rx="15" fill="#1d232a"/>' +
      '<ellipse cx="695" cy="167" rx="13" ry="9" fill="#fff"/><ellipse cx="745" cy="167" rx="13" ry="9" fill="#fff"/>' +
      '<circle cx="690" cy="168" r="4" fill="#1d232a"/><circle cx="740" cy="168" r="4" fill="#1d232a"/>' +
      '<path d="M705 200q13 6 24 0" stroke="#b9876a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      '<rect x="620" y="300" width="180" height="30" fill="#f2efe7"/>' +
      '<path d="M642 300h158" stroke="#d8d2c4" stroke-width="3"/>' +
      // سطح المكتب
      '<path d="M0 610 480 380 800 535V900H0Z" fill="#eef1f3"/>' +
      '<path d="M0 610 480 380 800 535" fill="none" stroke="#fff" stroke-width="4"/>' +
      // المصباح
      '<ellipse cx="560" cy="452" rx="54" ry="20" fill="#4f5966"/>' +
      '<ellipse cx="560" cy="445" rx="54" ry="20" fill="#6b7684"/>' +
      '<path d="M560 440 600 290 530 175" stroke="#4f5966" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="600" cy="290" r="13" fill="#8995a3"/>' +
      '<g transform="rotate(28 540 170)"><path d="M505 130h70l18 62H487Z" fill="#9aa5b1"/><path d="M505 130h35v62h-53Z" fill="#b6c0ca"/>' +
      '<ellipse cx="540" cy="192" rx="53" ry="11" fill="#ffd84d"/></g>' +
      // القفل العائم
      '<path d="M98 300v-46a46 46 0 0 1 92 0v46" fill="none" stroke="#dbe4ee" stroke-width="20"/>' +
      '<rect x="70" y="290" width="148" height="128" rx="26" fill="#3b8fd9"/>' +
      '<path d="M144 290h48a26 26 0 0 1 26 26v76a26 26 0 0 1-26 26h-48Z" fill="#2f7bc2"/>' +
      '<circle cx="144" cy="342" r="14" fill="#1d3b5c"/><rect x="138" y="346" width="12" height="36" rx="5" fill="#1d3b5c"/>' +
      // دفتر
      '<path d="M400 420 470 388 540 420 470 452Z" fill="#f08a2a"/>' +
      '<path d="M400 414 470 382 540 414 470 446Z" fill="#fff" stroke="#e0e4e9" stroke-width="2"/>' +
      // الحاسوب المحمول
      '<path d="M130 650 430 505 470 300 160 450Z" fill="#2f3b48"/>' +
      '<path d="M150 636 418 506 452 324 176 458Z" fill="#7dc3f2"/>' +
      '<path d="M210 560 340 498 360 418 232 480Z" fill="#ffb067"/>' +
      '<path d="M222 520 340 464 344 446 226 502Z" fill="#fff" opacity=".85"/>' +
      '<circle cx="290" cy="520" r="8" fill="#e8679f"/><circle cx="270" cy="540" r="8" fill="#3b8fd9"/>' +
      '<path d="M300 525 336 508M280 545 316 528" stroke="#fff" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M130 650 430 505 700 640 400 800Z" fill="#5b6776"/>' +
      '<path d="M130 650 400 800v14L130 664Z" fill="#3d4652"/>' +
      '<path d="M400 800 700 640v14L400 814Z" fill="#4a5462"/>' +
      '<path d="M190 652 430 536 590 616 352 736Z" fill="#3d4652"/>' +
      '<path d="M222 668 446 560M254 684 478 576M286 700 510 592M318 716 542 608" stroke="#56626f" stroke-width="5"/>' +
      '<path d="M420 760 500 720 560 750 480 790Z" fill="#76828f"/>' +
      // كوب
      '<ellipse cx="96" cy="790" rx="44" ry="15" fill="#d4cec2"/>' +
      '<path d="M52 700v90a44 15 0 0 0 88 0v-90Z" fill="#efe9de"/>' +
      '<path d="M140 720c26 0 26 50 0 50" stroke="#efe9de" stroke-width="10" fill="none"/>' +
      '<ellipse cx="96" cy="700" rx="44" ry="15" fill="#f3a057"/>' +
      '<path d="M96 700v40" stroke="#555" stroke-width="2"/><rect x="90" y="738" width="12" height="14" fill="#555"/>' +
      // الهاتف
      '<g transform="translate(10 -40)">' +
      '<path d="M190 870 300 812 410 870 300 928Z" fill="#1d2b3a"/>' +
      '<path d="M206 868 300 820 392 868 300 916Z" fill="#3f5873"/>' +
      '<path d="M240 860 300 830 330 846" fill="none" stroke="#7aa1c7" stroke-width="5" stroke-linecap="round"/>' +
      '</g>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'home-office',
    number: 1,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'حماية مكتبك المنزلي',
    title: 'سياسة سطح المكتب ومخاطر أمن المعلومات',
    description: 'تجوّل في المكتب المنزلي واكتشف العناصر التي قد تعرّض معلوماتك للخطر. انقر على كل عنصر وحدّد المخاطر المرتبطة به قبل نفاد الوقت.',
    timeLimit: 135,            // بالثواني
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
