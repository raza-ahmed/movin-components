"use client";

import * as React from "react";
type Phase = 'idle' | 'charging' | 'fired';
const DURATION = 1500;

export function ChargeButton() {
  const [chargeWidth, setChargeWidth] = React.useState(0);
  const phaseRef = React.useRef<Phase>('idle');
  const [phase, setPhaseState] = React.useState<Phase>('idle');
  const rafRef = React.useRef<number>(0);
  const startRef = React.useRef<number>(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function setPhase(p: Phase) { phaseRef.current = p; setPhaseState(p); }

  function start() {
    if (phaseRef.current !== 'idle') return;
    setPhase('charging');
    setChargeWidth(0);
    startRef.current = performance.now();
    function tick(now: number) {
      const pct = Math.min(((now - startRef.current) / DURATION) * 100, 100);
      setChargeWidth(pct);
      if (pct < 100) { rafRef.current = requestAnimationFrame(tick); }
      else { cancelAnimationFrame(rafRef.current); setPhase('fired'); setChargeWidth(100); timeoutRef.current = setTimeout(() => { setPhase('idle'); setChargeWidth(0); }, 800); }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function stop() {
    if (phaseRef.current !== 'charging') return;
    cancelAnimationFrame(rafRef.current);
    setPhase('idle');
    setChargeWidth(0);
  }

  React.useEffect(() => () => { cancelAnimationFrame(rafRef.current); if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const isFired = phase === 'fired';
  const isCharging = phase === 'charging';

  return (
    <button
      type="button"
      onMouseEnter={start}
      onMouseLeave={stop}
      className="relative overflow-hidden rounded-md text-xs font-semibold uppercase tracking-widest cursor-pointer border-2 select-none"
      style={{
        minWidth: '12rem',
        padding: '0.75rem 2.25rem',
        color: isFired ? '#202020' : '#f6f6f6',
        background: '#202020',
        borderColor: isFired ? '#c9c9c9' : isCharging ? '#c9c9c9' : 'rgba(246,246,246,0.15)',
        transition: 'border-color 200ms, color 150ms, box-shadow 200ms',
        boxShadow: isFired ? '0 0 24px rgba(201,201,201,0.7),0 0 48px rgba(201,201,201,0.3)' : 'none',
      }}
    >
      <span
        className="pointer-events-none absolute bottom-0 left-0 top-0"
        style={{
          width: `${chargeWidth}%`,
          background: isFired ? 'linear-gradient(90deg,#a7a7a7,#c9c9c9)' : 'linear-gradient(90deg,#a7a7a7,#c9c9c9)',
          transition: isFired ? 'background 150ms' : 'none',
        }}
      />
      <span className="relative z-10">
        {isFired ? 'FIRED!' : isCharging ? 'Charging...' : 'Hover to Charge'}
      </span>
    </button>
  );
}
