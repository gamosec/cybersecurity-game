# معمارية المشروع (Architecture)

لعبة تعليمية ثابتة (Static) بلا خادم ولا أدوات بناء: HTML + CSS + JavaScript عادي. كل الرسوم تُرسم بالشيفرة بصيغة SVG، فلا توجد صور خارجية (الخط Cairo الوحيد الخارجي، من Google Fonts مع بدائل محلية عند الانقطاع).

## 1) خريطة الملفات

```
index.html                 هيكل الشاشات + ترتيب تحميل السكربتات (?v=N لكسر الكاش)
css/styles.css             كل التنسيق في ملف واحد (أقسام مرقّمة بتعليقات ===)
js/core.js                 مساحة الأسماء CyberEscape، سجل السيناريوهات، أدوات، أيقونات الواجهة
js/iso.js                  Iso: رسم متساوي القياس (box/poly/onPlaneX/Y/Z) + CE.shade
js/icon-lib.js             Icons: أيقونات الخيارات المصورة (رسم + شارة) وقواعد الاختيار التلقائي من النص
js/audio.js                Sound: مؤثرات WebAudio (بلا ملفات)
js/missions.js             محرك المهام التفاعلية (الفريق الأحمر/الأزرق)
js/game.js                 محرك سيناريوهات الغرفة + القائمة + التحجيم + النتائج (آخر ملف يُحمَّل)
js/scenarios/scenarioN-*.js  سيناريو غرفة (محتوى + رسم)         ← 1..6
js/scenarios/mission1-*.js   مهمة تفاعلية (محتوى + رسم)         ← 7
js/scenarios/upcoming.js     بطاقات "قريبًا" (فارغة حاليًا)
tools/check-content.js     فحص ثابت للمحتوى والبنية (بلا متصفح)
tests/e2e.js               اختبار شامل بمتصفح حقيقي (Playwright)
docs/                      هذه الوثائق
```

## 2) ترتيب التحميل (مهم)

`core → iso → icon-lib → audio → missions → (ملفات السيناريوهات) → upcoming → game`

- السيناريوهات تستدعي `CE.registerScenario` عند التحميل، و`game.js` يقرأ السجل عند التشغيل، لذلك يجب أن يكون آخر ملف.
- `missions.js` يحتاج `CE.Icons` و`CE.Sound` و`CE.icons` (لذلك بعد icon-lib وaudio). يصل إلى محرك الغرفة عبر `CE.engine = { show, renderMenu }` الذي يعرّفه `game.js`.
- الفحص `tools/check-content.js` يتحقق من الترتيب ومن أن كل ملف js مذكور في `index.html`.

## 3) نموذج البيانات

### سيناريو غرفة (`registerScenario`)
```js
{
  id, number, kicker, heading, title, description, isNew?,
  timeLimit,            // ثوانٍ (135 للسيناريو 1، 150 لبقية السيناريوهات)
  pointsPerChallenge,   // 50
  timeBonusMax,         // 30
  passRatio,            // 0.6
  viewBox: '0 0 1600 900', mobileViewBox?: '240 10 1120 840', isoOrigin: [800, 300],
  challenges: [{ id, title, options: [{ text, correct, icon? }], feedback: { summary, tips: [] } }],
  renderScene(iso) → سلسلة SVG   // العناصر القابلة للنقر داخل <g data-hotspot="<challenge.id>">
  renderIntroArt() → <svg> كامل للجهة اليمنى من شاشة البداية
}
```
- `data-hotspot` يمكن تكراره لنفس التحدي في أكثر من مجموعة (جزء خلف الطاولة وجزء أمامها).
- منطقة النقر تُنشأ تلقائيًا من `getBBox()` للمجموعة. إن كان الصندوق يغطي عناصر أخرى (فقاعات، أشعة) فاستخدم `data-hit="self"` وأضف عنصرًا `class="hit"` يدويًا (انظر `docs/LESSONS.md`).

### مهمة (`type: 'mission'`)
نفس الحقول الأساسية + `briefing{title,paragraphs}`، `switchText`، و`teams.red` / `teams.blue` ولكل منهما `title, intro, find, hint, email{from,address,subject,body[]}, challenges[]`.
التحدي: `{ id, label, ui: 'select'|'dnd', prompt, instruction?, options[], feedback }`.
المشهد يضع `<g class="m-st" data-station="red|blue|decoy" data-name="…">` ومعه `<polygon class="hit">`.

## 4) محرك الغرفة (`js/game.js`)

الشاشات (عناصر `section.screen` في index.html، واحدة `.active` في كل مرة): `screen-menu` ← `screen-intro` ← `screen-game` ← `screen-results`، ونافذة عامة `#modal` ونافذة الأسئلة `#popup`.

| الدالة | الدور |
|---|---|
| `fit()` / `isFluid()` | يختار وضعين: **مسرح 1600×900 مُحجَّم** بـ transform، أو **`body.fluid`** عندما نسبة العرض/الارتفاع < 1.1 (هاتف عمودي) |
| `sceneSvg(s, cls, withFilters)` | يبني SVG المشهد من `renderScene`؛ مرشحات التوهج (hover/صحيح/خطأ/تلميح) تُضاف لمشهد اللعب فقط |
| `show(id)` | يبدّل الشاشة **ويفرّغ رسومات الشاشات غير النشطة** (`screenArt`) لتجنّب تكرار معرّفات SVG |
| `renderMenu()` | بطاقة لكل سيناريو (مصغّر المشهد)؛ عند أكثر من 6 يضيف الفئة `many` فتصبح 4 أعمدة مدمجة |
| `startGame` / `setupHotspots` | يبدأ المؤقت ويحوّل كل `[data-hotspot]` إلى زر (tabindex، role، منطقة نقر `.hit`) |
| `openChallenge` | يخلط الخيارات ويعرضها بطاقات مصورة (`CE.Icons.forText`) داخل `#popup` (لوحة سفلية على الهاتف) |
| `submitAnswer` | **تطابق تام**: `ch.options.every(o => !!o.correct === selected)` ثم نافذة التغذية الراجعة |
| `finish` | النقاط: `50 × الصحيح + round(timeLeft/timeLimit × timeBonusMax)`؛ النجاح إن `correct ≥ ceil(n × passRatio)`؛ يحفظ الأفضل في `localStorage` |

مفاتيح التخزين: `cyberEscape.best.<id>` و`cyberEscape.sound` فقط. لا حالة أخرى تُحفظ.

## 5) محرك المهام (`js/missions.js`)

تتولد الشاشة `#screen-mission` عند أول استخدام. التسلسل:

`briefing` (المؤقت متوقف) → يبدأ المؤقت → `teamIntro('red')` (نافذة شفافة، المؤقت يعمل) → المتدرب يبحث ويضغط محطة → **محطة تمويه**: رسالة `toast` / **محطة الفريق الآخر قبل أوانه**: رسالة / **المحطة الصحيحة**: `showEmail` (مرة واحدة لكل فريق) → `challenge()` لكل تحدٍ (بطاقات `select` أو سحب وإفلات `dnd`) → `submit` → `feedback` (المؤقت متوقف) → `advance` → بعد الأحمر: نافذة الانتقال → الأزرق → `finish` (نتيجة + مراجعة).

- المؤقت يتوقف في النوافذ التي تُنشأ بـ `overlay(html, cls)` دون `keepRunning`، ويستمر أثناء شاشة الحاسوب والبحث.
- النقاط: 50 لكل تحدٍ، **مكافأة الوقت تُمنح عند النجاح فقط**، والنجاح يحتاج `!timedOut && correct ≥ ceil(total × passRatio)`.
- لا توجد أي إشارة بصرية على المحطة المطلوبة. التلميح الأول وصف مكاني (`team.hint`)، والثاني يومض (`.m-pulse`).
- السحب والإفلات: أحداث `dragstart/dragover/drop` على الحاسوب + النقر لنقل البطاقة بين الصندوقين (للمس).
- الأيقونة: `option.icon` إن وُجد، وإلا `CE.Icons.forText(option.text)`.

## 6) طبقة الرسم

### `Iso` (js/iso.js)
محاور العالم: `x` نحو أسفل اليمين، `y` نحو أسفل اليسار، `z` للأعلى. `p(x,y,z) = [ox + x − y, oy + (x+y)/2 − z]`.
- `box(x,y,z,w,d,h,color,{top,left,right})` يرسم الوجوه الثلاثة المرئية. الوجه `left` هو الواقع على المستوى `y=Y` والوجه `right` على `x=X`.
- `poly(points, fill, extra?)` مضلع من نقاط عالم ثلاثية، `onPlaneX/Y/Z` مصفوفات لرسم صور مسطحة (لوحات، شاشات، ورق) على الجدار الأيسر (`x=ثابت`) أو الأيمن (`y=ثابت`) أو سطح أفقي.
- **لا يوجد ترتيب عمق تلقائي**: الرسم من الخلف إلى الأمام يدويًا (خوارزمية الرسّام). أي عنصر يُرسم متأخرًا يغطي ما قبله.
- الغرفة المعتادة: أرضية `S=520`، جدارا الخلفية `x=0` (يسار) و`y=0` (يمين)، `isoOrigin:[800,300]`. الجدار الأيسر يُرسم بـ `onPlaneX(0.6, yMax, zTop)` والأيمن بـ `onPlaneY(xMin, 0.6, zTop)`.

### `Icons` (js/icon-lib.js)
`Icons.get('doc+lock')` = رسم أساسي (`bases`) + شارة صغيرة (`badges`) في الزاوية. `Icons.forText(text)` يمرّ على مصفوفة `rules` (الأخص أولًا) ويعيد أول تطابق. **ترتيب القواعد مهم**. الفاحص يفشل إن لم يكن لخيار ما أيقونة.

### `Sound`
نغمات مولّدة (`click, open, correct, wrong, tick, finish, timeUp`). المتصفحات تمنع الصوت قبل أول تفاعل.

## 7) طبقات CSS (css/styles.css)

1. متغيرات `:root` (الألوان، الخط) ← 2. المسرح (`#stage` 1600×900 + transform) ← 3. القائمة (+ `.many`) ← 4. شاشة البداية ← 5. اللعب (HUD، أزرار جانبية، popup، بطاقات `.opt-card`) ← 6. النوافذ المنبثقة ← 7. النتائج ← 8. **الوضع المرن `.fluid`** (كل قواعده تبدأ بـ `.fluid` أو `body.fluid`) ← 9. وضع المهمة (`.m-*`) ← 10. تكييف الهاتف للمهمة.

قواعد: كل عنصر `svg` متداخل داخل مشهد قد يتأثر بـ CSS لذلك تُستهدف حاويات الرسم بـ `> svg`. لا `transform` عند `:hover` على البطاقات.

## 8) الاختبارات والفحوص

- `tools/check-content.js`: فحص ثابت (أرقام `?v=`، ملفات مفقودة، 4 خيارات، أيقونات، تطابق `data-hotspot`/`data-station`، تكرار معرّفات SVG، تسرّب ألوان المحطات، تحذير `text-anchor="end"`، الريال). مُختبَر بتخريب متعمّد.
- `tests/e2e.js`: يكتشف السيناريوهات تلقائيًا من السجل ويلعب كلًا منها (مسار صحيح + خاطئ، حاسوب + هاتف، انتهاء الوقت للغرف، المحطات والتلميحات للمهام) ويتحقق من حكم كل إجابة ومن غياب أخطاء الصفحة. مُختبَر بكسر منطق التقييم.
- لا يوجد اختبار وحدة (unit)، فالمنطق مرتبط بالواجهة. للجودة البصرية: `--shots <مجلد>` ثم افتح الصور.

## 9) قيود معروفة

- الإجابات الصحيحة موجودة في شيفرة المتصفح (لا سرية). مناسب للتوعية لا للاختبار المُقيَّم.
- لا يوجد خادم أو تتبع أو SCORM/LMS أو لوحة متصدرين. النتائج محلية في المتصفح.
- اختُبر على Chromium (حاسوب + محاكاة Pixel 7). لم يُختبر على Safari/iOS وFirefox فعليًا.
- المحتوى لم يراجعه مختص أمن معلومات (راجع `STATUS.md`).
