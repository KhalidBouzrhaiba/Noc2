// Answer normalization for typed puzzle answers, applied identically in all languages.
const ARABIC_DIACRITICS = /[ً-ٰٟـ]/g; // harakat, dagger alif, tatweel

export function normalizeAnswer(s) {
  return String(s ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // Latin accents
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .toLowerCase()
    .replace(/[’'`"«»“”.,;:!?؟،()\-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove leading/trailing filler words (e.g. "rue des", "lane") listed per puzzle. */
export function stripWords(s, words = []) {
  const set = new Set(words.map(normalizeAnswer));
  return s.split(' ').filter((w) => !set.has(w)).join(' ');
}
