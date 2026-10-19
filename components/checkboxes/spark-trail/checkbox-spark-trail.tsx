"use client";

import * as React from "react";
export function SparkTrailCheckbox({ label }: { label?: string }) {
  const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];
  const [on, setOn] = React.useState(false);
  const [sparkKey, setSparkKey] = React.useState(0);
  const [showSparks, setShowSparks] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-spark-trail';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-spark { 0% { transform: rotate(var(--angle)) translateX(0px) scaleX(1); opacity: 1; } 100% { transform: rotate(var(--angle)) translateX(18px) scaleX(0.2); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="spark-trail"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on; setOn(next);
    if (next) { setSparkKey(k => k + 1); setShowSparks(true); setTimeout(() => setShowSparks(false), 350); }
  };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="spark-trail" className="relative flex h-7 w-7 items-center justify-center overflow-visible rounded-[7px] border-2"
          style={{ background: on ? '#7c7c7c' : 'transparent', borderColor: on ? '#a7a7a7' : 'rgba(246,246,246,0.25)', transition: 'background 180ms ease, border-color 180ms ease' }}>
          {showSparks && SPARKS.map((angle, i) => (
            <span key={`${sparkKey}-${i}`} className="absolute" style={{ width: 6, height: 2, borderRadius: 1, background: 'rgba(246,246,246,0.9)', top: '50%', left: '50%', marginTop: -1, marginLeft: -3, '--angle': `${angle}deg`, animation: 'cb-spark 300ms ease-out forwards' } as React.CSSProperties} />
          ))}
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.5)', transition: on ? 'opacity 160ms ease 80ms, transform 220ms cubic-bezier(0.34,1.56,0.64,1) 80ms' : 'opacity 120ms ease, transform 120ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
