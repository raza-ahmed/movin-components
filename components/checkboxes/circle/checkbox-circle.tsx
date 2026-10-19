"use client";

import { useState } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 11;

export function CircleCheckbox() {
  const [on, setOn] = useState(false);

  return (
    <label className="relative inline-flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center">
      <input aria-label="Remember me" type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0 m-0" />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="absolute inset-0">
        <circle cx="14" cy="14" r="11" stroke="rgba(246,246,246,0.15)" strokeWidth="2" />
        <circle
          cx="14" cy="14" r="11"
          stroke="#a7a7a7" strokeWidth="2" strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={on ? 0 : CIRCUMFERENCE}
          transform="rotate(-90 14 14)"
          style={{ transition: on ? 'stroke-dashoffset 420ms cubic-bezier(0.4,0,0.2,1)' : 'stroke-dashoffset 250ms ease-in' }}
        />
      </svg>
      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true"
        className="relative"
        style={{
          transform: on ? 'scale(1)' : 'scale(0)',
          opacity: on ? 1 : 0,
          transition: on
            ? 'transform 300ms cubic-bezier(0.34,1.56,0.64,1) 280ms, opacity 200ms ease 280ms'
            : 'transform 150ms ease-in, opacity 120ms ease',
        }}>
        <path d="M1 4.5L4.5 8L11 1" stroke="#a7a7a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
