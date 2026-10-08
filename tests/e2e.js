#!/usr/bin/env node
/*
 * اختبار شامل في متصفح حقيقي (Playwright): node tests/e2e.js [--url <عنوان>] [--only id1,id2] [--modes desktop,phone] [--shots <مجلد>]
 *
 * يلعب كل سيناريو ومهمة (تُكتشف تلقائيًا من سجل السيناريوهات) مرتين: مسار صحيح ومسار خاطئ،
 * على الحاسوب والهاتف (عمودي)، بنقرات حقيقية على العناصر (تتحقق Playwright من إمكانية النقر الفعلية)،
 * وتتأكد من: الحكم الصحيح على كل إجابة، النتيجة النهائية، مؤقت انتهاء الوقت، لا أخطاء في الصفحة.
 * الافتراضي: يفتح index.html المحلي. للموقع المنشور: --url https://gamosec.github.io/cybersecurity-game/
 * المتطلب: Playwright (npm i -D playwright) أو متوفر عالميًا كما في بيئة الجلسات السحابية.
 */
'use strict';
const path = require('path');
const fs = require('fs');

function loadPlaywright() {
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright'];
  for (const t of tries) { try { return require(t); } catch (e) { /* التالي */ } }
  console.error('Playwright غير موجود. ثبّته: npm i -D playwright'); process.exit(2);
}
const { chromium, devices } = loadPlaywright();

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d; };
const URL = arg('url', 'file://' + path.join(__dirname, '..', 'index.html'));
const ONLY = arg('only', '') ? arg('only').split(',') : null;
const MODES = arg('modes', 'desktop,phone').split(',');
const SHOTS = arg('shots', '');
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
const failures = [];
function check(cond, label) {
  if (cond) { pass++; return; }
  fail++; failures.push(label); console.log('  ✗ ' + label);
}

async function newPage(browser, mode) {
  const ctx = mode === 'phone' ? await browser.newContext({ ...devices['Pixel 7'] }) : await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  page.errs = [];
  page.on('pageerror', (e) => page.errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.errs.push(m.text()); });
  await page.goto(URL);
  await page.waitForSelector('.scenario-card');
  return { ctx, page };
}

const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png') }); };
const clickIn = async (loc) => { await loc.scrollIntoViewIfNeeded(); await loc.click({ timeout: 8000 }); };

/* ---------- سيناريوهات الغرفة ---------- */
async function playRoom(browser, mode, sc, path_) {
  const tag = `${sc.id}/${mode}/${path_}`;
  const { ctx, page } = await newPage(browser, mode);
  await page.click(`.scenario-card[data-id="${sc.id}"]`);
  await page.click('#btn-start');
  await page.waitForSelector('.hotspot');
  for (let i = 0; i < sc.challenges.length; i++) {
    const c = sc.challenges[i];
    await clickIn(page.locator(`[data-hotspot="${c.id}"] .hit`).first());
    await page.waitForSelector('#popup:not([hidden]) .opt');
    const right = c.options.map((o, k) => o.correct ? k : -1).filter((k) => k >= 0);
    const wrong = c.options.map((o, k) => o.correct ? -1 : k).filter((k) => k >= 0);
    const picks = path_ === 'pass' ? right : (wrong.length ? [wrong[0]] : [right[0]]);
    check(await page.locator('#popup-options .opt-ic svg').count() === c.options.length, `${tag}: ${c.id} بعض الخيارات بلا أيقونة`);
    for (const k of picks) await clickIn(page.locator(`#popup-options input[value="${k}"] + .opt-card`));
    if (i === 0) await shot(page, tag.replace(/\//g, '-') + '-popup');
    await page.click('#popup-confirm');
    await page.waitForSelector('#modal:not([hidden])');
    const head = (await page.textContent('#modal-title')).trim();
    const verdictOk = path_ === 'pass' ? head.includes('أحسنت') : head.includes('غير صحيحة');
    check(verdictOk, `${tag}: تحدي ${c.id} حكمه "${head}"`);
    await page.click('#modal-close');
    await page.waitForTimeout(120);
  }
  await page.waitForSelector('#screen-results.active');
  const correct = (await page.textContent('#r-correct')).replace(/\s/g, '');
  check(correct === (path_ === 'pass' ? `${sc.challenges.length}/${sc.challenges.length}` : `0/${sc.challenges.length}`), `${tag}: الإجابات الصحيحة "${correct}"`);
  const title = (await page.textContent('#results-title')).trim();
  check(path_ === 'pass' ? title.includes('تهانينا') : !title.includes('تهانينا'), `${tag}: عنوان النتيجة "${title}"`);
  await shot(page, tag.replace(/\//g, '-') + '-result');
  check(page.errs.length === 0, `${tag}: أخطاء الصفحة ${JSON.stringify(page.errs)}`);
  await ctx.close();
}

async function timeUpRoom(browser, sc) {
  const { ctx, page } = await newPage(browser, 'desktop');
  await page.evaluate((id) => { CyberEscape.getScenario(id).timeLimit = 2; }, sc.id);
  await page.click(`.scenario-card[data-id="${sc.id}"]`);
  await page.click('#btn-start');
  await page.waitForSelector('#modal:not([hidden])', { timeout: 6000 });
  check((await page.textContent('#modal-title')).includes('انتهى الوقت'), `${sc.id}: نافذة انتهاء الوقت`);
  await page.click('#modal-close');
  await page.waitForSelector('#screen-results.active');
  check(true, 'ok');
  await ctx.close();
}

/* ---------- المهام ---------- */
async function playMission(browser, mode, sc, path_) {
  const tag = `${sc.id}/${mode}/${path_}`;
  const { ctx, page } = await newPage(browser, mode);
  await page.click(`.scenario-card[data-id="${sc.id}"]`);
  await page.click('#btn-start');
  await page.click('#m-brief-next');
  const intro = await page.textContent('.m-card');
  check(!/(باللون|الجهاز الأحمر|الجهاز الأزرق)/.test(intro), `${tag}: نص المقدمة يكشف لون المحطة`);
  await page.click('#m-ti-next');

  // محطة تمويه، ثم محطة الفريق الآخر مبكرًا، ثم تلميحان
  await clickIn(page.locator('[data-station="decoy"] .hit').first());
  check((await page.textContent('#m-toast')).includes('ليست محطة عمل'), `${tag}: رسالة محطة التمويه`);
  await clickIn(page.locator('[data-station="blue"] .hit'));
  check((await page.textContent('#m-toast')).includes('أولًا'), `${tag}: رسالة الفريق الآخر قبل أوانه`);
  await page.click('#m-hint');
  check((await page.textContent('#m-toast')).includes('تلميح'), `${tag}: التلميح الأول`);
  await page.click('#m-hint');
  check(await page.locator('[data-station="red"].m-pulse').count() > 0, `${tag}: التلميح الثاني يومض على المحطة`);
  await shot(page, tag.replace(/\//g, '-') + '-scene');

  for (const team of ['red', 'blue']) {
    await clickIn(page.locator(`[data-station="${team}"] .hit`));
    await page.waitForSelector('#m-mail-go');
    await shot(page, tag.replace(/\//g, '-') + '-' + team + '-email');
    await page.click('#m-mail-go');
    const chs = sc.teams[team].challenges;
    for (let i = 0; i < chs.length; i++) {
      const c = chs[i];
      await page.waitForSelector('.m-opt');
      check(await page.locator('.m-opt-ic svg').count() === c.options.length, `${tag}: ${team}:${c.id} بعض الخيارات بلا أيقونة`);
      const right = c.options.map((o, k) => o.correct ? k : -1).filter((k) => k >= 0);
      const wrong = c.options.map((o, k) => o.correct ? -1 : k).filter((k) => k >= 0);
      const picks = path_ === 'pass' ? right : (team === 'red' ? [wrong[0]] : [right[0]]);
      for (const k of picks) await clickIn(page.locator(`.m-opt[data-i="${k}"]`));
      if (i === 0) await shot(page, tag.replace(/\//g, '-') + '-' + team + '-q1');
      await page.click('#m-send');
      await page.waitForSelector('#m-fb-next');
      const head = (await page.textContent('.m-card-head')).trim();
      const ok = path_ === 'pass' ? head.includes('صحيحة!') : head.includes('غير صحيحة');
      check(ok, `${tag}: ${team}:${c.id} حكمه "${head}"`);
      await page.click('#m-fb-next');
    }
    if (team === 'red') await page.click('#m-sw-next');
  }
  await page.waitForSelector('.m-res-title');
  const title = (await page.textContent('.m-res-title')).trim();
  check(path_ === 'pass' ? title.includes('نجحت') : title.includes('لم تكتمل'), `${tag}: عنوان النتيجة "${title}"`);
  if (path_ === 'fail') check(await page.locator('.m-review li').count() === sc.teams.red.challenges.length + sc.teams.blue.challenges.length, `${tag}: مراجعة الإجابات`);
  await shot(page, tag.replace(/\//g, '-') + '-result');
  check(page.errs.length === 0, `${tag}: أخطاء الصفحة ${JSON.stringify(page.errs)}`);
  await ctx.close();
}

/* ---------- الرحلات (journey) ---------- */
async function playJourney(browser, mode, sc, path_) {
  const tag = `${sc.id}/${mode}/${path_}`;
  const { ctx, page } = await newPage(browser, mode);
  await page.click(`.scenario-card[data-id="${sc.id}"]`);
  await page.click('#btn-start');
  await page.click('#j-go');
  const pass = path_ === 'pass';
  for (let i = 0; i < sc.scenes.length; i++) {
    const c = sc.scenes[i];
    await page.waitForFunction((cap) => document.querySelector('#j-chip') && document.querySelector('#j-chip').textContent === cap, c.caption, { timeout: 8000 });
    await page.waitForTimeout(i ? 2300 : 600);
    await shot(page, tag.replace(/\//g, '-') + '-s' + (i + 1) + '-world');
    if (c.kind === 'items') {
      const picks = pass ? c.items.filter((it) => it.take) : [c.items.find((it) => it.take)];
      for (const it of picks) await clickIn(page.locator(`[data-item="${it.id}"] .hit`));
      await clickIn(page.locator('#j-dock-send'));
    } else {
      await clickIn(page.locator(`[data-focus="${c.focus}"] .hit`).first());
      if (c.kind === 'choice') {
        await page.waitForSelector('.j-opt');
        check(await page.locator('.j-opt svg').count() >= c.options.length, `${tag}: ${c.id} خيارات بلا أيقونة`);
        const idx = c.options.map((o, k) => (!!o.correct === pass ? k : -1)).filter((k) => k >= 0);
        for (const k of (pass ? idx : [idx[0]])) await clickIn(page.locator(`.j-opt[data-i="${k}"]`));
        await shot(page, tag.replace(/\//g, '-') + '-s' + (i + 1) + '-choice');
      } else {
        await page.waitForSelector('.j-net');
        const k = c.networks.findIndex((n) => !!n.trusted === pass);
        await clickIn(page.locator(`.j-net[data-i="${k}"]`));
        if (pass) await clickIn(page.locator('#j-vpn'));
        await shot(page, tag.replace(/\//g, '-') + '-s' + (i + 1) + '-wifi');
      }
      await clickIn(page.locator('#j-send'));
    }
    await page.waitForSelector('#j-next');
    const head = (await page.textContent('.j-fb .modal-title')).trim();
    check(pass ? head.includes('أحسنت') : !head.includes('أحسنت'), `${tag}: ${c.id} حكمه "${head}"`);
    await clickIn(page.locator('#j-next'));
  }
  await page.waitForFunction(() => document.getElementById('screen-results').classList.contains('active') || getComputedStyle(document.getElementById('screen-results')).display !== 'none', null, { timeout: 8000 });
  const title = (await page.textContent('#results-title')).trim();
  check(pass ? title.includes('تهانينا') : title.includes('حاول'), `${tag}: عنوان النتيجة "${title}"`);
  await shot(page, tag.replace(/\//g, '-') + '-result');
  check(page.errs.length === 0, `${tag}: أخطاء الصفحة ${JSON.stringify(page.errs)}`);
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  const probe = await newPage(browser, 'desktop');
  const scenarios = await probe.page.evaluate(() => CyberEscape.scenarios.filter((s) => !s.comingSoon).map((s) => JSON.parse(JSON.stringify(s, (k, v) => typeof v === 'function' ? undefined : v))));
  const cards = await probe.page.locator('.scenario-card:not(.locked)').count();
  check(cards === scenarios.length, `القائمة تعرض ${cards} بطاقة من ${scenarios.length}`);
  await shot(probe.page, 'menu');
  await probe.ctx.close();

  const list = scenarios.filter((s) => !ONLY || ONLY.includes(s.id));
  for (const sc of list) {
    process.stdout.write(`• ${sc.id} (${sc.type === 'mission' ? 'مهمة' : sc.type === 'journey' ? 'رحلة' : 'غرفة'}) `);
    const before = fail;
    for (const mode of MODES) for (const p of ['pass', 'fail']) {
      if (sc.type === 'mission') await playMission(browser, mode, sc, p); else if (sc.type === 'journey') await playJourney(browser, mode, sc, p); else await playRoom(browser, mode, sc, p);
    }
    if (sc.type === 'room' || !sc.type) await timeUpRoom(browser, sc);
    console.log(fail === before ? '✓' : '✗');
  }
  await browser.close();
  console.log(`\n${pass} فحصًا ناجحًا، ${fail} فاشلًا`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('انهار الاختبار:', e.message); process.exit(2); });
