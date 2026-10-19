"use client";

import { useState } from 'react';

export function RaisedCheckbox() {
  const [on, setOn] = useState(false);

  return (
    <label className="relative inline-flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center">
      <input aria-label="Remember me" type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0 m-0" />
      <span
        className="flex h-7 w-7 items-center justify-center rounded-[8px]"
        style={{
          background: on
            ? 'radial-gradient(circle at 42% 32%, #a7a7a7 0%, #7c7c7c 45%, #3a3a3a 100%)'
            : '#111111',
          border: on ? 'none' : '2px solid rgba(246,246,246,0.18)',
          boxShadow: on
            ? '0 -1px 0 1px rgba(167,167,167,0.5), 0 0 0 3px rgba(124,124,124,0.3), 0 8px 20px rgba(58,58,58,0.65), 0 3px 6px rgba(0,0,0,0.4), inset 0 1px 3px rgba(246,246,246,0.35), inset 0 -2px 4px rgba(0,0,0,0.35)'
            : 'inset 0 2px 4px rgba(0,0,0,0.5)',
          transform: on ? 'scale(1) translateY(-1px)' : 'scale(1) translateY(0px)',
          transition: on
            ? 'background 220ms ease, box-shadow 280ms ease, border 180ms ease, transform 300ms cubic-bezier(0.34,1.56,0.64,1)'
            : 'background 200ms ease, box-shadow 250ms ease, border 150ms ease, transform 200ms ease',
        }}
      >
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
          style={{
            filter: on ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' : 'none',
            transform: on ? 'scale(1)' : 'scale(0)',
            opacity: on ? 1 : 0,
            transition: on
              ? 'transform 300ms cubic-bezier(0.34,1.56,0.64,1) 80ms, opacity 200ms ease 80ms, filter 200ms ease 80ms'
              : 'transform 150ms ease-in, opacity 120ms ease',
          }}>
          <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}
