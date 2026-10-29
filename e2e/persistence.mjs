// Browser checks for save/resume, replay isolation, corrupted-save recovery and
// language switching of an already purchased hint.
import { CASES, caseById } from '../src/content/index.js';
import { tr } from '../src/core/i18n.js';
import { UI } from '../src/core/locales/ui.js';
import { chromium } from './pw.mjs';

const base = process.argv[2] ?? 'http://localhost:4174/';
const out = [];
const check = (n, ok, x = '') => out.push(`${ok ? 'PASS' : 'FAIL'}  ${n}${x ? ' — ' + x : ''}`);
const A = caseById('broadcast');
const en = (v) => tr(v, 'en');
const fr = (v) => tr(v, 'fr');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => {
  if (!localStorage.getItem('noctaviae:settings')) localStorage.setItem('noctaviae:settings', JSON.stringify({ locale: 'en', sound: false, motion: 'reduced' }));
});
await page.goto(base);
check('no Continue button without saved progress', (await page.getByRole('button', { name: en(UI.titleContinue) }).count()) === 0);

// Start case A and make some progress
await page.getByRole('button', { name: en(UI.titleInvestigate) }).click();
await page.locator('.file__cover', { hasText: en(A.title) }).click();
await page.locator('.file.is-open .file__actions .btn--primary').click();
await page.getByRole('button', { name: en(UI.skip) }).click();
await page.getByRole('button', { name: en(UI.revealEnter) }).click();
for (const id of ['st_log', 'st_tape']) {
  await page.locator('.here__list .chip', { hasText: en(A.objects.find((o) => o.id === id).name) }).click();
  await page.keyboard.press('Escape');
}
await page.locator('.dock').getByRole('button', { name: en(UI.navMap), exact: true }).click();
await page.locator('.map__row', { hasText: en(A.locations.find((l) => l.id === 'police').name) }).click();
const scoreBefore = await page.locator('.hud__stats dd').first().innerText();

// Reload → Continue → same place and evidence, no double rewards
await page.reload();
check('Continue appears after reload', (await page.getByRole('button', { name: en(UI.titleContinue) }).count()) === 1);
await page.getByRole('button', { name: en(UI.titleContinue) }).click();
check('resume restores the location', (await page.locator('#game-loc').innerText()) === en(A.locations.find((l) => l.id === 'police').name));
check('resume restores the score without duplicates', (await page.locator('.hud__stats dd').first().innerText()) === scoreBefore, scoreBefore);
const chipAccess = () => page.locator('.here__list .chip', { hasText: en(A.objects.find((o) => o.id === 'po_access').name) });
await chipAccess().click();
await page.keyboard.press('Escape');
const s1 = await page.locator('.hud__stats dd').first().innerText();
await page.reload();
await page.getByRole('button', { name: en(UI.titleContinue) }).click();
await chipAccess().click();
await page.keyboard.press('Escape');
const s2 = await page.locator('.hud__stats dd').first().innerText();
check('re-opening an object after reload does not re-award', s1 === s2 && Number(s1) > Number(scoreBefore), `${scoreBefore} → ${s1} → ${s2}`);

// Buy a hint in English, switch to French, the same purchased hint shows in French
await page.locator('.dock').getByRole('button', { name: en(UI.navNoctaviae), exact: true }).click();
check('no puzzle reachable yet → Noctaviae nudges toward the objective', (await page.locator('.tea__speech').count()) >= 2);
await page.keyboard.press('Escape');
for (const [loc, ids] of [['market', ['sm_receipt', 'sm_freezer']], ['police', ['po_report']]]) {
  await page.locator('.dock').getByRole('button', { name: en(UI.navMap), exact: true }).click();
  await page.locator('.map__row', { hasText: en(A.locations.find((l) => l.id === loc).name) }).click();
  for (const id of ids) {
    await page.locator('.here__list .chip', { hasText: en(A.objects.find((o) => o.id === id).name) }).click();
    await page.keyboard.press('Escape');
  }
}
await page.locator('.dock').getByRole('button', { name: en(UI.navNoctaviae), exact: true }).click();
await page.locator('.tea__topics .option', { hasText: en(A.puzzles.p_outage.title) }).click();
await page.locator('.level').first().getByRole('button').click();
await page.getByRole('button', { name: en(UI.hintYes) }).click();
const balAfter = await page.locator('.tea__balance').innerText();
check('level 3 cannot be bought before level 2', (await page.locator('.level').nth(2).getByRole('button').count()) === 0);
await page.locator('.level').nth(1).getByRole('button').click();
await page.getByRole('button', { name: en(UI.hintYes) }).click();
const bal = Number(/\d+/.exec(await page.locator('.tea__balance').innerText())[0]);
const lvl3 = page.locator('.level').nth(2);
if (bal < 50) {
  check('unaffordable level is blocked with an explanation', (await lvl3.getByRole('button').count()) === 0 && (await lvl3.innerText()).includes('50'), `balance ${bal}`);
} else {
  await lvl3.getByRole('button').click();
  await page.getByRole('button', { name: en(UI.hintYes) }).click();
}
check('balance never negative', bal >= 0, String(bal));
await page.keyboard.press('Escape');
await page.getByRole('button', { name: en(UI.menu) }).first().click();
await page.locator('dialog[open] .controls__lang', { hasText: 'FR' }).click();
await page.keyboard.press('Escape');
await page.locator('.dock').getByRole('button', { name: fr(UI.navNoctaviae), exact: true }).click();
await page.locator('.tea__topics .option', { hasText: fr(A.puzzles.p_outage.title) }).click();
const texts = await page.locator('.level--bought .level__text').allInnerTexts();
check('purchased hints display in the newly selected language', texts[0] === fr(A.puzzles.p_outage.hints[0]) && texts[1] === fr(A.puzzles.p_outage.hints[1]));
check('switching language did not charge again', Number(/\d+/.exec(await page.locator('.tea__balance').innerText())[0]) === bal);
await page.keyboard.press('Escape');

// Replay isolation: start case B, then replay A; B progress stays
await page.getByRole('button', { name: fr(UI.menu) }).first().click();
await page.getByRole('button', { name: fr(UI.menuToCases) }).click();
const B = caseById('harvest');
await page.locator('.file__cover', { hasText: fr(B.title) }).click();
await page.locator('.file.is-open .file__actions .btn--primary').click();
await page.getByRole('button', { name: fr(UI.skip) }).click();
await page.getByRole('button', { name: fr(UI.revealEnter) }).click();
await page.locator('.here__list .chip').first().click();
await page.keyboard.press('Escape');
await page.getByRole('button', { name: fr(UI.menu) }).first().click();
await page.getByRole('button', { name: fr(UI.menuToCases) }).click();
await page.locator('.file__cover', { hasText: fr(A.title) }).click();
await page.locator('.file.is-open').getByRole('button', { name: fr(UI.caseReplay) }).click();
check('replay asks for confirmation', (await page.locator('dialog[open].confirm').count()) === 1);
await page.locator('dialog[open].confirm .btn--danger').click();
await page.waitForSelector('.radio');
const saves = await page.evaluate(() => ({ a: JSON.parse(localStorage.getItem('noctaviae:case:broadcast')), b: JSON.parse(localStorage.getItem('noctaviae:case:harvest')) }));
check('replay reset case A only', saves.a.clues.length === 0 && saves.a.hints.length === 0 && saves.a.run === 2);
check('case B progress untouched by A replay', saves.b.clues.length > 0);

// Corrupted save → controlled recovery
await page.evaluate(() => localStorage.setItem('noctaviae:case:house', '{broken json'));
await page.reload();
await page.locator('.title__actions .btn--primary').click();
const C = caseById('house');
await page.locator('.file__cover', { hasText: fr(C.title) }).click();
check('unreadable save is reported, not crashed', (await page.locator('.file.is-open .stamp').innerText()).toLowerCase() === fr(UI.saveUnreadable).toLowerCase());
await page.locator('.file.is-open').getByRole('button', { name: fr(UI.saveUnreadableAction) }).click();
check('discarding offers a fresh start', (await page.locator('.file', { hasText: fr(C.title) }).locator('.stamp').innerText()).toLowerCase() === fr(UI.caseNew).toLowerCase());
check('no page errors', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(out.join('\n'));
const failed = out.filter((x) => x.startsWith('FAIL')).length;
console.log(`\n${out.length - failed}/${out.length} checks passed`);
process.exit(failed ? 1 : 0);
