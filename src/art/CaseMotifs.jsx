// Distinct cover illustrations for the three case files.
export function CaseMotif({ motif }) {
  if (motif === 'radio')
    return (
      <svg className="file__motif" viewBox="0 0 200 120" aria-hidden="true" focusable="false">
        <path d="M10 70c20-40 30 40 50 0s30 40 50 0 30 40 50 0 20 20 30 0" stroke="#b3261e" strokeWidth="3" fill="none" />
        <path d="M150 110 170 20l20 90M156 80h28M161 56h18" stroke="#2a2420" strokeWidth="3" fill="none" />
        <circle cx="170" cy="18" r="4" fill="#b3261e" />
        <text x="20" y="108" fill="#2a2420" fontFamily="'Special Elite', monospace" fontSize="16">98.7 MHz</text>
        <path d="M0 6h200" stroke="#b3261e" strokeWidth="6" opacity=".7" />
      </svg>
    );
  if (motif === 'harvest')
    return (
      <svg className="file__motif" viewBox="0 0 200 120" aria-hidden="true" focusable="false">
        <ellipse cx="60" cy="82" rx="38" ry="28" fill="#d9731f" />
        <path d="M60 54v-14" stroke="#4f6b3f" strokeWidth="5" />
        <path d="M44 80l6-8 6 8zM64 80l6-8 6 8zM46 92h28" stroke="#2a1608" strokeWidth="3" fill="#2a1608" />
        <circle cx="150" cy="50" r="32" fill="#e8d7a6" stroke="#2a2420" strokeWidth="4" />
        <path d="M150 50V28M150 50l12 8" stroke="#2a2420" strokeWidth="4" strokeLinecap="round" />
        <path d="M120 100c20-6 40-6 60 0" stroke="#8f3a24" strokeWidth="5" />
        <path d="M110 20c8 4 10 10 6 18" stroke="#9a4a1c" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg className="file__motif" viewBox="0 0 200 120" aria-hidden="true" focusable="false">
      <path d="M10 16h90v90H10z" fill="#d9c9a2" />
      <path d="M10 46h90M10 76h90M40 16v90M70 16v90" stroke="#9a875c" strokeWidth="2" />
      <circle cx="55" cy="61" r="10" fill="none" stroke="#b3261e" strokeWidth="3" />
      <rect x="112" y="20" width="76" height="86" fill="#efe6d2" transform="rotate(5 150 63)" />
      <path d="M126 96V60l24-20 24 20v36z" fill="#5a5448" transform="rotate(5 150 63)" />
      <circle cx="150" cy="66" r="6" fill="#e8c27a" transform="rotate(5 150 63)" />
      <path d="M146 34a6 6 0 1 0 9 2 5 5 0 1 1-9-2z" fill="#2a2420" transform="rotate(5 150 63)" />
    </svg>
  );
}
