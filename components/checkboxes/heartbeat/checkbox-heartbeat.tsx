"use client";

import * as React from "react";
export function HeartbeatCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [showBeat, setShowBeat] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-heartbeat';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-heartbeat { 0% { stroke-dashoffset: 1; } 100% { stroke-dashoffset: 0; } }
      @keyframes cb-hb-fade { 0% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="heartbeat"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on; setOn(next); setKey(k => k + 1);
    if (next) { setShowBeat(true); setTimeout(() => setShowBeat(false), 700); }
  };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="heartbeat" className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{ background: on ? '#202020' : 'transparent', borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)', transition: 'background 250ms ease, border-color 250ms ease' }}>
          {showBeat && (
            <svg key={`hb-${key}`} width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true" className="absolute" style={{ animation: 'cb-hb-fade 700ms ease forwards' }}>
              <polyline points="0,6 4,6 5,2 6,10 7,1 8,11 9,6 13,6 14,4 15,8 16,6 22,6" stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: 'cb-heartbeat 500ms ease forwards' }} />
            </svg>
          )}
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ position: 'relative', zIndex: 1, opacity: on && !showBeat ? 1 : 0, transform: on && !showBeat ? 'scale(1)' : 'scale(0.5)', transition: 'opacity 200ms ease, transform 260ms cubic-bezier(0.34,1.56,0.64,1)' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#7c7c7c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
