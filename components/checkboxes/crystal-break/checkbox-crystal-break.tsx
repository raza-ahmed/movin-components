"use client";

import * as React from "react";
export function CrystalBreakCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [crackKey, setCrackKey] = React.useState(0);
  const [showCrack, setShowCrack] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-crystal-break';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-shard-a { 0% { transform: translate(0,0) rotate(0deg); opacity: 1; } 40% { transform: translate(-6px,-5px) rotate(-8deg); opacity: 0.8; } 70% { transform: translate(-3px,-2px) rotate(-3deg); opacity: 0.9; } 100% { transform: translate(0,0) rotate(0deg); opacity: 0; } }
      @keyframes cb-shard-b { 0% { transform: translate(0,0) rotate(0deg); opacity: 1; } 40% { transform: translate(5px,-4px) rotate(10deg); opacity: 0.8; } 70% { transform: translate(2px,-1px) rotate(4deg); opacity: 0.9; } 100% { transform: translate(0,0) rotate(0deg); opacity: 0; } }
      @keyframes cb-shard-c { 0% { transform: translate(0,0) rotate(0deg); opacity: 1; } 40% { transform: translate(0,6px) rotate(-5deg); opacity: 0.8; } 70% { transform: translate(0,2px) rotate(-2deg); opacity: 0.9; } 100% { transform: translate(0,0) rotate(0deg); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="crystal-break"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setCrackKey(k => k + 1); setShowCrack(true); setTimeout(() => setShowCrack(false), 500); setOn(v => !v); };
  const shardColor = on ? 'light-dark(#42454c, #e5e6e9)' : 'light-dark(rgba(55,58,64,0.6), rgba(241,242,243,0.6))';

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="crystal-break" className="relative flex h-7 w-7 items-center justify-center overflow-visible rounded-[7px] border-2"
          style={{ background: on ? 'light-dark(#cbced3, #393c41)' : 'transparent', borderColor: on ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'background 200ms ease 280ms, border-color 200ms ease' }}>
          {showCrack && <span key={`a-${crackKey}`} className="absolute inset-0 rounded-[7px]" style={{ clipPath: 'polygon(0% 0%, 60% 0%, 0% 60%)', background: shardColor, animation: 'cb-shard-a 460ms ease-out forwards', opacity: 0.7 }} />}
          {showCrack && <span key={`b-${crackKey}`} className="absolute inset-0" style={{ clipPath: 'polygon(40% 0%, 100% 0%, 100% 55%)', background: shardColor, animation: 'cb-shard-b 460ms ease-out forwards', opacity: 0.6 }} />}
          {showCrack && <span key={`c-${crackKey}`} className="absolute inset-0" style={{ clipPath: 'polygon(0% 60%, 100% 55%, 100% 100%, 0% 100%)', background: shardColor, animation: 'cb-shard-c 460ms ease-out forwards', opacity: 0.5 }} />}
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ position: 'relative', zIndex: 1, opacity: on && !showCrack ? 1 : 0, transform: on && !showCrack ? 'scale(1)' : 'scale(0.6)', transition: 'opacity 200ms ease, transform 260ms cubic-bezier(0.34,1.56,0.64,1)' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
