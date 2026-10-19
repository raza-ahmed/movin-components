"use client";

import * as React from "react";
export function InkBlotCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [animIn, setAnimIn] = React.useState(true);

  React.useEffect(() => {
    const id = 'anim-cb-ink-blot';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-ink-in { 0% { border-radius: 7px; background: transparent; } 20% { border-radius: 40% 60% 60% 40% / 30% 70% 70% 30%; background: #4d4d4d; } 45% { border-radius: 55% 45% 45% 55% / 60% 40% 40% 60%; } 65% { border-radius: 48% 52% 50% 50% / 50% 50% 50% 50%; } 100% { border-radius: 7px; background: #4d4d4d; } }
      @keyframes cb-ink-out { 0% { border-radius: 7px; background: #4d4d4d; } 25% { border-radius: 50% 40% 60% 50% / 60% 50% 40% 50%; background: #4d4d4d; } 55% { border-radius: 30% 60% 40% 70% / 40% 70% 30% 60%; } 100% { border-radius: 7px; background: transparent; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="ink-blot"] { animation: none !important; } [data-cb="ink-blot"] * { transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setAnimIn(!on); setKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span key={key} data-cb="ink-blot" className="flex h-7 w-7 items-center justify-center border-2"
          style={{ borderColor: on ? '#4d4d4d' : 'rgba(246,246,246,0.25)', transition: 'border-color 200ms ease', animation: `${animIn ? 'cb-ink-in' : 'cb-ink-out'} 520ms cubic-bezier(0.22, 1, 0.36, 1) forwards` }}>
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transition: on ? 'opacity 160ms ease 340ms' : 'opacity 100ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
