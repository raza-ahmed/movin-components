"use client";

import * as React from "react";
const DURATION = 1500;
const R = 22;
const CIRC = 2 * Math.PI * R;

export function HoldConfirmButton({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = React.useState(0);
  const [confirmed, setConfirmed] = React.useState(false);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number>(0);
  const doneRef = React.useRef(false);

  function cancelRaf() {
    const id = rafRef.current;
    if (id !== null) { cancelAnimationFrame(id); rafRef.current = null; }
  }

  function handleMouseDown() {
    if (doneRef.current) return;
    cancelRaf();
    setProgress(0);
    startRef.current = performance.now();
    function tick(now: number) {
      const p = Math.min((now - startRef.current) / DURATION, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        doneRef.current = true;
        setConfirmed(true);
        setTimeout(() => { doneRef.current = false; setConfirmed(false); setProgress(0); }, 1800);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function handleRelease() {
    if (!doneRef.current) { cancelRaf(); setProgress(0); }
  }

  const offset = CIRC * (1 - progress);

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      className="inline-flex select-none items-center gap-2.5 rounded-lg border px-6 py-2.5 font-semibold tracking-wide transition-colors duration-300"
      style={{
        background: confirmed ? '#282828' : '#202020',
        color: confirmed ? '#c9c9c9' : '#c9c9c9',
        borderColor: confirmed ? '#a7a7a7' : '#7c7c7c',
        cursor: confirmed ? 'default' : 'pointer',
      }}
    >
      <svg width="52" height="52">
        <circle cx="26" cy="26" r={R} stroke="#282828" strokeWidth="4" fill="none" />
        <circle
          cx="26" cy="26" r={R}
          stroke={confirmed ? '#a7a7a7' : '#7c7c7c'}
          strokeWidth="4" fill="none"
          strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '26px 26px', transition: confirmed ? 'stroke 300ms ease' : 'none' }}
        />
        <text x="26" y="31" textAnchor="middle" fontSize="14" fontWeight="bold" fill={confirmed ? '#c9c9c9' : '#a7a7a7'}>
          {confirmed ? '✓' : `${Math.round(progress * 100)}%`}
        </text>
      </svg>
      {confirmed ? 'CONFIRMED!' : children}
    </button>
  );
}
