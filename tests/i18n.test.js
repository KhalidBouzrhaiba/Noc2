import { describe, it, expect } from 'vitest';
import { CASES } from '../src/content/index.js';
import { UI } from '../src/core/locales/ui.js';
import { findMissing, LOCALES, tr } from '../src/core/i18n.js';
import { NOCTAVIAE } from '../src/content/noctaviae.js';

// Translation audit: every localized value must have all four languages.
describe('translation audit', () => {
  it('UI strings are complete in Darija, Arabic, French and English', () => {
    expect(findMissing(UI, 'UI')).toEqual([]);
    for (const [k, v] of Object.entries(UI)) for (const l of LOCALES) expect(typeof v[l], `${k}.${l}`).toBe('string');
  });
  it('Noctaviae lines are complete', () => {
    expect(findMissing(NOCTAVIAE, 'NOCTAVIAE')).toEqual([]);
  });
  it.each(CASES.map((c) => [c.id, c]))('case %s content is complete', (_id, def) => {
    const { bible, walkthrough, ...content } = def;
    expect(findMissing(content, def.id)).toEqual([]);
  });
  it('Arabic and Darija text is actually written in Arabic script', () => {
    const arabic = /[؀-ۿ]/;
    for (const [k, v] of Object.entries(UI)) {
      if (k === 'appName' && false) continue;
      expect(arabic.test(v.ar), `UI.${k}.ar`).toBe(true);
      expect(arabic.test(v.dar), `UI.${k}.dar`).toBe(true);
    }
  });
  it('reports missing translations visibly instead of falling back to English', () => {
    const orig = console.error;
    console.error = () => {};
    expect(tr({ en: 'Hello', fr: 'Bonjour', ar: 'مرحبا' }, 'dar')).toBe('⟦dar?⟧');
    console.error = orig;
  });
});
