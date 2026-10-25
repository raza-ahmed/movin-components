"use client";

import * as React from "react";
export function ShakeLockCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [animIn, setAnimIn] = React.useState(true);

  React.useEffect(() => {
    const id = 'anim-cb-shake';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-shake-in { 0% { transform: translateX(0); } 10% { transform: translateX(-5px); } 24% { transform: translateX(5px); } 38% { transform: translateX(-4px); } 52% { transform: translateX(4px); } 66% { transform: translateX(-2px); } 80% { transform: translateX(2px); } 100% { transform: translateX(0); } }
      @keyframes cb-shake-out { 0% { transform: translateX(0); } 15% { transform: translateX(4px); } 35% { transform: translateX(-3px); } 55% { transform: translateX(2px); } 80% { transform: translateX(-1px); } 100% { transform: translateX(0); } }
      @media (prefers-reduced-motion: reduce) { [data-cb="shake"] { animation: none !important; } [data-cb="shake"] * { transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setAnimIn(!on); setKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span key={key} data-cb="shake" className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? 'light-dark(#5f626a, #a7abb2)' : 'transparent',
            borderColor: on ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))',
            transition: 'background 200ms ease, border-color 200ms ease',
            animation: `${animIn ? 'cb-shake-in' : 'cb-shake-out'} 380ms ease forwards`,
          }}>
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transition: on ? 'opacity 160ms ease 240ms' : 'opacity 100ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
