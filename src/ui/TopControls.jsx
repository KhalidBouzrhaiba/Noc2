import { useSettings } from '../core/settings.jsx';
import { LOCALES, LOCALE_INFO } from '../core/i18n.js';
import { UI } from '../core/locales/ui.js';
import { audio } from '../core/audio.js';

/** Language, sound and motion controls. Compact by design so they never dominate a scene. */
export default function TopControls({ compact = false }) {
  const { locale, sound, motion, update, t } = useSettings();
  const nextMotion = { system: 'reduced', reduced: 'full', full: 'system' }[motion];
  const motionLabel = { system: UI.motionSystem, full: UI.motionFull, reduced: UI.motionReduced }[motion];
  return (
    <div className={`controls ${compact ? 'controls--compact' : ''}`}>
      <div className="controls__langs" role="group" aria-label={t(UI.language)}>
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            lang={LOCALE_INFO[l].htmlLang}
            dir={LOCALE_INFO[l].dir}
            className="controls__lang"
            aria-pressed={locale === l}
            onClick={() => update({ locale: l })}
          >
            {LOCALE_INFO[l].short}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="controls__toggle"
        aria-pressed={sound}
        onClick={() => {
          const on = !sound;
          update({ sound: on });
          if (on) {
            audio.setEnabled(true);
            audio.unlock();
            audio.play('click');
          }
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          {sound ? <path d="M16 8c1.5 1.2 1.5 6.8 0 8M18.5 5.5c3 2.5 3 10.5 0 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /> : <path d="M16 9l5 6m0-6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
        <span className={compact ? 'sr-only' : ''}>{t(sound ? UI.soundOn : UI.soundOff)}</span>
      </button>
      <button type="button" className="controls__toggle" onClick={() => update({ motion: nextMotion })}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M3 12c3-6 6-6 9 0s6 6 9 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <span className={compact ? 'sr-only' : ''}>
          {t(UI.motion)}: {t(motionLabel)}
        </span>
      </button>
    </div>
  );
}
