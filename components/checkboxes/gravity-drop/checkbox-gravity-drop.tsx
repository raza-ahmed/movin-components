"use client";

import * as React from "react";
export function GravityDropCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    const id = 'anim-cb-gravity';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-gravity-in { 0% { transform: translateY(-18px); opacity: 0; } 55% { transform: translateY(3px); opacity: 1; } 75% { transform: translateY(-4px); } 88% { transform: translateY(2px); } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes cb-gravity-out { 0% { transform: translateY(0); opacity: 1; } 40% { transform: translateY(-6px); opacity: 1; } 100% { transform: translateY(18px); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="gravity"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="gravity" className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{ background: on ? '#202020' : 'transparent', borderColor: on ? '#a7a7a7' : 'rgba(246,246,246,0.25)', transition: 'background 180ms ease, border-color 180ms ease' }}>
          <svg key={key} width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ animation: on ? 'cb-gravity-in 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'cb-gravity-out 260ms ease-in forwards' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#a7a7a7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
