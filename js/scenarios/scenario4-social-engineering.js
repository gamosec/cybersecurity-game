/*
 * السيناريو 4: الهندسة الاجتماعية — الزائر غير المتوقع (منطقة الاستقبال)
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
      id: 'door',
      title: 'باب الموظفين مفتوح بإسفين',
      options: [
        { text: 'التتبّع خلف الموظفين (Tailgating)', correct: true },
        { text: 'دخول أشخاص غير مصرّح لهم', correct: true },
        { text: 'سرقة الأجهزة والمستندات', correct: true },
        { text: 'زرع أجهزة تنصّت أو ذاكرات USB داخل المكتب', correct: true }
      ],
      feedback: {
        summary: 'جميع الخيارات صحيحة: الباب المفتوح يُبطل نظام البطاقات بالكامل، فيدخل أي شخص دون تحقق ليسرق أو يزرع أجهزة داخل المكتب.',
        tips: [
          'لا تترك الأبواب الآمنة مفتوحة، وأبلغ عن أي باب معطّل أو مسنود.',
          'لا تسمح لأحد بالدخول خلفك دون بطاقة، حتى لو بدا لطيفًا أو يحمل صناديق.',
          'وجّه الزوار إلى الاستقبال لتسجيلهم ومرافقتهم.'
        ]
      }
    },
    {
      id: 'badge',
      title: 'بطاقة موظف متروكة على الاستقبال',
      options: [
        { text: 'انتحال هوية الموظف', correct: true },
        { text: 'الدخول المادي غير المصرّح به', correct: true },
        { text: 'التصيّد عبر الرسائل النصية', correct: false },
        { text: 'برامج الفدية', correct: false }
      ],
      feedback: {
        summary: 'بطاقة الدخول مفتاح مادي وهوية في الوقت نفسه: من يجدها يستطيع فتح الأبواب والتظاهر بأنه موظف.',
        tips: [
          'احمل بطاقتك دائمًا، وأخفها عند مغادرة مبنى العمل.',
          'أبلغ فورًا عن فقدان بطاقتك ليتم إيقافها.',
          'سلّم أي بطاقة تجدها إلى الأمن بدل تركها في مكان عام.'
        ]
      }
    },
    {
      id: 'ceo',
      title: 'طلب عاجل من "المدير التنفيذي" بتحويل مالي',
      options: [
        { text: 'انتحال صفة المدير (CEO Fraud)', correct: true },
        { text: 'الاحتيال المالي', correct: true },
        { text: 'الضغط والاستعجال كأسلوب خداع', correct: true },
        { text: 'هجوم الوسيط (Man-in-the-Middle)', correct: false }
      ],
      feedback: {
        summary: 'المحتال ينتحل صفة المدير ويطلب تحويل 12,000 دولار "فورًا" إلى مورّد في الخارج، مستغلًا السلطة والاستعجال لمنعك من التحقق. ولا يحتاج إلى اعتراض الاتصال؛ يكفيه أن يقنعك.',
        tips: [
          'تحقّق من أي طلب تحويل مالي عبر قناة أخرى معروفة، كالاتصال برقم المدير المسجّل لديك.',
          'اتبع إجراءات الموافقة المعتمدة مهما كانت درجة الاستعجال، سواء كان المبلغ 500 دينار أو آلاف الدولارات.',
          'كن حذرًا من طلبات السرية ("لا تخبر أحدًا") وتغيير الحساب البنكي للمورّد.'
        ]
      }
    },
    {
      id: 'board',
      title: 'لوحة الإعلانات في منطقة الاستقبال',
      options: [
        { text: 'جمع المعلومات لتنفيذ هجمات موجّهة', correct: true },
        { text: 'هجوم القوة الغاشمة (Brute Force)', correct: false },
        { text: 'التنصّت على الشبكة اللاسلكية', correct: false },
        { text: 'برامج التجسس', correct: false }
      ],
      feedback: {
        summary: 'الهيكل التنظيمي وأرقام التحويلات وإعلان "مدير تقنية المعلومات في إجازة" هدية للمهاجم: يعرف من ينتحل صفته، ومن يتصل به، ومتى يكون التحقق أضعف.',
        tips: [
          'لا تعرض المعلومات الداخلية في الأماكن التي يصل إليها الزوار.',
          'تجنّب الإعلان عن إجازات المسؤولين أو تفاصيل الأنظمة في الأماكن العامة وعلى وسائل التواصل.',
          'كن حذرًا من المتصلين الذين يعرفون أسماء زملائك ويستخدمونها لكسب ثقتك.'
        ]
      }
    },
    {
      id: 'visitor',
      title: 'سجل الزوار: "فني صيانة" بلا هوية',
      options: [
        { text: 'انتحال صفة فني (Pretexting)', correct: true },
        { text: 'الوصول إلى غرفة الخوادم', correct: true },
        { text: 'زرع أجهزة أو سرقة معدات', correct: true },
        { text: 'هجوم القوة الغاشمة (Brute Force)', correct: false }
      ],
      feedback: {
        summary: 'دخل شخص بصفة "فني صيانة" دون موعد أو هوية، ثم طلب الوصول إلى غرفة الخوادم. هذه قصة مختلقة (Pretexting) هدفها الوصول المادي إلى الأجهزة.',
        tips: [
          'تحقّق من هوية أي فني أو مورّد ومن وجود موعد مسبق مع الجهة المعنية.',
          'رافق الزوار دائمًا، ولا تسمح لهم بدخول المناطق الحساسة وحدهم.',
          'اتصل بالشركة الموردة عبر رقمها الرسمي إذا ساورك الشك.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* رسم منطقة الاستقبال                                                  */
  /* ------------------------------------------------------------------ */

  function renderScene(I) {
    const S = 520;
    const H = 270;
    const T = 18;
    const P = (x, y, z) => I.p(x, y, z);
    const blink = '<animate attributeName="opacity" values="1;.2;1" dur="1s" repeatCount="indefinite"/>';
    let s = '';

    s += '<defs>' +
      '<linearGradient id="s4-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7e3f8"/><stop offset="1" stop-color="#f1f8fe"/></linearGradient>' +
      '<linearGradient id="s4-hall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b3440"/><stop offset="1" stop-color="#45505e"/></linearGradient>' +
      '</defs>';

    // الأرضية والجدران
    s += I.box(0, 0, -T, S, S, T, '#bfc5cc', { top: '#e4e7eb', left: '#c6ccd3', right: '#b1b8c0' });
    for (let k = 65; k < S; k += 65) {
      s += I.poly([[k, 0, 0.2], [k + 1, 0, 0.2], [k + 1, S, 0.2], [k, S, 0.2]], '#d3d7dc');
      s += I.poly([[0, k, 0.2], [S, k, 0.2], [S, k + 1, 0.2], [0, k + 1, 0.2]], '#d3d7dc');
    }
    s += I.box(-T, -T, 0, T, S + T, H, '#d5dde6', { left: '#c8d1db', right: '#e2e9f0', top: '#f6f8fa' });
    s += I.box(0, -T, 0, S, T, H, '#d5dde6', { left: '#eaf0f5', right: '#c4ced8', top: '#f6f8fa' });
    s += I.poly([[0.5, 0, 0], [0.5, S, 0], [0.5, S, 10], [0.5, 0, 10]], '#c8d1db');
    s += I.poly([[0, 0.5, 0], [S, 0.5, 0], [S, 0.5, 10], [0, 0.5, 10]], '#d6dee6');

    // الجدار الأيمن: نافذة وشعار الشركة
    s += '<g transform="' + I.onPlaneY(50, 0.6, 236) + '">' +
      '<rect width="120" height="125" fill="#f6f8fa"/>' +
      '<rect x="8" y="8" width="104" height="109" fill="url(#s4-sky)"/>' +
      '<path d="M16 80 46 22M44 108 92 26" stroke="#fff" stroke-width="8" opacity=".5"/>' +
      '<path d="M60 8v109" stroke="#f6f8fa" stroke-width="5"/>' +
      '</g>';
    s += I.box(46, 0, 105, 128, 10, 6, '#f1f4f7');
    s += '<g transform="' + I.onPlaneY(206, 0.6, 250) + '">' +
      '<rect width="170" height="46" rx="6" fill="#1f3b60"/>' +
      '<circle cx="148" cy="23" r="13" fill="#3fa2e0"/><path d="M142 23l5 5 8-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<text x="70" y="29" font-size="17" font-weight="800" fill="#fff" text-anchor="middle">شركة المستقبل</text>' +
      '</g>';

    // باب الموظفين المسنود (عنصر خطر)
    (function () {
      s += '<g data-hotspot="door">' +
        '<g transform="' + I.onPlaneY(394, 0.6, 222) + '">' +
        '<rect width="84" height="222" fill="#9aa5b1"/>' +
        '<rect x="6" y="6" width="72" height="216" fill="url(#s4-hall)"/>' +
        '<rect x="2" y="-28" width="80" height="20" rx="3" fill="#ef4352"/>' +
        '<text x="42" y="-14" font-size="10.5" font-weight="700" fill="#fff" text-anchor="middle">للموظفين فقط</text>' +
        '</g>' +
        I.box(396, 0.5, 0, 4, 74, 210, '#a9d4f0', { left: '#8fc3e6', right: '#bfe0f5', top: '#cfe8f8' }) +
        I.poly([[400.3, 10, 95], [400.3, 64, 95], [400.3, 64, 100], [400.3, 10, 100]], '#5a6675') +
        I.box(394, 72, 0, 18, 14, 9, '#f6c23e', { top: '#ffd84d' }) +
        '<g transform="' + I.onPlaneY(484, 0.6, 128) + '"><rect width="11" height="24" rx="2" fill="#2b3440"/>' +
        '<circle cx="5.5" cy="7" r="2.6" fill="#ef4352">' + blink + '</circle></g>' +
        '</g>';
    })();

    // الجدار الأيسر: لوحة الإعلانات (عنصر خطر)
    s += '<g data-hotspot="board"><g transform="' + I.onPlaneX(0.6, 280, 238) + '">' +
      '<rect width="170" height="118" rx="3" fill="#8a6a4f"/>' +
      '<rect x="6" y="6" width="158" height="106" fill="#d2a978"/>' +
      // الهيكل التنظيمي
      '<rect x="12" y="12" width="78" height="60" fill="#fff"/>' +
      '<text x="51" y="22" font-size="7" font-weight="700" fill="#1e2d3d" text-anchor="middle">الهيكل التنظيمي</text>' +
      '<g fill="#3c8fdc"><rect x="41" y="27" width="20" height="9" rx="1"/><rect x="18" y="46" width="18" height="8" rx="1"/><rect x="42" y="46" width="18" height="8" rx="1"/><rect x="66" y="46" width="18" height="8" rx="1"/>' +
      '<rect x="18" y="60" width="18" height="8" rx="1" opacity=".6"/><rect x="66" y="60" width="18" height="8" rx="1" opacity=".6"/></g>' +
      '<path d="M51 36v5M27 41h48M27 41v5M51 41v5M75 41v5" stroke="#3c8fdc" stroke-width="1.2" fill="none"/>' +
      // أرقام التحويلات
      '<rect x="96" y="12" width="62" height="44" fill="#fff8c8"/>' +
      '<text x="127" y="22" font-size="6.5" font-weight="700" fill="#1e2d3d" text-anchor="middle">أرقام التحويلات</text>' +
      '<path d="M102 29h50M102 36h44M102 43h50M102 50h40" stroke="#b9a66a" stroke-width="1.4"/>' +
      // إعلان الإجازة
      '<rect x="96" y="62" width="62" height="44" fill="#fde3e5"/>' +
      '<text x="127" y="74" font-size="6.2" font-weight="700" fill="#c0392b" text-anchor="middle">مدير تقنية</text>' +
      '<text x="127" y="83" font-size="6.2" font-weight="700" fill="#c0392b" text-anchor="middle">المعلومات في إجازة</text>' +
      '<text x="127" y="95" font-size="6.2" fill="#5a6675" text-anchor="middle">حتى 20 أكتوبر</text>' +
      '<rect x="12" y="78" width="78" height="28" fill="#e2f3ea"/>' +
      '<path d="M18 86h62M18 93h50M18 100h56" stroke="#7fb59a" stroke-width="1.4"/>' +
      '<g fill="#ef4352"><circle cx="51" cy="14" r="2.4"/><circle cx="127" cy="14" r="2.4"/><circle cx="127" cy="64" r="2.4"/><circle cx="51" cy="80" r="2.4"/></g>' +
      '</g></g>';

    // نبتة في الزاوية الخلفية
    (function () {
      const [cx, cy] = P(26, 40, 0);
      s += '<g>' +
        '<g fill="#1f6f5c"><ellipse cx="' + (cx - 14) + '" cy="' + (cy - 76) + '" rx="9" ry="28" transform="rotate(-26 ' + (cx - 14) + ' ' + (cy - 76) + ')"/>' +
        '<ellipse cx="' + (cx + 16) + '" cy="' + (cy - 78) + '" rx="9" ry="28" transform="rotate(26 ' + (cx + 16) + ' ' + (cy - 78) + ')"/></g>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 90) + '" rx="9" ry="32" fill="#2a8a70"/>' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 42) + 'h40l-6 42h-28Z" fill="#3a4552"/>' +
        '<path d="M' + cx + ' ' + (cy - 42) + 'h20l-6 42h-14Z" fill="#2b333c"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 42) + '" rx="20" ry="6" fill="#5b4636"/>' +
        '</g>';
    })();

    // كرسي موظف الاستقبال (خلف الطاولة)
    s += I.box(300, 110, 0, 50, 6, 4, '#2b333c');
    s += I.box(322, 88, 0, 6, 50, 4, '#2b333c');
    s += I.box(321, 109, 4, 8, 8, 44, '#2b333c');
    s += I.box(298, 84, 92, 54, 6, 50, '#3a4552');
    s += I.box(298, 90, 48, 54, 50, 8, '#4b5563');

    // طاولة الاستقبال
    s += I.box(190, 140, 0, 250, 66, 90, '#f1f3f6', { left: '#3c8fdc', right: '#2f7bc2', top: '#f7f8fa' });
    s += I.poly([[190, 206.4, 30], [440, 206.4, 30], [440, 206.4, 34], [190, 206.4, 34]], '#2f7bc2');
    s += I.box(186, 136, 90, 258, 74, 5, '#e2e7ec', { top: '#f7f8fa', left: '#d3d9e0', right: '#c4ccd5' });
    // شاشة الاستقبال (من الخلف)
    s += I.box(318, 150, 95, 40, 6, 3, '#2f3b48');
    s += I.box(334, 152, 98, 8, 4, 18, '#2f3b48');
    s += I.box(306, 154, 112, 64, 4, 40, '#3a4552', { left: '#4b5563' });

    // سجل الزوار (عنصر خطر)
    s += '<g data-hotspot="visitor">' +
      '<g transform="' + I.onPlaneZ(204, 156, 95.3) + '"><g transform="rotate(6 22 26)">' +
      '<rect width="44" height="54" rx="3" fill="#8a6a4f"/>' +
      '<rect x="4" y="7" width="36" height="44" fill="#fff"/>' +
      '<rect x="14" y="2" width="16" height="7" rx="2" fill="#9aa5b1"/>' +
      '<text x="22" y="16" font-size="5.6" font-weight="700" fill="#1e2d3d" text-anchor="middle">سجل الزوار</text>' +
      '<path d="M8 21h28M8 28h28" stroke="#c4cbd4" stroke-width="1.2"/>' +
      '<text x="22" y="36" font-size="4.6" font-weight="700" fill="#c0392b" text-anchor="middle">فني صيانة</text>' +
      '<text x="22" y="43" font-size="4.2" fill="#c0392b" text-anchor="middle">بلا هوية ← الخوادم</text>' +
      '</g></g>' +
      I.box(232, 190, 95, 30, 3, 2, '#1f3b60') +
      '</g>';

    // بطاقة الموظف المتروكة (عنصر خطر)
    s += '<g data-hotspot="badge">' +
      '<path d="M' + P(262, 158, 95.4)[0] + ' ' + P(262, 158, 95.4)[1] + 'Q' + P(250, 170, 95.4)[0] + ' ' + (P(250, 170, 95.4)[1] + 6) + ' ' + P(266, 182, 95.4)[0] + ' ' + P(266, 182, 95.4)[1] + '" stroke="#3c8fdc" stroke-width="3" fill="none"/>' +
      '<g transform="' + I.onPlaneZ(266, 166, 95.5) + '"><g transform="rotate(-10 15 20)">' +
      '<rect width="30" height="40" rx="3" fill="#fff" stroke="#c4cbd4"/>' +
      '<rect width="30" height="8" rx="2" fill="#1f3b60"/>' +
      '<circle cx="15" cy="17" r="5" fill="#e9c6a3"/><path d="M8 28q7-8 14 0Z" fill="#3c8fdc"/>' +
      '<text x="15" y="35" font-size="4.6" font-weight="700" fill="#1e2d3d" text-anchor="middle">سارة - الموارد</text>' +
      '</g></g>' +
      '</g>';

    // هاتف الاستقبال وطلب "المدير" (عنصر خطر)
    (function () {
      const h = P(400, 170, 104);
      const bx = h[0] - 100, by = h[1] - 200;
      s += '<g data-hotspot="ceo" data-hit="self">' +
        '<ellipse class="hit" cx="' + h[0] + '" cy="' + (h[1] + 8) + '" rx="40" ry="26"/>' +
        I.box(380, 154, 95, 44, 36, 8, '#2f3b48', { top: '#3a4552' }) +
        I.box(384, 158, 103, 14, 28, 7, '#1f2933', { top: '#2b3440' }) +
        '<g transform="' + I.onPlaneZ(400, 160, 103.2) + '"><rect width="18" height="8" rx="1" fill="#9fe3b8"/></g>' +
        '<path d="M' + (bx + 92) + ' ' + (by + 70) + 'L' + (h[0] + 4) + ' ' + (h[1] - 14) + 'L' + (bx + 116) + ' ' + (by + 70) + 'Z" fill="#fff" stroke="#ef4352" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<rect x="' + bx + '" y="' + by + '" width="170" height="72" rx="14" fill="#fff" stroke="#ef4352" stroke-width="2.5"/>' +
        '<path d="M' + (bx + 93) + ' ' + (by + 68) + 'h22" stroke="#fff" stroke-width="4"/>' +
        '<text x="' + (bx + 85) + '" y="' + (by + 21) + '" font-size="12" font-weight="700" fill="#c0392b" text-anchor="middle">"المدير التنفيذي" - عاجل!</text>' +
        '<text x="' + (bx + 85) + '" y="' + (by + 40) + '" font-size="10.5" fill="#1e2d3d" text-anchor="middle">حوّلوا 12,000 دولار للمورّد</text>' +
        '<text x="' + (bx + 85) + '" y="' + (by + 57) + '" font-size="10.5" fill="#1e2d3d" text-anchor="middle">في الخارج اليوم، ولا تخبروا أحدًا</text>' +
        '<circle cx="' + (bx + 170) + '" cy="' + by + '" r="8" fill="#ef4352">' + blink + '</circle>' +
        '</g>';
    })();

    // منطقة الانتظار: أريكة وطاولة صغيرة
    s += I.box(0, 300, 0, 26, 150, 92, '#e08a2a');
    s += I.box(10, 290, 0, 80, 18, 60, '#e8963a');
    s += I.box(26, 308, 0, 64, 134, 34, '#f29c3e');
    s += I.box(26, 310, 34, 60, 130, 10, '#f6ad55');
    s += I.box(10, 442, 0, 80, 18, 60, '#e8963a');
    s += I.box(118, 350, 0, 6, 6, 40, '#8b97a5');
    s += I.box(166, 350, 0, 6, 6, 40, '#8b97a5');
    s += I.box(118, 404, 0, 6, 6, 40, '#8b97a5');
    s += I.box(166, 404, 0, 6, 6, 40, '#8b97a5');
    s += I.box(112, 344, 40, 66, 70, 5, '#f1f3f6', { left: '#d9dee5', right: '#c9d0d9' });
    s += '<g transform="' + I.onPlaneZ(124, 356, 45.3) + '"><g transform="rotate(12 18 14)"><rect width="36" height="28" fill="#3fa2e0"/><rect x="4" y="4" width="28" height="10" fill="#fff" opacity=".8"/></g></g>';
    s += '<g transform="' + I.onPlaneZ(140, 384, 45.4) + '"><g transform="rotate(-8 16 12)"><rect width="32" height="24" fill="#e8679f"/><rect x="4" y="4" width="24" height="8" fill="#fff" opacity=".8"/></g></g>';

    // نبتة أمامية
    (function () {
      const [cx, cy] = P(490, 260, 0);
      s += '<g>' +
        '<g fill="#1f6f5c"><ellipse cx="' + (cx - 16) + '" cy="' + (cy - 70) + '" rx="9" ry="26" transform="rotate(-30 ' + (cx - 16) + ' ' + (cy - 70) + ')"/>' +
        '<ellipse cx="' + (cx + 17) + '" cy="' + (cy - 72) + '" rx="9" ry="27" transform="rotate(28 ' + (cx + 17) + ' ' + (cy - 72) + ')"/></g>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 82) + '" rx="9" ry="30" fill="#2a8a70"/>' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 40) + 'h40l-6 40h-28Z" fill="#f1f3f6"/>' +
        '<path d="M' + cx + ' ' + (cy - 40) + 'h20l-6 40h-14Z" fill="#d9dee5"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 40) + '" rx="20" ry="6" fill="#5b4636"/>' +
        '</g>';
    })();

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* رسم شاشة البداية: الزائر غير المتوقع                                */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="s4-ihall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b3440"/><stop offset="1" stop-color="#45505e"/></linearGradient></defs>' +
      '<rect width="800" height="900" fill="#e2e9f0"/>' +
      '<path d="M0 700h800v200H0Z" fill="#cfd5dc"/>' +
      // الباب الآمن
      '<rect x="430" y="150" width="260" height="560" fill="#9aa5b1"/>' +
      '<rect x="450" y="170" width="220" height="540" fill="url(#s4-ihall)"/>' +
      '<path d="M450 170 610 230V760L450 710Z" fill="#a9d4f0" opacity=".85"/>' +
      '<path d="M450 170 610 230V760L450 710Z" fill="none" stroke="#7fb4d8" stroke-width="6"/>' +
      '<rect x="580" y="450" width="10" height="70" rx="4" fill="#5a6675"/>' +
      '<path d="M590 740 650 760 650 790 590 770Z" fill="#f6c23e"/>' +
      '<rect x="710" y="400" width="44" height="74" rx="8" fill="#2b3440"/>' +
      '<circle cx="732" cy="424" r="8" fill="#ef4352"/>' +
      '<rect x="470" y="96" width="180" height="40" rx="8" fill="#ef4352"/>' +
      '<text x="560" y="124" font-size="22" font-weight="700" fill="#fff" text-anchor="middle">للموظفين فقط</text>' +
      // الزائر
      '<path d="M120 900V640q0-70 70-80h80q70 10 70 80V900Z" fill="#1f3b60"/>' +
      '<path d="M210 560h40l-20 60Z" fill="#fff"/>' +
      '<rect x="206" y="500" width="48" height="64" fill="#e9c6a3"/>' +
      '<ellipse cx="230" cy="440" rx="70" ry="80" fill="#f2d3b1"/>' +
      '<path d="M156 420q0-90 74-90t74 90Z" fill="#3c8fdc"/>' +
      '<path d="M300 410h70q10 0 6 10l-6 10h-70Z" fill="#2f7bc2"/>' +
      '<rect x="160" y="400" width="140" height="14" fill="#2f7bc2"/>' +
      '<text x="230" y="385" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">فني</text>' +
      '<circle cx="205" cy="450" r="7" fill="#1e2d3d"/><circle cx="255" cy="450" r="7" fill="#1e2d3d"/>' +
      '<path d="M206 488q24 18 48 0" stroke="#b9876a" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      // صندوق يحمله
      '<rect x="230" y="660" width="170" height="130" rx="6" fill="#c58b5a"/>' +
      '<path d="M230 700h170M315 660v40" stroke="#a37249" stroke-width="6"/>' +
      '<rect x="250" y="725" width="70" height="40" fill="#fff"/><path d="M258 737h54M258 750h40" stroke="#c4cbd4" stroke-width="4"/>' +
      // بطاقة زائر مزيفة
      '<path d="M200 560l-30 130" stroke="#ef4352" stroke-width="5"/>' +
      '<rect x="120" y="680" width="90" height="120" rx="8" fill="#fff" stroke="#c4cbd4" stroke-width="3" transform="rotate(8 165 740)"/>' +
      '<rect x="120" y="680" width="90" height="26" rx="6" fill="#ef4352" transform="rotate(8 165 740)"/>' +
      '<text x="168" y="700" font-size="16" font-weight="700" fill="#fff" text-anchor="middle" transform="rotate(8 165 740)">زائر</text>' +
      '<text x="168" y="770" font-size="40" font-weight="800" fill="#c4cbd4" text-anchor="middle" transform="rotate(8 165 740)">؟</text>' +
      // فقاعة الكلام
      '<rect x="40" y="180" width="300" height="100" rx="24" fill="#fff" stroke="#3c8fdc" stroke-width="5"/>' +
      '<path d="M200 278 222 330 240 278Z" fill="#fff" stroke="#3c8fdc" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M204 276h32" stroke="#fff" stroke-width="8"/>' +
      '<text x="190" y="224" font-size="22" font-weight="700" fill="#1e2d3d" text-anchor="middle">مرحبًا! أنا من الصيانة</text>' +
      '<text x="190" y="258" font-size="20" fill="#5a6675" text-anchor="middle">هل تفتح لي الباب؟</text>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'social-engineering',
    number: 4,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'الزائر غير المتوقع',
    title: 'الهندسة الاجتماعية',
    description: 'المهاجم لا يحتاج دائمًا إلى اختراق الأنظمة؛ أحيانًا يكفيه أن يقنعك. افحص منطقة الاستقبال واكتشف ثغرات الهندسة الاجتماعية قبل نفاد الوقت.',
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
