import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LOCALE_INFO, isLocale, tr, fmt } from './i18n.js';
import { createStore, KEYS } from '../game/persistence.js';
import { audio } from './audio.js';

const SettingsCtx = createContext(null);
const store = createStore();

function detectLocale() {
  const langs = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [];
  for (const l of langs) {
    const v = String(l).toLowerCase();
    if (v.startsWith('ar-ma')) return 'dar';
    if (v.startsWith('ar')) return 'ar';
    if (v.startsWith('fr')) return 'fr';
    if (v.startsWith('en')) return 'en';
  }
  return 'en';
}

function loadSettings() {
  const res = store.read(KEYS.settings);
  const v = res.ok && res.value && typeof res.value === 'object' ? res.value : {};
  return {
    locale: isLocale(v.locale) ? v.locale : detectLocale(),
    sound: typeof v.sound === 'boolean' ? v.sound : true,
    motion: ['system', 'full', 'reduced'].includes(v.motion) ? v.motion : 'system',
  };
}

function systemReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);
  const [sysReduced, setSysReduced] = useState(systemReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return undefined;
    const on = () => setSysReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  const reducedMotion = settings.motion === 'reduced' || (settings.motion === 'system' && sysReduced);

  useEffect(() => {
    const info = LOCALE_INFO[settings.locale];
    document.documentElement.lang = info.htmlLang;
    document.documentElement.dir = info.dir;
    document.documentElement.dataset.locale = settings.locale;
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
    store.write(KEYS.settings, settings);
    audio.setEnabled(settings.sound);
  }, [settings, reducedMotion]);

  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);

  const value = useMemo(
    () => ({
      ...settings,
      reducedMotion,
      dir: LOCALE_INFO[settings.locale].dir,
      update,
      t: (v) => tr(v, settings.locale),
      f: (v, vars) => fmt(v, settings.locale, vars),
    }),
    [settings, reducedMotion, update],
  );
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error('useSettings outside provider');
  return ctx;
}
