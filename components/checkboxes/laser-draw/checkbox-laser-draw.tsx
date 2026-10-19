"use client";

import * as React from "react";
export function LaserDrawCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [drawKey, setDrawKey] = React.useState(0);

  React.useEffect(() => {
    const id = 'anim-cb-laser-draw';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes laser-glow {
        0%   { filter: drop-shadow(0 0 2px #a7a7a7) drop-shadow(0 0 6px #a7a7a7); }
        50%  { filter: drop-shadow(0 0 5px #a7a7a7) drop-shadow(0 0 14px #a7a7a7) drop-shadow(0 0 24px rgba(167,167,167,0.4)); }
        100% { filter: drop-shadow(0 0 3px #a7a7a7) drop-shadow(0 0 8px #a7a7a7); }
      }
      @media (prefers-reduced-motion: reduce) { [data-cb="laser-draw"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setDrawKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span
          data-cb="laser-draw"
          className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? 'rgba(167,167,167,0.08)' : 'transparent',
            borderColor: on ? '#a7a7a7' : 'rgba(246,246,246,0.25)',
            transition: 'background 300ms ease, border-color 300ms ease',
          }}
        >
          <svg key={drawKey} width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ animation: on ? 'laser-glow 800ms ease-in-out infinite' : 'none', filter: on ? 'drop-shadow(0 0 3px #a7a7a7) drop-shadow(0 0 8px #a7a7a7)' : 'none', transition: 'filter 300ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#a7a7a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              pathLength="1" strokeDasharray="1" strokeDashoffset={on ? 0 : 1}
              style={{ transition: on ? 'stroke-dashoffset 420ms cubic-bezier(0.16, 1, 0.3, 1)' : 'stroke-dashoffset 200ms ease-in' }} />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
