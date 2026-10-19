"use client";

import { useEffect, useState } from 'react';

const KEYFRAMES = `
@keyframes neon-flicker {
  0%   { opacity: 1; }
  5%   { opacity: 0.2; }
  10%  { opacity: 1; }
  15%  { opacity: 0.4; }
  20%  { opacity: 1; }
  100% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  [data-cb="neon"] { animation: none !important; }
}
`;

export function NeonCheckbox() {
  const [on, setOn] = useState(false);
  const [flickerKey, setFlickerKey] = useState(0);

  useEffect(() => {
    const id = 'anim-cb-neon';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = KEYFRAMES;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) setFlickerKey(k => k + 1);
  };

  return (
    <label className="relative inline-flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center">
      <input aria-label="Remember me" type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0 m-0" />
      <span
        key={flickerKey}
        data-cb="neon"
        className="flex h-7 w-7 items-center justify-center rounded-[6px] border-2 transition-all duration-300"
        style={{
          background: on ? 'rgba(237,237,237,0.06)' : '#111111',
          borderColor: on ? '#ededed' : 'rgba(246,246,246,0.12)',
          boxShadow: on ? '0 0 4px #ededed, 0 0 10px rgba(237,237,237,0.6), 0 0 22px rgba(237,237,237,0.3)' : 'none',
          animation: on ? 'neon-flicker 400ms ease-out forwards' : 'none',
        }}
      >
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
          <path
            d="M1.5 5L5 8.5L11.5 1.5" stroke="#ededed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            pathLength="1" strokeDasharray="1" strokeDashoffset={on ? 0 : 1}
            style={{
              filter: on ? 'drop-shadow(0 0 3px #ededed)' : 'none',
              transition: on
                ? 'stroke-dashoffset 350ms cubic-bezier(0.16,1,0.3,1) 150ms, filter 300ms ease 150ms'
                : 'stroke-dashoffset 180ms ease-in, filter 150ms ease',
            }}
          />
        </svg>
      </span>
    </label>
  );
}
