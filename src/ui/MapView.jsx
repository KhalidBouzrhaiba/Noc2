import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { locationStatus } from '../game/engine.js';

/** Town map with restrained, meaningful indicators. Locked places cannot be travelled to. */
export default function MapView({ def, p, onTravel }) {
  const { t, f } = useSettings();
  return (
    <div className="map">
      <div className="map__paper" dir="ltr">
        <svg className="map__art" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M0 40c20-4 30 6 50 2s30-8 50-2" stroke="#9a875c" strokeWidth="1.6" fill="none" />
          <path d="M40 0c4 20-4 40 2 80M70 0c-4 30 6 50 0 80" stroke="#9a875c" strokeWidth="1.2" fill="none" />
          <path d="M10 70c10-6 20-4 26 2" stroke="#4f6b3f" strokeWidth="3" fill="none" opacity=".5" />
          <circle cx="86" cy="12" r="6" fill="none" stroke="#9a875c" strokeWidth=".6" />
          <path d="M86 6v12M80 12h12" stroke="#9a875c" strokeWidth=".6" />
        </svg>
        {def.locations.map((l) => {
          const st = locationStatus(def, p, l.id);
          const here = p.loc === l.id;
          const label = [t(l.name), here && t(UI.mapHere), !st.unlocked && t(UI.mapLocked), st.fresh && t(UI.mapFresh), st.leads && t(UI.mapLeads), st.optional && t(UI.mapOptional)]
            .filter(Boolean)
            .join(' — ');
          return (
            <button
              key={l.id}
              type="button"
              className={`map__pin ${here ? 'is-here' : ''} ${st.unlocked ? '' : 'is-locked'} ${st.visited ? 'is-visited' : ''} ${st.fresh ? 'is-fresh' : ''} ${st.leads ? 'has-leads' : ''}`}
              style={{ left: `${l.map[0]}%`, top: `${l.map[1]}%` }}
              disabled={!st.unlocked}
              aria-current={here ? 'location' : undefined}
              aria-label={st.unlocked ? `${f(UI.mapGo, { name: t(l.name) })} — ${label}` : label}
              onClick={() => onTravel(l.id)}
            >
              <span className="map__mark" aria-hidden="true">
                {st.unlocked ? '' : '🔒'}
              </span>
              <span className="map__name">{t(l.name)}</span>
              {st.optional && <span className="map__opt" aria-hidden="true">✦</span>}
            </button>
          );
        })}
      </div>
      <ul className="map__list" aria-label={t(UI.mapTitle)}>
        {def.locations.map((l) => {
          const st = locationStatus(def, p, l.id);
          const here = p.loc === l.id;
          const notes = [here && UI.mapHere, !st.unlocked && UI.mapLocked, st.fresh && UI.mapFresh, st.leads && UI.mapLeads, st.optional && UI.mapOptional, st.visited && !here && UI.mapVisited].filter(Boolean);
          return (
            <li key={l.id}>
              <button type="button" className={`map__row ${here ? 'is-here' : ''}`} disabled={!st.unlocked || here} onClick={() => onTravel(l.id)}>
                <span className="map__row-name">{t(l.name)}</span>
                <span className="map__row-notes">{notes.map((n) => t(n)).join(' · ')}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <dl className="map__legend">
        <dt className="map__key map__key--here" aria-hidden="true" />
        <dd>{t(UI.mapHere)}</dd>
        <dt className="map__key map__key--fresh" aria-hidden="true" />
        <dd>{t(UI.mapFresh)}</dd>
        <dt className="map__key map__key--leads" aria-hidden="true" />
        <dd>{t(UI.mapLeads)}</dd>
        <dt className="map__key map__key--visited" aria-hidden="true" />
        <dd>{t(UI.mapVisited)}</dd>
        <dt className="map__key map__key--locked" aria-hidden="true">🔒</dt>
        <dd>{t(UI.mapLocked)}</dd>
        <dt className="map__key map__key--opt" aria-hidden="true">✦</dt>
        <dd>{t(UI.mapOptional)}</dd>
      </dl>
    </div>
  );
}
