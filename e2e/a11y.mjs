// Accessibility audit with axe-core on the main screens and dialogs (WCAG 2.1 A/AA rules).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from './pw.mjs';
import { caseById } from '../src/content/index.js';
import { act, newProgress } from '../src/game/engine.js';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const base = process.argv[2] ?? 'http://localhost:4174/';
const locales = (process.argv[3] ?? 'en,ar').split(',');
const H = caseById('harvest');
const toAction = ([type, a, b]) => (type === 'visit' ? { type, loc: a } : type === 'interact' ? { type, obj: a } : type === 'use' ? { type, item: a, obj: b } : type === 'solve' ? { type, puzzle: a, answer: b } : { type, a, b });
let p = newProgress(H, 1, null, 0);
for (const s of H.walkthrough.slice(0, -1)) p = act(H, p, toAction(s)).p;

const browser = await chromium.launch();
let total = 0;
for (const locale of locales) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  await page.addInitScript(([l, prog]) => {
    localStorage.setItem('noctaviae:guide-seen', '1');
    localStorage.setItem('noctaviae:settings', JSON.stringify({ locale: l, sound: false, motion: 'reduced' }));
    localStorage.setItem('noctaviae:case:harvest', prog);
  }, [locale, JSON.stringify(p)]);
  await page.goto(base);
  const audit = async (name) => {
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, target: v.nodes[0]?.target?.join(' '), summary: v.nodes[0]?.failureSummary?.split('\n')[1] }));
    });
    total += res.length;
    console.log(`[${locale}] ${name}: ${res.length ? res.map((v) => `${v.id}(${v.impact}) x${v.n} @ ${v.target} — ${v.summary}`).join('\n    ') : 'no violations'}`);
  };
  await audit('title');
  await page.locator('.title__actions .btn--primary').click();
  await audit('case files');
  await page.locator('.cases__head .btn--ghost').click();
  await page.locator('.title__actions .btn--secondary').click();
  await audit('game');
  for (const [i, name] of [[0, 'map'], [1, 'notebook'], [3, 'hints'], [4, 'final']]) {
    await page.locator('.dock__btn').nth(i).click();
    await audit(name);
    await page.keyboard.press('Escape');
  }
  await page.locator('.here__list .chip').first().click();
  await audit('object panel');
  await page.keyboard.press('Escape');
}
await browser.close();
console.log(`\nTotal violation types: ${total}`);
