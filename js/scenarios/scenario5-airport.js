/*
 * السيناريو 5: أمن المعلومات أثناء السفر — بوابة المغادرة B12 (صالة مطار عند الغروب)
 * البنية مماثلة للسيناريوهات السابقة (راجع README.md).
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
      id: 'charging',
      title: 'محطة شحن USB مجانية',
      options: [
        { text: 'نقل برامج ضارة عبر منفذ USB', correct: true },
        { text: 'سرقة البيانات من الهاتف أثناء الشحن', correct: true },
        { text: 'التصيّد الصوتي (Vishing)', correct: false },
        { text: 'هجوم القوة الغاشمة (Brute Force)', correct: false }
      ],
      feedback: {
        summary: 'منفذ USB لا ينقل الكهرباء فقط بل البيانات أيضًا. المنافذ العامة المعدّلة قد تثبّت برامج ضارة أو تنسخ بياناتك، وهو ما يُعرف بـ"اختطاف الشحن" (Juice Jacking).',
        tips: [
          'استخدم شاحنك الخاص مع مقبس الكهرباء العادي، أو بطارية متنقلة.',
          'استخدم كابل شحن فقط (بدون نقل بيانات) أو عازل بيانات USB.',
          'إذا ظهرت رسالة "الوثوق بهذا الجهاز؟" عند الشحن، اختر "عدم الوثوق".'
        ]
      }
    },
    {
      id: 'wifi',
      title: 'شبكتا واي فاي مجانيتان بالاسم نفسه تقريبًا',
      options: [
        { text: 'شبكة توأم شريرة (Evil Twin)', correct: true },
        { text: 'التنصّت على اتصالاتك', correct: true },
        { text: 'سرقة بيانات تسجيل الدخول', correct: true },
        { text: 'برامج الفدية على خادم المطار', correct: false }
      ],
      feedback: {
        summary: 'ينشئ المهاجم شبكة باسم مشابه لشبكة المطار (Airport-Free-WiFi بدل Airport_Free_WiFi)، فيمرّ كل ما تتصفحه عبر جهازه، وقد يعرض صفحة دخول مزيفة تطلب بريدك أو بطاقتك مقابل "5 دولارات للساعة".',
        tips: [
          'تأكد من اسم الشبكة الرسمي من لوحات المطار أو موظفيه.',
          'استخدم شبكة VPN موثوقة أو بيانات هاتفك عند الاتصال بالشبكات العامة.',
          'تجنّب الدخول إلى البنك أو حساب العمل عبر واي فاي عام، وألغِ الاتصال التلقائي بالشبكات المفتوحة.'
        ]
      }
    },
    {
      id: 'boarding',
      title: 'صورة بطاقة الصعود على وسائل التواصل',
      options: [
        { text: 'كشف بيانات الحجز من الباركود', correct: true },
        { text: 'إلغاء الرحلة أو تعديلها من شخص آخر', correct: true },
        { text: 'معرفة أن منزلك فارغ أثناء سفرك', correct: true },
        { text: 'انتحال هويتك باستخدام بياناتك', correct: true }
      ],
      feedback: {
        summary: 'جميع الخيارات صحيحة: الباركود يحتوي على اسمك ورقم الحجز، وبهما يمكن الدخول إلى حجزك وتعديله أو إلغاؤه، كما أن المنشور يخبر الجميع بأن منزلك فارغ.',
        tips: [
          'لا تنشر صور بطاقة الصعود أو جواز السفر، حتى بعد الرحلة.',
          'انشر صور السفر بعد عودتك بدل نشرها أثناء الرحلة.',
          'اجعل حساباتك على وسائل التواصل خاصة، وراجع من يمكنه رؤية منشوراتك.'
        ]
      }
    },
    {
      id: 'shoulder',
      title: 'ملف "رواتب الموظفين - سري" على الحاسوب',
      options: [
        { text: 'التلصّص على الشاشة (Shoulder Surfing)', correct: true },
        { text: 'هجوم الوسيط (Man-in-the-Middle)', correct: false },
        { text: 'برامج الفدية', correct: false },
        { text: 'التصيّد الاحتيالي', correct: false }
      ],
      feedback: {
        summary: 'الخطر هنا بسيط ومباشر: الراكب المجاور يستطيع قراءة الملف السري أو تصويره دون أي اختراق تقني.',
        tips: [
          'استخدم واقي خصوصية للشاشة (Privacy Filter) عند العمل في الأماكن العامة.',
          'لا تفتح الملفات السرية في المطارات والطائرات والمقاهي.',
          'اقفل الشاشة حتى لو ابتعدت لحظة واحدة.'
        ]
      }
    },
    {
      id: 'luggage',
      title: 'بطاقة الحقيبة تكشف العنوان كاملًا',
      options: [
        { text: 'كشف عنوان منزلك ومعلوماتك الشخصية', correct: true },
        { text: 'استهدافك بالهندسة الاجتماعية', correct: true },
        { text: 'حشو بيانات الاعتماد (Credential Stuffing)', correct: false },
        { text: 'برامج التجسس', correct: false }
      ],
      feedback: {
        summary: 'بطاقة الحقيبة المكشوفة تخبر أي شخص في الصالة باسمك وعنوان منزلك الفارغ ورقم هاتفك، وهي معلومات كافية لسرقة المنزل أو لمكالمة احتيال تبدو موثوقة.',
        tips: [
          'استخدم بطاقة حقيبة بغطاء يخفي المعلومات.',
          'اكتب الاسم ورقم الهاتف أو البريد فقط، دون عنوان المنزل.',
          'كن حذرًا من المتصلين الذين يعرفون تفاصيل رحلتك ويطلبون معلومات إضافية.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* رسم صالة المغادرة                                                    */
  /* ------------------------------------------------------------------ */

  // طائرة جانبية مسطحة (يتجه مقدمها إلى اليمين)
  function planeShape(fill, tail) {
    return '<path d="M0 14q0-8 14-8h86q16 0 24 8q-8 8-24 8H14Q0 22 0 14Z" fill="' + fill + '"/>' +
      '<path d="M8 8 0-8h12l14 14Z" fill="' + tail + '"/>' +
      '<path d="M52 16 34 34h12l26-18Z" fill="' + tail + '" opacity=".9"/>' +
      '<path d="M54 12 40 0h9l20 12Z" fill="' + tail + '" opacity=".7"/>' +
      '<g fill="#9fd0ee"><circle cx="30" cy="12" r="1.4"/><circle cx="38" cy="12" r="1.4"/><circle cx="46" cy="12" r="1.4"/><circle cx="62" cy="12" r="1.4"/><circle cx="70" cy="12" r="1.4"/><circle cx="78" cy="12" r="1.4"/><circle cx="86" cy="12" r="1.4"/></g>' +
      '<path d="M112 10q6 0 8 4h-10Z" fill="#2b3440"/>';
  }

  function renderScene(I) {
    const S = 520;
    const H = 270;
    const T = 18;
    const P = (x, y, z) => I.p(x, y, z);
    const blink = (d) => '<animate attributeName="opacity" values="1;.25;1" dur="' + (d || 1) + 's" repeatCount="indefinite"/>';
    let s = '';

    s += '<defs>' +
      '<linearGradient id="s5-sunset" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#2d2f6e"/><stop offset=".35" stop-color="#7b4c9e"/>' +
      '<stop offset=".62" stop-color="#ef6f6c"/><stop offset=".78" stop-color="#ffb55e"/></linearGradient>' +
      '<radialGradient id="s5-sun"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#ffd27a"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="s5-glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="s5-glass"><rect width="520" height="254"/></clipPath>' +
      '</defs>';

    // الأرضية والجدران
    s += I.box(0, 0, -T, S, S, T, '#b7bfc9', { top: '#dde2e8', left: '#c3cad3', right: '#aab3bd' });
    s += I.box(-T, -T, 0, T, S + T, H, '#cfd6de', { left: '#c2cad3', right: '#e4e9ee', top: '#f6f8fa' });
    s += I.box(0, -T, 0, S, T, H, '#cfd6de', { left: '#e9eef3', right: '#bcc5cf', top: '#f6f8fa' });

    // الجدار الزجاجي: غروب، مدرج، طائرة تقلع
    s += '<g transform="' + I.onPlaneY(0, 0.6, 262) + '"><g clip-path="url(#s5-glass)">' +
      '<rect width="520" height="254" fill="url(#s5-sunset)"/>' +
      '<circle cx="390" cy="172" r="70" fill="url(#s5-sun)"/>' +
      '<g fill="#f7a8a0" opacity=".55"><ellipse cx="90" cy="90" rx="60" ry="9"/><ellipse cx="140" cy="102" rx="44" ry="7"/><ellipse cx="320" cy="70" rx="70" ry="8"/><ellipse cx="460" cy="120" rx="50" ry="7"/></g>' +
      '<path d="M0 190h30v-22h14v-14h10v14h22v-30h12v30h26v-16h18v16h40v-40h8v-12h6v12h8v40h34v-24h20v24h60v-18h16v18h50v-34h12v34h30v-20h18v20h40v74H0Z" fill="#4a3566" opacity=".75"/>' +
      '<rect y="196" width="520" height="58" fill="#3b3f4a"/>' +
      '<path d="M0 222h520" stroke="#e9edf1" stroke-width="2" stroke-dasharray="18 14"/>' +
      '<g fill="#ffd27a">' + [20, 70, 120, 170, 220, 270, 320, 370, 420, 470].map((x) => '<circle cx="' + x + '" cy="206" r="2"/>').join('') + '</g>' +
      // طائرة تقلع
      '<g><animateTransform attributeName="transform" type="translate" values="-150 214;180 200;620 92" keyTimes="0;.45;1" dur="16s" repeatCount="indefinite"/>' +
      '<g transform="rotate(-9 60 14)">' + planeShape('#f4f6f9', '#3fa2e0') + '</g></g>' +
      // طائرة متوقفة عند البوابة
      '<g transform="translate(-40 150) scale(2.1)">' + planeShape('#ffffff', '#1f3b60') + '</g>' +
      '<rect width="520" height="254" fill="url(#s5-glare)"/>' +
      '</g>' +
      '<g stroke="#c9d0d9" stroke-width="6">' + [65, 130, 195, 260, 325, 390, 455].map((x) => '<path d="M' + x + ' 0v254"/>').join('') + '</g>' +
      '<path d="M0 118h520" stroke="#c9d0d9" stroke-width="4"/>' +
      '<rect width="520" height="254" fill="none" stroke="#aab3bd" stroke-width="8"/>' +
      '</g>';

    // الجدار الأيسر: لوحة البوابة، لوحة المغادرة، لافتة الواي فاي
    s += '<g transform="' + I.onPlaneX(0.6, 118, 214) + '">' +
      '<rect width="78" height="58" rx="4" fill="#f6c23e"/>' +
      '<text x="39" y="16" font-size="10" font-weight="700" fill="#1e2d3d" text-anchor="middle">بوابة</text>' +
      '<text x="39" y="46" font-size="30" font-weight="800" fill="#1e2d3d" text-anchor="middle" font-family="Arial, sans-serif">B12</text>' +
      '</g>';

    (function () {
      const rows = [
        ['دبي', '18:40', 'B12', 'صعود', '#2ee07a', true],
        ['لندن', '19:15', 'B14', 'تأخير', '#ff6b78', false],
        ['إسطنبول', '19:30', 'B12', 'في الموعد', '#ffd84d', false],
        ['القاهرة', '20:05', 'B10', 'في الموعد', '#ffd84d', false]
      ];
      // في النص العربي (direction="rtl") تعني text-anchor="start" الحافة اليمنى
      let r = '';
      rows.forEach((row, i) => {
        const y = 40 + i * 17;
        r += '<text x="222" y="' + y + '" font-size="10" fill="#e9edf1" text-anchor="start" direction="rtl">' + row[0] + '</text>' +
          '<text x="140" y="' + y + '" font-size="10" fill="#e9edf1" text-anchor="middle" font-family="Arial, sans-serif">' + row[1] + '</text>' +
          '<text x="95" y="' + y + '" font-size="10" fill="#e9edf1" text-anchor="middle" font-family="Arial, sans-serif">' + row[2] + '</text>' +
          '<text x="40" y="' + y + '" font-size="10" font-weight="700" fill="' + row[4] + '" text-anchor="middle">' + row[3] + (row[5] ? blink(0.9) : '') + '</text>';
      });
      s += '<g transform="' + I.onPlaneX(0.6, 372, 234) + '">' +
        '<rect width="236" height="112" rx="5" fill="#111827" stroke="#374151" stroke-width="5"/>' +
        '<rect x="5" y="5" width="226" height="20" fill="#1f2937"/>' +
        '<text x="222" y="19" font-size="11" font-weight="800" fill="#ffd84d" text-anchor="start" direction="rtl">المغادرة</text>' +
        '<path d="M150 13l10 3-10 3-2 4h-3l2-7-2-7h3Z" fill="#ffd84d"/>' +
        r + '</g>';
    })();
    s += '<g data-hotspot="wifi"><g transform="' + I.onPlaneX(0.6, 492, 178) + '">' +
      '<rect x="3" y="3" width="100" height="116" rx="6" fill="#000" opacity=".12"/>' +
      '<rect width="100" height="116" rx="6" fill="#1f3b60"/>' +
      '<g fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"><path d="M36 22q14-12 28 0"/><path d="M42 28q8-7 16 0"/></g>' +
      '<circle cx="50" cy="33" r="2.6" fill="#fff"/>' +
      '<text x="50" y="50" font-size="10.5" font-weight="700" fill="#fff" text-anchor="middle">واي فاي مجاني</text>' +
      '<rect x="8" y="60" width="84" height="18" rx="9" fill="#fff"/>' +
      '<text x="50" y="72.5" font-size="7.6" font-weight="700" fill="#1e2d3d" text-anchor="middle" direction="ltr" font-family="Arial, sans-serif">Airport_Free_WiFi</text>' +
      '<rect x="8" y="84" width="84" height="18" rx="9" fill="#fff"/>' +
      '<text x="50" y="96.5" font-size="7.6" font-weight="700" fill="#1e2d3d" text-anchor="middle" direction="ltr" font-family="Arial, sans-serif">Airport-Free-WiFi</text>' +
      '</g></g>';

    // السجادة
    s += I.poly([[140, 120, 0.3], [470, 120, 0.3], [470, 400, 0.3], [140, 400, 0.3]], '#36598a');
    s += I.poly([[152, 132, 0.4], [458, 132, 0.4], [458, 388, 0.4], [152, 388, 0.4]], '#36598a', 'stroke="#5a7fb0" stroke-width="2" fill-opacity="0"');

    // نبتة في الزاوية الخلفية
    (function () {
      const [cx, cy] = P(30, 30, 0);
      s += '<g>' +
        '<g fill="#1f6f5c"><ellipse cx="' + (cx - 16) + '" cy="' + (cy - 80) + '" rx="10" ry="30" transform="rotate(-26 ' + (cx - 16) + ' ' + (cy - 80) + ')"/>' +
        '<ellipse cx="' + (cx + 18) + '" cy="' + (cy - 82) + '" rx="10" ry="30" transform="rotate(26 ' + (cx + 18) + ' ' + (cy - 82) + ')"/></g>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 96) + '" rx="10" ry="36" fill="#2a8a70"/>' +
        '<path d="M' + (cx - 22) + ' ' + (cy - 46) + 'h44l-6 46h-32Z" fill="#e9edf1"/>' +
        '<path d="M' + cx + ' ' + (cy - 46) + 'h22l-6 46h-16Z" fill="#c9d0d9"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 46) + '" rx="22" ry="6" fill="#5b4636"/>' +
        '</g>';
    })();

    // صف مقاعد (الظهر نحو الزجاج)
    function bench(x0, y0, n, seatColor) {
      const w = 46;
      let b = '';
      [x0 + 10, x0 + n * w - 16].forEach((lx) => { b += I.box(lx, y0 + 16, 0, 6, 10, 38, '#4b5563'); });
      b += I.box(x0, y0 + 2, 34, n * w, 36, 4, '#4b5563');
      b += I.box(x0, y0 - 6, 38, n * w, 7, 44, CE.shade(seatColor, -0.15));
      for (let i = 0; i < n; i++) {
        b += I.box(x0 + i * w + 2, y0 + 1, 38, w - 4, 36, 6, seatColor);
        b += I.box(x0 + i * w - 2, y0 + 2, 44, 4, 34, 14, '#9aa5b1');
      }
      b += I.box(x0 + n * w - 2, y0 + 2, 44, 4, 34, 14, '#9aa5b1');
      return b;
    }

    s += bench(176, 152, 6, '#3c8fdc');

    // هاتف المسافر ومنشور بطاقة الصعود (عنصر خطر)
    (function () {
      const ph = P(214, 172, 46);
      const bx = ph[0] - 86, by = ph[1] - 200;
      let bars = '';
      for (let i = 0; i < 26; i++) {
        const w = (i * 7) % 3 + 1;
        bars += '<rect x="' + (bx + 26 + i * 3.6) + '" y="' + (by + 108) + '" width="' + w + '" height="22" fill="#1e2d3d"/>';
      }
      s += '<g data-hotspot="boarding" data-hit="self">' +
        '<ellipse class="hit" cx="' + ph[0] + '" cy="' + ph[1] + '" rx="28" ry="18"/>' +
        I.box(206, 160, 42.4, 16, 28, 2.5, '#1f2933', { top: '#1f2933' }) +
        '<g transform="' + I.onPlaneZ(207.5, 161.5, 45) + '"><rect width="13" height="25" rx="1.5" fill="#e8679f"/><rect x="2" y="9" width="9" height="7" fill="#fff"/></g>' +
        '<path d="M' + (bx + 74) + ' ' + (by + 150) + 'L' + ph[0] + ' ' + (ph[1] - 6) + 'L' + (bx + 100) + ' ' + (by + 150) + 'Z" fill="#fff" stroke="#e8679f" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<rect x="' + bx + '" y="' + by + '" width="172" height="152" rx="14" fill="#fff" stroke="#e8679f" stroke-width="2.5"/>' +
        '<path d="M' + (bx + 75) + ' ' + (by + 148) + 'h24" stroke="#fff" stroke-width="4"/>' +
        '<circle cx="' + (bx + 154) + '" cy="' + (by + 18) + '" r="10" fill="#f6c23e"/>' +
        '<text x="' + (bx + 96) + '" y="' + (by + 22) + '" font-size="11.5" font-weight="700" fill="#1e2d3d" text-anchor="middle">أخيرًا إجازة!</text>' +
        '<rect x="' + (bx + 12) + '" y="' + (by + 36) + '" width="148" height="100" rx="8" fill="#eaf4fc" stroke="#9fd0ee"/>' +
        '<text x="' + (bx + 86) + '" y="' + (by + 54) + '" font-size="10" font-weight="700" fill="#1f3b60" text-anchor="middle">بطاقة صعود · B12</text>' +
        '<text x="' + (bx + 86) + '" y="' + (by + 72) + '" font-size="9.5" fill="#1e2d3d" text-anchor="middle">أحمد سالم · مقعد 14A</text>' +
        '<text x="' + (bx + 86) + '" y="' + (by + 92) + '" font-size="9" fill="#5a6675" text-anchor="middle" direction="ltr" font-family="Arial, sans-serif">PNR: K7XQ2M</text>' +
        bars +
        '<path d="M' + (bx + 20) + ' ' + (by + 10) + 'c-4-6-14-2-8 5l8 7 8-7c6-7-4-11-8-5Z" fill="#ef4352">' + blink(1.2) + '</path>' +
        '</g>';
    })();

    // صف المقاعد الأمامي
    s += bench(176, 292, 6, '#3c8fdc');

    // الحاسوب والراكب المجاور (عنصر خطر)
    (function () {
      const head = P(372, 304, 116);
      s += '<g data-hotspot="shoulder">' +
        I.box(304, 302, 44, 46, 30, 3, '#a7b1bc') +
        '<g transform="' + I.onPlaneZ(306, 304, 47.2) + '"><rect x="2" y="2" width="40" height="12" rx="1" fill="#3b4652"/><rect x="14" y="17" width="16" height="8" rx="1" fill="#8e99a5"/></g>' +
        I.box(304, 298, 47, 46, 4, 34, '#2f3b48') +
        '<g transform="' + I.onPlaneY(306, 302.3, 79) + '">' +
        '<rect width="42" height="30" fill="#fff"/>' +
        '<rect width="42" height="6" fill="#1f8a4c"/>' +
        '<text x="21" y="12" font-size="4.4" font-weight="700" fill="#1e2d3d" text-anchor="middle">رواتب الموظفين</text>' +
        '<path d="M3 15h36M3 19h36M3 23h36M3 27h36M14 14v16M27 14v16" stroke="#c4cbd4" stroke-width=".6"/>' +
        '<rect x="24" y="16" width="16" height="7" rx="1" fill="none" stroke="#ef4352" stroke-width="1" transform="rotate(-12 32 19)"/>' +
        '<text x="32" y="21.3" font-size="4.6" font-weight="800" fill="#ef4352" text-anchor="middle" transform="rotate(-12 32 19)">سري</text>' +
        '</g>' +
        // الراكب المجاور
        I.box(356, 298, 44, 32, 26, 9, '#1f3b60') +
        I.box(356, 324, 6, 32, 8, 38, '#1f3b60') +
        I.box(356, 330, 0, 32, 12, 6, '#2b333c') +
        I.box(356, 296, 53, 32, 16, 44, '#e8679f', { top: '#f08db0' }) +
        '<ellipse cx="' + head[0] + '" cy="' + (head[1] + 4) + '" rx="14" ry="16" fill="#e9c6a3"/>' +
        '<path d="M' + (head[0] - 15) + ' ' + (head[1] + 2) + 'q1-20 15-20t15 18q-8-8-15-8t-15 10Z" fill="#3a2a22"/>' +
        '<circle cx="' + (head[0] - 6) + '" cy="' + (head[1] + 5) + '" r="1.8" fill="#1e2d3d"/>' +
        '<circle cx="' + (head[0] + 2) + '" cy="' + (head[1] + 5) + '" r="1.8" fill="#1e2d3d"/>' +
        '<g transform="translate(' + (head[0] - 44) + ' ' + (head[1] - 30) + ')">' +
        '<circle r="13" fill="#fff" stroke="#ef4352" stroke-width="2"/>' +
        '<path d="M-8 0q8-8 16 0q-8 8-16 0Z" fill="none" stroke="#1e2d3d" stroke-width="1.8"/><circle r="2.6" fill="#1e2d3d"/>' +
        blink(1.4) + '</g>' +
        '</g>';
    })();

    // كوب قهوة على مقعد
    (function () {
      const [cx, cy] = P(420, 312, 44);
      s += '<g><path d="M' + (cx - 7) + ' ' + cy + 'l1-16h12l1 16Z" fill="#f3f0e8"/><rect x="' + (cx - 7) + '" y="' + (cy - 11) + '" width="14" height="5" fill="#2db46d"/><ellipse cx="' + cx + '" cy="' + (cy - 16) + '" rx="6" ry="2" fill="#5b4636"/></g>';
    })();

    // الحقيبة وبطاقتها (عنصر خطر)
    (function () {
      const tag = P(146, 362, 76);
      s += '<g data-hotspot="luggage">' +
        I.box(132, 352, 0, 6, 6, 4, '#2b333c') + I.box(164, 352, 0, 6, 6, 4, '#2b333c') +
        I.box(128, 340, 4, 46, 26, 70, '#e84a4a', { top: '#f07272' }) +
        I.poly([[128, 366.4, 20], [174, 366.4, 20], [174, 366.4, 22], [128, 366.4, 22]], '#c0392b') +
        I.poly([[128, 366.4, 54], [174, 366.4, 54], [174, 366.4, 56], [128, 366.4, 56]], '#c0392b') +
        I.box(140, 350, 74, 3, 3, 26, '#4b5563') + I.box(160, 350, 74, 3, 3, 26, '#4b5563') +
        I.box(140, 350, 98, 23, 3, 3, '#4b5563') +
        '<path d="M' + P(150, 362, 74)[0] + ' ' + P(150, 362, 74)[1] + 'L' + (tag[0] - 2) + ' ' + (tag[1] + 10) + '" stroke="#1e2d3d" stroke-width="1.6"/>' +
        '<g transform="translate(' + (tag[0] - 64) + ' ' + (tag[1] + 8) + ') rotate(-6)">' +
        '<rect width="96" height="50" rx="6" fill="#fff" stroke="#f6c23e" stroke-width="2.5"/>' +
        '<circle cx="88" cy="8" r="3" fill="#f6c23e"/>' +
        '<text x="48" y="15" font-size="9" font-weight="700" fill="#1e2d3d" text-anchor="middle">أحمد سالم</text>' +
        '<text x="48" y="28" font-size="7.4" fill="#c0392b" text-anchor="middle">حي النخيل، شارع 12، منزل 7</text>' +
        '<text x="48" y="41" font-size="7.4" fill="#5a6675" text-anchor="middle" direction="ltr" font-family="Arial, sans-serif">+962 79 000 0000</text>' +
        '</g>' +
        '</g>';
    })();

    // محطة الشحن المجانية (عنصر خطر)
    s += '<g data-hotspot="charging">' +
      I.box(466, 330, 0, 36, 34, 132, '#e9edf1', { left: '#f4f6f9', right: '#d3d9e0', top: '#ffffff' }) +
      '<g transform="' + I.onPlaneY(469, 364.3, 128) + '">' +
      '<rect width="30" height="36" rx="3" fill="#2db46d"/>' +
      '<path d="M17 5 9 19h6l-3 11 9-15h-6l3-10Z" fill="#fff"/>' +
      '<rect y="40" width="30" height="12" rx="2" fill="#1f3b60"/>' +
      '<text x="15" y="49" font-size="7.4" font-weight="700" fill="#fff" text-anchor="middle">شحن مجاني</text>' +
      '<g fill="#2b333c"><rect x="4" y="62" width="6" height="3.5" rx=".8"/><rect x="12" y="62" width="6" height="3.5" rx=".8"/><rect x="20" y="62" width="6" height="3.5" rx=".8"/></g>' +
      '<path d="M7 66q-2 14 4 22M15 66q2 10 0 22" stroke="#1e2d3d" stroke-width="1.6" fill="none"/>' +
      '</g>' +
      I.box(466, 364, 34, 36, 12, 3, '#c9d0d9') +
      I.box(474, 366, 37, 12, 8, 22, '#1f2933', { left: '#5db2ee' }) +
      I.box(486, 366, 37, 12, 8, 22, '#1f2933', { left: '#9fe3b8' }) +
      '<circle cx="' + P(484, 364.5, 120)[0] + '" cy="' + P(484, 364.5, 120)[1] + '" r="2.6" fill="#2ee07a">' + blink(0.8) + '</circle>' +
      '</g>';

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* رسم شاشة البداية: نافذة الطائرة                                      */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    let bars = '';
    for (let i = 0; i < 30; i++) bars += '<rect x="' + (52 + i * 4) + '" y="772" width="' + ((i * 5) % 3 + 1) + '" height="30" fill="#1e2d3d"/>';
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="s5-isky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d2f6e"/><stop offset=".45" stop-color="#8b4f9e"/><stop offset=".75" stop-color="#ef6f6c"/><stop offset="1" stop-color="#ffb55e"/></linearGradient>' +
      '<clipPath id="s5-iwin"><rect x="235" y="105" width="330" height="430" rx="150"/></clipPath>' +
      '</defs>' +
      '<rect width="800" height="900" fill="#ebe6dd"/>' +
      '<path d="M0 0h800v40C600 70 200 70 0 40Z" fill="#dcd5c9"/>' +
      // نافذة الطائرة
      '<rect x="200" y="70" width="400" height="500" rx="185" fill="#d8d1c4"/>' +
      '<rect x="220" y="90" width="360" height="460" rx="168" fill="#c9c1b3"/>' +
      '<g clip-path="url(#s5-iwin)">' +
      '<rect x="235" y="105" width="330" height="430" fill="url(#s5-isky)"/>' +
      '<circle cx="470" cy="420" r="60" fill="#ffe0a0" opacity=".85"/>' +
      '<g fill="#f7b3a8" opacity=".75"><ellipse cx="300" cy="300" rx="90" ry="16"/><ellipse cx="460" cy="250" rx="80" ry="12"/><ellipse cx="380" cy="470" rx="140" ry="26"/></g>' +
      '<g fill="#fde0d6"><ellipse cx="300" cy="500" rx="110" ry="30"/><ellipse cx="480" cy="510" rx="100" ry="26"/></g>' +
      '<path d="M235 430 520 360 540 372 235 470Z" fill="#e9edf1"/><path d="M235 470 540 372 545 380 235 482Z" fill="#aab3bd"/>' +
      '<path d="M500 368 530 330 545 334 528 372Z" fill="#3fa2e0"/>' +
      '</g>' +
      '<rect x="235" y="105" width="330" height="430" rx="150" fill="none" stroke="#b9b0a1" stroke-width="6"/>' +
      '<rect x="250" y="80" width="300" height="70" rx="30" fill="#e2dbcf"/>' +
      // طاولة الطعام
      '<path d="M0 640h800v260H0Z" fill="#9aa5b1"/>' +
      '<path d="M0 640h800" stroke="#c9d0d9" stroke-width="10"/>' +
      // بطاقة الصعود على الهاتف
      '<g transform="rotate(-10 140 760)">' +
      '<rect x="30" y="600" width="220" height="300" rx="26" fill="#1f2933"/>' +
      '<rect x="42" y="620" width="196" height="262" rx="14" fill="#fff"/>' +
      '<rect x="42" y="620" width="196" height="56" rx="14" fill="#1f3b60"/>' +
      '<text x="140" y="656" font-size="22" font-weight="700" fill="#fff" text-anchor="middle">بطاقة صعود</text>' +
      '<text x="140" y="712" font-size="34" font-weight="800" fill="#1e2d3d" text-anchor="middle" font-family="Arial, sans-serif">B12</text>' +
      '<text x="140" y="748" font-size="17" fill="#5a6675" text-anchor="middle">مقعد 14A</text>' +
      bars +
      '<circle cx="216" cy="846" r="16" fill="#ef4352"/><path d="M216 852c-8-6-10-12-4-14 2-1 4 0 4 2 0-2 2-3 4-2 6 2 4 8-4 14Z" fill="#fff"/>' +
      '</g>' +
      // جواز السفر
      '<g transform="rotate(12 600 760)">' +
      '<rect x="500" y="660" width="190" height="250" rx="12" fill="#1f3b60"/>' +
      '<circle cx="595" cy="760" r="44" fill="none" stroke="#e3c27a" stroke-width="6"/>' +
      '<path d="M595 724v72M559 760h72" stroke="#e3c27a" stroke-width="4"/>' +
      '<text x="595" y="850" font-size="24" font-weight="700" fill="#e3c27a" text-anchor="middle">جواز سفر</text>' +
      '</g>' +
      // كوب
      '<ellipse cx="360" cy="830" rx="50" ry="16" fill="#7b8794"/>' +
      '<path d="M310 740v90a50 16 0 0 0 100 0v-90Z" fill="#f4f6f9"/>' +
      '<ellipse cx="360" cy="740" rx="50" ry="16" fill="#7a4b2a"/>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'airport',
    number: 5,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'بوابة المغادرة B12',
    title: 'أمن المعلومات أثناء السفر',
    description: 'رحلتك تُقلع بعد قليل! قبل الصعود إلى الطائرة، اكتشف المخاطر الأمنية المنتشرة في صالة المغادرة: من محطات الشحن إلى شبكات الواي فاي ومنشورات السفر.',
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
