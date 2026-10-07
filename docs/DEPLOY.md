# النشر والتشغيل

## الوضع الحالي

- المستودع: `gamosec/cybersecurity-game` (**عام**). الموقع: https://gamosec.github.io/cybersecurity-game/
- GitHub Pages مضبوط (من إعدادات المستودع) على: **Deploy from a branch → `main` → `/ (root)`**. أي دفع إلى `main` ينشر الموقع خلال دقيقة تقريبًا. لا يوجد workflow ولا خطوة بناء.
- فرع التطوير المخصّص للجلسات السحابية: `claude/cybersecurity-escape-room-scenario-1-0my2fq`. **`main` يلحق به دائمًا بـ fast-forward** (لم نفتح PR لأن المستخدم لم يطلب).

## وصفة النشر (بعد اجتياز الفحوص)

```bash
node tools/check-content.js && node tests/e2e.js          # يجب أن ينجحا
# 1) ارفع ?v=N في كل وسوم index.html (الفاحص يفرض التطابق). مولّد السيناريو يفعل ذلك تلقائيًا.
git add -A && git commit -m "..."                          # رسالة واضحة، دون ذكر اسم أي نموذج
git push -u origin claude/cybersecurity-escape-room-scenario-1-0my2fq
git fetch origin main && git merge-base --is-ancestor origin/main HEAD && git push origin HEAD:main   # fast-forward فقط
```
- إن فشل الشرط الأخير (لم يعد `main` سلفًا لفرعك) فتوقف واسأل المستخدم؛ لا force-push.
- بعد الدفع انتظر ظهور الإصدار الجديد ثم اختبر الموقع الحي:
```bash
for i in $(seq 1 24); do curl -sS "https://gamosec.github.io/cybersecurity-game/?t=$i" | grep -q 'icon-lib.js?v=13' && echo live && break; sleep 15; done   # بدّل 13 برقمك
node tests/e2e.js --url https://gamosec.github.io/cybersecurity-game/ --modes desktop,phone
```

## لماذا نرفع `?v=`؟

الصفحة تُخدَم بـ `cache-control: max-age=600`، والهواتف تتمسك بالنسخ القديمة من JS/CSS. بدون تغيير الوسم يرى المستخدم نسخة قديمة وقد يبلغ عن أخطاء أُصلحت. رقم واحد موحَّد لكل الوسوم.

## استكشاف الأخطاء

| العَرَض | الاحتمال |
|---|---|
| الموقع لا يتغيّر بعد الدفع | انتظر دقيقتين؛ تأكد أن الدفع وصل لـ `main`؛ حدّث بـ Ctrl+F5؛ جرّب `?t=1` في الرابط |
| 404 لملف جديد | لم يُنشر بعد، أو لم تُضِف وسمه في index.html |
| Pages لا يعمل نهائيًا | المستودع يجب أن يكون **عامًا** (الخطة المجانية)، والإعداد: Settings → Pages → `main` / root |
| الاختبار يفشل بـ "Playwright غير موجود" | `npm i -D playwright` أو استخدم بيئة الجلسة السحابية (مثبّت عالميًا) |
| "Executable doesn't exist" | لا تنفّذ `playwright install`؛ في البيئة السحابية المتصفح موجود في `/opt/pw-browsers` |

## ملاحظات بيئة الجلسات السحابية

- لا يوجد `gh` CLI؛ لأي تعامل مع GitHub (PR، قراءة، تعليق) استخدم أدوات `mcp__github__*` (حمّلها بـ ToolSearch). التفويض محصور بهذا المستودع.
- لا تنشئ PR إلا إن طلب المستخدم.
- مجلد الـ scratchpad مؤقت؛ ما يستحق البقاء يوضع في المستودع (`tests/`, `tools/`, `docs/`).
- حالات `git push` الفاشلة لشبكة: أعد المحاولة حتى 4 مرات بتأخير 2/4/8/16 ثانية.
