"use client";

import { useState } from 'react';

export function XToCheckCheckbox() {
  const [on, setOn] = useState(false);

  return (
    <label className="relative inline-flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center">
      <input aria-label="Remember me" type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0 m-0" />
      <span
        className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2 transition-all duration-[250ms]"
        style={{
          background: on ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04))',
          borderColor: on ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true" className="absolute transition-all duration-200"
          style={{
            transform: on ? 'rotate(45deg) scale(0)' : 'rotate(0deg) scale(1)',
            opacity: on ? 0 : 1,
          }}>
          <line x1="1" y1="1" x2="10" y2="10" stroke="light-dark(rgba(55,58,64,0.6), rgba(241,242,243,0.6))" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="1" x2="1" y2="10" stroke="light-dark(rgba(55,58,64,0.6), rgba(241,242,243,0.6))" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true" className="absolute"
          style={{
            transform: on ? 'rotate(0deg) scale(1)' : 'rotate(-45deg) scale(0)',
            opacity: on ? 1 : 0,
            transition: on
              ? 'transform 300ms cubic-bezier(0.34,1.56,0.64,1) 100ms, opacity 200ms ease 100ms'
              : 'transform 180ms ease-in, opacity 150ms ease',
          }}>
          <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}
