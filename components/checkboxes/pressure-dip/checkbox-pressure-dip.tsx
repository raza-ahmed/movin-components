"use client";

import * as React from "react";
export function PressureDipCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [animIn, setAnimIn] = React.useState(true);

  React.useEffect(() => {
    const id = 'anim-cb-pressure';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-pressure-check { 0% { transform: scaleY(1) scaleX(1); } 18% { transform: scaleY(0.28) scaleX(1.15); } 45% { transform: scaleY(1.08) scaleX(0.96); } 65% { transform: scaleY(0.97) scaleX(1.01); } 100% { transform: scaleY(1) scaleX(1); } }
      @keyframes cb-pressure-uncheck { 0% { transform: scaleY(1) scaleX(1); } 20% { transform: scaleY(1.1) scaleX(0.94); } 45% { transform: scaleY(0.3) scaleX(1.12); } 100% { transform: scaleY(1) scaleX(1); } }
      @media (prefers-reduced-motion: reduce) { [data-cb="pressure"] { animation: none !important; } [data-cb="pressure"] * { transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setAnimIn(!on); setKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span key={key} data-cb="pressure" className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? '#7c7c7c' : 'transparent',
            borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
            transition: 'background 180ms ease, border-color 180ms ease',
            animation: `${animIn ? 'cb-pressure-check' : 'cb-pressure-uncheck'} 440ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
            transformOrigin: 'center center',
          }}>
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transition: on ? 'opacity 150ms ease 220ms' : 'opacity 100ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
