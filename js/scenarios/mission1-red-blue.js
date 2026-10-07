/*
 * المهمة 7: الفريق الأحمر مقابل الفريق الأزرق — مكتب مؤسسة ResearchAI
 *
 * مهمة تفاعلية تعليمية دفاعية: يبحث المتدرب بنفسه عن محطة عمل الفريق الأحمر (دون أن يُقال له لونها)،
 * ثم يخوض تحديات على مستوى التوعية (اختيار نوع الأسلوب لفهم الثغرة)، ثم يبحث عن محطة الفريق
 * الأزرق ويبني الدفاعات بالسحب والإفلات. كل تغذية راجعة تعيد التركيز إلى الدرس الدفاعي.
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;

  /* ------------------------------------------------------------------ */
  /* المحتوى                                                             */
  /* ------------------------------------------------------------------ */

  const redChallenges = [
    {
      id: 'r-dlp',
      label: 'تجاوز مراقبة تسرّب البيانات',
      ui: 'select',
      prompt: 'إذا علمت أن الفريق الأزرق لديه حل لمنع تسريب البيانات الحساسة، ما الذي يُمكنك فعله لتجاوز التدابير الأمنية لديهم؟ (اختر إجابتين)',
      options: [
        { text: 'إرسال رابط لموقع إلكتروني ضار', icon: 'link+alert', correct: true },
        { text: 'طلب تثبيت برامج ضارة', icon: 'bug', correct: true },
        { text: 'طلب الحصول على معلومات شخصية عبر البريد الإلكتروني', icon: 'mail+q', correct: false },
        { text: 'نقل ملف البيانات الحساسة مباشرة إلى الخارج', icon: 'doc+out', correct: false }
      ],
      feedback: {
        summary: 'يفحص نظام منع تسرّب البيانات (DLP) المحتوى الحساس عند خروجه من المؤسسة، لذلك يُكتشف النقل المباشر فورًا. أما الروابط الضارة والبرامج التي يثبّتها المستخدم فتعتمد على خداع الإنسان، ولهذا لا يكفي DLP وحده.',
        tips: [
          'الدرس الدفاعي: ادعم DLP بفحص الروابط الصادرة وتقييد تثبيت البرامج.',
          'درّب الموظفين على عدم تثبيت أدوات غير معتمدة.',
          'راقب السلوك غير المعتاد لنقل البيانات، لا المحتوى فقط.'
        ]
      }
    },
    {
      id: 'r-cred',
      label: 'خداع الموظفين المدرَّبين',
      ui: 'select',
      prompt: 'درّب الفريق الأزرق الموظفين على عدم مشاركة كلمات المرور. أي الأساليب ما زال يشكّل خطرًا عليهم؟ (اختر إجابتين)',
      options: [
        { text: 'مكالمة تنتحل صفة الدعم الفني وتطلب رمز التحقق', icon: 'handset+hook', correct: true },
        { text: 'رابط يقود إلى صفحة دخول مزيفة', icon: 'monitor+hook', correct: true },
        { text: 'بريد عادي يطلب كلمة المرور صراحةً', icon: 'mail+q', correct: false },
        { text: 'زائر يسأل عن كلمة المرور وجهًا لوجه', icon: 'person+q', correct: false }
      ],
      feedback: {
        summary: 'الطلب الصريح يرفضه الموظف المدرَّب، أما الذريعة المقنعة (دعم فني عاجل) والصفحات المزيفة التي تبدو شرعية فتظل خطرة. من يفهم ذلك يبني دفاعًا أفضل.',
        tips: [
          'الدرس الدفاعي: فعّل المصادقة متعددة العوامل (MFA) لتقليل أثر سرقة كلمة المرور.',
          'علّم الموظفين التحقق عبر قناة رسمية قبل مشاركة أي رمز.',
          'سهّل الإبلاغ عن المكالمات والرسائل المشبوهة.'
        ]
      }
    },
    {
      id: 'r-mail',
      label: 'ثغرات بوابة البريد',
      ui: 'select',
      prompt: 'بوابة البريد لدى الفريق الأزرق تحجب المرفقات التنفيذية المعروفة. أي أنواع الرسائل لا تعتمد على تلك المرفقات وتحتاج إلى طبقات حماية إضافية؟ (اختر إجابتين)',
      options: [
        { text: 'رسالة تحمل رابطًا لصفحة مزيفة', icon: 'mail+hook', correct: true },
        { text: 'رسالة تنتحل صفة المدير وتطلب تحويلًا ماليًا بلا مرفقات', icon: 'boss+alert', correct: true },
        { text: 'مرفق تنفيذي معروف (exe)', icon: 'exe', correct: false },
        { text: 'برنامج ضار معروف داخل ملف مضغوط', icon: 'zip+bug', correct: false }
      ],
      feedback: {
        summary: 'البوابة تمسك ما هو معروف من المرفقات، لكنها لا تفهم الخداع: الروابط المزيفة ورسائل انتحال الصفة تحتاج إلى تدريب وتحقق إضافي لا إلى توقيعات ملفات.',
        tips: [
          'الدرس الدفاعي: حلّل الروابط في بيئة معزولة (Sandbox) قبل فتحها.',
          'اشترط موافقة ثانية على أي تحويل مالي مهما كان مصدر الطلب.',
          'اعتمد على إبلاغ الموظفين كطبقة كشف إضافية.'
        ]
      }
    }
  ];

  const blueChallenges = [
    {
      id: 'b-dlp',
      label: 'منع تسريب البيانات',
      ui: 'dnd',
      prompt: 'أنت الآن في الفريق الأزرق. اسحب الضوابط المناسبة لمنع تسريب البيانات الحساسة إلى صندوق الإجابة، ثم اضغط إرسال. (ثلاث إجابات صحيحة)',
      instruction: 'اسحب الدفاعات الصحيحة إلى هنا',
      options: [
        { text: 'تفعيل مراقبة تسرّب البيانات (DLP)', icon: 'shield+eye', correct: true },
        { text: 'تقييد رفع الملفات إلى المواقع غير الموثوقة', icon: 'cloud+stop', correct: true },
        { text: 'تشفير البيانات الحساسة أثناء التخزين والنقل', icon: 'doc+lock', correct: true },
        { text: 'مشاركة حساب واحد بين كل أعضاء الفريق', icon: 'users+alert', correct: false }
      ],
      feedback: {
        summary: 'المراقبة والتقييد والتشفير طبقات تكمّل بعضها: الأولى تكشف، والثانية تمنع القنوات غير الموثوقة، والثالثة تحمي البيانات حتى لو خرجت. أما الحسابات المشتركة فتُضعف المساءلة.',
        tips: [
          'امنح كل مستخدم حسابًا خاصًا لتتبّع من وصل إلى البيانات.',
          'راجع صلاحيات الوصول دوريًا وطبّق مبدأ أقل الامتيازات.',
          'نبّه فريق الأمن تلقائيًا عند محاولات النقل غير المعتادة.'
        ]
      }
    },
    {
      id: 'b-phish',
      label: 'إيقاف التصيّد وانتحال الدعم',
      ui: 'dnd',
      prompt: 'اسحب أساليب الحماية التي توقف التصيّد وانتحال صفة الدعم الفني إلى صندوق الإجابة، ثم اضغط إرسال. (ثلاث إجابات صحيحة)',
      instruction: 'اسحب الدفاعات الصحيحة إلى هنا',
      options: [
        { text: 'المصادقة متعددة العوامل (MFA)', icon: 'phone+shield', correct: true },
        { text: 'تدريب التوعية والإبلاغ عن الرسائل المشبوهة', icon: 'cap', correct: true },
        { text: 'التحقق من الطلبات الحساسة عبر قناة رسمية', icon: 'handset+check', correct: true },
        { text: 'كتابة كلمات المرور على لوحة مشتركة للسرعة', icon: 'note+alert', correct: false }
      ],
      feedback: {
        summary: 'المصادقة متعددة العوامل تقلّل أثر سرقة كلمة المرور، والتوعية تكشف الخداع مبكرًا، والتحقق الرسمي يحبط انتحال الصفة. كتابة كلمات المرور علنًا تهدم كل ذلك.',
        tips: [
          'اجعل الإبلاغ عن التصيّد بنقرة واحدة وبلا لوم.',
          'شغّل تمارين تصيّد محاكاة دورية لقياس الوعي.',
          'استخدم مفاتيح أمان مقاومة للتصيّد للحسابات الحساسة.'
        ]
      }
    },
    {
      id: 'b-mail',
      label: 'تقوية البريد الإلكتروني',
      ui: 'dnd',
      prompt: 'اسحب إعدادات تقوية البريد الإلكتروني التي تغلق الثغرات إلى صندوق الإجابة، ثم اضغط إرسال. (ثلاث إجابات صحيحة)',
      instruction: 'اسحب الدفاعات الصحيحة إلى هنا',
      options: [
        { text: 'تحليل الروابط والمرفقات في بيئة معزولة (Sandbox)', icon: 'box+mag', correct: true },
        { text: 'توسيع الروابط المختصرة وفحص وجهتها', icon: 'link+mag', correct: true },
        { text: 'حظر الأرشيفات المحمية بكلمة مرور', icon: 'zip+lock', correct: true },
        { text: 'فتح جميع المرفقات تلقائيًا لتسريع العمل', icon: 'doc+bolt', correct: false }
      ],
      feedback: {
        summary: 'التحليل المعزول يكشف ما يختبئ خلف الروابط والملفات، وتوسيع الروابط يفضح الوجهة الحقيقية، وحظر الأرشيفات المحمية يمنع تهريب المحتوى. الفتح التلقائي يفعل العكس تمامًا.',
        tips: [
          'فعّل بروتوكولات SPF و DKIM و DMARC لمكافحة انتحال النطاق.',
          'نبّه عند الرسائل الخارجية التي تنتحل أسماء داخلية.',
          'حدّث قواعد الفلترة باستمرار اعتمادًا على البلاغات.'
        ]
      }
    }
  ];

  /* ------------------------------------------------------------------ */
  /* مساعدات الرسم                                                       */
  /* ------------------------------------------------------------------ */

  const fx = (n) => Math.round(n * 10) / 10;

  // الغلاف المحدّب لمجموعة نقاط (لمنطقة نقر شفافة حول المحطة)
  function hull(points) {
    const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    p.forEach((q) => { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); });
    const upper = [];
    p.slice().reverse().forEach((q) => { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); });
    return lower.slice(0, -1).concat(upper.slice(0, -1));
  }

  function hitBox(I, x0, x1, y0, y1, z0, z1) {
    const pts = [];
    [x0, x1].forEach((x) => [y0, y1].forEach((y) => [z0, z1].forEach((z) => pts.push(I.p(x, y, z)))));
    return '<polygon class="hit" points="' + hull(pts).map((q) => fx(q[0]) + ',' + fx(q[1])).join(' ') + '"/>';
  }

  // محتوى الشاشات (58×36)
  const screens = {
    sheet: '<rect width="58" height="36" fill="#fff"/><rect width="58" height="6" fill="#1f8a4c"/><path d="M0 12h58M0 18h58M0 24h58M0 30h58M14 6v30M30 6v30M44 6v30" stroke="#cfd8e0" stroke-width=".8"/><rect x="31" y="19" width="12" height="5" fill="#c8f0d6"/><rect x="2" y="25" width="10" height="5" fill="#ffe8a8"/>',
    doc: '<rect width="58" height="36" fill="#eef2f7"/><rect width="58" height="6" fill="#2b579a"/><rect x="10" y="9" width="38" height="27" fill="#fff"/><path d="M14 14h30M14 19h26M14 24h30M14 29h20" stroke="#b9c7d4" stroke-width="1.6"/>',
    chart: '<rect width="58" height="36" fill="#fff"/><rect width="58" height="6" fill="#3fa2e0"/><g fill="#3fa2e0"><rect x="8" y="22" width="6" height="12"/><rect x="18" y="16" width="6" height="18"/><rect x="28" y="20" width="6" height="14"/></g><circle cx="46" cy="22" r="8" fill="none" stroke="#f08a2a" stroke-width="5" stroke-dasharray="26 24"/>',
    mail: '<rect width="58" height="36" fill="#fff"/><rect width="14" height="36" fill="#eef2f6"/><rect width="58" height="6" fill="#0f7bd0"/><path d="M18 11h36M18 17h30M18 23h36M18 29h26" stroke="#c4cbd4" stroke-width="2"/><rect x="2" y="9" width="10" height="4" fill="#c8e2f7"/><rect x="2" y="16" width="10" height="3" fill="#dbe3ea"/>',
    code: '<rect width="58" height="36" fill="#1e2433"/><g stroke-width="2" stroke-linecap="round"><path d="M5 8h14" stroke="#ff9d57"/><path d="M22 8h20" stroke="#5db2ee"/><path d="M9 14h22" stroke="#7bd88f"/><path d="M34 14h12" stroke="#e8679f"/><path d="M9 20h12" stroke="#5db2ee"/><path d="M24 20h22" stroke="#ffd84d"/><path d="M5 26h18" stroke="#7bd88f"/></g>',
    red: '<rect width="58" height="36" fill="#d93645"/><path d="M0 26q20-14 58-4v14H0Z" fill="#ef5a67"/><rect x="17" y="5" width="24" height="26" rx="3" fill="#fff"/><circle cx="29" cy="14" r="4.6" fill="#d93645"/><path d="M21 27q8-9 16 0Z" fill="#d93645"/>',
    blue: '<rect width="58" height="36" fill="#2f7bc2"/><path d="M0 26q20-14 58-4v14H0Z" fill="#4d98dc"/><rect x="17" y="5" width="24" height="26" rx="3" fill="#fff"/><circle cx="29" cy="14" r="4.6" fill="#2f7bc2"/><path d="M21 27q8-9 16 0Z" fill="#2f7bc2"/>'
  };

  function chairParts(I, cx, cy, color) {
    const dark = '#2b333c';
    const seat = I.box(cx - 25, cy - 3, 0, 50, 6, 4, dark) + I.box(cx - 3, cy - 25, 0, 6, 50, 4, dark) +
      I.box(cx - 4, cy - 4, 4, 8, 8, 44, '#4b5563') +
      I.box(cx - 33, cy - 30, 48, 66, 58, 8, color, { top: CE.shade(color, 0.14) }) +
      I.box(cx - 40, cy - 14, 56, 6, 34, 4, dark) + I.box(cx + 34, cy - 14, 56, 6, 34, 4, dark) +
      I.box(cx - 38, cy - 4, 48, 3, 3, 8, dark) + I.box(cx + 35, cy - 4, 48, 3, 3, 8, dark);
    const back = I.box(cx - 31, cy + 28, 56, 62, 8, 46, CE.shade(color, -0.05), { top: CE.shade(color, 0.1) });
    return { seat: seat, back: back };
  }

  function sittingPerson(I, cx, cy, shirt, hair) {
    const head = I.p(cx, cy + 6, 122);
    return I.box(cx - 16, cy - 4, 56, 32, 16, 48, shirt, { top: CE.shade(shirt, 0.12) }) +
      I.box(cx - 10, cy - 36, 56, 8, 34, 8, '#2b3350') + I.box(cx + 2, cy - 36, 56, 8, 34, 8, '#2b3350') +
      '<ellipse cx="' + fx(head[0]) + '" cy="' + fx(head[1]) + '" rx="13" ry="15" fill="' + hair + '"/>' +
      '<ellipse cx="' + fx(head[0] - 9) + '" cy="' + fx(head[1] + 3) + '" rx="2.4" ry="3.6" fill="#e9c6a3"/>';
  }

  // محطة عمل كاملة: مكتب + شاشة + كرسي (+ شخص اختياريًا)
  function workstation(I, x, y, o) {
    const w = 132, d = 58, h = 86;
    const P = (a, b, c) => I.p(a, b, c);
    const mx = x + 22, mw = 64, mh = 42, panelZ = h + 22;
    const cx = x + 52, cy = y + d + 38;
    const chair = chairParts(I, cx, cy, o.chair);
    let g = '<g class="m-st" data-station="' + o.kind + '" data-name="' + (o.name || '') + '">';
    g += hitBox(I, x + 4, x + w - 4, y + 2, cy + 36, 0, h + 78);

    // الأرجل وخزانة الأدراج
    [[x + 3, y + 3], [x + 3, y + d - 8], [x + w - 8, y + 3]].forEach((p) => { g += I.box(p[0], p[1], 0, 5, 5, h, '#59626e'); });
    g += I.box(x + w - 46, y + 6, 0, 40, d - 12, h - 2, '#eef1f4', { left: '#dde3ea', right: '#c9d1da', top: '#f7f8fa' });
    [[8, 30], [34, 56], [60, 82]].forEach((r) => {
      const yy = y + d - 5.6;
      g += I.poly([[x + w - 44, yy, r[0] + 1], [x + w - 8, yy, r[0] + 1], [x + w - 8, yy, r[1]], [x + w - 44, yy, r[1]]], '#e1e6ec', 'stroke="#b9c3ce" stroke-width="1"');
      g += I.poly([[x + w - 33, yy - .4, (r[0] + r[1]) / 2 - 1], [x + w - 19, yy - .4, (r[0] + r[1]) / 2 - 1], [x + w - 19, yy - .4, (r[0] + r[1]) / 2 + 1], [x + w - 33, yy - .4, (r[0] + r[1]) / 2 + 1]], '#8995a3');
    });

    // لوح المكتب
    g += I.box(x, y, h, w, d, 6, '#d7bd8f', { top: '#ecdcb9', left: '#cdb384', right: '#b99b6c' });
    g += I.poly([[x, y, h + 6.2], [x + w, y, h + 6.2], [x + w, y + d, h + 6.2], [x, y + d, h + 6.2]], 'rgba(255,255,255,0)', 'class="st-click" fill-opacity="0"');

    // الشاشة (قاعدة + عنق + لوحة + المحتوى)
    g += I.box(mx + mw / 2 - 15, y + 12, h + 6, 30, 22, 3, '#2f3b48');
    g += I.box(mx + mw / 2 - 3, y + 19, h + 9, 6, 6, 14, '#2f3b48');
    g += I.box(mx, y + 20, panelZ, mw, 6, mh, '#232d3a', { left: '#2b3645' });
    g += '<g transform="' + I.onPlaneY(mx + 3, y + 26.3, panelZ + mh - 3) + '">' + (screens[o.screen] || screens.sheet) + '</g>';

    // لوحة المفاتيح والفأرة
    g += I.box(x + 32, y + 36, h + 6, 48, 15, 2.4, '#e4e8ed');
    g += '<g transform="' + I.onPlaneZ(x + 34, y + 38, h + 8.6) + '"><path d="M0 4h44M0 8h44M0 12h44M7 0v13M14 0v13M21 0v13M28 0v13M35 0v13" stroke="#b6bec8" stroke-width=".9"/></g>';
    g += I.box(x + 90, y + 38, h + 6, 9, 12, 3, '#e4e8ed');

    // أغراض المكتب
    (o.items || []).forEach((it) => {
      if (it === 'mug') {
        const q = P(x + 14, y + 44, h + 6);
        g += '<path d="M' + fx(q[0] - 7) + ' ' + fx(q[1]) + 'v-14h14v14a7 2.6 0 0 1-14 0Z" fill="#fff" stroke="#c9d0d9"/><ellipse cx="' + fx(q[0]) + '" cy="' + fx(q[1] - 14) + '" rx="7" ry="2.6" fill="#7a4b2a"/><path d="M' + fx(q[0] + 7) + ' ' + fx(q[1] - 11) + 'c6 0 6 8 0 8" stroke="#c9d0d9" stroke-width="2.4" fill="none"/>';
      } else if (it === 'papers') {
        g += '<g transform="' + I.onPlaneZ(x + 8, y + 8, h + 6.4) + '"><g transform="rotate(8 12 10)"><rect width="22" height="18" fill="#fff"/><path d="M3 5h16M3 9h12M3 13h16" stroke="#c4cbd4" stroke-width="1.2"/></g></g>';
      } else if (it === 'lamp') {
        const q = P(x + 8, y + 12, h + 6);
        g += '<ellipse cx="' + fx(q[0]) + '" cy="' + fx(q[1]) + '" rx="9" ry="3.4" fill="#4b5563"/><path d="M' + fx(q[0]) + ' ' + fx(q[1]) + 'l-6-30 14-18" fill="none" stroke="#4b5563" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M' + fx(q[0] + 4) + ' ' + fx(q[1] - 56) + 'l18 5-4 12-18-5Z" fill="#7b8794"/><ellipse cx="' + fx(q[0] + 14) + '" cy="' + fx(q[1] - 46) + '" rx="6" ry="2.6" fill="#ffd84d"/>';
      } else if (it === 'plant') {
        const q = P(x + 116, y + 14, h + 6);
        g += '<g fill="#2a8a70"><ellipse cx="' + fx(q[0] - 4) + '" cy="' + fx(q[1] - 20) + '" rx="3.5" ry="11" transform="rotate(-20 ' + fx(q[0] - 4) + ' ' + fx(q[1] - 20) + ')"/><ellipse cx="' + fx(q[0] + 5) + '" cy="' + fx(q[1] - 20) + '" rx="3.5" ry="11" transform="rotate(20 ' + fx(q[0] + 5) + ' ' + fx(q[1] - 20) + ')"/><ellipse cx="' + fx(q[0]) + '" cy="' + fx(q[1] - 24) + '" rx="3.5" ry="12"/></g><path d="M' + fx(q[0] - 8) + ' ' + fx(q[1] - 10) + 'h16l-2.5 10h-11Z" fill="#e8679f"/>';
      } else if (it === 'phone') {
        g += I.box(x + 100, y + 8, h + 6, 20, 14, 5, '#2f3b48');
      }
    });

    // شعار الفريق على خزانة الأدراج (تفصيل صغير فقط)
    if (o.kind === 'red') {
      g += '<g transform="' + I.onPlaneY(x + w - 40, y + d - 5.5, 76) + '"><path d="M3 2v18" stroke="#d93645" stroke-width="2" stroke-linecap="round"/><path d="M4 3h14l-3.5 5 3.5 5H4Z" fill="#d93645"/></g>';
    } else if (o.kind === 'blue') {
      g += '<g transform="' + I.onPlaneY(x + w - 40, y + d - 5.5, 76) + '"><path d="M11 2 19 5v7c0 5-4 8-8 10-4-2-8-5-8-10V5Z" fill="#2f7bc2"/><path d="m7 11 3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>';
    }

    g += chair.seat;
    if (o.person) g += sittingPerson(I, cx, cy, o.person.shirt, o.person.hair);
    g += chair.back;

    if (o.kind !== 'decoy') {
      const q = P(x + w / 2, y + d / 2, h + 120);
      g += '<g class="st-check"><circle cx="' + fx(q[0]) + '" cy="' + fx(q[1]) + '" r="17" fill="#2db46d" stroke="#fff" stroke-width="3"/><path d="M' + fx(q[0] - 8) + ' ' + fx(q[1]) + 'l5 5 11-11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>';
    }
    return g + '</g>';
  }

  function plant(I, x, y, potColor, big) {
    const [cx, cy] = I.p(x, y, 0);
    const s = big ? 1.25 : 1;
    return '<g transform="translate(' + fx(cx) + ' ' + fx(cy) + ') scale(' + s + ')">' +
      '<g fill="#1f6f5c"><ellipse cx="-14" cy="-74" rx="9" ry="28" transform="rotate(-28 -14 -74)"/><ellipse cx="16" cy="-76" rx="9" ry="28" transform="rotate(26 16 -76)"/></g>' +
      '<g fill="#2a8a70"><ellipse cx="0" cy="-88" rx="9" ry="32"/><ellipse cx="-28" cy="-56" rx="8" ry="22" transform="rotate(-56 -28 -56)"/><ellipse cx="28" cy="-58" rx="8" ry="22" transform="rotate(56 28 -58)"/></g>' +
      '<path d="M-22-44h44l-6 44h-32Z" fill="' + potColor + '"/><path d="M0-44h22l-6 44H0Z" fill="' + CE.shade(potColor, -0.18) + '"/><ellipse cx="0" cy="-44" rx="22" ry="6.5" fill="#5b4636"/></g>';
  }

  function books(I) {
    const cols = ['#e84a4a', '#3c8fdc', '#f6c23e', '#2db46d', '#8e5bd6', '#f08a2a', '#e8679f', '#5bc0f8', '#1f3b60'];
    let b = '<rect width="100" height="200" fill="#6e523b"/>';
    [10, 58, 106, 154].forEach((sy, r) => {
      b += '<rect x="4" y="' + (sy + 36) + '" width="92" height="5" fill="#8a6a4f"/>';
      let x = 6, n = r * 5;
      while (x < 90) {
        const bw = 6 + ((n * 7) % 5), bh = 26 + ((n * 11) % 12);
        b += '<rect x="' + x + '" y="' + (sy + 36 - bh) + '" width="' + bw + '" height="' + bh + '" fill="' + cols[n % cols.length] + '"/>';
        x += bw + 1; n++;
      }
    });
    return b;
  }

  /* ------------------------------------------------------------------ */
  /* المشهد: مكتب مفتوح مشرق                                             */
  /* ------------------------------------------------------------------ */

  function cityView() {
    const W = 464, H = 236;
    let b = '<rect width="' + W + '" height="' + H + '" fill="url(#m1-sky)"/>' +
      '<circle cx="360" cy="70" r="46" fill="url(#m1-sun)"/>' +
      '<g clip-path="url(#m1-clip)"><g><animateTransform attributeName="transform" type="translate" values="-160 0;520 0" dur="80s" repeatCount="indefinite"/>' +
      '<g fill="#fff" opacity=".9"><ellipse cx="40" cy="44" rx="46" ry="11"/><ellipse cx="70" cy="36" rx="30" ry="10"/><ellipse cx="22" cy="38" rx="22" ry="8"/></g>' +
      '<g fill="#fff" opacity=".75"><ellipse cx="200" cy="82" rx="54" ry="11"/><ellipse cx="228" cy="74" rx="32" ry="10"/></g></g></g>';
    [[0, 112, 52], [46, 84, 40], [88, 124, 60], [148, 74, 44], [194, 104, 58], [250, 64, 46], [296, 98, 60], [354, 80, 44], [398, 110, 66]].forEach((r) => {
      b += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + (H - r[1]) + '" fill="#b9d0e4"/>';
    });
    [[8, 150, 56], [68, 124, 50], [122, 164, 66], [190, 112, 54], [246, 142, 62], [312, 102, 52], [366, 152, 60], [428, 128, 40]].forEach((r, i) => {
      b += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + (H - r[1]) + '" fill="#8aa7c3"/>';
      for (let wy = r[1] + 8; wy < H - 10; wy += 11) {
        for (let wx = r[0] + 6; wx < r[0] + r[2] - 6; wx += 9) {
          const lit = (wx * 3 + wy * 7 + i) % 7 < 2;
          b += '<rect x="' + wx + '" y="' + wy + '" width="4.5" height="6" fill="' + (lit ? '#ffe7a8' : '#d8ebfa') + '" opacity="' + (lit ? 0.95 : 0.55) + '"/>';
        }
      }
    });
    b += '<rect y="' + (H - 12) + '" width="' + W + '" height="12" fill="#6f8aa6"/>';
    return b;
  }

  function renderScene(I) {
    const S = 520, H = 272, T = 18;
    const P = (x, y, z) => I.p(x, y, z);
    let s = '';

    s += '<defs>' +
      '<linearGradient id="m1-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcdf4"/><stop offset="1" stop-color="#eaf6fd"/></linearGradient>' +
      '<radialGradient id="m1-sun"><stop offset="0" stop-color="#fff6cc"/><stop offset="1" stop-color="#fff6cc" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="m1-clip"><rect width="464" height="130"/></clipPath>' +
      '</defs>';

    // الأرضية الخشبية الفاتحة
    s += I.box(0, 0, -T, S, S, T, '#c9ad7d', { top: '#ead9b6', left: '#cdb182', right: '#b79a6b' });
    for (let k = 52; k < S; k += 52) s += I.poly([[k, 0, 0.2], [k + 1.2, 0, 0.2], [k + 1.2, S, 0.2], [k, S, 0.2]], '#dcc9a1');
    for (let k = 104; k < S; k += 104) s += I.poly([[0, k, 0.2], [S, k, 0.2], [S, k + 1.2, 0.2], [0, k + 1.2, 0.2]], '#e2d1ad');

    // الجدران
    s += I.box(-T, -T, 0, T, S + T, H, '#e3e9f0', { left: '#d3dbe4', right: '#eef2f7', top: '#fafbfc' });
    s += I.box(0, -T, 0, S, T, H, '#e3e9f0', { left: '#f1f5f9', right: '#cfd8e2', top: '#fafbfc' });
    s += I.poly([[0.5, 0, 0], [0.5, S, 0], [0.5, S, 12], [0.5, 0, 12]], '#c3ccd7');
    s += I.poly([[0, 0.5, 0], [S, 0.5, 0], [S, 0.5, 12], [0, 0.5, 12]], '#d2dae3');
    // شريط إضاءة سقفي
    s += I.poly([[0.8, 4, H - 12], [0.8, S - 4, H - 12], [0.8, S - 4, H - 4], [0.8, 4, H - 4]], '#fff4cf', 'opacity=".95"');
    s += I.poly([[4, 0.8, H - 12], [S - 4, 0.8, H - 12], [S - 4, 0.8, H - 4], [4, 0.8, H - 4]], '#fff4cf', 'opacity=".95"');

    // الجدار الزجاجي بمنظر مدينة (الجدار الأيمن)
    s += '<g transform="' + I.onPlaneY(24, 0.6, 252) + '">' + cityView() +
      '<g fill="#fff" opacity=".2"><path d="M60 0h50L40 236H-10Z"/><path d="M190 0h26L146 236h-26Z"/><path d="M330 0h40L300 236h-40Z"/></g>' +
      '<g stroke="#f4f7fa" stroke-width="7">' + [0, 116, 232, 348, 464].map((x) => '<path d="M' + x + ' 0v236"/>').join('') + '</g>' +
      '<path d="M0 118h464" stroke="#f4f7fa" stroke-width="5"/>' +
      '<rect width="464" height="236" fill="none" stroke="#cfd8e2" stroke-width="9"/></g>';
    s += I.box(20, 0, 14, 476, 12, 5, '#f4f7fa');

    // الجدار الأيسر: لوحة بيضاء، ملصقات، ساعة، باب
    s += '<g transform="' + I.onPlaneX(0.6, 336, 232) + '">' +
      '<rect x="3" y="4" width="210" height="118" rx="5" fill="#000" opacity=".1"/>' +
      '<rect width="210" height="118" rx="5" fill="#fff" stroke="#9aa5b1" stroke-width="5"/>' +
      '<g fill="#fde3e5" stroke="#e23b47" stroke-width="2"><rect x="16" y="16" width="44" height="24" rx="4"/></g>' +
      '<g fill="#dff0fb" stroke="#2f7bc2" stroke-width="2"><rect x="150" y="16" width="44" height="24" rx="4"/><rect x="84" y="78" width="44" height="24" rx="4"/></g>' +
      '<path d="M60 28H150M38 40V78H84M172 40V78H128" fill="none" stroke="#8995a3" stroke-width="2.4" stroke-dasharray="5 4"/>' +
      '<circle cx="38" cy="28" r="5" fill="#e23b47"/><circle cx="172" cy="28" r="5" fill="#2f7bc2"/><circle cx="106" cy="90" r="5" fill="#2db46d"/>' +
      '<path d="M18 100h40M18 108h28" stroke="#c4cbd4" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="60" y="118" width="90" height="5" fill="#9aa5b1"/></g>';
    s += '<g transform="' + I.onPlaneX(0.6, 110, 214) + '"><rect width="84" height="64" rx="3" fill="#8a6a4f"/><rect x="5" y="5" width="74" height="54" fill="#f7efe0"/><path d="M5 40q20-14 36-4t38-8v31H5Z" fill="#2db46d"/><path d="M5 48q24-14 40-4t34-6v15H5Z" fill="#3fa2e0"/><circle cx="58" cy="22" r="9" fill="#f6c23e"/></g>';
    s += '<g transform="' + I.onPlaneX(0.6, 432, 244) + '"><circle cx="22" cy="22" r="22" fill="#fff" stroke="#3a4552" stroke-width="3.5"/><path d="M22 22V9M22 22l10 6" stroke="#3a4552" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="22" r="2.4" fill="#e23b47"/></g>';
    s += '<g transform="' + I.onPlaneX(0.6, 508, 206) + '"><rect width="92" height="206" fill="#7d5a40"/><rect x="6" y="6" width="80" height="200" fill="#b98559"/><rect x="16" y="18" width="60" height="68" rx="3" fill="none" stroke="#a37249" stroke-width="3"/><rect x="16" y="100" width="60" height="86" rx="3" fill="none" stroke="#a37249" stroke-width="3"/><rect x="66" y="94" width="12" height="5" rx="2" fill="#e3c27a"/></g>';

    // سجادة مكتبية
    s += I.poly([[96, 96, 0.4], [446, 96, 0.4], [446, 420, 0.4], [96, 420, 0.4]], '#aec3d8');
    s += I.poly([[108, 108, 0.5], [434, 108, 0.5], [434, 408, 0.5], [108, 408, 0.5]], '#aec3d8', 'stroke="#d3e1ee" stroke-width="2.5" fill-opacity="0"');
    // بقع ضوء من النافذة
    s += I.poly([[70, 0, 0.6], [150, 0, 0.6], [250, 190, 0.6], [150, 190, 0.6]], '#ffffff', 'opacity=".16"');
    s += I.poly([[250, 0, 0.6], [310, 0, 0.6], [400, 170, 0.6], [330, 170, 0.6]], '#ffffff', 'opacity=".12"');

    // مكتبة الكتب على الجدار الأيسر (عمق الغرفة)
    s += I.box(0, 14, 0, 36, 100, 206, '#8a6a4f', { left: '#9b7a5c', right: '#7a5c43', top: '#a5866a' });
    s += '<g transform="' + I.onPlaneX(36.3, 114, 206) + '">' + books(I) + '</g>';

    // الصف الخلفي: ثلاث محطات (الأحمر في الطرف الأيمن)
    const NAMES = ['محطة موظف المحاسبة', 'محطة موظف الموارد البشرية', 'محطة موظف المبيعات', 'محطة موظف الدعم', 'محطة موظف الجودة'];
    const person = (shirt, hair) => ({ shirt: shirt, hair: hair });

    s += workstation(I, 52, 20, { kind: 'decoy', name: NAMES[0], screen: 'sheet', chair: '#8a96a3', items: ['mug', 'papers'], person: person('#f08a2a', '#3a2a22') });
    s += I.box(188, 20, 0, 3, 58, 60, '#cfe3f3', { left: '#b9d3e8', right: '#a8c5dd', top: '#e4f0fa' });
    s += workstation(I, 200, 20, { kind: 'decoy', name: NAMES[1], screen: 'doc', chair: '#2db46d', items: ['lamp', 'plant'] });
    s += I.box(336, 20, 0, 3, 58, 60, '#cfe3f3', { left: '#b9d3e8', right: '#a8c5dd', top: '#e4f0fa' });
    s += workstation(I, 348, 20, { kind: 'red', name: 'محطة عمل', screen: 'red', chair: '#e23b47', items: ['mug', 'papers'] });

    // الصف الأوسط: الأزرق في أقصى اليسار، ومحطات تمويه
    s += workstation(I, 52, 250, { kind: 'blue', name: 'محطة عمل', screen: 'blue', chair: '#2f7bc2', items: ['papers', 'phone'] });
    s += workstation(I, 200, 250, { kind: 'decoy', name: NAMES[2], screen: 'chart', chair: '#f6c23e', items: ['mug'], person: person('#8e5bd6', '#1d1a24') });
    s += workstation(I, 348, 250, { kind: 'decoy', name: NAMES[3], screen: 'mail', chair: '#9aa5b1', items: ['plant', 'papers'] });

    // منطقة الاستراحة: طاولة قهوة وكراسي منخفضة
    s += I.box(260, 408, 0, 7, 7, 30, '#9aa5b1') + I.box(350, 408, 0, 7, 7, 30, '#9aa5b1');
    s += I.box(260, 456, 0, 7, 7, 30, '#9aa5b1') + I.box(350, 456, 0, 7, 7, 30, '#9aa5b1');
    s += I.box(252, 400, 30, 112, 70, 6, '#f4f6f9', { top: '#ffffff', left: '#d9dee5', right: '#c6cdd6' });
    s += '<g transform="' + I.onPlaneZ(268, 414, 36.4) + '"><g transform="rotate(10 20 14)"><rect width="38" height="28" fill="#3fa2e0"/><rect x="4" y="4" width="30" height="10" fill="#fff" opacity=".85"/></g></g>';
    (function () {
      const [cx, cy] = P(332, 430, 36);
      s += '<g><path d="M' + fx(cx - 8) + ' ' + fx(cy) + 'v-14h16v14a8 3 0 0 1-16 0Z" fill="#fff" stroke="#c9d0d9"/><ellipse cx="' + fx(cx) + '" cy="' + fx(cy - 14) + '" rx="8" ry="3" fill="#7a4b2a"/></g>';
    })();
    s += I.box(222, 410, 0, 30, 54, 40, '#f08a2a', { top: '#f6a452' });
    s += I.box(392, 410, 0, 30, 54, 40, '#3fa2e0', { top: '#6cbcf0' });

    // مبرّد المياه
    s += I.box(470, 372, 0, 34, 34, 80, '#eef1f4', { left: '#fafbfc', right: '#d3d9e0', top: '#ffffff' });
    (function () {
      const [cx, cy] = P(487, 389, 80);
      s += '<g><path d="M' + fx(cx - 18) + ' ' + fx(cy - 2) + 'v-46a18 7 0 0 1 36 0v46Z" fill="#8fd0f5" opacity=".92"/><ellipse cx="' + fx(cx) + '" cy="' + fx(cy - 48) + '" rx="18" ry="6.5" fill="#bfe6fb"/></g>';
    })();

    // نباتات
    s += plant(I, 24, 326, '#e8679f', false);
    s += plant(I, 494, 236, '#3a4552', false);
    s += plant(I, 120, 500, '#f3f0e8', true);
    s += plant(I, 500, 480, '#3fa2e0', false);

    return s;
  }

  /* ------------------------------------------------------------------ */
  /* شاشة البداية                                                        */
  /* ------------------------------------------------------------------ */

  function renderIntroArt() {
    return '<svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="m1i-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcdf4"/><stop offset="1" stop-color="#eaf6fd"/></linearGradient>' +
      '<linearGradient id="m1i-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ead9b6"/><stop offset="1" stop-color="#c9ad7d"/></linearGradient>' +
      '</defs>' +
      '<rect width="800" height="900" fill="#e3e9f0"/>' +
      // جدار زجاجي بمنظر مدينة
      '<rect x="0" y="0" width="800" height="500" fill="url(#m1i-sky)"/>' +
      '<circle cx="610" cy="150" r="70" fill="#fff6cc" opacity=".9"/>' +
      '<g fill="#b9d0e4"><rect x="20" y="300" width="90" height="200"/><rect x="130" y="240" width="70" height="260"/><rect x="220" y="320" width="100" height="180"/><rect x="340" y="200" width="80" height="300"/><rect x="440" y="280" width="96" height="220"/><rect x="560" y="230" width="76" height="270"/><rect x="660" y="310" width="120" height="190"/></g>' +
      '<g fill="#8aa7c3"><rect x="0" y="360" width="100" height="140"/><rect x="190" y="380" width="120" height="120"/><rect x="400" y="340" width="90" height="160"/><rect x="520" y="390" width="130" height="110"/><rect x="700" y="370" width="100" height="130"/></g>' +
      '<g fill="#ffe7a8" opacity=".9">' + [[40, 380], [60, 420], [150, 300], [170, 350], [250, 390], [360, 260], [380, 330], [470, 340], [600, 300], [620, 360], [700, 400], [740, 440], [420, 400], [230, 440]].map((q) => '<rect x="' + q[0] + '" y="' + q[1] + '" width="14" height="18"/>').join('') + '</g>' +
      '<g fill="#fff" opacity=".85"><ellipse cx="160" cy="110" rx="90" ry="22"/><ellipse cx="230" cy="94" rx="56" ry="18"/><ellipse cx="520" cy="190" rx="100" ry="20"/></g>' +
      '<g stroke="#f4f7fa" stroke-width="12"><path d="M266 0v500M532 0v500"/><path d="M0 250h800"/></g>' +
      '<rect y="500" width="800" height="400" fill="url(#m1i-floor)"/>' +
      '<rect y="494" width="800" height="14" fill="#f4f7fa"/>' +
      // خط قطري يفصل الفريقين
      '<path d="M0 900 800 520V900Z" fill="#2f7bc2" opacity=".18"/><path d="M0 520 800 900H0Z" fill="#e23b47" opacity=".16"/>' +
      // مكتب في المقدمة
      '<rect x="0" y="640" width="800" height="40" fill="#d7bd8f"/><rect x="0" y="640" width="800" height="12" fill="#ecdcb9"/><rect x="0" y="680" width="800" height="220" fill="#cdb384"/>' +
      // شاشتان: حمراء (يسار) وزرقاء (يمين)
      '<g transform="translate(40 330)"><rect width="330" height="230" rx="18" fill="#232d3a"/><rect x="14" y="14" width="302" height="190" rx="8" fill="#d93645"/><path d="M14 150q100-70 302-20v74H14Z" fill="#ef5a67"/><rect x="115" y="40" width="100" height="120" rx="12" fill="#fff"/><circle cx="165" cy="78" r="20" fill="#d93645"/><path d="M130 140q35-38 70 0Z" fill="#d93645"/><rect x="120" y="206" width="90" height="34" fill="#232d3a"/><rect x="85" y="236" width="160" height="14" rx="7" fill="#2f3b48"/></g>' +
      '<g transform="translate(430 330)"><rect width="330" height="230" rx="18" fill="#232d3a"/><rect x="14" y="14" width="302" height="190" rx="8" fill="#2f7bc2"/><path d="M14 150q100-70 302-20v74H14Z" fill="#4d98dc"/><rect x="115" y="40" width="100" height="120" rx="12" fill="#fff"/><path d="M165 56 195 68v28c0 22-14 38-30 46-16-8-30-24-30-46V68Z" fill="#2f7bc2"/><path d="m150 98 11 11 22-24" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><rect x="120" y="206" width="90" height="34" fill="#232d3a"/><rect x="85" y="236" width="160" height="14" rx="7" fill="#2f3b48"/></g>' +
      // لوحات المفاتيح وأكواب
      '<rect x="80" y="700" width="260" height="46" rx="10" fill="#e4e8ed"/><rect x="470" y="700" width="260" height="46" rx="10" fill="#e4e8ed"/>' +
      '<g fill="#c9d0d9">' + Array.from({ length: 10 }, (_, i) => '<rect x="' + (96 + i * 24) + '" y="712" width="16" height="10" rx="2"/><rect x="' + (486 + i * 24) + '" y="712" width="16" height="10" rx="2"/>').join('') + '</g>' +
      '<g transform="translate(386 640)"><path d="M0 0h50l-6 66H6Z" fill="#fff" stroke="#c9d0d9" stroke-width="3"/><ellipse cx="25" cy="0" rx="25" ry="9" fill="#7a4b2a"/><path d="M50 14c20 0 20 30 0 30" fill="none" stroke="#c9d0d9" stroke-width="7"/></g>' +
      // ورقة لاصقة: ابحث عن المحطة
      '<g transform="rotate(-6 400 190)"><rect x="260" y="130" width="280" height="110" rx="10" fill="#ffd84d"/><rect x="260" y="130" width="280" height="22" rx="10" fill="#f6c23e"/><text x="400" y="190" font-size="30" font-weight="800" fill="#1e2d3d" text-anchor="middle">أين المحطة؟</text><text x="400" y="222" font-size="20" fill="#5a6675" text-anchor="middle">اكتشف بنفسك</text></g>' +
      '</svg>';
  }

  CE.registerScenario({
    id: 'red-blue',
    number: 7,
    type: 'mission',
    isNew: true,
    kicker: 'تحديات الأمن السيبراني',
    heading: 'الهجوم والدفاع',
    title: 'الفريق الأحمر ضد الفريق الأزرق',
    description: 'مهمة من جزأين داخل مكتب مؤسسة ResearchAI: فكّر أولًا كمهاجم لتفهم كيف تُتجاوز الحماية، ثم بدّل القبّعة لتبني الدفاعات الصحيحة. تجوّل في المكتب وابحث بنفسك عن محطتَي عمل الفريقين.',
    timeLimit: 360,
    pointsPerChallenge: 50,
    timeBonusMax: 50,
    passRatio: 0.6,
    viewBox: '0 0 1600 900',
    mobileViewBox: '240 110 1120 760',
    isoOrigin: [800, 300],
    briefing: {
      title: 'مقدمة',
      paragraphs: [
        'مرحبًا! في هذه المهمة ستلعب دورين مختلفين: "ميكا" في الفريق الأحمر، ثم "جو" في الفريق الأزرق.',
        'يستخدم الفريق الأحمر أساليب الهندسة الاجتماعية لاختبار الدفاعات، بينما يتولى الفريق الأزرق حماية المؤسسة من التهديدات والهجمات الإلكترونية.',
        'أنت في مكتب ResearchAI. ابحث بنفسك عن محطة عمل كل فريق، ثم أنجز التحديات. الهدف دائمًا: حماية أفضل.'
      ]
    },
    switchText: 'الآن بدّل القبّعة: انضم إلى الفريق الأزرق لبناء الدفاعات التي توقف تلك الهجمات.',
    teams: {
      red: {
        title: 'الفريق الأحمر',
        intro: 'أنت "ميكا"، اختصاصي أمن في الفريق الأحمر. مهمتك اختبار دفاعات الفريق الأزرق بالتفكير كمهاجم — على مستوى اختيار نوع الأسلوب لفهم الثغرة، لا تنفيذها.',
        find: 'ابحث في المكتب عن محطة عمل الفريق الأحمر واضغط عليها لبدء التحديات.',
        hint: 'محطتك في الصف الخلفي، في الجهة القريبة من النافذة الزجاجية.',
        email: {
          from: 'نادين الكعبي', address: 'nadine@researchai.example',
          subject: 'مرحبًا بك في الفريق الأحمر!',
          body: [
            'مرحبًا ميكا،',
            'يسعدنا انضمامك إلى الفريق الأحمر. مهمتنا اختبار جاهزية دفاعات مؤسستنا بتفكير المهاجم داخل بيئة محاكاة آمنة، حتى يستفيد الفريق الأزرق من النتائج.',
            'أمامك ثلاثة تحديات: في كل منها اختر الأساليب التي تتجاوز الضابط الأمني المذكور، وبعد كل إجابة ستعرف الدرس الدفاعي المقابل.',
            'حظًا موفقًا!',
            'نادين الكعبي'
          ]
        },
        challenges: redChallenges
      },
      blue: {
        title: 'الفريق الأزرق',
        intro: 'أنت "جو"، موظف قديم في فريق تقنية المعلومات لدى ResearchAI، ومطلوب منك إثبات أن دفاعاتنا ترقى إلى المستوى المطلوب. حان وقت التخطيط الاستراتيجي.',
        find: 'ابحث في المكتب عن محطة عمل الفريق الأزرق واضغط عليها.',
        hint: 'محطتك في الصف الأوسط، في الجهة البعيدة عن النافذة.',
        email: {
          from: 'فهد المنصوري', address: 'fahad@researchai.example',
          subject: 'مهمة جديدة للفريق الأزرق',
          body: [
            'مرحبًا جو،',
            'أنهى الفريق الأحمر اختباراته، وظهرت ثغرات يجب إغلاقها قبل أن يستغلها أحد حقيقي.',
            'في كل تحدٍ اسحب أساليب الحماية الصحيحة إلى صندوق الإجابة، ثم اضغط إرسال. اختر بعناية: بعض الإجراءات تبدو مفيدة لكنها تُضعف الأمن.',
            'بالتوفيق!',
            'فهد المنصوري'
          ]
        },
        challenges: blueChallenges
      }
    },
    renderScene,
    renderIntroArt
  });
})();
