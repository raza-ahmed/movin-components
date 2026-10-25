"use client";

import * as React from "react";
export function StampCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [stampKey, setStampKey] = React.useState(0);
  const [showInk, setShowInk] = React.useState(false);
  const INK_ANGLES = [0, 60, 120, 180, 240, 300];

  React.useEffect(() => {
    const id = 'anim-cb-stamp';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-stamp-in { 0% { transform: translateY(-14px) scale(1.3); filter: blur(2px); opacity: 0; } 45% { transform: translateY(2px) scale(0.95); filter: blur(0); opacity: 1; } 65% { transform: translateY(-3px) scale(1.05); } 100% { transform: translateY(0) scale(1); opacity: 1; } }
      @keyframes cb-stamp-out { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.5); opacity: 0; } }
      @keyframes cb-ink-dot { 0% { transform: rotate(var(--angle)) translateX(0px); opacity: 1; } 100% { transform: rotate(var(--angle)) translateX(14px); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="stamp"] * { animation: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on; setOn(next); setStampKey(k => k + 1);
    if (next) { setShowInk(true); setTimeout(() => setShowInk(false), 500); }
  };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="stamp" className="relative flex h-7 w-7 items-center justify-center overflow-visible rounded-[7px] border-2"
          style={{ background: on ? 'light-dark(#ebedf0, #232529)' : 'transparent', borderColor: on ? 'light-dark(#cbced3, #393c41)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'background 200ms ease, border-color 200ms ease' }}>
          {showInk && INK_ANGLES.map(angle => (
            <span key={angle} className="absolute rounded-full" style={{ width: 4, height: 4, background: 'light-dark(#6d7179, #7d8087)', top: '50%', left: '50%', marginTop: -2, marginLeft: -2, '--angle': `${angle}deg`, animation: 'cb-ink-dot 480ms ease-out forwards' } as React.CSSProperties} />
          ))}
          <svg key={stampKey} width="14" height="11" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ animation: on ? 'cb-stamp-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'cb-stamp-out 200ms ease forwards', opacity: on ? undefined : 0 }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#5f626a, #a7abb2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
