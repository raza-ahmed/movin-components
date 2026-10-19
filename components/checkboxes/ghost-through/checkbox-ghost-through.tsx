"use client";

import * as React from "react";
export function GhostThroughCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [animIn, setAnimIn] = React.useState(true);

  React.useEffect(() => {
    const id = 'anim-cb-ghost';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-ghost-in { 0% { opacity: 1; background: transparent; } 30% { opacity: 0.2; background: transparent; } 70% { opacity: 0.2; background: #7c7c7c; } 100% { opacity: 1; background: #7c7c7c; } }
      @keyframes cb-ghost-out { 0% { opacity: 1; background: #7c7c7c; } 30% { opacity: 0.2; background: #7c7c7c; } 70% { opacity: 0.2; background: transparent; } 100% { opacity: 1; background: transparent; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="ghost"] { animation: none !important; } [data-cb="ghost"] * { transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setAnimIn(!on); setKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span key={key} data-cb="ghost" className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{ borderColor: on ? '#a7a7a7' : 'rgba(246,246,246,0.25)', transition: 'border-color 300ms ease', animation: `${animIn ? 'cb-ghost-in' : 'cb-ghost-out'} 500ms ease forwards` }}>
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transition: on ? 'opacity 200ms ease 200ms' : 'opacity 120ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
