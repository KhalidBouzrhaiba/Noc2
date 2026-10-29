import { useId } from 'react';

/**
 * Noctaviae — original SVG character. A composed black cat sitting upright, a thin pale
 * crescent on her brow, amber eyes, a rust collar with a small brass key (no lock ever fits it).
 * `mood`: 'calm' | 'alert'. Decorative unless `label` is given.
 */
export default function Noctaviae({ className = '', label, mood = 'calm', rim = true }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`noctaviae noctaviae--${mood} ${className}`}
      viewBox="0 0 200 270"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}fur`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#25222e" />
          <stop offset=".55" stopColor="#121017" />
          <stop offset="1" stopColor="#09080c" />
        </linearGradient>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset=".55" stopColor="#f2b84b" stopOpacity="0" />
          <stop offset="1" stopColor="#f2b84b" stopOpacity=".7" />
        </linearGradient>
        <radialGradient id={`${id}eye`} cx=".45" cy=".4" r=".7">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".6" stopColor="#f0a028" />
          <stop offset="1" stopColor="#a65a10" />
        </radialGradient>
        <radialGradient id={`${id}glow`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffb648" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffb648" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tail, wrapped around the front paws */}
      <path
        className="noctaviae__tail"
        d="M138 236c26 2 40-6 40-20 0-12-10-18-18-14"
        fill="none"
        stroke={`url(#${id}fur)`}
        strokeWidth="13"
        strokeLinecap="round"
      />
      {/* body */}
      <path
        d="M80 104c-16 18-26 42-27 70-1 30 6 52 18 64h66c12-12 17-36 14-62-3-30-14-56-31-72z"
        fill={`url(#${id}fur)`}
      />
      {/* haunch */}
      <path d="M124 150c22 8 30 40 22 74-4 14-12 16-20 16-4-30-6-62-2-90z" fill="#0d0b11" />
      {/* front legs */}
      <path d="M86 160c-3 26-4 52-6 76h16c2-24 4-48 4-72z" fill="#0b0a0e" />
      <path d="M104 164c0 24 1 48 3 72h16c-2-24-4-50-8-74z" fill="#0f0d13" />
      <ellipse cx="88" cy="238" rx="11" ry="5" fill="#141219" />
      <ellipse cx="115" cy="238" rx="11" ry="5" fill="#141219" />
      {/* tail tip over the paws */}
      <path d="M58 244c18 10 70 12 96-2" fill="none" stroke="#0d0b11" strokeWidth="12" strokeLinecap="round" />

      {/* collar + brass key */}
      <path d="M74 99c16 11 38 11 54 0l1 8c-17 12-39 12-56 0z" fill="#8f3a24" />
      <g className="noctaviae__key">
        <circle cx="101" cy="114" r="4.2" fill="none" stroke="#d9a441" strokeWidth="2" />
        <path d="M101 118v13m0-4h4m-4 4h3" stroke="#d9a441" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* head */}
      <g className="noctaviae__head">
        <path
          className="noctaviae__ear noctaviae__ear--l"
          d="M64 56 58 14l30 26z"
          fill={`url(#${id}fur)`}
        />
        <path d="M66 46 63 24l14 13z" fill="#3a2630" opacity=".55" />
        <path
          className="noctaviae__ear noctaviae__ear--r"
          d="M112 38l26-28-2 46z"
          fill={`url(#${id}fur)`}
        />
        <path d="M120 36l13-15-1 22z" fill="#3a2630" opacity=".55" />
        <path
          d="M64 52c4-12 18-18 37-18s33 6 37 18c6 18 2 36-10 47-8 8-17 11-27 11s-20-3-28-11C61 88 58 70 64 52z"
          fill={`url(#${id}fur)`}
        />
        {/* crescent mark */}
        <path d="M94 42a9 9 0 1 0 15 4 7 7 0 1 1-15-4z" fill="#e9dfc8" opacity=".85" />
        {/* eyes */}
        <g className="noctaviae__eyes">
          <circle cx="83" cy="70" r="16" fill={`url(#${id}glow)`} />
          <circle cx="119" cy="70" r="16" fill={`url(#${id}glow)`} />
          <path d="M72 70c4-7 18-8 22 0-4 7-18 7-22 0z" fill={`url(#${id}eye)`} />
          <path d="M108 70c4-8 18-7 22 0-4 7-18 7-22 0z" fill={`url(#${id}eye)`} />
          <ellipse className="noctaviae__pupil" cx="83" cy="70" rx="1.7" ry="5.6" fill="#120c06" />
          <ellipse className="noctaviae__pupil" cx="119" cy="70" rx="1.7" ry="5.6" fill="#120c06" />
          <circle cx="86" cy="67.5" r="1.1" fill="#fff6d8" />
          <circle cx="122" cy="67.5" r="1.1" fill="#fff6d8" />
        </g>
        {/* nose, mouth, whiskers */}
        <path d="M97 84h8l-4 4z" fill="#4a3036" />
        <path d="M101 88c-1 4-5 5-7 3m7-3c1 4 5 5 7 3" fill="none" stroke="#2b2128" strokeWidth="1.2" strokeLinecap="round" />
        <g stroke="#cfc6b4" strokeOpacity=".35" strokeWidth=".8" strokeLinecap="round">
          <path d="M88 87l-30-4m30 7-28 4" />
          <path d="M114 87l30-4m-30 7 28 4" />
        </g>
      </g>

      {rim && (
        <path
          d="M80 104c-16 18-26 42-27 70-1 30 6 52 18 64h66c12-12 17-36 14-62-3-30-14-56-31-72M64 52c4-12 18-18 37-18s33 6 37 18c6 18 2 36-10 47"
          fill="none"
          stroke={`url(#${id}rim)`}
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
