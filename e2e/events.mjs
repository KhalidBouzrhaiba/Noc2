// Event flow in the development simulation (run against `npm run dev`).
import { chromium } from './pw.mjs';
import { caseById } from '../src/content/index.js';
import { tr } from '../src/core/i18n.js';
import { UI } from '../src/core/locales/ui.js';
import { EV } from '../src/core/locales/events.js';

const base = process.argv[2] ?? 'http://localhost:5175/';
const en = (v) => tr(v, 'en');
const out = [];
const check = (n, ok, x = '') => out.push(`${ok ? 'PASS' : 'FAIL'}  ${n}${x ? ' — ' + x : ''}`);
const A = caseById('broadcast');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.addInitScript(() => {
  if (!localStorage.getItem('noctaviae:settings')) localStorage.setItem('noctaviae:settings', JSON.stringify({ locale: 'en', sound: false, motion: 'reduced' }));
});

// Organizer
await page.goto(base + '#/admin');
check('dev mode is clearly labelled', (await page.locator('.devbanner').innerText()).includes('DEVELOPMENT'));
await page.getByLabel(en(EV.adEmail)).fill('organizer@example.com');
await page.getByRole('button', { name: en(EV.adSignInBtn) }).click();
await page.getByRole('button', { name: en(EV.adNew) }).click();
await page.getByLabel(en(EV.adName)).fill('Halloween Night');
await page.getByLabel(en(EV.adCode)).fill('HOLLOW31');
await page.locator('.admin__form .check', { hasText: en(caseById('harvest').title) }).click();
await page.locator('.admin__form .check', { hasText: en(caseById('house').title) }).click();
await page.getByRole('button', { name: en(EV.adSave) }).click();
await page.waitForSelector('.admin__detail');
check('event created as draft', (await page.locator('.admin__detail .badge').first().innerText()) === en(EV.status_draft));
const actions = await page.locator('.admin__detail .row').first().locator('button').allInnerTexts();
check('only valid transitions offered from draft', actions.includes(en(EV.adTo_open)) && !actions.includes(en(EV.adTo_completed)));
await page.getByRole('button', { name: en(EV.adTo_open) }).click();
await page.locator('dialog[open].confirm .btn--danger').click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: en(EV.adTo_active) }).click();
await page.locator('dialog[open].confirm .btn--danger').click();
await page.waitForTimeout(300);
check('event is active', (await page.locator('.admin__detail .badge').first().innerText()) === en(EV.status_active));

// Player
await page.getByRole('button', { name: en(UI.menuToTitle) }).click();
await page.getByRole('button', { name: en(UI.titleEvents) }).click();
await page.getByLabel(en(EV.code)).fill('nope');
await page.getByLabel(en(EV.name)).fill('Amal');
await page.getByRole('button', { name: en(EV.join), exact: true }).click();
check('invalid code is refused with a message', (await page.locator('.events__form .feedback--wrong').innerText()).length > 0);
await page.getByLabel(en(EV.code)).fill('hollow31');
await page.getByRole('button', { name: en(EV.join), exact: true }).click();
await page.waitForSelector('.events__hub');
check('hub shows only allowed cases', (await page.locator('.events__cases .file').count()) === 1);
await page.getByRole('button', { name: en(EV.play) }).click();
await page.getByRole('button', { name: en(UI.skip) }).click();
await page.getByRole('button', { name: en(UI.revealEnter) }).click();
check('event strip visible in game', (await page.locator('.eventstrip').innerText()).includes('Amal'));
const objName = (id) => en(A.objects.find((o) => o.id === id).name);
const visit = async (loc) => {
  await page.locator('.dock').getByRole('button', { name: en(UI.navMap), exact: true }).click();
  await page.locator('.map__row', { hasText: en(A.locations.find((l) => l.id === loc).name) }).click();
};
const touch = async (id) => {
  await page.locator('.here__list .chip', { hasText: objName(id) }).first().click();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
};
await touch('st_log');
await visit('police');
await touch('po_access');
await visit('market');
await touch('sm_receipt');
await page.waitForTimeout(800);
check('actions sync to the event', (await page.locator('.eventstrip').innerText()).includes(en(EV.syncOk)));

// Server-first hint purchase
await page.locator('.dock').getByRole('button', { name: en(UI.navNoctaviae), exact: true }).click();
await page.locator('.tea__topics .option').first().click();
await page.locator('.level').first().getByRole('button').click();
await page.getByRole('button', { name: en(UI.hintYes) }).click();
await page.waitForSelector('.level--bought');
check('event hint delivered after server confirmation', (await page.locator('.level--bought').count()) === 1);
await page.keyboard.press('Escape');

// Pause: actions are queued, not lost; resume flushes them
const ls = async () => page.evaluate(() => JSON.parse(localStorage.getItem('noctaviae:devsim')));
let db = await ls();
db.events[0].status = 'paused';
await page.evaluate((d) => localStorage.setItem('noctaviae:devsim', JSON.stringify(d)), db);
await visit('police');
await touch('po_report');
await page.waitForTimeout(600);
const strip = await page.locator('.eventstrip').innerText();
check('paused event: action kept in the queue', strip.includes(en(EV.syncError)) || /waiting to sync/.test(strip), strip.replace(/\n/g, ' | '));
db = await ls();
check('paused event: nothing recorded server-side', !db.claims.some((c) => c.reward_id === 'clue:report'));

// Back to the hub: official score from the server
await page.getByRole('button', { name: en(UI.menu) }).first().click();
await page.getByRole('button', { name: en(UI.menuToCases) }).click();
await page.waitForSelector('.events__hub');
check('hub shows the paused status message', (await page.locator('.events__hub').innerText()).includes(en(EV.err_event_paused)));
const lbText = await page.locator('.lb').innerText();
check('leaderboard lists the player', lbText.includes('Amal') && lbText.includes(en(EV.lbYou)));
check('leaderboard explains the tie-break', lbText.includes(en(EV.lbTieRule)));

// Organizer: resume, inspect members, export, reset
await page.goto(base + '#/admin');
await page.locator('.admin__events .map__row').first().click();
await page.getByRole('button', { name: en(EV.adTo_active) }).click();
await page.locator('dialog[open].confirm .btn--danger').click();
await page.waitForTimeout(400);
check('members table shows the participant', (await page.locator('.admin__detail table').first().innerText()).includes('Amal'));
const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: en(EV.adExport) }).click()]);
const csv = await (await download.createReadStream()).toArray().then((b) => Buffer.concat(b).toString('utf8'));
check('CSV export contains only authorized columns', csv.includes('rank,display_name,score,cases_completed') && csv.includes('Amal') && !/user_id|member_id|@/.test(csv));
await page.locator('.admin__detail table').first().getByRole('button', { name: en(EV.adReset) }).click();
await page.locator('dialog[open].confirm .btn--danger').click();
await page.waitForTimeout(400);
const audit = await page.locator('.admin__audit').innerText();
check('audit records consequential actions', ['event_created', 'status_changed', 'member_joined', 'member_reset', 'results_exported'].every((a) => audit.includes(a)));
check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
await browser.close();
console.log(out.join('\n'));
const failed = out.filter((x) => x.startsWith('FAIL')).length;
console.log(`\n${out.length - failed}/${out.length} checks passed`);
process.exit(failed ? 1 : 0);
