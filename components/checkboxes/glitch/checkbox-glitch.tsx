"use client";

import * as React from "react";
export function GlitchCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [glitchKey, setGlitchKey] = React.useState(0);
  const [showGlitch, setShowGlitch] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-glitch';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-glitch-r { 0% { transform: translateX(3px); opacity: 0.7; } 25% { transform: translateX(-2px); } 50% { transform: translateX(4px); } 100% { transform: translateX(0); opacity: 0; } }
      @keyframes cb-glitch-b { 0% { transform: translateX(-3px); opacity: 0.7; } 25% { transform: translateX(2px); } 50% { transform: translateX(-4px); } 100% { transform: translateX(0); opacity: 0; } }
      @keyframes cb-scan { 0% { transform: translateY(-100%); opacity: 0.6; } 100% { transform: translateY(120%); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="glitch"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setGlitchKey(k => k + 1); setShowGlitch(true); setTimeout(() => setShowGlitch(false), 320); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="glitch" className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{ background: on ? '#202020' : 'transparent', borderColor: on ? '#a7a7a7' : 'rgba(246,246,246,0.25)', transition: 'background 150ms ease, border-color 150ms ease' }}>
          {showGlitch && <span key={`r-${glitchKey}`} className="absolute inset-0" style={{ background: 'rgba(246,246,246,0.25)', animation: 'cb-glitch-r 300ms ease forwards' }} />}
          {showGlitch && <span key={`b-${glitchKey}`} className="absolute inset-0" style={{ background: 'rgba(17,17,17,0.4)', animation: 'cb-glitch-b 300ms ease forwards' }} />}
          {showGlitch && <span key={`s-${glitchKey}`} className="absolute left-0 right-0 h-0.5" style={{ background: 'rgba(246,246,246,0.6)', animation: 'cb-scan 280ms ease forwards' }} />}
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ position: 'relative', zIndex: 1, opacity: on ? 1 : 0, transition: on ? 'opacity 180ms ease 160ms' : 'opacity 100ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#a7a7a7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
