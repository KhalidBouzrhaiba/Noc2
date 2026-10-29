import { useEffect, useRef } from 'react';
import { useSettings } from '../core/settings.jsx';
import { UI } from '../core/locales/ui.js';

/**
 * Accessible modal built on <dialog>: focus is trapped by the browser, Escape closes,
 * focus returns to the opener. Background is inert while open.
 */
export default function Modal({ open, onClose, title, className = '', children, wide = false, labelledBy, hideClose = false }) {
  const ref = useRef(null);
  const { t } = useSettings();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const titleId = labelledBy ?? `${className || 'modal'}-title`;
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'modal--wide' : ''} ${className}`}
      aria-labelledby={title ? titleId : labelledBy}
      onClose={() => open && onClose?.()}
      onClick={(e) => {
        if (e.target === ref.current) onClose?.();
      }}
    >
      {open && (
        <div className="modal__inner">
          {(title || !hideClose) && (
            <header className="modal__head">
              {title && (
                <h2 id={titleId} className="modal__title">
                  {title}
                </h2>
              )}
              {!hideClose && (
                <button type="button" className="btn btn--ghost modal__close" onClick={onClose}>
                  {t(UI.close)} <span aria-hidden="true">✕</span>
                </button>
              )}
            </header>
          )}
          <div className="modal__body">{children}</div>
        </div>
      )}
    </dialog>
  );
}
