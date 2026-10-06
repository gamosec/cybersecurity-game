/*
 * السيناريو 3: كلمات المرور والمصادقة — خزنة الحسابات (مساحة عمل مشتركة)
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
      id: 'public-pc',
      title: 'حفظ كلمة المرور على كمبيوتر عام',
      options: [
        { text: 'دخول المستخدم التالي إلى حسابك', correct: true },
        { text: 'سرقة بيانات الدخول المحفوظة في المتصفح', correct: true },
        { text: 'برامج تسجيل لوحة المفاتيح (Keylogger)', correct: true },
        { text: 'التصيّد عبر رموز QR', correct: false }
      ],
      feedback: {
        summary: 'الكمبيوتر العام يستخدمه الجميع: كلمة المرور المحفوظة أو خيار "تذكرني" يفتح حسابك لمن يأتي بعدك، وقد يحتوي الجهاز على برامج تسجّل كل ما تكتبه.',
        tips: [
          'لا تحفظ كلمات المرور ولا تفعّل "تذكرني" على أي جهاز مشترك أو عام.',
          'استخدم نافذة التصفح الخاص، وسجّل الخروج من جميع الحسابات قبل المغادرة.',
          'تجنّب الدخول إلى حساباتك المصرفية أو حساب العمل من الأجهزة العامة.'
        ]
      }
    },
    {
      id: 'mfa',
      title: 'طلبات موافقة متكررة على تسجيل الدخول',
      options: [
        { text: 'المهاجم يعرف كلمة مرورك بالفعل', correct: true },
        { text: 'اختراق الحساب إذا ضغطت "موافقة"', correct: true },
        { text: 'عطل مؤقت في تطبيق المصادقة', correct: false },
        { text: 'هجوم حجب الخدمة (DDoS) على هاتفك', correct: false }
      ],
      feedback: {
        summary: 'هذا هجوم "إرهاق المصادقة" (MFA Fatigue): المهاجم سرق كلمة مرورك ويرسل طلبات متتالية على أمل أن توافق بالخطأ أو لتتخلص من الإزعاج. الطلبات ليست عطلًا تقنيًا.',
        tips: [
          'لا توافق أبدًا على طلب تسجيل دخول لم تبدأه أنت.',
          'غيّر كلمة المرور فورًا وأبلغ فريق أمن المعلومات.',
          'استخدم المصادقة بمطابقة الرقم أو مفتاح الأمان بدل زر الموافقة البسيط.'
        ]
      }
    },
    {
      id: 'reuse',
      title: 'كلمة مرور واحدة لكل الحسابات',
      options: [
        { text: 'حشو بيانات الاعتماد (Credential Stuffing)', correct: true },
        { text: 'اختراق جميع الحسابات بتسريب واحد', correct: true },
        { text: 'كشف كلمات المرور إذا سُرق الدفتر', correct: true },
        { text: 'الاحتيال المالي عبر الحساب المصرفي', correct: true }
      ],
      feedback: {
        summary: 'جميع الخيارات صحيحة: عندما يتسرّب موقع واحد، يجرّب المهاجمون كلمة المرور نفسها تلقائيًا على البريد والبنك والمتاجر. قد يُسحب من حسابك المصرفي مئات الدنانير، أو تُستخدم بطاقتك للشراء بمئات الدولارات من متجر عالمي.',
        tips: [
          'استخدم كلمة مرور مختلفة وفريدة لكل حساب.',
          'اعتمد مدير كلمات مرور موثوقًا بدل الدفتر الورقي.',
          'افحص ما إذا كان بريدك ضمن تسريبات معروفة، وغيّر كلمات المرور المتأثرة فورًا.'
        ]
      }
    },
    {
      id: 'weak',
      title: 'كلمة مرور جديدة: Ahmad1990',
      options: [
        { text: 'التخمين وهجمات القوة الغاشمة', correct: true },
        { text: 'التصيّد الصوتي (Vishing)', correct: false },
        { text: 'هجوم الوسيط (Man-in-the-Middle)', correct: false },
        { text: 'برامج الفدية', correct: false }
      ],
      feedback: {
        summary: 'كلمة مرور من الاسم وسنة الميلاد سهلة التخمين لأن هذه المعلومات منشورة غالبًا على وسائل التواصل، وتكسرها أدوات القوة الغاشمة والقواميس خلال ثوانٍ.',
        tips: [
          'استخدم عبارة مرور طويلة (12 حرفًا أو أكثر) مثل: قهوة-نافذة-مطر-٧٣!',
          'تجنّب الأسماء وتواريخ الميلاد وأرقام الهواتف والكلمات الشائعة.',
          'فعّل المصادقة متعددة العوامل لتحمي الحساب حتى لو خُمّنت كلمة المرور.'
        ]
      }
    },
    {
      id: 'shared',
      title: 'حساب الفريق المشترك على السبورة',
      options: [
        { text: 'كشف بيانات الدخول للزوار', correct: true },
        { text: 'صعوبة معرفة من استخدم الحساب', correct: true },
        { text: 'بقاء الوصول بعد مغادرة الموظفين', correct: true },
        { text: 'هجوم حجب الخدمة (DDoS)', correct: false }
      ],
      feedback: {
        summary: 'الحساب المشترك المكتوب على السبورة يراه كل زائر، ولا يمكن معرفة من استخدمه، ويظل الموظف السابق قادرًا على الدخول ما لم تُغيَّر كلمة المرور.',
        tips: [
          'امنح كل موظف حسابًا خاصًا به بدل الحسابات المشتركة.',
          'لا تكتب بيانات الدخول على السبورات أو الأوراق في الأماكن المشتركة.',
          'ألغِ صلاحيات الموظفين فور مغادرتهم، وغيّر أي كلمة مرور كانوا يعرفونها.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* رسم مساحة العمل المشتركة                                            */
  /* ------------------------------------------------------------------ */

  function renderScene(I) {
    const S = 520;
    const H = 270;
    const T = 18;
    const P = (x, y, z) => I.p(x, y, z);
    const blink = '<animate attributeName="opacity" values="1;.2;1" dur="1.1s" repeatCount="indefinite"/>';
    let s = '';

    function chair(x, y, color, backSide) {
      let c = I.box(x + 17, y + 19, 0, 8, 8, 40, '#2b333c');
      c += I.box(x + 2, y + 21, 0, 38, 4, 4, '#2b333c') + I.box(x + 19, y + 4, 0, 4, 38, 4, '#2b333c');
      if (backSide === 'far') c += I.box(x - 6, y, 51, 6, 46, 50, CE.shade(color, -0.1));
      c += I.box(x, y, 44, 42, 46, 7, color);
      if (backSide === 'near') c += I.box(x + 42, y, 51, 6, 46, 50, CE.shade(color, -0.1));
      return c;
    }

    s += '<defs>' +
      '<linearGradient id="s3-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7e3f8"/><stop offset="1" stop-color="#f1f8fe"/></linearGradient>' +
      '</defs>';

    // الأرضية الخشبية والجدران
    s += I.box(0, 0, -T, S, S, T, '#c9b597', { top: '#e8dcc6', left: '#cdb998', right: '#b9a483' });
    for (let k = 40; k < S; k += 40) {
      s += I.poly([[k, 0, 0.2], [k + 1.2, 0, 0.2], [k + 1.2, S, 0.2], [k, S, 0.2]], '#ddcfb5');
    }
    s += I.box(-T, -T, 0, T, S + T, H, '#e7dccb', { left: '#d8ccb8', right: '#efe6d8', top: '#faf7f2' });
    s += I.box(0, -T, 0, S, T, H, '#e7dccb', { left: '#f4ede2', right: '#d4c7b2', top: '#faf7f2' });
    s += I.poly([[0.5, 0, 0], [0.5, S, 0], [0.5, S, 10], [0.5, 0, 10]], '#d9ccb6');
    s += I.poly([[0, 0.5, 0], [S, 0.5, 0], [S, 0.5, 10], [0, 0.5, 10]], '#e2d6c2');

    // السجادة
    s += I.poly([[130, 170, 0.4], [370, 170, 0.4], [370, 360, 0.4], [130, 360, 0.4]], '#7fb59a');
    s += I.poly([[142, 182, 0.5], [358, 182, 0.5], [358, 348, 0.5], [142, 348, 0.5]], '#7fb59a', 'stroke="#a5ceb9" stroke-width="2" fill-opacity="0"');

    // الجدار الأيمن: مكتبة كتب، نافذة، لافتة الكمبيوتر العام
    s += I.box(30, 0, 0, 120, 34, 212, '#8a6a4f', { left: '#9b7a5c', right: '#7a5c43', top: '#a5866a' });
    (function () {
      const colors = ['#e84a4a', '#3c8fdc', '#f6c23e', '#2db46d', '#8e5bd6', '#f08a2a', '#e8679f', '#5bc0f8'];
      let books = '';
      [12, 62, 112, 162].forEach((sy, r) => {
        let x = 8;
        let n = r * 3;
        while (x < 108) {
          const w = 6 + ((n * 7) % 5);
          const h = 30 + ((n * 11) % 12);
          books += '<rect x="' + x + '" y="' + (sy + 42 - h) + '" width="' + w + '" height="' + h + '" fill="' + colors[n % colors.length] + '"/>';
          x += w + 1;
          n++;
        }
        books += '<rect x="4" y="' + (sy + 42) + '" width="112" height="5" fill="#6e523b"/>';
      });
      s += '<g transform="' + I.onPlaneY(30, 34.3, 212) + '"><rect width="120" height="212" fill="#5e4532"/>' + books + '</g>';
    })();
    s += '<g transform="' + I.onPlaneY(172, 0.6, 238) + '">' +
      '<rect width="96" height="125" fill="#faf7f2"/>' +
      '<rect x="8" y="8" width="80" height="109" fill="url(#s3-sky)"/>' +
      '<path d="M14 60 40 20M24 90 70 22" stroke="#fff" stroke-width="7" opacity=".55"/>' +
      '<path d="M48 8v109M8 62h80" stroke="#faf7f2" stroke-width="5"/>' +
      '</g>';
    s += I.box(168, 0, 107, 104, 10, 6, '#f4efe6');
    s += '<g transform="' + I.onPlaneY(318, 0.6, 262) + '">' +
      '<rect width="128" height="26" rx="4" fill="#3c8fdc"/>' +
      '<text x="64" y="17.5" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">كمبيوتر عام للزوار</text>' +
      '</g>';

    // الجدار الأيسر: السبورة (عنصر خطر)
    s += '<g data-hotspot="shared"><g transform="' + I.onPlaneX(0.6, 340, 236) + '">' +
      '<rect x="3" y="3" width="196" height="116" fill="#000" opacity=".1"/>' +
      '<rect width="196" height="116" rx="3" fill="#fff" stroke="#9aa5b1" stroke-width="5"/>' +
      '<text x="98" y="26" font-size="13" font-weight="700" fill="#2b579a" text-anchor="middle">حساب الفريق المشترك</text>' +
      '<path d="M40 32h116" stroke="#2b579a" stroke-width="2"/>' +
      '<text x="98" y="56" font-size="12" fill="#1e2d3d" text-anchor="middle" direction="ltr">user: team_admin</text>' +
      '<text x="98" y="80" font-size="13" font-weight="700" fill="#c0392b" text-anchor="middle" direction="ltr">pass: Team@2026</text>' +
      '<path d="M22 96q20-8 40 0t40 0" stroke="#2db46d" stroke-width="2.5" fill="none"/>' +
      '<circle cx="170" cy="96" r="9" fill="none" stroke="#e84a4a" stroke-width="2.5"/>' +
      '</g>' +
      I.box(0, 160, 118, 10, 160, 4, '#9aa5b1') +
      '</g>';

    // نبتة في الزاوية الخلفية
    (function () {
      const [cx, cy] = P(20, 60, 0);
      s += '<g>' +
        '<g fill="#1f6f5c"><ellipse cx="' + (cx - 14) + '" cy="' + (cy - 76) + '" rx="9" ry="28" transform="rotate(-26 ' + (cx - 14) + ' ' + (cy - 76) + ')"/>' +
        '<ellipse cx="' + (cx + 16) + '" cy="' + (cy - 78) + '" rx="9" ry="28" transform="rotate(26 ' + (cx + 16) + ' ' + (cy - 78) + ')"/></g>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 90) + '" rx="9" ry="32" fill="#2a8a70"/>' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 42) + 'h40l-6 42h-28Z" fill="#f3f0e8"/>' +
        '<path d="M' + cx + ' ' + (cy - 42) + 'h20l-6 42h-14Z" fill="#dfe3e8"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 42) + '" rx="20" ry="6" fill="#5b4636"/>' +
        '</g>';
    })();

    // مكتب الكمبيوتر العام
    const deskLeg = '#3a434e';
    s += I.box(290, 2, 0, 6, 6, 86, deskLeg);
    s += I.box(476, 2, 0, 6, 6, 86, deskLeg);
    s += I.box(290, 100, 0, 6, 6, 86, deskLeg);
    s += I.box(476, 100, 0, 6, 6, 86, deskLeg);
    s += I.box(286, 0, 86, 200, 108, 6, '#f1f3f6', { left: '#d9dee5', right: '#c9d0d9', top: '#f7f8fa' });

    // الكمبيوتر العام ونافذة حفظ كلمة المرور (عنصر خطر)
    s += '<g data-hotspot="public-pc">' +
      I.box(365, 26, 92, 34, 22, 3, '#2f3b48') +
      I.box(379, 31, 95, 6, 6, 22, '#2f3b48') +
      I.box(322, 36, 106, 122, 7, 74, '#2a3542') +
      '<g transform="' + I.onPlaneY(326, 43.3, 176) + '">' +
      '<rect width="114" height="66" fill="#f4f6f9"/>' +
      '<rect width="114" height="7" fill="#d9dee5"/>' +
      '<rect x="20" y="1.5" width="74" height="4" rx="2" fill="#fff"/>' +
      '<rect x="30" y="18" width="54" height="36" rx="3" fill="#fff" stroke="#d9dee5"/>' +
      '<rect x="36" y="25" width="42" height="6" rx="1" fill="#eef2f6"/>' +
      '<rect x="36" y="34" width="42" height="6" rx="1" fill="#eef2f6"/>' +
      '<text x="57" y="39" font-size="5" fill="#5a6675" text-anchor="middle">••••••••</text>' +
      '<rect x="36" y="44" width="42" height="6" rx="1" fill="#3c8fdc"/>' +
      '<rect x="62" y="9" width="50" height="24" rx="2" fill="#fff" stroke="#3c8fdc" stroke-width="1.4"/>' +
      '<text x="87" y="17" font-size="4.8" font-weight="700" fill="#1e2d3d" text-anchor="middle">حفظ كلمة المرور؟</text>' +
      '<rect x="66" y="22" width="20" height="7" rx="1.5" fill="#3c8fdc"/>' +
      '<text x="76" y="27.2" font-size="4.3" fill="#fff" text-anchor="middle">حفظ</text>' +
      '<rect x="89" y="22" width="20" height="7" rx="1.5" fill="#eef2f6"/>' +
      '<text x="99" y="27.2" font-size="4.3" fill="#5a6675" text-anchor="middle">لاحقًا</text>' +
      '</g>' +
      I.box(345, 62, 92, 72, 24, 2.4, '#d9dee5') +
      '<g transform="' + I.onPlaneZ(347, 64, 94.6) + '"><path d="M0 4h68M0 10h68M0 16h68M8 0v20M16 0v20M24 0v20M32 0v20M40 0v20M48 0v20M56 0v20" stroke="#b6bec8" stroke-width="1"/></g>' +
      I.box(424, 66, 92, 9, 13, 3, '#d9dee5') +
      '</g>';
    s += chair(368, 122, '#4b5563', 'near');

    // الكرسي البعيد حول طاولة العمل
    s += chair(100, 236, '#f08a2a', 'far');

    // طاولة العمل المشتركة
    s += I.box(156, 206, 0, 7, 7, 66, '#c3c9d1');
    s += I.box(326, 206, 0, 7, 7, 66, '#c3c9d1');
    s += I.box(156, 316, 0, 7, 7, 66, '#c3c9d1');
    s += I.box(326, 316, 0, 7, 7, 66, '#c3c9d1');
    s += I.box(150, 200, 66, 190, 126, 7, '#b98559', { top: '#d3a273', left: '#a87648', right: '#94673e' });

    // الحاسوب المحمول وكلمة المرور الضعيفة (عنصر خطر)
    s += '<g data-hotspot="weak">' +
      I.box(176, 220, 73, 62, 60, 4, '#a7b1bc') +
      '<g transform="' + I.onPlaneZ(176, 220, 77.2) + '">' +
      '<rect x="3" y="4" width="28" height="52" rx="2" fill="#3b4652"/>' +
      '<path d="M8 4v52M13 4v52M18 4v52M23 4v52M3 13h28M3 22h28M3 31h28M3 40h28M3 49h28" stroke="#56626f" stroke-width="1"/>' +
      '<rect x="38" y="19" width="16" height="22" rx="2" fill="#8e99a5"/>' +
      '</g>' +
      I.box(172, 220, 77, 4, 60, 46, '#2f3b48') +
      '<g transform="' + I.onPlaneX(176.4, 280, 121) + '">' +
      '<rect x="3" y="3" width="54" height="38" fill="#fff"/>' +
      '<text x="30" y="11" font-size="4.6" font-weight="700" fill="#1e2d3d" text-anchor="middle">كلمة مرور جديدة</text>' +
      '<rect x="8" y="14" width="44" height="9" rx="1.5" fill="#f4f6f9" stroke="#b9c7d4" stroke-width=".8"/>' +
      '<text x="30" y="20.8" font-size="5.6" font-weight="700" fill="#1e2d3d" text-anchor="middle" direction="ltr">Ahmad1990</text>' +
      '<rect x="8" y="27" width="44" height="3" rx="1.5" fill="#e3e8ee"/>' +
      '<rect x="37" y="27" width="15" height="3" rx="1.5" fill="#ef4352"/>' +
      '<text x="30" y="37" font-size="4.6" font-weight="700" fill="#c0392b" text-anchor="middle">ضعيفة جدًا</text>' +
      '</g>' +
      '</g>';

    // دفتر كلمات المرور المكررة (عنصر خطر)
    s += '<g data-hotspot="reuse">' +
      '<g transform="' + I.onPlaneZ(272, 236, 73.3) + '"><g transform="rotate(8 26 30)">' +
      '<rect x="1.5" y="1.5" width="52" height="62" rx="2" fill="#000" opacity=".12"/>' +
      '<rect width="52" height="62" rx="2" fill="#fff"/>' +
      '<rect width="6" height="62" fill="#e84a4a"/>' +
      '<text x="29" y="12" font-size="6" font-weight="700" fill="#1e2d3d" text-anchor="middle">كلمات المرور</text>' +
      '<text x="29" y="24" font-size="5" fill="#5a6675" text-anchor="middle">البريد: Ahmad1990</text>' +
      '<text x="29" y="35" font-size="5" fill="#5a6675" text-anchor="middle">البنك: Ahmad1990</text>' +
      '<text x="29" y="46" font-size="5" fill="#5a6675" text-anchor="middle">المتجر: Ahmad1990</text>' +
      '<path d="M12 52h34" stroke="#e84a4a" stroke-width="1.4"/>' +
      '</g></g>' +
      '</g>';

    // كوب على الطاولة
    (function () {
      const [cx, cy] = P(318, 300, 73);
      s += '<g><path d="M' + (cx - 9) + ' ' + cy + 'v-18h18v18a9 3 0 0 1-18 0Z" fill="#3c8fdc"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 18) + '" rx="9" ry="3" fill="#7a4b2a"/></g>';
    })();

    // الكرسي القريب حول طاولة العمل
    s += chair(345, 240, '#f08a2a', 'near');

    // الكرسي الوثير والطاولة الجانبية مع الهاتف (عنصر خطر)
    s += I.box(14, 372, 0, 86, 78, 34, '#3c8fdc');
    s += I.box(4, 372, 0, 18, 78, 92, '#2f7bc2');
    s += I.box(22, 366, 0, 78, 10, 60, '#3584cd');
    s += I.box(24, 380, 34, 72, 64, 10, '#5aa8ea');
    s += I.box(22, 446, 0, 78, 10, 60, '#3584cd');
    s += I.box(114, 398, 0, 6, 6, 48, '#3a434e');
    s += I.box(100, 384, 48, 34, 34, 4, '#f1f3f6', { left: '#d9dee5', right: '#c9d0d9' });
    (function () {
      const ph = P(117, 401, 52.5);
      const bx = ph[0] - 40, by = ph[1] - 138;
      let cards = '';
      [0, 1, 2].forEach((i) => {
        const y = by + i * 36;
        cards += '<rect x="' + (bx + i * 6) + '" y="' + y + '" width="150" height="32" rx="9" fill="#fff" stroke="#3c8fdc" stroke-width="2"/>' +
          '<text x="' + (bx + i * 6 + 75) + '" y="' + (y + 13) + '" font-size="10.5" font-weight="700" fill="#1e2d3d" text-anchor="middle">هل تحاول تسجيل الدخول؟</text>' +
          '<rect x="' + (bx + i * 6 + 30) + '" y="' + (y + 17) + '" width="40" height="11" rx="3" fill="#2db46d"/>' +
          '<text x="' + (bx + i * 6 + 50) + '" y="' + (y + 25.5) + '" font-size="8" fill="#fff" text-anchor="middle">موافقة</text>' +
          '<rect x="' + (bx + i * 6 + 80) + '" y="' + (y + 17) + '" width="40" height="11" rx="3" fill="#ef4352"/>' +
          '<text x="' + (bx + i * 6 + 100) + '" y="' + (y + 25.5) + '" font-size="8" fill="#fff" text-anchor="middle">رفض</text>';
      });
      s += '<g data-hotspot="mfa" data-hit="self">' +
        '<ellipse class="hit" cx="' + ph[0] + '" cy="' + ph[1] + '" rx="28" ry="18"/>' +
        I.box(108, 392, 52, 16, 28, 2.5, '#1f2933', { top: '#1f2933' }) +
        '<g transform="' + I.onPlaneZ(109.5, 393.5, 54.6) + '"><rect width="13" height="25" rx="1.5" fill="#5db2ee"/>' +
        '<rect x="2" y="3" width="9" height="4" rx="1" fill="#fff"/><rect x="2" y="9" width="9" height="4" rx="1" fill="#fff"/><rect x="2" y="15" width="9" height="4" rx="1" fill="#fff"/></g>' +
        '<path d="M' + (bx + 60) + ' ' + (by + 104) + 'L' + ph[0] + ' ' + (ph[1] - 6) + 'L' + (bx + 84) + ' ' + (by + 104) + 'Z" fill="#fff" stroke="#3c8fdc" stroke-width="2" stroke-linejoin="round"/>' +
        cards +
        '<circle cx="' + (bx + 162) + '" cy="' + (by + 2) + '" r="11" fill="#ef4352">' + blink + '</circle>' +
        '<text x="' + (bx + 162) + '" y="' + (by + 6) + '" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">5</text>' +
        '</g>';
    })();

    // نبتة أمامية
    (function () {
      const [cx, cy] = P(488, 250, 0);
      s += '<g>' +
        '<g fill="#1f6f5c"><ellipse cx="' + (cx - 16) + '" cy="' + (cy - 70) + '" rx="9" ry="26" transform="rotate(-30 ' + (cx - 16) + ' ' + (cy - 70) + ')"/>' +
        '<ellipse cx="' + (cx + 17) + '" cy="' + (cy - 72) + '" rx="9" ry="27" transform="rotate(28 ' + (cx + 17) + ' ' + (cy - 72) + ')"/></g>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 82) + '" rx="9" ry="30" fill="#2a8a70"/>' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 40) + 'h40l-6 40h-28Z" fill="#b98559"/>' +
        '<path d="M' + cx + ' ' + (cy - 40) + 'h20l-6 40h-14Z" fill="#a87648"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 40) + '" rx="20" ry="6" fill="#5b4636"/>' +
        '</g>';
    })();

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* رسم شاشة البداية: خزنة الحسابات                                     */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="800" height="900" fill="#efe6d8"/>' +
      '<path d="M520 0h280v560L520 400Z" fill="#e2d6c2"/>' +
      '<path d="M0 640 480 410 800 560V900H0Z" fill="#d3a273"/>' +
      '<path d="M0 640 480 410 800 560" fill="none" stroke="#e3b88b" stroke-width="5"/>' +
      // الخزنة
      '<rect x="190" y="190" width="420" height="440" rx="34" fill="#4b5563"/>' +
      '<rect x="190" y="190" width="420" height="440" rx="34" fill="none" stroke="#3a4552" stroke-width="10"/>' +
      '<rect x="230" y="230" width="340" height="360" rx="22" fill="#5f6b7a"/>' +
      '<circle cx="400" cy="380" r="92" fill="#3a4552"/>' +
      '<circle cx="400" cy="380" r="72" fill="#8995a3"/>' +
      '<g stroke="#3a4552" stroke-width="6" stroke-linecap="round">' +
      '<path d="M400 316v16M400 428v16M336 380h16M448 380h16M355 335l11 11M434 414l11 11M445 335l-11 11M366 414l-11 11"/></g>' +
      '<circle cx="400" cy="380" r="26" fill="#c9d0d9"/>' +
      '<rect x="560" y="330" width="26" height="100" rx="10" fill="#c9d0d9"/>' +
      '<rect x="230" y="630" width="60" height="26" rx="6" fill="#3a4552"/><rect x="510" y="630" width="60" height="26" rx="6" fill="#3a4552"/>' +
      // حقل كلمة المرور
      '<rect x="120" y="70" width="560" height="84" rx="42" fill="#fff" stroke="#3c8fdc" stroke-width="6"/>' +
      '<g fill="#1e2d3d"><circle cx="230" cy="112" r="11"/><circle cx="270" cy="112" r="11"/><circle cx="310" cy="112" r="11"/><circle cx="350" cy="112" r="11"/><circle cx="390" cy="112" r="11"/><circle cx="430" cy="112" r="11"/><circle cx="470" cy="112" r="11"/></g>' +
      '<rect x="510" y="94" width="5" height="36" fill="#3c8fdc"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>' +
      '<path d="M160 112q22-24 44 0q-22 24-44 0Z" fill="none" stroke="#5a6675" stroke-width="5"/><circle cx="182" cy="112" r="7" fill="#5a6675"/>' +
      '<rect x="580" y="96" width="70" height="32" rx="16" fill="#2db46d"/>' +
      '<path d="M598 112l8 8 16-16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      // المفتاح
      '<g transform="rotate(-28 640 700)">' +
      '<circle cx="580" cy="700" r="46" fill="none" stroke="#f6c23e" stroke-width="22"/>' +
      '<path d="M626 700h150M730 700v40M766 700v30" stroke="#f6c23e" stroke-width="22" stroke-linecap="round"/>' +
      '</g>' +
      // الهاتف وطلب المصادقة
      '<g transform="rotate(-12 140 770)">' +
      '<rect x="60" y="640" width="140" height="250" rx="22" fill="#1f2933"/>' +
      '<rect x="72" y="662" width="116" height="206" rx="10" fill="#5db2ee"/>' +
      '<rect x="82" y="700" width="96" height="76" rx="12" fill="#fff"/>' +
      '<circle cx="130" cy="726" r="14" fill="#3c8fdc"/>' +
      '<rect x="88" y="750" width="40" height="18" rx="5" fill="#2db46d"/><rect x="132" y="750" width="40" height="18" rx="5" fill="#ef4352"/>' +
      '</g>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'passwords',
    number: 3,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'خزنة الحسابات',
    title: 'كلمات المرور والمصادقة',
    description: 'في مساحة العمل المشتركة أخطاء كثيرة في التعامل مع كلمات المرور والمصادقة. اكتشف كل خطأ وحدّد مخاطره قبل أن يفتح أحدهم خزنة حساباتك.',
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
