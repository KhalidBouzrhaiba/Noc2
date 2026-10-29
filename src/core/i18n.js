// Locale management. Every user-facing string is a "localized value": { dar, ar, fr, en }.
// There is deliberately NO fallback to another language: a missing entry is reported
// (console + visible marker in development) and caught by the i18n audit test.

export const LOCALES = ['dar', 'ar', 'fr', 'en'];
export const LOCALE_INFO = {
  dar: { label: 'الدارجة', short: 'دارجة', dir: 'rtl', htmlLang: 'ar-MA' },
  ar: { label: 'العربية', short: 'عربية', dir: 'rtl', htmlLang: 'ar' },
  fr: { label: 'Français', short: 'FR', dir: 'ltr', htmlLang: 'fr' },
  en: { label: 'English', short: 'EN', dir: 'ltr', htmlLang: 'en' },
};

export const isLocale = (l) => LOCALES.includes(l);
export const dirOf = (locale) => LOCALE_INFO[locale]?.dir ?? 'ltr';

const reported = new Set();

/** Resolve a localized value for `locale`. Strings are returned as-is (ids, numbers). */
export function tr(value, locale) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  const text = value[locale];
  if (typeof text === 'string' && text.length > 0) return text;
  const key = `${locale}:${JSON.stringify(value).slice(0, 60)}`;
  if (!reported.has(key)) {
    reported.add(key);
    console.error(`[i18n] missing "${locale}" translation for`, value);
  }
  return `⟦${locale}?⟧`;
}

/** Interpolate {name} placeholders after resolving. */
export function fmt(value, locale, vars = {}) {
  return tr(value, locale).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Walk any data structure and return paths of localized values missing a locale. */
export function findMissing(root, path = '$', out = []) {
  if (Array.isArray(root)) {
    root.forEach((v, i) => findMissing(v, `${path}[${i}]`, out));
  } else if (root && typeof root === 'object') {
    const keys = Object.keys(root);
    const looksLocalized = keys.length > 0 && keys.some((k) => LOCALES.includes(k)) && keys.every((k) => LOCALES.includes(k));
    if (looksLocalized) {
      for (const l of LOCALES) {
        const v = root[l];
        const ok = (typeof v === 'string' && v.trim()) || (Array.isArray(v) && v.length && v.every((x) => typeof x === 'string' && x.trim()));
        if (!ok) out.push(`${path}.${l}`);
      }
    } else {
      for (const k of keys) findMissing(root[k], `${path}.${k}`, out);
    }
  }
  return out;
}

/** Shorthand used by content files: L(dar, ar, fr, en). Order matches the locale list. */
export const L = (dar, ar, fr, en) => ({ dar, ar, fr, en });
