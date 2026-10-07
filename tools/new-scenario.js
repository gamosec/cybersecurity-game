#!/usr/bin/env node
/*
 * مولّد هيكل سيناريو غرفة جديد:
 *   node tools/new-scenario.js <slug> <number> "<العنوان>" "<العنوان الفرعي>"
 * مثال: node tools/new-scenario.js bank 8 "أمن الخدمات المصرفية" "فرع البنك"
 *
 * ينشئ js/scenarios/scenario<number>-<slug>.js من القالب، ويضيف وسم script قبل upcoming.js،
 * ويرفع رقم ?v= في كل وسوم index.html. الناتج صالح ويجتاز check-content وe2e قبل أي تعديل.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const [slug, num, title, heading] = process.argv.slice(2);
if (!slug || !/^[a-z][a-z0-9-]*$/.test(slug) || !/^\d+$/.test(num || '') || !title || !heading) {
  console.error('الاستعمال: node tools/new-scenario.js <slug-بالإنجليزية> <رقم> "<العنوان>" "<العنوان الفرعي>"');
  process.exit(2);
}
const root = path.join(__dirname, '..');
const rel = `js/scenarios/scenario${num}-${slug}.js`;
const out = path.join(root, rel);
if (fs.existsSync(out)) { console.error('الملف موجود: ' + rel); process.exit(1); }

const esc = (s) => s.replace(/'/g, "\\'");
const src = fs.readFileSync(path.join(__dirname, 'templates', 'room-scenario.js'), 'utf8')
  .replace(/__ID__/g, slug).replace(/__NUM__/g, num).replace(/__PFX__/g, 's' + num)
  .replace(/__TITLE__/g, esc(title)).replace(/__HEADING__/g, esc(heading));
fs.writeFileSync(out, src);

const idx = path.join(root, 'index.html');
let html = fs.readFileSync(idx, 'utf8');
const anchor = /  <script src="js\/scenarios\/upcoming\.js\?v=\d+"><\/script>\n/;
if (!anchor.test(html)) { console.error('لم أجد وسم upcoming.js في index.html'); process.exit(1); }
const v = (html.match(/\?v=(\d+)/) || [0, '1'])[1];
html = html.replace(anchor, (m) => `  <script src="${rel}?v=${v}"></script>\n` + m);
html = html.replace(/\?v=\d+"/g, `?v=${Number(v) + 1}"`);
fs.writeFileSync(idx, html);

console.log('✓ أُنشئ ' + rel + '  وأُضيف إلى index.html  (?v=' + (Number(v) + 1) + ')');
console.log('التالي: 1) استبدل كل TODO  2) node tools/check-content.js  3) node tests/e2e.js --only ' + slug + '  4) راجع الصور  5) حدّث docs/ANSWER-KEY.md وREADME وSTATUS.md');
