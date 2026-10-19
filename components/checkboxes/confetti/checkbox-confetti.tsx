"use client";

import * as React from "react";
export function ConfettiCheckbox({ label }: { label?: string }) {
  const PIECES = [
    { angle: 0, color: '#f6f6f6', shape: 'rect' }, { angle: 45, color: '#a7a7a7', shape: 'circle' },
    { angle: 90, color: '#c9c9c9', shape: 'rect' }, { angle: 135, color: '#7c7c7c', shape: 'circle' },
    { angle: 180, color: '#f6f6f6', shape: 'rect' }, { angle: 225, color: '#a7a7a7', shape: 'circle' },
    { angle: 270, color: '#c9c9c9', shape: 'rect' }, { angle: 315, color: '#7c7c7c', shape: 'circle' },
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
          style={{ background: on ? '#7c7c7c' : 'transparent', borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)', transition: 'background 200ms ease, border-color 200ms ease' }}>
          {showBurst && PIECES.map((p, i) => (
            <span key={`${burstKey}-${i}`} className="absolute" style={{ width: p.shape === 'rect' ? 5 : 4, height: p.shape === 'rect' ? 3 : 4, borderRadius: p.shape === 'circle' ? '50%' : 1, background: p.color, top: '50%', left: '50%', marginTop: p.shape === 'rect' ? -1.5 : -2, marginLeft: p.shape === 'rect' ? -2.5 : -2, '--angle': `${p.angle}deg`, animation: `cb-confetti-burst 560ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 20}ms forwards` } as React.CSSProperties} />
          ))}
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.5)', transition: on ? 'opacity 180ms ease 100ms, transform 260ms cubic-bezier(0.34,1.56,0.64,1) 100ms' : 'opacity 130ms ease, transform 130ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
