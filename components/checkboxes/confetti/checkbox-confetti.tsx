"use client";

import * as React from "react";
export function ConfettiCheckbox({ label }: { label?: string }) {
  const PIECES = [
    { angle: 0, color: 'light-dark(#373a40, #f1f2f3)', shape: 'rect' }, { angle: 45, color: 'light-dark(#5f626a, #a7abb2)', shape: 'circle' },
    { angle: 90, color: 'light-dark(#50535b, #c6c8cd)', shape: 'rect' }, { angle: 135, color: 'light-dark(#6d7179, #7d8087)', shape: 'circle' },
    { angle: 180, color: 'light-dark(#373a40, #f1f2f3)', shape: 'rect' }, { angle: 225, color: 'light-dark(#5f626a, #a7abb2)', shape: 'circle' },
    { angle: 270, color: 'light-dark(#50535b, #c6c8cd)', shape: 'rect' }, { angle: 315, color: 'light-dark(#6d7179, #7d8087)', shape: 'circle' },
  ];
  const [on, setOn] = React.useState(false);
  const [burstKey, setBurstKey] = React.useState(0);
  const [showBurst, setShowBurst] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-confetti';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-confetti-burst { 0% { transform: rotate(var(--angle)) translateX(0px) scale(1); opacity: 1; } 60% { opacity: 1; } 100% { transform: rotate(var(--angle)) translateX(20px) scale(0.3) rotate(180deg); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="confetti"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on; setOn(next);
    if (next) { setBurstKey(k => k + 1); setShowBurst(true); setTimeout(() => setShowBurst(false), 600); }
  };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="confetti" className="relative flex h-7 w-7 items-center justify-center overflow-visible rounded-[7px] border-2"
          style={{ background: on ? 'light-dark(#6d7179, #7d8087)' : 'transparent', borderColor: on ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'background 200ms ease, border-color 200ms ease' }}>
          {showBurst && PIECES.map((p, i) => (
            <span key={`${burstKey}-${i}`} className="absolute" style={{ width: p.shape === 'rect' ? 5 : 4, height: p.shape === 'rect' ? 3 : 4, borderRadius: p.shape === 'circle' ? '50%' : 1, background: p.color, top: '50%', left: '50%', marginTop: p.shape === 'rect' ? -1.5 : -2, marginLeft: p.shape === 'rect' ? -2.5 : -2, '--angle': `${p.angle}deg`, animation: `cb-confetti-burst 560ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 20}ms forwards` } as React.CSSProperties} />
          ))}
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.5)', transition: on ? 'opacity 180ms ease 100ms, transform 260ms cubic-bezier(0.34,1.56,0.64,1) 100ms' : 'opacity 130ms ease, transform 130ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
