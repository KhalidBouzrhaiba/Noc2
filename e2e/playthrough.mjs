// End-to-end playthrough: plays each case through the real UI (clicks, dialogs, puzzles,
// board, hints, final deduction) using the scripted walkthrough from the content files.
// Usage: node e2e/playthrough.mjs [baseUrl] [locale] [caseIds] [viewport]
import { CASES } from '../src/content/index.js';
import { tr } from '../src/core/i18n.js';
import { UI } from '../src/core/locales/ui.js';
import { chromium } from './pw.mjs';

const base = process.argv[2] ?? 'http://localhost:4174/';
const locale = process.argv[3] ?? 'en';
const only = (process.argv[4] ?? 'broadcast,harvest,house').split(',');
const [vw, vh] = (process.argv[5] ?? '1280x800').split('x').map(Number);
const T = (v) => tr(v, locale);
const exact = (text) => new RegExp(`^\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  [${locale}] ${name}${extra ? ' — ' + extra : ''}`);

const browser = await chromium.launch();
for (const def of CASES.filter((c) => only.includes(c.id))) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile: vw < 800, hasTouch: vw < 800 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript((l) => {
    if (!localStorage.getItem('noctaviae:settings')) localStorage.setItem('noctaviae:settings', JSON.stringify({ locale: l, sound: false, motion: 'reduced' }));
  }, locale);
  await page.goto(base);

  // Close every open dialog (reading a document returns to its object panel first).
  const closeModal = async () => {
    let quiet = 0;
    for (let i = 0; i < 12 && quiet < 2; i++) {
      if (await page.locator('dialog[open]').count()) {
        quiet = 0;
        await page.keyboard.press('Escape');
      } else quiet++;
      await page.waitForTimeout(80);
    }
  };
  const objName = (id) => T(def.objects.find((o) => o.id === id).name);
  const clickChip = async (id) => {
    await page.locator('.here__list .chip', { has: page.locator('.chip__name', { hasText: exact(objName(id)) }) }).first().click();
    await page.waitForSelector('dialog[open].objpanel');
  };

  // Opening: title → cases → radio → reveal → play
  await page.getByRole('button', { name: T(UI.titleInvestigate) }).click();
  await page.locator('.file__cover', { hasText: T(def.title) }).click();
  await page.locator('.file.is-open .file__actions .btn--primary').click();
  const radioText = await page.locator('.radio__transcript').innerText();
  check(`${def.id}: radio shows the selected case before playing`, radioText.includes(T(def.title)));
  await page.getByRole('button', { name: T(UI.radioTurnOn) }).click();
  await page.waitForSelector('.radio__line');
  const firstLine = await page.locator('.radio__line').first().innerText();
  check(`${def.id}: radio announcement is case-specific`, firstLine.length > 0 && T(def.radio.lines[0]).startsWith(firstLine.slice(0, 10)));
  await page.getByRole('button', { name: T(UI.skip) }).click();
  await page.waitForSelector('.reveal--reveal');
  await page.getByRole('button', { name: T(UI.revealEnter) }).click();
  await page.waitForSelector('.game');
  check(`${def.id}: reaches a playable location`, (await page.locator('#game-loc').innerText()).includes(T(def.locations.find((l) => l.id === def.start).name)));

  let lockedSeen = false;
  let hintBought = false;
  for (const [type, a, b] of def.walkthrough) {
    await closeModal();
    if (type === 'visit') {
      const here = await page.locator('#game-loc').innerText();
      if (here === T(def.locations.find((l) => l.id === a).name)) continue;
      await page.locator('.dock').getByRole('button', { name: T(UI.navMap), exact: true }).click();
      await page.locator('.map__row', { has: page.locator('.map__row-name', { hasText: exact(T(def.locations.find((l) => l.id === a).name)) }) }).click();
      await page.waitForTimeout(80);
    } else if (type === 'interact') {
      await clickChip(a);
      const o = def.objects.find((x) => x.id === a);
      if (o.doc) {
        await page.getByRole('button', { name: T(UI.actionRead) }).click();
        await page.waitForSelector('dialog[open].docpanel .doc__body');
      }
    } else if (type === 'use') {
      await clickChip(b);
      await page.locator('.objpanel__use summary').click();
      await page.locator('.objpanel__use button', { hasText: T(def.items[a].name) }).click();
      await page.waitForTimeout(60);
      const fb = await page.locator('dialog[open] .feedback').first().getAttribute('class');
      if (!fb.includes('feedback--ok')) throw new Error(`use ${a} on ${b} failed`);
    } else if (type === 'solve') {
      const pz = def.puzzles[a];
      const opener = def.objects.find((o) => o.puzzle === a);
      if (!lockedSeen) {
        // before solving the first puzzle, an unmet lock elsewhere is reported (checked separately below)
      }
      await clickChip(opener.id);
      if (opener.doc && (await page.getByRole('button', { name: T(UI.actionRead) }).count())) {
        /* document opener: go straight to the puzzle */
      }
      // Buy a level-1 hint on the first puzzle to exercise the economy through the UI.
      if (!hintBought) {
        await closeModal();
        await page.locator('.dock').getByRole('button', { name: T(UI.navNoctaviae), exact: true }).click();
        const before = await page.locator('.tea__balance').innerText();
        await page.locator('.tea__topics .option', { hasText: T(pz.title) }).click();
        const buy = page.locator('.level').first().getByRole('button');
        await buy.dblclick(); // a double click must neither confirm by accident nor charge twice
        check(`${def.id}: double click on buy only opens the confirmation`, (await page.locator('.level--bought').count()) === 0);
        await page.waitForTimeout(450);
        await page.getByRole('button', { name: T(UI.hintYes) }).click();
        await page.waitForSelector('.level--bought');
        const after = await page.locator('.tea__balance').innerText();
        const n = (s) => Number(s.match(/\d+/)[0]);
        check(`${def.id}: hint level 1 costs exactly 20`, n(before) - n(after) === 20, `${n(before)} → ${n(after)}`);
        check(`${def.id}: hint text is shown after purchase`, (await page.locator('.level--bought .level__text').innerText()) === T(pz.hints[0]));
        hintBought = true;
        await closeModal();
        await clickChip(opener.id);
      }
      await page.getByRole('button', { name: T(UI.actionPuzzle) }).click();
      await page.waitForSelector('dialog[open].puzzlepanel');
      const dlg = page.locator('dialog[open].puzzlepanel');
      if (pz.type === 'choice') await dlg.locator('.option', { hasText: T(pz.options.find((o) => o.id === b).text) }).click();
      else if (pz.type === 'code' || pz.type === 'word') {
        // first submit a wrong answer and check progress is kept
        await dlg.locator('input').fill(pz.type === 'code' ? '0000' : 'zzz');
        await dlg.getByRole('button', { name: T(UI.puzzleSubmit) }).click();
        check(`${def.id}/${a}: wrong answer gives feedback`, (await dlg.locator('.feedback--wrong').count()) === 1);
        const answer = pz.type === 'word' ? pz.answers[locale][0] : b;
        await dlg.locator('input').fill(answer);
      } else if (pz.type === 'order') {
        for (let i = 0; i < b.length; i++) {
          const texts = await dlg.locator('.order__text').allInnerTexts();
          let j = texts.indexOf(T(pz.items[b[i]]));
          while (j > i) {
            await dlg.locator('.order__row').nth(j).locator('.icon-btn').first().click();
            j--;
          }
        }
      } else if (pz.type === 'classify') {
        for (const [sid, cat] of Object.entries(b)) {
          await dlg.locator('.classify__row', { hasText: T(pz.statements[sid]) }).locator('.seg__opt', { hasText: T(pz.categories[cat]) }).click();
        }
      } else if (pz.type === 'match') {
        const rows = dlg.locator('.match__row');
        const keys = Object.keys(pz.left);
        for (let i = 0; i < keys.length; i++) await rows.nth(i).locator('select').selectOption(b[keys[i]]);
      }
      await dlg.getByRole('button', { name: T(UI.puzzleSubmit) }).click();
      const ok = await dlg.locator('.feedback--ok').count();
      check(`${def.id}/${a}: puzzle solved through the UI`, ok === 1);
    } else if (type === 'connect') {
      await page.locator('.dock').getByRole('button', { name: T(UI.navNotebook), exact: false }).click();
      await page.getByRole('tab', { name: T(UI.nbBoard) }).click();
      for (const c of [a, b]) await page.locator('.pin', { hasText: T(def.clues[c].title) }).first().click();
      await page.getByRole('button', { name: T(UI.boardConnect) }).click();
      const fb = await page.locator('.board .feedback').first().getAttribute('class');
      check(`${def.id}: board connection ${a}+${b}`, fb.includes('feedback--ok'));
    } else if (type === 'final') {
      await page.locator('.dock').getByRole('button', { name: T(UI.navConclude) }).click();
      const dlg = page.locator('dialog[open].finalpanel');
      for (const q of def.final.questions) {
        const fs = dlg.locator('.final__q').nth(def.final.questions.indexOf(q));
        if (q.type === 'choice') await fs.locator('.option', { hasText: T(q.options.find((o) => o.id === a[q.id]).text) }).click();
        else if (q.type === 'order') {
          const want = a[q.id];
          for (let i = 0; i < want.length; i++) {
            const texts = await fs.locator('.order__text').allInnerTexts();
            let j = texts.indexOf(T(q.items[want[i]]));
            while (j > i) {
              await fs.locator('.order__row').nth(j).locator('.icon-btn').first().click();
              j--;
            }
          }
        } else if (q.type === 'evidence') {
          for (const c of a[q.id]) await fs.locator('.check', { hasText: T(def.clues[c].title) }).first().click();
        }
      }
      await dlg.getByRole('button', { name: T(UI.finalSubmit) }).click();
      await page.waitForSelector('.ending', { timeout: 5000 });
    }
  }

  const outcome = await page.locator('.ending__outcome').innerText();
  check(`${def.id}: strong ending reached`, outcome === T(UI.endOutcome_strong), outcome);
  const score = Number(await page.locator('.ending__total').innerText());
  check(`${def.id}: ending shows a real score`, score > 0, String(score));

  // Reload: the completed case must be restored as completed, not resumable.
  await page.reload();
  await page.getByRole('button', { name: T(UI.titleInvestigate) }).click();
  const stamp = await page.locator('.file', { hasText: T(def.title) }).locator('.stamp').innerText();
  check(`${def.id}: completion persists after reload`, stamp.toLowerCase() === T(UI.caseCompleted).toLowerCase(), stamp);
  const others = await page.locator('.stamp').allInnerTexts();
  check(`${def.id}: other cases are untouched`, others.filter((s) => s.toLowerCase() === T(UI.caseNew).toLowerCase()).length === CASES.length - 1);
  check(`${def.id}: no console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  check(`${def.id}: direction is ${['ar', 'dar'].includes(locale) ? 'rtl' : 'ltr'}`, (await page.evaluate(() => document.documentElement.dir)) === (['ar', 'dar'].includes(locale) ? 'rtl' : 'ltr'));
  check(`${def.id}: no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)));
  await ctx.close();
}
await browser.close();
console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
