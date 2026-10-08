/*
 * الرحلة 8: العمل عن بُعد من مقهى — "مكتبي في المقهى"
 * عالم واحد (مقهى متساوي القياس) والكاميرا تنتقل بين أربعة مواقف:
 *   1) مكالمة من زميل (اخرج لتجيب)  2) الذهاب إلى دورة المياه (ماذا تأخذ؟)
 *   3) رمز QR على الطاولة            4) شبكات الواي فاي (+ VPN)
 * المحرك: js/journeys.js — البنية في docs/ARCHITECTURE.md
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;
  const J = CE.Journey;
  const fx = (n) => Math.round(n * 10) / 10;

  /* ------------------------------------------------------------------ */
  /* المحتوى                                                             */
  /* ------------------------------------------------------------------ */

  const scenes = [
    {
      id: 'call',
      title: 'المكالمة',
      caption: 'المشهد 1 · مكالمة من زميل',
      transition: 'بعد قليل في المقهى…',
      narration: 'تعمل عن بُعد من مقهى بحاسوب الشركة. يرنّ هاتفك: زميلك سامر يريد مناقشة ملف عملاء الشركة الآن، والزبائن يجلسون حولك. اضغط على هاتفك.',
      hint: 'هاتفك على الطاولة أمام حاسوبك، وهو الذي يرنّ.',
      cam: [330, 215, 1000, 563],
      camMobile: [610, 300, 460, 590],
      kind: 'choice',
      focus: 'phone',
      device: 'call',
      deviceInfo: { initial: 'س', name: 'سامر — زميلك في العمل', sub: 'ملف عملاء الشركة · عاجل' },
      prompt: 'كيف تتصرف مع هذه المكالمة؟ اختر الإجراء الأنسب ثم أرسل.',
      multi: false,
      options: [
        { text: 'أرد بعد الخروج من المبنى إلى مكان هادئ بعيد عن الناس', icon: 'exit', correct: true },
        { text: 'أرد هنا بصوت عادٍ لأنهي الموضوع بسرعة', icon: 'handset+eye', correct: false },
        { text: 'أرد هنا على مكبّر الصوت لأفتح الملف أثناء الحديث', icon: 'speaker+alert', correct: false },
        { text: 'أتجاهل المكالمة ولا أرد على زميلي إطلاقًا', icon: 'phoneOff', correct: false }
      ],
      feedback: {
        summary: 'الحديث عن العملاء والملفات في مكان عام قد يسمعه من حولك (التنصّت)، وقد يصوّرك أحدهم أو يلتقط أسماءً وأرقامًا. الحل الأمني الصحيح هو الرد مع الابتعاد إلى مكان خاص، أما تجاهل زميلك كليًا فيعطّل العمل بلا داعٍ.',
        tips: [
          'لا تذكر أسماء العملاء أو الأرقام الحساسة بصوت مسموع في الأماكن العامة.',
          'إن لم تستطع الخروج فورًا فاطلب من زميلك الانتظار دقيقة أو أرسل رسالة قصيرة ثم عاود الاتصال من مكان خاص.',
          'استخدم سماعات الأذن، وتجنّب مكبّر الصوت وفتح ملفات العملاء أثناء المكالمة بجوار الآخرين.'
        ]
      }
    },
    {
      id: 'restroom',
      title: 'دورة المياه',
      caption: 'المشهد 2 · الذهاب إلى دورة المياه',
      transition: 'بعد انتهاء المكالمة…',
      narration: 'تحتاج إلى دورة المياه لبضع دقائق. أمامك على الطاولة أشياء كثيرة. اضغط على الأشياء المهمة التي يجب أن تأخذها معك ولا تتركها دون مراقبة، ثم اضغط «اذهب».',
      hint: 'خذ كل ما يحمل بياناتك أو هويتك أو يفتح حساباتك. ما ستعود إليه ولا قيمة أمنية له يبقى.',
      cam: [440, 275, 780, 439],
      camMobile: [560, 330, 520, 640],
      kind: 'items',
      sendLabel: 'اذهب إلى دورة المياه',
      prompt: '',
      items: [
        { id: 'phone', text: 'هاتفك المحمول', icon: 'phone', take: true, why: 'يفتح بريدك وحساباتك ورموز التحقق.' },
        { id: 'wallet', text: 'محفظتك', icon: 'wallet', take: true, why: 'فيها بطاقات بنكية وهويتك.' },
        { id: 'laptop', text: 'حاسوب الشركة المحمول', icon: 'laptop', take: true, why: 'عليه بيانات العملاء وجلسات العمل المفتوحة، وتُقفل الشاشة حتى لو أخذته.' },
        { id: 'bag', text: 'حقيبتك', icon: 'bag', take: true, why: 'فيها أجهزة وأوراق ومفاتيح شخصية.' },
        { id: 'badge', text: 'بطاقة الدخول إلى مقر العمل', icon: 'card', take: true, why: 'من يلتقطها يدخل مبنى شركتك منتحلًا شخصيتك.' },
        { id: 'usb', text: 'ذاكرة USB فيها ملفات العمل', icon: 'usb', take: true, why: 'ملفات غير مشفّرة يسهل نسخها أو سرقتها.' },
        { id: 'notebook', text: 'دفتر ملاحظات الاجتماعات', icon: 'notebook', take: true, why: 'فيه أسماء عملاء وأرقام وكلمات مرور مؤقتة.' },
        { id: 'keys', text: 'مفاتيح السيارة والمنزل', icon: 'keys', take: true, why: 'تدلّ على عنوانك وتمنح دخولًا فعليًا.' },
        { id: 'cup', text: 'فنجان القهوة', icon: 'cup', take: false, why: 'لا يحمل أي بيانات؛ ستعود إليه.' },
        { id: 'pen', text: 'قلم', icon: 'pen', take: false, why: 'لا قيمة أمنية له.' },
        { id: 'menu', text: 'قائمة طعام المقهى', icon: 'menu', take: false, why: 'ملك المقهى ولا بيانات فيها.' },
        { id: 'napkins', text: 'علبة المناديل', icon: 'doc', take: false, why: 'لا قيمة أمنية لها.' }
      ],
      feedback: {
        summary: 'دقيقتان تكفيان لسرقة جهاز أو تصوير شاشة أو نسخ ملف. القاعدة: كل ما يحمل بيانات أو يُثبت هويتك أو يفتح حسابًا أو مكانًا لا يُترك دون مراقبة، حتى لدقائق قليلة.',
        tips: [
          'خذ حاسوبك وهاتفك دائمًا، أو اطلب من شخص موثوق مراقبتهما، ولا تعتمد على "الجميع هنا طيبون".',
          'فعّل قفل الشاشة التلقائي بسرعة، وسجّل الخروج من الجلسات الحساسة عند الابتعاد.',
          'اكتب ملاحظاتك الحساسة في تطبيق محمي بدل الدفتر الورقي، وشفّر ذاكرات USB أو تجنّبها.'
        ]
      }
    },
    {
      id: 'qr',
      title: 'رمز QR',
      caption: 'المشهد 3 · رمز QR على الطاولة',
      transition: 'تعود إلى طاولتك…',
      narration: 'تلاحظ على حامل الطاولة ملصقًا: «امسح لطلب قائمة الطعام والدفع». يبدو أن الملصق لُصق فوق ملصق آخر. اضغط عليه.',
      hint: 'الملصق قائم على الطاولة، قرب حاسوبك.',
      cam: [690, 420, 440, 248],
      camMobile: [735, 410, 330, 440],
      kind: 'choice',
      focus: 'qr',
      device: 'camera',
      deviceInfo: { link: 'cafe-orders-pay.example/menu?id=772' },
      prompt: 'ماذا تفعل قبل أن تعتمد على هذا الرمز؟ اختر كل ما ينطبق ثم أرسل.',
      multi: true,
      options: [
        { text: 'أتأكد أن الملصق ليس ملصوقًا فوق رمز آخر وأسأل موظفي المقهى', icon: 'qr+mag', correct: true },
        { text: 'أمسحه بتطبيق موثوق يعرض الرابط قبل فتحه', icon: 'scan', correct: true },
        { text: 'أتحقق من اسم موقع الرابط قبل إدخال أي بيانات', icon: 'link+mag', correct: true },
        { text: 'أفتح الرابط فورًا وأدخل بيانات بطاقتي للدفع', icon: 'card+alert', correct: false }
      ],
      feedback: {
        summary: 'المحتال يلصق رمز QR مزيفًا فوق الرمز الأصلي ليحوّلك إلى صفحة دفع أو دخول مزيفة (Quishing). ثلاث خطوات تحميك: تفقّد الملصق، وامسح بتطبيق يُظهر الرابط، وافحص اسم الموقع قبل إدخال أي بيانات. أما فتح الرابط والدفع فورًا فهو ما ينتظره المحتال.',
        tips: [
          'إن بدا الملصق مُلصقًا فوق آخر أو مُتجعّدًا فاحذر، وأبلغ إدارة المقهى.',
          'لا تُدخل بيانات البطاقة أو كلمات المرور في صفحة وصلت إليها عبر رمز QR دون التحقق من اسم موقعها.',
          'فضّل طلب الخدمة من الموظف مباشرة أو من موقع المقهى الذي تكتبه بنفسك.'
        ]
      }
    },
    {
      id: 'wifi',
      title: 'الواي فاي',
      caption: 'المشهد 4 · شبكة الواي فاي',
      transition: 'تحتاج إلى الإنترنت…',
      narration: 'تحتاج إلى الإنترنت لإرسال الملف إلى فريقك. تظهر عدة شبكات، والمقهى قريب من الحرم الجامعي الذي تعمل فيه. اضغط على هاتفك لفتح قائمة الشبكات.',
      hint: 'هاتفك على الطاولة. وعلى إيصالك اسم شبكة المقهى الرسمية.',
      cam: [545, 340, 640, 360],
      camMobile: [690, 385, 340, 440],
      kind: 'wifi',
      focus: 'phone',
      prompt: 'اختر الشبكة المناسبة، وقرّر إن كنت ستفعّل الـ VPN، ثم اتصل.',
      receipt: 'شبكة المقهى الرسمية: Cafe_Guest — كلمة المرور مطبوعة على هذا الإيصال.',
      networks: [
        { id: 'fast', name: 'Free_WiFi_Fast', sub: 'مفتوحة — بلا كلمة مرور', secure: false, bars: 4, trusted: false, why: 'شبكة غريبة مفتوحة لا تعرف من أنشأها؛ قد تتنصّت على كل ما ترسله.' },
        { id: 'cafe', name: 'Cafe_Guest', sub: 'محمية بكلمة مرور (WPA2)', secure: true, bars: 3, trusted: true, why: 'هي شبكة المقهى الرسمية المطابقة لاسم الإيصال.' },
        { id: 'twin', name: 'Cafe_Guest_Free', sub: 'مفتوحة — بلا كلمة مرور', secure: false, bars: 4, trusted: false, why: 'اسمها يشبه شبكة المقهى لكنها مفتوحة وليست على الإيصال: شبكة مزيفة (توأم شريرة).' },
        { id: 'uni', name: 'UniWork-Staff', sub: 'شبكة موظفي الجامعة — حساب العمل', secure: true, bars: 2, trusted: true, why: 'شبكة جهة عملك الرسمية وتسجّل الدخول فيها بحسابك المؤسسي.' }
      ],
      feedback: {
        summary: 'اختيار الشبكة يتطلب أمرين: شبكة موثوقة (شبكة المقهى الرسمية المطابقة للإيصال، أو شبكة جهة عملك بحسابك)، وتفعيل الـ VPN لتشفير اتصالك حتى لو كانت الشبكة مشتركة. الشبكات المفتوحة الغريبة أو المشابهة في الاسم قد يديرها مهاجم.',
        tips: [
          'تأكد من اسم الشبكة من الموظف أو الإيصال قبل الاتصال، واحذر الأسماء المتشابهة.',
          'شغّل VPN الشركة قبل فتح أي نظام عمل في شبكة عامة.',
          'عطّل الاتصال التلقائي بالشبكات المفتوحة، وتجنّب الخدمات المصرفية على الشبكات العامة.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* مساعدات الرسم                                                       */
  /* ------------------------------------------------------------------ */

  const TX = 200, TY = 210, TZ = 80;      // زاوية الطاولة وارتفاع سطحها

  function standingPerson(I, x, y, shirt, hair, apron) {
    const head = I.p(x + 7, y + 6, 134);
    let g = I.box(x, y, 0, 6, 7, 52, '#2b3350') + I.box(x + 9, y, 0, 6, 7, 52, '#2b3350') +
      I.box(x - 2, y - 2, 52, 20, 14, 48, shirt, { top: CE.shade(shirt, 0.12) });
    if (apron) g += I.box(x - 3, y + 12, 52, 22, 3, 38, apron);
    g += '<ellipse cx="' + fx(head[0]) + '" cy="' + fx(head[1]) + '" rx="11" ry="13" fill="#e9c6a3"/>' +
      '<path d="M' + fx(head[0] - 12) + ' ' + fx(head[1] - 2) + 'q1-16 12-16t12 15q-7-7-12-7t-12 8Z" fill="' + hair + '"/>';
    return g;
  }

  function chair(I, x, y, color) {
    return I.box(x + 18, y + 18, 0, 6, 6, 36, '#4b5563') + I.box(x + 2, y + 20, 0, 36, 4, 4, '#2b333c') + I.box(x + 18, y + 4, 0, 4, 34, 4, '#2b333c') +
      I.box(x, y, 40, 40, 40, 7, color, { top: CE.shade(color, 0.14) });
  }

  function seated(I, x, y, shirt, hair, z) {
    const head = I.p(x + 8, y + 8, z + 62);
    return I.box(x - 2, y - 2, z, 24, 18, 34, shirt, { top: CE.shade(shirt, 0.12) }) +
      '<ellipse cx="' + fx(head[0]) + '" cy="' + fx(head[1]) + '" rx="11.5" ry="13.5" fill="#e9c6a3"/>' +
      '<path d="M' + fx(head[0] - 12) + ' ' + fx(head[1] - 2) + 'q1-16 12-16t12 15q-7-7-12-7t-12 8Z" fill="' + hair + '"/>';
  }

  function smallTable(I, x, y, w, d, color) {
    let t = '';
    [[x + 4, y + 4], [x + w - 9, y + 4], [x + 4, y + d - 9], [x + w - 9, y + d - 9]].forEach((p) => { t += I.box(p[0], p[1], 0, 5, 5, 70, '#59626e'); });
    return t + I.box(x, y, 70, w, d, 6, color, { top: CE.shade(color, 0.2), left: color, right: CE.shade(color, -0.14) });
  }

  /* ---------- أغراض الطاولة (كل غرض مجموعة قابلة للنقر) ---------- */

  function item(id, name, ring, inner) {
    return '<g data-item="' + id + '" data-name="' + name + '">' + ring + inner + '</g>';
  }

  function tableItems(I) {
    const P = (u, v, z) => I.p(TX + u, TY + v, TZ + (z || 0));
    const R = (u, v, rx, ry) => { const q = P(u, v, 4); return J.ring(fx(q[0]), fx(q[1]), rx, ry); };
    let s = '';

    // حاسوب الشركة المحمول (الشاشة تواجه الجهة اليمنى السفلية: مقعدك)
    s += item('laptop', 'حاسوب الشركة المحمول', R(44, 44, 50, 30),
      I.box(TX + 14, TY + 18, TZ, 62, 54, 3, '#aeb8c3') +
      '<g transform="' + I.onPlaneZ(TX + 32, TY + 22, TZ + 3.2) + '"><path d="M0 4h34M0 10h34M0 16h34M0 22h34M5 0v26M11 0v26M17 0v26M23 0v26M29 0v26" stroke="#7b8794" stroke-width=".9"/></g>' +
      I.box(TX + 14, TY + 18, TZ + 3, 4, 54, 42, '#2f3b48') +
      '<g transform="' + I.onPlaneX(TX + 18.4, TY + 72, TZ + 45) + '">' +
      '<rect x="2" y="2" width="50" height="38" fill="#fff"/><rect x="2" y="2" width="50" height="6" fill="#2b579a"/>' +
      '<path d="M7 14h28M7 19h22M7 24h30M7 29h18" stroke="#b9c7d4" stroke-width="2"/><rect x="36" y="13" width="14" height="10" rx="1" fill="#fde3e5" stroke="#ef4352" stroke-width="1"/>' +
      '<text x="43" y="20.6" font-size="6" font-weight="800" fill="#ef4352" text-anchor="middle">سري</text></g>');

    // دفتر ملاحظات
    s += item('notebook', 'دفتر ملاحظات الاجتماعات', R(122, 30, 24, 15),
      I.box(TX + 100, TY + 14, TZ, 40, 30, 4, '#3fa2e0', { top: '#5ab6ee' }) +
      '<g transform="' + I.onPlaneZ(TX + 104, TY + 17, TZ + 4.2) + '"><rect width="32" height="24" fill="#fff"/><path d="M4 6h24M4 12h24M4 18h14" stroke="#8fb4d6" stroke-width="1.6"/></g>');

    // فنجان قهوة
    (function () {
      const q = P(182, 28);
      s += item('cup', 'فنجان القهوة', R(182, 28, 15, 9),
        '<g><path d="M' + fx(q[0] - 10) + ' ' + fx(q[1]) + 'v-20h20v20a10 3.4 0 0 1-20 0Z" fill="#fff" stroke="#c9d0d9" stroke-width="1.5"/>' +
        '<ellipse cx="' + fx(q[0]) + '" cy="' + fx(q[1] - 20) + '" rx="10" ry="3.4" fill="#7a4b2a"/>' +
        '<path d="M' + fx(q[0] + 10) + ' ' + fx(q[1] - 15) + 'c8 0 8 11 0 11" fill="none" stroke="#c9d0d9" stroke-width="3"/>' +
        '<path d="M' + fx(q[0] - 4) + ' ' + fx(q[1] - 26) + 'c-3 4 3 6 0 10M' + fx(q[0] + 4) + ' ' + fx(q[1] - 26) + 'c-3 4 3 6 0 10" fill="none" stroke="#e9edf1" stroke-width="2" stroke-linecap="round"/></g>');
    })();

    // ذاكرة USB
    s += item('usb', 'ذاكرة USB', R(106, 68, 22, 12),
      I.box(TX + 92, TY + 60, TZ, 30, 12, 5, '#e84a4a', { top: '#f26a6a' }) + I.box(TX + 120, TY + 63, TZ + 1, 10, 7, 3, '#c9d0d9'));

    // قلم
    s += item('pen', 'قلم', R(160, 60, 22, 8),
      I.box(TX + 146, TY + 57, TZ, 30, 5, 5, '#1f3b60', { top: '#3a5f8c' }) + I.box(TX + 170, TY + 57, TZ + 1, 8, 5, 3, '#ef4352'));

    // قائمة الطعام
    s += item('menu', 'قائمة طعام المقهى', R(166, 94, 20, 14),
      '<g transform="' + I.onPlaneZ(TX + 150, TY + 82, TZ + 0.4) + '"><g transform="rotate(8 14 18)"><rect width="30" height="36" rx="2" fill="#fff8e6" stroke="#c9961a" stroke-width="1.6"/><path d="M5 9h20M5 16h20M5 23h14" stroke="#c4a35a" stroke-width="2"/></g></g>');

    // علبة المناديل
    s += item('napkins', 'علبة المناديل', R(188, 112, 16, 10),
      I.box(TX + 180, TY + 104, TZ, 16, 16, 12, '#cfe3f3', { top: '#e4f0fa' }));

    // بطاقة الدخول بحبل
    s += item('badge', 'بطاقة الدخول إلى مقر العمل', R(26, 108, 24, 14),
      '<g transform="' + I.onPlaneZ(TX + 10, TY + 94, TZ + 0.5) + '"><g transform="rotate(-10 14 18)"><path d="M14 0c-12 14-6 26 0 40" fill="none" stroke="#1f3b60" stroke-width="2.4"/>' +
      '<rect y="12" width="30" height="22" rx="3" fill="#fff" stroke="#c4cbd4"/><rect y="12" width="30" height="6" rx="2" fill="#1f3b60"/><circle cx="9" cy="26" r="4" fill="#e9c6a3"/><path d="M16 23h10M16 28h8" stroke="#8fb4d6" stroke-width="2"/></g></g>');

    // مفاتيح
    (function () {
      const q = P(66, 110, 2);
      s += item('keys', 'مفاتيح السيارة والمنزل', R(66, 110, 22, 13),
        '<g><circle cx="' + fx(q[0] - 8) + '" cy="' + fx(q[1]) + '" r="7" fill="none" stroke="#8995a3" stroke-width="3"/>' +
        '<path d="M' + fx(q[0] - 2) + ' ' + fx(q[1] - 4) + 'l18-8M' + fx(q[0] + 8) + ' ' + fx(q[1] - 9) + 'l3 4M' + fx(q[0] + 13) + ' ' + fx(q[1] - 11) + 'l3 4" stroke="#f6c23e" stroke-width="4.5" stroke-linecap="round"/>' +
        '<rect x="' + fx(q[0] - 18) + '" y="' + fx(q[1] + 2) + '" width="13" height="9" rx="3" fill="#ef4352"/></g>');
    })();

    // محفظة
    s += item('wallet', 'محفظتك', R(106, 110, 26, 14),
      I.box(TX + 92, TY + 100, TZ, 36, 22, 6, '#8a5a3c', { top: '#a8714c' }) + I.box(TX + 118, TY + 104, TZ + 6, 14, 14, 1.5, '#f6c23e'));

    // الهاتف (يُنقر لفتح المكالمة/الواي فاي أو يؤخذ في مشهد الأغراض) + موجات الرنين (عنصر مستقل لا يستقبل النقر)
    (function () {
      const q = P(150, 108, 4);
      s += '<g data-focus="phone" data-item="phone" data-name="هاتفك المحمول">' + R(150, 108, 22, 14) +
        I.box(TX + 142, TY + 94, TZ, 16, 28, 2.6, '#1f2933') +
        '<g transform="' + I.onPlaneZ(TX + 143.4, TY + 95.4, TZ + 2.8) + '"><rect width="13" height="25" rx="1.5" fill="#5db2ee"/><rect x="2" y="3" width="9" height="5" rx="1" fill="#fff"/><rect x="2" y="10" width="9" height="4" rx="1" fill="#fff" opacity=".8"/></g></g>';
      s += '<g class="j-waves" pointer-events="none"><circle cx="' + fx(q[0]) + '" cy="' + fx(q[1] - 6) + '" r="16"/><circle cx="' + fx(q[0]) + '" cy="' + fx(q[1] - 6) + '" r="16"/><circle cx="' + fx(q[0]) + '" cy="' + fx(q[1] - 6) + '" r="16"/></g>';
    })();

    return s;
  }

  /* ---------- حامل الطاولة وملصق QR (يُنقر في المشهد 3) ---------- */

  function qrTent(I) {
    const bx = TX + 170, by = TY + 8, bz = TZ;           // قاعدة الحامل
    const content = '<g transform="' + I.onPlaneX(bx + 6.6, by + 40, bz + 52) + '">' +
      '<rect width="40" height="52" rx="3" fill="#f08a2a"/><rect x="3" y="3" width="34" height="9" rx="2" fill="#fff"/>' +
      '<text x="20" y="10.2" font-size="6" font-weight="800" fill="#c2641a" text-anchor="middle">قائمة الطعام</text>' +
      '<path d="M5 45h30" stroke="#fff" stroke-width="2"/>' +
      '<g transform="translate(5 14)">' +
      '<rect x="-1.5" y="-1.5" width="33" height="33" fill="#000" opacity=".18"/><rect width="30" height="30" rx="1.5" fill="#fff"/>' +
      '<g transform="translate(2 2) scale(.19)">' + J.qrSvg(0, 0, 140) + '</g>' +
      '<path d="M30 20 22 30h8Z" fill="#c9c1b0"/><path d="M30 20 22 30" stroke="#8a8272" stroke-width=".8"/></g>' +
      '<text x="20" y="49.6" font-size="5.2" font-weight="700" fill="#fff" text-anchor="middle">امسح للطلب والدفع</text></g>';
    return '<g data-focus="qr" data-name="ملصق رمز QR">' + J.ring(fx(I.p(bx + 4, by + 22, bz + 12)[0]), fx(I.p(bx + 4, by + 22, bz + 12)[1]), 30, 36) +
      I.box(bx, by, bz, 7, 40, 54, '#e8e2d4', { left: '#d8d0bf', right: '#efe9dc' }) + content + '</g>';
  }

  /* ------------------------------------------------------------------ */
  /* العالم: مقهى متساوي القياس                                          */
  /* ------------------------------------------------------------------ */

  function streetView() {
    return '<rect width="150" height="170" fill="url(#j1-sky)"/>' +
      '<circle cx="118" cy="40" r="20" fill="#fff6cc" opacity=".9"/>' +
      '<g fill="#b9d0e4"><rect x="0" y="70" width="34" height="100"/><rect x="38" y="46" width="30" height="124"/><rect x="72" y="84" width="40" height="86"/><rect x="116" y="58" width="34" height="112"/></g>' +
      '<g fill="#8aa7c3"><rect x="6" y="100" width="22" height="70"/><rect x="78" y="106" width="28" height="64"/></g>' +
      '<g fill="#ffe7a8" opacity=".9"><rect x="44" y="62" width="6" height="8"/><rect x="54" y="80" width="6" height="8"/><rect x="122" y="76" width="6" height="8"/><rect x="132" y="96" width="6" height="8"/></g>' +
      '<rect y="146" width="150" height="24" fill="#5c6877"/><path d="M0 158h150" stroke="#e9edf1" stroke-width="2" stroke-dasharray="12 9"/>' +
      '<g><animateTransform attributeName="transform" type="translate" values="-50 0;180 0" dur="9s" repeatCount="indefinite"/>' +
      '<rect x="0" y="136" width="34" height="12" rx="4" fill="#e84a4a"/><rect x="8" y="128" width="18" height="10" rx="3" fill="#f6d5d5"/><circle cx="8" cy="149" r="4" fill="#2b333c"/><circle cx="27" cy="149" r="4" fill="#2b333c"/></g>';
  }

  function renderScene(I) {
    const S = 560, H = 270, T = 18;
    const P = (x, y, z) => I.p(x, y, z);
    let s = '';

    s += '<defs><linearGradient id="j1-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ad3f6"/><stop offset="1" stop-color="#eaf6fd"/></linearGradient>' +
      '<linearGradient id="j1-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b98559"/><stop offset="1" stop-color="#d09a69"/></linearGradient></defs>';

    // الأرضية: بلاط شطرنجي دافئ
    s += I.box(0, 0, -T, S, S, T, '#b99a72', { top: '#ead9b6', left: '#c7a97c', right: '#a98a63' });
    for (let a = 0; a < 8; a++) for (let b = 0; b < 8; b++) {
      if ((a + b) % 2) s += I.poly([[a * 70, b * 70, 0.2], [a * 70 + 70, b * 70, 0.2], [a * 70 + 70, b * 70 + 70, 0.2], [a * 70, b * 70 + 70, 0.2]], '#e2cfa6');
    }

    // الجدران
    s += I.box(-T, -T, 0, T, S + T, H, '#f1e6d2', { left: '#e3d5bb', right: '#f8f0e2', top: '#fffaf0' });
    s += I.box(0, -T, 0, S, T, H, '#f1e6d2', { left: '#faf2e3', right: '#dccfb4', top: '#fffaf0' });
    s += I.poly([[0.5, 0, 0], [0.5, S, 0], [0.5, S, 14], [0.5, 0, 14]], '#a9794f');
    s += I.poly([[0, 0.5, 0], [S, 0.5, 0], [S, 0.5, 14], [0, 0.5, 14]], '#b9895e');

    // ===== الجدار الأيمن: نوافذ على الشارع =====
    [34, 150, 266].forEach((x) => {
      s += '<g transform="' + I.onPlaneY(x, 0.6, 236) + '"><rect width="108" height="170" rx="4" fill="#fff"/>' +
        '<g transform="translate(4 4) scale(.693 .976)">' + streetView() + '</g>' +
        '<path d="M54 4v162M4 86h100" stroke="#fff" stroke-width="5"/><rect width="108" height="170" rx="4" fill="none" stroke="#e7dcc4" stroke-width="6"/></g>';
      s += I.box(x - 4, 0, 62, 116, 10, 6, '#fffaf0');
    });

    // لافتة المقهى فوق النوافذ
    s += '<g transform="' + I.onPlaneY(40, 0.6, 262) + '"><rect width="150" height="22" rx="5" fill="#3b2a20"/><text x="75" y="16" font-size="13" font-weight="800" fill="#ffe0a8" text-anchor="middle">مقهى النافذة</text></g>';

    // لوحة القائمة فوق المنضدة
    s += '<g transform="' + I.onPlaneY(386, 0.6, 244) + '"><rect width="150" height="72" rx="4" fill="#2b2f36"/><rect x="5" y="5" width="140" height="62" fill="#353a43"/>' +
      '<text x="75" y="19" font-size="10" font-weight="800" fill="#ffe08a" text-anchor="middle">القائمة</text>' +
      '<g font-size="8.5" fill="#fff"><text x="138" y="35" text-anchor="start" direction="rtl">قهوة</text><text x="12" y="35" text-anchor="start" direction="ltr">2 دينار</text><text x="138" y="48" text-anchor="start" direction="rtl">شاي</text><text x="12" y="48" text-anchor="start" direction="ltr">1 دينار</text><text x="138" y="61" text-anchor="start" direction="rtl">كرواسان</text><text x="12" y="61" text-anchor="start" direction="ltr">2 دينار</text></g></g>';

    // ===== الجدار الأيسر: رف كتب ومكتبة =====
    s += I.box(0, 18, 0, 26, 120, 150, '#8a6a4f', { left: '#9b7a5c', right: '#7a5c43', top: '#a5866a' });
    (function () {
      const cols = ['#e84a4a', '#3c8fdc', '#f6c23e', '#2db46d', '#8e5bd6', '#f08a2a', '#e8679f', '#1f3b60'];
      let b = '<rect width="120" height="150" fill="#5e4532"/>';
      [6, 54, 102].forEach((sy, r) => {
        b += '<rect x="3" y="' + (sy + 38) + '" width="114" height="5" fill="#7a5c43"/>';
        let x = 6, n = r * 4;
        while (x < 108) { const w = 7 + ((n * 7) % 5), h = 28 + ((n * 11) % 9); b += '<rect x="' + x + '" y="' + (sy + 38 - h) + '" width="' + w + '" height="' + h + '" fill="' + cols[n % cols.length] + '"/>'; x += w + 1; n++; }
      });
      s += '<g transform="' + I.onPlaneX(26.3, 138, 150) + '">' + b + '</g>';
    })();
    // نبتة فوق المكتبة
    (function () {
      const [cx, cy] = P(14, 78, 150);
      s += '<g><g fill="#2a8a70"><ellipse cx="' + fx(cx - 5) + '" cy="' + fx(cy - 18) + '" rx="4" ry="14" transform="rotate(-22 ' + fx(cx - 5) + ' ' + fx(cy - 18) + ')"/><ellipse cx="' + fx(cx + 6) + '" cy="' + fx(cy - 18) + '" rx="4" ry="14" transform="rotate(22 ' + fx(cx + 6) + ' ' + fx(cy - 18) + ')"/><ellipse cx="' + fx(cx) + '" cy="' + fx(cy - 22) + '" rx="4" ry="16"/></g><path d="M' + fx(cx - 10) + ' ' + fx(cy - 8) + 'h20l-3 12h-14Z" fill="#e8679f"/></g>';
    })();

    // ملصق على الجدار الأيسر
    s += '<g transform="' + I.onPlaneX(0.6, 250, 220) + '"><rect width="90" height="66" rx="3" fill="#f7efe0" stroke="#a37249" stroke-width="3"/><path d="M8 46q18-16 34-6t40-8v26H8Z" fill="#2db46d"/><circle cx="64" cy="22" r="9" fill="#f6c23e"/></g>';

    // باب الخروج (يسار، قرب المقدمة) ولافتة EXIT
    s += '<g transform="' + I.onPlaneX(0.6, 420, 214) + '"><rect width="96" height="214" fill="#6b4a33"/><rect x="6" y="6" width="84" height="208" fill="#a9d4f0"/>' +
      '<path d="M6 6h84v208H6Z" fill="none" stroke="#7fb4d8" stroke-width="3"/><path d="M14 20 40 20 14 80Z" fill="#fff" opacity=".35"/><rect x="72" y="110" width="12" height="6" rx="2" fill="#5a6675"/></g>';
    s += '<g transform="' + I.onPlaneX(0.6, 408, 236) + '"><rect width="70" height="18" rx="3" fill="#2db46d"/><text x="35" y="13.5" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">خروج</text></g>';

    // باب دورة المياه
    s += '<g transform="' + I.onPlaneX(0.6, 536, 200) + '"><rect width="86" height="200" fill="#7d5a40"/><rect x="6" y="6" width="74" height="194" fill="#c99a6b"/><rect x="62" y="98" width="12" height="6" rx="2" fill="#f6c23e"/></g>';
    s += '<g transform="' + I.onPlaneX(0.6, 530, 244) + '"><rect width="72" height="30" rx="4" fill="#3c8fdc"/><circle cx="14" cy="15" r="5" fill="#fff"/><path d="M8 28q6-10 12 0Z" fill="#fff"/><text x="46" y="20" font-size="9" font-weight="800" fill="#fff" text-anchor="middle">دورة المياه</text></g>';

    // ===== المنضدة (الجدار الأيمن): الباريستا ثم المنضدة =====
    s += standingPerson(I, 440, 14, '#f4f6f9', '#3a2a22', '#8a5a3c');
    s += I.box(380, 36, 0, 170, 62, 88, '#a9794f', { top: '#e7d3b0', left: '#a9794f', right: '#8e6340' });
    s += I.box(376, 32, 88, 178, 70, 6, '#efe2c6', { top: '#fbf3df', left: '#e3d3b0', right: '#d3c19a' });
    s += I.box(396, 44, 94, 40, 28, 26, '#c9d0d9', { top: '#e4e9ee', left: '#b7bfc9', right: '#a3acb7' });       // آلة القهوة
    s += I.box(402, 48, 120, 28, 20, 14, '#8995a3');
    s += I.box(470, 44, 94, 54, 30, 22, '#cfe9f5', { top: '#e6f5fb', left: '#bfe0f0', right: '#a9cfe3' });       // واجهة الحلويات
    s += I.box(474, 56, 98, 10, 10, 6, '#e0a15c') + I.box(490, 56, 98, 10, 10, 6, '#f6c23e') + I.box(506, 56, 98, 10, 10, 6, '#e8679f');

    // ===== طاولات الجيران =====
    // الجار 1 (خلف يسار)
    s += seated(I, 108, 96, '#8e5bd6', '#1d1a24', 36);
    s += chair(I, 92, 84, '#f08a2a');
    s += smallTable(I, 96, 128, 84, 64, '#d6b98f');
    s += I.box(120, 142, 76, 36, 24, 3, '#aeb8c3') + I.box(120, 142, 79, 3, 24, 28, '#2f3b48');

    // الجار 2 (أمام يسار) — يصغي إلى المكالمات
    s += smallTable(I, 76, 360, 90, 60, '#d6b98f');
    s += chair(I, 180, 372, '#3c8fdc');
    s += seated(I, 194, 384, '#1f3b60', '#2b1f18', 40);
    s += I.box(100, 376, 76, 22, 14, 3, '#f1f3f6');
    (function () {
      const q = P(150, 392, 76);
      s += '<g><path d="M' + fx(q[0] - 7) + ' ' + fx(q[1]) + 'v-14h14v14a7 2.6 0 0 1-14 0Z" fill="#fff" stroke="#c9d0d9"/><ellipse cx="' + fx(q[0]) + '" cy="' + fx(q[1] - 14) + '" rx="7" ry="2.6" fill="#7a4b2a"/></g>';
    })();

    // ===== طاولتك =====
    [[TX + 8, TY + 8], [TX + 188, TY + 8], [TX + 8, TY + 118], [TX + 188, TY + 118]].forEach((p) => { s += I.box(p[0], p[1], 0, 6, 6, 74, '#59626e'); });
    s += I.box(TX, TY, 74, 200, 130, 6, '#d09a69', { top: '#e9c28f', left: '#c18a5a', right: '#a8744a' });

    // الكرسي الجانبي (حقيبتك) — يسار الطاولة من جهة y الكبيرة
    s += chair(I, 244, 346, '#2db46d');
    s += item('bag', 'حقيبتك', J.ring(fx(P(262, 366, 66)[0]), fx(P(262, 366, 66)[1]), 34, 22),
      '<path d="M' + fx(P(250, 360, 82)[0]) + ' ' + fx(P(250, 360, 82)[1]) + 'q12-18 24 0" fill="none" stroke="#232d3a" stroke-width="4"/>' +
      I.box(248, 356, 47, 36, 20, 34, '#3a4552', { top: '#4b5563', right: '#2f3a47' }) + I.box(258, 376, 66, 12, 4, 8, '#f6c23e'));

    s += tableItems(I);
    s += qrTent(I);
    // إيصال (دليل للمشهد الأخير)
    s += '<g transform="' + I.onPlaneZ(TX + 112, TY + 78, TZ + 0.4) + '"><g transform="rotate(-12 8 12)"><rect width="18" height="26" fill="#fff"/><path d="M3 5h12M3 9h12M3 13h9M3 19h12" stroke="#c4cbd4" stroke-width="1.2"/></g></g>';

    // مقعدك (فارغ) على الجهة +x
    s += chair(I, 426, 238, '#e84a4a');

    // ===== المقدمة: نباتات وزينة =====
    function plant(x, y, pot) {
      const [cx, cy] = P(x, y, 0);
      return '<g transform="translate(' + fx(cx) + ' ' + fx(cy) + ')"><g fill="#1f6f5c"><ellipse cx="-14" cy="-74" rx="9" ry="28" transform="rotate(-28 -14 -74)"/><ellipse cx="16" cy="-76" rx="9" ry="28" transform="rotate(26 16 -76)"/></g>' +
        '<g fill="#2a8a70"><ellipse cx="0" cy="-88" rx="9" ry="32"/><ellipse cx="-28" cy="-56" rx="8" ry="22" transform="rotate(-56 -28 -56)"/><ellipse cx="28" cy="-58" rx="8" ry="22" transform="rotate(56 28 -58)"/></g>' +
        '<path d="M-22-44h44l-6 44h-32Z" fill="' + pot + '"/><path d="M0-44h22l-6 44H0Z" fill="' + CE.shade(pot, -0.18) + '"/><ellipse cx="0" cy="-44" rx="22" ry="6.5" fill="#5b4636"/></g>';
    }
    s += plant(30, 20, '#e8679f');
    s += plant(530, 530, '#3a4552');
    s += plant(30, 330, '#f3f0e8');

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* شاشة البداية                                                        */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="j1i-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcdf4"/><stop offset="1" stop-color="#eaf6fd"/></linearGradient>' +
      '<linearGradient id="j1i-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6ecd9"/><stop offset="1" stop-color="#ecdcbd"/></linearGradient></defs>' +
      '<rect width="800" height="900" fill="url(#j1i-wall)"/>' +
      '<rect x="60" y="70" width="680" height="440" rx="16" fill="#fff"/><rect x="76" y="86" width="648" height="408" fill="url(#j1i-sky)"/>' +
      '<g fill="#b9d0e4"><rect x="76" y="320" width="120" height="174"/><rect x="214" y="250" width="100" height="244"/><rect x="330" y="340" width="130" height="154"/><rect x="480" y="280" width="110" height="214"/><rect x="606" y="330" width="118" height="164"/></g>' +
      '<g fill="#8aa7c3"><rect x="100" y="380" width="70" height="114"/><rect x="350" y="400" width="90" height="94"/><rect x="630" y="400" width="70" height="94"/></g>' +
      '<g fill="#ffe7a8" opacity=".95"><rect x="236" y="290" width="16" height="22"/><rect x="262" y="330" width="16" height="22"/><rect x="500" y="318" width="16" height="22"/><rect x="528" y="360" width="16" height="22"/></g>' +
      '<circle cx="610" cy="170" r="52" fill="#fff6cc"/><g fill="#fff" opacity=".9"><ellipse cx="200" cy="150" rx="86" ry="20"/><ellipse cx="270" cy="134" rx="50" ry="16"/></g>' +
      '<g stroke="#fff" stroke-width="12"><path d="M400 86v408M76 290h648"/></g>' +
      '<rect x="40" y="500" width="720" height="30" fill="#ead9b6"/>' +
      '<path d="M0 560h800v340H0Z" fill="#d09a69"/><path d="M0 560h800" stroke="#e9c28f" stroke-width="10"/>' +
      // طاولة وحاسوب وفنجان
      '<path d="M90 640 400 560 710 640 400 760Z" fill="#e9c28f"/><path d="M90 640 400 760v18L90 658Z" fill="#c18a5a"/><path d="M400 760 710 640v18L400 778Z" fill="#a8744a"/>' +
      '<path d="M210 640 330 480 520 520 440 660Z" fill="#2f3b48"/><path d="M226 632 336 496 506 530 436 648Z" fill="#fff"/><path d="M246 580 330 516 392 530" stroke="#2b579a" stroke-width="12" fill="none"/>' +
      '<path d="M260 640 440 700 610 640 430 590Z" fill="#aeb8c3"/>' +
      '<rect x="520" y="650" width="70" height="120" rx="12" fill="#1f2933" transform="rotate(-18 555 710)"/><rect x="529" y="662" width="52" height="92" rx="6" fill="#5db2ee" transform="rotate(-18 555 710)"/>' +
      '<g fill="none" stroke="#ef4352" stroke-width="7" stroke-linecap="round"><path d="M600 640q22-20 42 0M586 620q34-34 68 0"/></g>' +
      '<g transform="translate(150 690)"><path d="M0 0h110l-12 100H12Z" fill="#fff" stroke="#c9d0d9" stroke-width="5"/><ellipse cx="55" cy="0" rx="55" ry="18" fill="#7a4b2a"/><path d="M110 28c40 0 40 56 0 56" fill="none" stroke="#c9d0d9" stroke-width="12"/></g>' +
      // درع واي فاي
      '<g transform="translate(400 330)"><path d="M0-70 70-40V10c0 50-34 90-70 108C-34 100-70 60-70 10V-40Z" fill="#3fa2e0" stroke="#fff" stroke-width="8"/><g fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"><path d="M-34-4q34-30 68 0M-20 14q20-18 40 0"/></g><circle cy="34" r="7" fill="#fff"/></g>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'remote-cafe',
    number: 8,
    type: 'journey',
    isNew: true,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'مكتبي في المقهى',
    title: 'أمن العمل عن بُعد في الأماكن العامة',
    description: 'تعمل اليوم من مقهى بحاسوب الشركة. أربعة مواقف تنتظرك: مكالمة من زميل، وذهابك إلى دورة المياه، ورمز QR على الطاولة، وشبكات الواي فاي. انتقل بين المشاهد واتخذ القرار الأمني الصحيح في كل موقف.',
    timeLimit: 240,
    pointsPerChallenge: 50,
    timeBonusMax: 30,
    passRatio: 0.6,
    viewBox: '0 0 1600 900',
    isoOrigin: [800, 300],
    briefing: {
      title: 'مقدمة',
      paragraphs: [
        'العمل عن بُعد يعني أن مكتبك أحيانًا يكون مقهى. هناك تنتشر المخاطر: من يسمعك، ومن يرى شاشتك، ومن يعبث بأغراضك أو بشبكتك.',
        'ستعيش أربعة مواقف متتالية في المقهى نفسه. اضغط على الأشياء المطلوبة في كل مشهد، واختر القرار الصحيح، ثم أرسل إجابتك.'
      ]
    },
    scenes,
    renderScene,
    renderIntroArt
  });
})();
