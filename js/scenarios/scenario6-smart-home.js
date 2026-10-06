/*
 * السيناريو 6: أمن الأجهزة الذكية — منزل ذكي في منتصف الليل (إنترنت الأشياء)
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
      id: 'camera',
      title: 'كاميرا مراقبة بكلمة المرور الافتراضية',
      options: [
        { text: 'التجسس عبر البث المباشر', correct: true },
        { text: 'ضمّ الكاميرا إلى شبكة بوت نت (Botnet)', correct: true },
        { text: 'التصيّد عبر رموز QR', correct: false },
        { text: 'التلصّص على الشاشة (Shoulder Surfing)', correct: false }
      ],
      feedback: {
        summary: 'كلمات المرور الافتراضية مثل admin/admin منشورة على الإنترنت، وتبحث عنها برامج آلية لتشاهد البث المباشر من داخل منزلك أو تستخدم الكاميرا في هجمات واسعة ضمن شبكات البوت نت.',
        tips: [
          'غيّر اسم المستخدم وكلمة المرور الافتراضيين فور تركيب أي جهاز ذكي.',
          'فعّل المصادقة الثنائية في تطبيق الكاميرا، وحدّث برنامجها الثابت باستمرار.',
          'لا توجّه الكاميرات الداخلية إلى غرف النوم أو الأماكن الخاصة.'
        ]
      }
    },
    {
      id: 'speaker',
      title: 'المساعد الصوتي ينفّذ عملية شراء',
      options: [
        { text: 'عمليات شراء غير مقصودة', correct: true },
        { text: 'تسجيل المحادثات الخاصة', correct: true },
        { text: 'تنفيذ أوامر صوتية من غرباء أو من التلفاز', correct: true },
        { text: 'هجوم القوة الغاشمة (Brute Force)', correct: false }
      ],
      feedback: {
        summary: 'المساعد الصوتي يستمع دائمًا لكلمة التنبيه، وقد يسجّل محادثاتك، وينفّذ أوامر من إعلان في التلفاز أو من طفل، فيشتري ألعابًا بقيمة 40 دولارًا من متجر عالمي دون أن تقصد.',
        tips: [
          'اطلب رمزًا سريًا (PIN) لتأكيد أي عملية شراء صوتية، أو عطّلها تمامًا.',
          'راجع سجل التسجيلات الصوتية واحذفه دوريًا.',
          'أوقف الميكروفون عند الحديث في أمور خاصة، ولا تربط الأقفال بأوامر صوتية دون تحقق.'
        ]
      }
    },
    {
      id: 'router',
      title: 'راوتر لم يُحدَّث منذ 2023',
      options: [
        { text: 'استغلال ثغرات معروفة غير مُرقّعة', correct: true },
        { text: 'التصيّد الصوتي (Vishing)', correct: false },
        { text: 'سرقة الهوية من المستندات الورقية', correct: false },
        { text: 'التتبّع خلف الموظفين (Tailgating)', correct: false }
      ],
      feedback: {
        summary: 'البرنامج الثابت القديم يحتوي على ثغرات معروفة ومنشورة، يستغلها المهاجمون للسيطرة على الراوتر، ومن خلاله على كل الأجهزة الذكية في المنزل.',
        tips: [
          'فعّل التحديث التلقائي للبرنامج الثابت للراوتر، أو حدّثه يدويًا كل شهر.',
          'استبدل الأجهزة التي توقّف الصانع عن دعمها بتحديثات أمنية.',
          'افصل الأجهزة الذكية على شبكة ضيوف منفصلة عن أجهزتك الشخصية.'
        ]
      }
    },
    {
      id: 'lock',
      title: 'قفل الباب الذكي برمز 1234 للجميع',
      options: [
        { text: 'دخول غير مصرّح به إلى المنزل', correct: true },
        { text: 'تخمين الرمز بسهولة', correct: true },
        { text: 'عدم معرفة من دخل ومتى', correct: true },
        { text: 'استمرار دخول عمّال أو ضيوف سابقين', correct: true }
      ],
      feedback: {
        summary: 'جميع الخيارات صحيحة: الرمز 1234 من أول ما يجرّبه أي شخص، ومشاركته مع الجميع تعني أنك لا تعرف من دخل، ولا يمكنك منع من انتهى عمله من العودة.',
        tips: [
          'استخدم رمزًا طويلًا وغير متوقع، وأخفِ الرمز عن الأعين.',
          'أنشئ رمزًا مؤقتًا ومستقلًا لكل ضيف أو عامل، واحذفه بعد انتهاء الحاجة.',
          'راجع سجل الدخول في تطبيق القفل، وفعّل التنبيهات عند فتح الباب.'
        ]
      }
    },
    {
      id: 'tv',
      title: 'التلفاز الذكي يثبّت تطبيقًا من مصدر غير معروف',
      options: [
        { text: 'تثبيت برامج ضارة', correct: true },
        { text: 'التجسس عبر كاميرا التلفاز وميكروفونه', correct: true },
        { text: 'التتبّع خلف الموظفين (Tailgating)', correct: false },
        { text: 'هجوم القوة الغاشمة (Brute Force)', correct: false }
      ],
      feedback: {
        summary: 'تطبيقات "الأفلام المجانية" من خارج المتجر الرسمي غالبًا ما تحمل برامج ضارة، والتلفاز الذكي المزوّد بكاميرا وميكروفون يصبح جهاز تجسس داخل غرفة المعيشة.',
        tips: [
          'ثبّت التطبيقات من المتجر الرسمي فقط، وعطّل خيار "مصادر غير معروفة".',
          'غطِّ كاميرا التلفاز أو افصلها، وعطّل الميكروفون إذا لم تكن تستخدمه.',
          'حدّث نظام التلفاز باستمرار واحذف التطبيقات التي لا تستخدمها.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* رسم المنزل الذكي ليلًا                                              */
  /* ------------------------------------------------------------------ */

  function renderScene(I) {
    const S = 520;
    const H = 270;
    const T = 18;
    const P = (x, y, z) => I.p(x, y, z);
    const blink = (d, lo) => '<animate attributeName="opacity" values="1;' + (lo || 0.2) + ';1" dur="' + (d || 1) + 's" repeatCount="indefinite"/>';
    let s = '';

    s += '<defs>' +
      '<linearGradient id="s6-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1030"/><stop offset=".7" stop-color="#1f2a6b"/><stop offset="1" stop-color="#3a3f8f"/></linearGradient>' +
      '<radialGradient id="s6-warm"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="s6-cyan"><stop offset="0" stop-color="#5ef2ff" stop-opacity=".5"/><stop offset="1" stop-color="#5ef2ff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="s6-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5d6c" stop-opacity=".35"/><stop offset="1" stop-color="#ff5d6c" stop-opacity="0"/></linearGradient>' +
      '</defs>';

    // الأرضية والجدران بألوان ليلية
    s += I.box(0, 0, -T, S, S, T, '#1c2140', { top: '#2b3159', left: '#232849', right: '#1a1e3a' });
    s += I.box(-T, -T, 0, T, S + T, H, '#262c55', { left: '#20264a', right: '#2f3664', top: '#3a4275' });
    s += I.box(0, -T, 0, S, T, H, '#262c55', { left: '#343c6e', right: '#1f2547', top: '#3a4275' });
    s += I.poly([[0.5, 0, 0], [0.5, S, 0], [0.5, S, 8], [0.5, 0, 8]], '#20264a');
    s += I.poly([[0, 0.5, 0], [S, 0.5, 0], [S, 0.5, 8], [0, 0.5, 8]], '#2a3060');

    // النافذة: سماء ليلية، قمر، نجوم تتلألأ، مدينة مضيئة
    (function () {
      const stars = [[14, 18], [40, 30], [70, 12], [96, 40], [122, 20], [30, 56], [110, 66], [140, 46]];
      let st = '';
      stars.forEach(([x, y], i) => {
        st += '<circle cx="' + x + '" cy="' + y + '" r="' + (i % 3 ? 1.2 : 1.8) + '" fill="#fff">' + blink(1.5 + (i % 4) * 0.6, 0.15) + '</circle>';
      });
      let city = '';
      const bld = [[0, 92, 20], [22, 80, 16], [40, 98, 22], [64, 72, 18], [84, 88, 24], [110, 78, 16], [128, 94, 22]];
      bld.forEach(([x, y, w], i) => {
        city += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (130 - y) + '" fill="#141a3f"/>';
        for (let wy = y + 6; wy < 124; wy += 9) {
          for (let wx = x + 4; wx < x + w - 3; wx += 6) {
            if ((wx * 7 + wy * 3 + i) % 5 < 2) city += '<rect x="' + wx + '" y="' + wy + '" width="2.6" height="3.4" fill="#ffd27a" opacity=".85"/>';
          }
        }
      });
      s += '<g transform="' + I.onPlaneY(40, 0.6, 236) + '">' +
        '<rect width="160" height="138" fill="#3a4275"/>' +
        '<svg x="8" y="8" width="144" height="122" viewBox="0 0 150 130" preserveAspectRatio="none">' +
        '<rect width="150" height="130" fill="url(#s6-night)"/>' + st +
        '<circle cx="118" cy="30" r="14" fill="#fff4c9"/><circle cx="124" cy="25" r="12" fill="#14194a"/>' +
        city + '</svg>' +
        '<path d="M80 8v122M8 70h144" stroke="#3a4275" stroke-width="5"/>' +
        '</g>';
      s += I.box(36, 0, 96, 168, 10, 6, '#3a4275');
      // ضوء القمر على الأرض
      s += I.poly([[60, 0, 0.5], [200, 0, 0.5], [260, 120, 0.5], [120, 120, 0.5]], '#7b86d6', 'opacity=".12"');
    })();

    // سجادة
    s += I.poly([[228, 90, 0.4], [446, 90, 0.4], [446, 252, 0.4], [228, 252, 0.4]], '#4b3f7a');
    s += I.poly([[240, 102, 0.5], [434, 102, 0.5], [434, 240, 0.5], [240, 240, 0.5]], '#4b3f7a', 'stroke="#6f5fb0" stroke-width="2" fill-opacity="0"');


    // التلفاز الذكي (عنصر خطر)
    s += '<g data-hotspot="tv">' +
      I.box(250, 0.6, 92, 172, 6, 96, '#11142a', { left: '#151935' }) +
      '<g transform="' + I.onPlaneY(254, 6.8, 184) + '">' +
      '<rect width="164" height="88" fill="#1b3d7a"/>' +
      '<rect x="6" y="8" width="40" height="24" rx="3" fill="#e84a4a"/><rect x="50" y="8" width="40" height="24" rx="3" fill="#2db46d"/><rect x="94" y="8" width="40" height="24" rx="3" fill="#f6c23e"/>' +
      '<rect x="30" y="34" width="104" height="48" rx="6" fill="#fff"/>' +
      '<text x="82" y="47" font-size="8" font-weight="700" fill="#c0392b" text-anchor="middle">تثبيت من مصدر غير معروف؟</text>' +
      '<text x="82" y="60" font-size="8" fill="#1e2d3d" text-anchor="middle" direction="ltr" font-family="Arial, sans-serif">FreeMovies_HD.apk</text>' +
      '<rect x="56" y="65" width="52" height="12" rx="3" fill="#3c8fdc"/>' +
      '<text x="82" y="74" font-size="7.6" font-weight="700" fill="#fff" text-anchor="middle">تثبيت</text>' +
      '</g>' +
      I.box(328, 0.6, 188, 16, 7, 6, '#11142a') +
      '<circle cx="' + P(336, 7.8, 191)[0] + '" cy="' + P(336, 7.8, 191)[1] + '" r="1.8" fill="#ff5d6c">' + blink(1.2) + '</circle>' +
      '</g>';

    // طاولة التلفاز
    s += I.box(240, 8, 0, 200, 40, 34, '#3a3f63', { top: '#4b5180', left: '#33385a', right: '#2b2f4e' });
    s += I.poly([[240, 48.4, 16], [440, 48.4, 16], [440, 48.4, 17.5], [240, 48.4, 17.5]], '#2b2f4e');

    // الراوتر القديم (عنصر خطر)
    (function () {
      const r = P(410, 26, 44);
      const cx = r[0] + 10, cy = r[1] - 96;
      let leds = '';
      ['#2ee07a', '#2ee07a', '#f6c23e', '#2ee07a'].forEach((c, i) => {
        const q = P(398 + i * 8, 40.5, 39);
        leds += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="1.8" fill="' + c + '">' + (i === 2 ? blink(0.7) : '') + '</circle>';
      });
      s += '<g data-hotspot="router" data-hit="self">' +
        '<ellipse class="hit" cx="' + r[0] + '" cy="' + (r[1] - 6) + '" rx="40" ry="26"/>' +
        '<path d="M' + P(398, 18, 44)[0] + ' ' + P(398, 18, 44)[1] + 'v-34M' + P(426, 18, 44)[0] + ' ' + P(426, 18, 44)[1] + 'v-34" stroke="#0e1124" stroke-width="4" stroke-linecap="round"/>' +
        I.box(392, 16, 34, 40, 24, 9, '#151935', { top: '#22274a' }) + leds +
        '<path d="M' + (cx - 6) + ' ' + (cy + 30) + 'L' + r[0] + ' ' + (r[1] - 14) + 'L' + (cx + 10) + ' ' + (cy + 30) + 'Z" fill="#fff4c9"/>' +
        '<rect x="' + (cx - 66) + '" y="' + (cy - 4) + '" width="132" height="36" rx="10" fill="#fff4c9" stroke="#f6c23e" stroke-width="2.5"/>' +
        '<path d="M' + (cx + 46) + ' ' + (cy + 4) + 'l9 16h-18Z" fill="#f6c23e"/><path d="M' + (cx + 46) + ' ' + (cy + 10) + 'v5" stroke="#1e2d3d" stroke-width="2"/>' +
        '<text x="' + (cx - 8) + '" y="' + (cy + 11) + '" font-size="9.5" font-weight="700" fill="#1e2d3d" text-anchor="middle">تحديث متاح</text>' +
        '<text x="' + (cx - 8) + '" y="' + (cy + 25) + '" font-size="9" fill="#5a6675" text-anchor="middle">منذ 2023 · تجاهل</text>' +
        '</g>';
    })();

    // الجدار الأيسر: الباب والقفل الذكي (عنصر خطر)
    s += '<g data-hotspot="lock"><g transform="' + I.onPlaneX(0.6, 470, 208) + '">' +
      '<rect width="96" height="208" fill="#3a2f2a"/>' +
      '<rect x="7" y="7" width="82" height="201" fill="#6b4a33"/>' +
      '<rect x="17" y="20" width="62" height="70" rx="3" fill="none" stroke="#7d5a40" stroke-width="3"/>' +
      '<rect x="17" y="104" width="62" height="88" rx="3" fill="none" stroke="#7d5a40" stroke-width="3"/>' +
      '<rect x="64" y="86" width="22" height="34" rx="4" fill="#11142a"/>' +
      '<rect x="67" y="89" width="16" height="7" rx="1.5" fill="#5ef2ff">' + blink(2, 0.5) + '</rect>' +
      '<g fill="#5ef2ff" opacity=".8"><circle cx="70" cy="101" r="1.4"/><circle cx="75" cy="101" r="1.4"/><circle cx="80" cy="101" r="1.4"/>' +
      '<circle cx="70" cy="106" r="1.4"/><circle cx="75" cy="106" r="1.4"/><circle cx="80" cy="106" r="1.4"/>' +
      '<circle cx="70" cy="111" r="1.4"/><circle cx="75" cy="111" r="1.4"/><circle cx="80" cy="111" r="1.4"/></g>' +
      '<g transform="rotate(-6 50 106)"><rect x="34" y="94" width="26" height="24" fill="#ffd84d"/>' +
      '<text x="47" y="104" font-size="6" fill="#1e2d3d" text-anchor="middle">رمز الباب</text>' +
      '<text x="47" y="114" font-size="9" font-weight="800" fill="#c0392b" text-anchor="middle" font-family="Arial, sans-serif">1234</text></g>' +
      '</g></g>';

    // كاميرا المراقبة في الزاوية (عنصر خطر)
    (function () {
      const lens = P(34.5, 192, 184);
      const chip = P(4, 214, 226);
      // شعاع الكاميرا خارج مجموعة العنصر حتى لا يكبّر منطقة النقر
      s += '<path d="M' + lens[0] + ' ' + lens[1] + 'L' + P(230, 300, 0)[0] + ' ' + P(230, 300, 0)[1] + 'L' + P(120, 420, 0)[0] + ' ' + P(120, 420, 0)[1] + 'Z" fill="url(#s6-cone)" pointer-events="none"/>';
      s += '<g data-hotspot="camera">' +
        I.box(0.6, 176, 192, 14, 30, 6, '#d9dee5') +
        I.box(6, 183, 176, 28, 18, 16, '#eef1f4', { left: '#d3d9e0', right: '#c4ccd5' }) +
        '<circle cx="' + lens[0] + '" cy="' + lens[1] + '" r="6" fill="#11142a"/><circle cx="' + lens[0] + '" cy="' + lens[1] + '" r="2.6" fill="#5ef2ff"/>' +
        '<circle cx="' + (lens[0] - 12) + '" cy="' + (lens[1] - 10) + '" r="2.4" fill="#ff5d6c">' + blink(0.8) + '</circle>' +
        '<g transform="translate(' + chip[0] + ' ' + chip[1] + ')">' +
        '<rect x="-52" y="-12" width="104" height="24" rx="12" fill="#11142a" stroke="#ff5d6c" stroke-width="2"/>' +
        '<circle cx="38" cy="0" r="4" fill="#ff5d6c">' + blink(0.8) + '</circle>' +
        '<text x="-6" y="4" font-size="9.5" font-weight="700" fill="#fff" text-anchor="middle" direction="ltr" font-family="Arial, sans-serif">admin / admin</text>' +
        '</g>' +
        '</g>';
    })();

    // مصباح أرضي بضوء دافئ
    (function () {
      const b = P(70, 300, 0);
      s += '<ellipse cx="' + b[0] + '" cy="' + (b[1] - 6) + '" rx="110" ry="50" fill="url(#s6-warm)"/>' +
        '<ellipse cx="' + b[0] + '" cy="' + b[1] + '" rx="14" ry="5" fill="#11142a"/>' +
        '<path d="M' + b[0] + ' ' + b[1] + 'v-150" stroke="#11142a" stroke-width="4"/>' +
        '<path d="M' + (b[0] - 22) + ' ' + (b[1] - 146) + 'h44l-10-30h-24Z" fill="#ffd27a"/>' +
        '<ellipse cx="' + b[0] + '" cy="' + (b[1] - 146) + '" rx="22" ry="5" fill="#fff0c4"/>' +
        '<circle cx="' + b[0] + '" cy="' + (b[1] - 150) + '" r="60" fill="url(#s6-warm)"/>';
    })();

    // طاولة القهوة
    s += I.box(276, 118, 0, 8, 8, 32, '#11142a');
    s += I.box(384, 118, 0, 8, 8, 32, '#11142a');
    s += I.box(276, 176, 0, 8, 8, 32, '#11142a');
    s += I.box(384, 176, 0, 8, 8, 32, '#11142a');
    s += I.box(270, 112, 32, 128, 78, 5, '#5a4a8f', { top: '#6f5fb0', left: '#4b3f7a', right: '#3f3468' });
    s += I.box(300, 140, 37, 26, 9, 3, '#11142a');
    (function () {
      const [cx, cy] = P(364, 150, 37);
      s += '<g><path d="M' + (cx - 8) + ' ' + cy + 'v-14h16v14a8 3 0 0 1-16 0Z" fill="#e8679f"/><ellipse cx="' + cx + '" cy="' + (cy - 14) + '" rx="8" ry="3" fill="#5b4636"/></g>';
    })();

    // الأريكة (ظهرها نحو المشاهد) وقطة نائمة
    s += I.box(206, 262, 0, 14, 72, 54, '#4a3f78');
    s += I.box(220, 262, 0, 210, 60, 34, '#5b4f92');
    s += I.box(222, 264, 34, 102, 56, 12, '#6a5ea8');
    s += I.box(326, 264, 34, 102, 56, 12, '#6a5ea8');
    s += I.box(220, 322, 0, 210, 14, 80, '#4f4486', { top: '#62579c' });
    s += I.box(430, 262, 0, 14, 72, 54, '#4a3f78');
    (function () {
      const [cx, cy] = P(300, 329, 80);
      s += '<g><ellipse cx="' + cx + '" cy="' + (cy - 8) + '" rx="26" ry="11" fill="#f08a2a"/>' +
        '<circle cx="' + (cx - 22) + '" cy="' + (cy - 14) + '" r="9" fill="#f08a2a"/>' +
        '<path d="M' + (cx - 29) + ' ' + (cy - 20) + 'l2-9 5 6ZM' + (cx - 19) + ' ' + (cy - 21) + 'l3-8 3 8Z" fill="#f08a2a"/>' +
        '<path d="M' + (cx - 26) + ' ' + (cy - 14) + 'q2 2 4 0M' + (cx - 20) + ' ' + (cy - 14) + 'q2 2 4 0" stroke="#5b3a1a" stroke-width="1.2" fill="none"/>' +
        '<path d="M' + (cx + 24) + ' ' + (cy - 6) + 'q16 4 10-10" stroke="#f08a2a" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<text x="' + (cx + 8) + '" y="' + (cy - 24) + '" font-size="9" fill="#cfd5ff" font-family="Arial">z<tspan dy="-5" font-size="7">z</tspan></text>' +
        '</g>';
    })();

    // الطاولة الجانبية والمساعد الصوتي (عنصر خطر)
    s += I.box(466, 282, 0, 6, 6, 44, '#11142a');
    s += I.box(452, 268, 44, 36, 36, 4, '#5a4a8f', { top: '#6f5fb0' });
    (function () {
      const [cx, cy] = P(470, 286, 48);
      const bx = cx - 196, by = cy - 116;
      s += '<g data-hotspot="speaker" data-hit="self">' +
        '<ellipse class="hit" cx="' + cx + '" cy="' + (cy - 18) + '" rx="26" ry="30"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 20) + '" rx="40" ry="40" fill="url(#s6-cyan)">' + blink(2, 0.4) + '</ellipse>' +
        '<path d="M' + (cx - 12) + ' ' + cy + 'v-30h24v30a12 4 0 0 1-24 0Z" fill="#2b3159"/>' +
        '<path d="M' + cx + ' ' + (cy + 4) + 'v-34h12v30a12 4 0 0 1-12 4Z" fill="#222849"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 30) + '" rx="12" ry="4" fill="#5ef2ff">' + blink(1.2, 0.35) + '</ellipse>' +
        '<g stroke="#5ef2ff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8">' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 30) + 'q-6-8 0-16"/><path d="M' + (cx - 28) + ' ' + (cy - 26) + 'q-10-12 0-26"/></g>' +
        '<path d="M' + (bx + 150) + ' ' + (by + 52) + 'L' + (cx - 14) + ' ' + (cy - 30) + 'L' + (bx + 172) + ' ' + (by + 52) + 'Z" fill="#fff" stroke="#5ef2ff" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<rect x="' + bx + '" y="' + by + '" width="182" height="54" rx="14" fill="#fff" stroke="#5ef2ff" stroke-width="2.5"/>' +
        '<path d="M' + (bx + 151) + ' ' + (by + 50) + 'h20" stroke="#fff" stroke-width="4"/>' +
        '<text x="' + (bx + 91) + '" y="' + (by + 22) + '" font-size="11" font-weight="700" fill="#1e2d3d" text-anchor="middle">"حسنًا، تم طلب ألعاب</text>' +
        '<text x="' + (bx + 91) + '" y="' + (by + 40) + '" font-size="11" font-weight="700" fill="#1e2d3d" text-anchor="middle">بقيمة 40 دولارًا"</text>' +
        '</g>';
    })();

    // نبتة أمامية
    (function () {
      const [cx, cy] = P(486, 430, 0);
      s += '<g>' +
        '<g fill="#1d5a4c"><ellipse cx="' + (cx - 16) + '" cy="' + (cy - 70) + '" rx="9" ry="26" transform="rotate(-30 ' + (cx - 16) + ' ' + (cy - 70) + ')"/>' +
        '<ellipse cx="' + (cx + 17) + '" cy="' + (cy - 72) + '" rx="9" ry="27" transform="rotate(28 ' + (cx + 17) + ' ' + (cy - 72) + ')"/></g>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 82) + '" rx="9" ry="30" fill="#236a59"/>' +
        '<path d="M' + (cx - 20) + ' ' + (cy - 40) + 'h40l-6 40h-28Z" fill="#3a4275"/>' +
        '<path d="M' + cx + ' ' + (cy - 40) + 'h20l-6 40h-14Z" fill="#2f3664"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy - 40) + '" rx="20" ry="6" fill="#2b1f18"/>' +
        '</g>';
    })();

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* رسم شاشة البداية: منزل متصل في الليل                                */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    const devices = [
      [150, 250, '#ff5d6c', '<rect x="-22" y="-12" width="34" height="24" rx="6" fill="#eef1f4"/><circle cx="-4" cy="0" r="7" fill="#11142a"/><circle cx="-4" cy="0" r="3" fill="#5ef2ff"/>'],
      [650, 230, '#5ef2ff', '<path d="M-14 16v-30h28v30a14 5 0 0 1-28 0Z" fill="#2b3159"/><ellipse cx="0" cy="-14" rx="14" ry="5" fill="#5ef2ff"/>'],
      [110, 560, '#ffd84d', '<rect x="-14" y="-22" width="28" height="44" rx="5" fill="#11142a"/><rect x="-10" y="-17" width="20" height="9" rx="2" fill="#5ef2ff"/><g fill="#5ef2ff"><circle cx="-6" cy="0" r="2"/><circle cx="0" cy="0" r="2"/><circle cx="6" cy="0" r="2"/><circle cx="-6" cy="7" r="2"/><circle cx="0" cy="7" r="2"/><circle cx="6" cy="7" r="2"/></g>'],
      [690, 560, '#9b8cff', '<rect x="-30" y="-20" width="60" height="38" rx="4" fill="#11142a"/><rect x="-26" y="-16" width="52" height="30" fill="#1b3d7a"/><path d="M-8 22h16" stroke="#11142a" stroke-width="5"/>']
    ];
    let net = '';
    devices.forEach(([x, y, c, icon], i) => {
      net += '<path d="M400 470 L' + x + ' ' + y + '" stroke="' + c + '" stroke-width="3" stroke-dasharray="8 8" opacity=".7">' +
        '<animate attributeName="stroke-dashoffset" values="0;-32" dur="' + (1.2 + i * 0.3) + 's" repeatCount="indefinite"/></path>' +
        '<circle cx="' + x + '" cy="' + y + '" r="52" fill="#1a1f45" stroke="' + c + '" stroke-width="4"/>' +
        '<g transform="translate(' + x + ' ' + y + ') scale(1.5)">' + icon + '</g>';
    });
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="s6-isky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a24"/><stop offset="1" stop-color="#2a2f7a"/></linearGradient>' +
      '<radialGradient id="s6-iglow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="900" fill="url(#s6-isky)"/>' +
      '<g fill="#fff">' + [[60, 60], [200, 110], [330, 40], [520, 90], [700, 50], [760, 150], [440, 160], [90, 170]].map(([x, y], i) =>
        '<circle cx="' + x + '" cy="' + y + '" r="' + (i % 2 ? 2 : 3) + '"><animate attributeName="opacity" values="1;.2;1" dur="' + (1.4 + i * 0.3) + 's" repeatCount="indefinite"/></circle>').join('') + '</g>' +
      '<circle cx="620" cy="110" r="48" fill="#fff4c9"/><circle cx="640" cy="96" r="44" fill="#0b0f30"/>' +
      '<path d="M0 820h800v80H0Z" fill="#11142a"/>' +
      // المنزل
      '<circle cx="400" cy="560" r="230" fill="url(#s6-iglow)"/>' +
      '<path d="M240 520 400 380 560 520V820H240Z" fill="#262c55"/>' +
      '<path d="M220 530 400 370 580 530" stroke="#3a4275" stroke-width="22" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<rect x="290" y="560" width="70" height="70" rx="4" fill="#ffd27a"/><path d="M325 560v70M290 595h70" stroke="#262c55" stroke-width="5"/>' +
      '<rect x="440" y="560" width="70" height="70" rx="4" fill="#6fb7ff"/><path d="M475 560v70M440 595h70" stroke="#262c55" stroke-width="5"/>' +
      '<rect x="370" y="680" width="60" height="140" rx="4" fill="#6b4a33"/><circle cx="418" cy="752" r="5" fill="#5ef2ff"/>' +
      '<g fill="none" stroke="#5ef2ff" stroke-width="7" stroke-linecap="round"><path d="M372 470q28-24 56 0"/><path d="M384 486q16-13 32 0"/></g>' +
      '<circle cx="400" cy="500" r="6" fill="#5ef2ff"/>' +
      net +
      // عين المخترق
      '<g transform="translate(400 250)">' +
      '<path d="M-90 0q90-80 180 0q-90 80-180 0Z" fill="#11142a" stroke="#ff5d6c" stroke-width="5"/>' +
      '<circle r="30" fill="#ff5d6c"/><circle r="12" fill="#11142a"/>' +
      '<animateTransform attributeName="transform" type="translate" values="400 250;400 244;400 250" dur="3s" repeatCount="indefinite"/></g>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'smart-home',
    number: 6,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'عيون في الظلام',
    title: 'أمن الأجهزة الذكية في المنزل',
    description: 'منتصف الليل، والجميع نائمون... إلا الأجهزة الذكية. الكاميرا والمساعد الصوتي والتلفاز والقفل كلها متصلة بالإنترنت. اكتشف الثغرات قبل أن يستغلها أحد.',
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
