"use client";

import * as React from "react";
export function ChargingCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [barWidth, setBarWidth] = React.useState(0);
  const [charged, setCharged] = React.useState(false);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);
  const DURATION = 600;

  const runCharge = (toOn: boolean) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setCharged(false);
    setBarWidth(toOn ? 0 : 100);
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setBarWidth(toOn ? eased * 100 : (1 - eased) * 100);
      if (progress < 1) { rafRef.current = requestAnimationFrame(animate); }
      else { setBarWidth(toOn ? 100 : 0); if (toOn) setCharged(true); }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const toggle = () => { const next = !on; setOn(next); runCharge(next); };
  React.useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span
          data-cb="charging"
          className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{ borderColor: on ? '#a7a7a7' : 'rgba(246,246,246,0.25)', transition: 'border-color 200ms ease' }}
        >
          <span className="absolute bottom-1 left-1 right-1 h-1 rounded-full" style={{ background: 'rgba(246,246,246,0.12)', opacity: charged ? 0 : 1, transition: 'opacity 200ms ease' }}>
            <span className="block h-full rounded-full" style={{ background: '#a7a7a7', width: `${barWidth}%` }} />
          </span>
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: charged ? 1 : 0, transform: charged ? 'scale(1)' : 'scale(0.4)', transition: charged ? 'opacity 200ms ease, transform 280ms cubic-bezier(0.34,1.56,0.64,1)' : 'opacity 150ms ease, transform 150ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#a7a7a7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
