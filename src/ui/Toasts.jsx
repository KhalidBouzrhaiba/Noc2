import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastCtx = createContext(null);

/** Short, deduplicated notifications. Announced politely to screen readers. */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const recent = useRef(new Map());
  const push = useCallback((text, kind = 'info', key = text) => {
    const now = Date.now();
    if (now - (recent.current.get(key) ?? 0) < 1500) return; // swallow double-click duplicates
    recent.current.set(key, now);
    const id = `${now}-${Math.random()}`;
    setItems((xs) => [...xs.slice(-3), { id, text, kind }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 4200);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((x) => (
          <p key={x.id} className={`toast toast--${x.kind}`}>
            {x.text}
          </p>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToasts = () => useContext(ToastCtx);
