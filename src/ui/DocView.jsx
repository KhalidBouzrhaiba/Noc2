import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { locationById } from '../game/engine.js';

/** A discovered document, record, statement or photo, presented as paper. */
export default function DocView({ def, clueId }) {
  const { t, f } = useSettings();
  const c = def.clues[clueId];
  if (!c) return null;
  return (
    <article className={`doc doc--${c.kind} doc--${def.motif}`} aria-labelledby={`doc-${clueId}`}>
      <header className="doc__meta">
        <span className={`badge badge--${c.kind}`}>{t(UI[`kind_${c.kind}`])}</span>
        <span className={`badge badge--status-${c.status}`}>{t(UI[`status_${c.status}`])}</span>
        {c.optional && <span className="badge">{t(UI.optionalTag)}</span>}
        <span className="doc__from">{f(UI.nbFrom, { place: t(locationById(def, c.from).name) })}</span>
      </header>
      <h3 id={`doc-${clueId}`} className="doc__title">
        {t(c.title)}
      </h3>
      <p className="doc__body" dir="auto">
        {t(c.body)}
      </p>
    </article>
  );
}
