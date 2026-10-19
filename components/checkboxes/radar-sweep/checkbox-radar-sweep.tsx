"use client";

import * as React from "react";
export function RadarSweepCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [sweep, setSweep] = React.useState(0);
  const [sweeping, setSweeping] = React.useState(false);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);
  const DURATION = 700;

  const runSweep = (toOn: boolean) => {
    setSweeping(true);
    setSweep(toOn ? 0 : 100);
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / DURATION, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setSweep(toOn ? eased * 100 : (1 - eased) * 100);
      if (progress < 1) { rafRef.current = requestAnimationFrame(animate); }
      else { setSweeping(false); setSweep(toOn ? 100 : 0); }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const toggle = () => { const next = !on; setOn(next); runSweep(next); };
  React.useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span
          data-cb="radar"
          className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{
            borderColor: on || sweeping ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
            transition: 'border-color 200ms ease',
            background: `conic-gradient(from -90deg, #7c7c7c ${Math.round(sweep)}%, transparent ${Math.round(sweep)}%)`,
          }}
        >
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ position: 'relative', zIndex: 1, opacity: on && !sweeping ? 1 : 0, transition: 'opacity 180ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
