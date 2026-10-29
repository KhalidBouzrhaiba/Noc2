import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';
import { locationById } from '../game/engine.js';
import { ItemIcon } from '../art/ItemIcons.jsx';

export default function Inventory({ def, p, onUse }) {
  const { t, f } = useSettings();
  if (!p.items.length) return <p className="muted">{t(UI.noItems)}</p>;
  const origin = (itemId) => {
    const o = def.objects.find((x) => x.gives?.items?.includes(itemId));
    return o ? t(locationById(def, o.loc).name) : '';
  };
  return (
    <ul className="inventory">
      {p.items.map((id) => {
        const it = def.items[id];
        const used = p.used.includes(id);
        return (
          <li key={id} className={`item ${used ? 'item--used' : ''}`}>
            <ItemIcon icon={it.icon} />
            <div className="item__text">
              <h3 className="item__name">{t(it.name)}</h3>
              <p>{t(it.desc)}</p>
              <p className="muted">{f(UI.itemFound, { place: origin(id) })}</p>
            </div>
            {used ? (
              <span className="badge badge--ok">{t(UI.itemUsed)}</span>
            ) : (
              <button type="button" className="btn btn--secondary" onClick={() => onUse(id)}>
                {t(UI.itemUseOn)}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
