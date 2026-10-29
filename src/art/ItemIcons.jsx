export function ItemIcon({ icon, className = '' }) {
  return (
    <svg className={`item-icon ${className}`} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="10" fill="#2a2632" />
      {icon === 'key' && (
        <g stroke="#d9a441" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <circle cx="16" cy="18" r="7" />
          <path d="M21 23l15 15m-5-5 4-4m-8 0 3-3" />
        </g>
      )}
      {icon === 'smallkey' && (
        <g stroke="#d9a441" strokeWidth="3" fill="none" strokeLinecap="round">
          <circle cx="18" cy="20" r="5" />
          <path d="M22 24l10 10m-3-3 3-3" />
          <text x="32" y="16" fill="#d9a441" stroke="none" fontSize="10" fontFamily="monospace">7</text>
        </g>
      )}
      {icon === 'crescent' && <path d="M18 12a14 14 0 1 0 18 20 11 11 0 1 1-18-20z" fill="#c99a3b" />}
    </svg>
  );
}
