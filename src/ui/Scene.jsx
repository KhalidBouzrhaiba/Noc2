import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { check } from '../game/conditions.js';
import { isVisible, locationById, puzzleAvailable, stateIndex } from '../game/engine.js';
import Backdrop from '../art/Backdrops.jsx';
import { Prop, propAspect } from '../art/props.jsx';

/** Interaction state of one object, used for markers and accessible names. */
export function objectState(def, p, o) {
  const seenIdx = p.seen[o.id];
  const usable = check(o.requires, p) && (!o.puzzle || puzzleAvailable(def, p, o.puzzle));
  const solved = o.puzzle && p.solved.includes(o.puzzle);
  let tag = null;
  if (seenIdx == null) tag = usable ? 'new' : 'locked';
  else if (seenIdx < stateIndex(o, p)) tag = 'changed';
  else if (o.puzzle && !solved) tag = usable ? 'puzzle' : 'locked';
  else if (solved) tag = 'solved';
  else tag = 'seen';
  return { tag, usable, solved, optional: !!o.optional };
}

const TAG_LABEL = { new: UI.objNew, changed: UI.objChanged, seen: UI.objSeen, locked: UI.objLocked, puzzle: UI.objPuzzle, solved: UI.objSolved };

export default function Scene({ def, p, onObject, usingItem }) {
  const { t } = useSettings();
  const loc = locationById(def, p.loc);
  const objs = def.objects.filter((o) => o.loc === loc.id && isVisible(o, p));
  return (
    <section className={`scene scene--${loc.scene} ${usingItem ? 'scene--using' : ''}`} aria-labelledby="scene-title">
      <div className="scene__stage" dir="ltr">
        <Backdrop scene={loc.scene} />
        {objs.map((o) => {
          const st = objectState(def, p, o);
          const [x, y, w] = o.at;
          return (
            <button
              key={o.id}
              type="button"
              className={`hotspot hotspot--${st.tag} ${o.optional ? 'hotspot--optional' : ''}`}
              style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, aspectRatio: `1 / ${propAspect(o.prop)}` }}
              onClick={() => onObject(o)}
              aria-label={`${t(o.name)} — ${t(TAG_LABEL[st.tag])}`}
              tabIndex={-1}
            >
              <Prop name={o.prop} />
              <span className="hotspot__label" aria-hidden="true">
                {t(o.name)}
              </span>
              {(st.tag === 'new' || st.tag === 'changed') && <span className="hotspot__dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="here">
        <h2 id="scene-title" className="here__title">
          {t(loc.name)}
        </h2>
        <p className="here__desc">{t(loc.desc)}</p>
        {objs.length === 0 ? (
          <p className="muted">{t(UI.hereEmpty)}</p>
        ) : (
          <ul className="here__list" aria-label={t(UI.hereTitle)}>
            {objs.map((o) => {
              const st = objectState(def, p, o);
              return (
                <li key={o.id}>
                  <button type="button" className={`chip chip--${st.tag}`} onClick={() => onObject(o)}>
                    <span className="chip__name">{t(o.name)}</span>
                    <span className="chip__tag">{t(TAG_LABEL[st.tag])}</span>
                    {o.optional && <span className="chip__opt">{t(UI.objOptional)}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
