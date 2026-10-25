"use client";

import { useState } from 'react';

export function LiquidCheckbox() {
  const [on, setOn] = useState(false);

  return (
    <label className="relative inline-flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center">
      <input aria-label="Remember me" type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0 m-0" />
      <span
        className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2 transition-colors duration-[250ms]"
        style={{ borderColor: on ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))' }}
      >
        <span
          className="absolute bottom-0 left-0 right-0 h-full"
          style={{
            background: 'light-dark(#5f626a, #a7abb2)',
            transform: on ? 'translateY(0%)' : 'translateY(100%)',
            transition: on ? 'transform 380ms cubic-bezier(0.4,0,0.2,1)' : 'transform 260ms cubic-bezier(0.4,0,1,1)',
          }}
        />
        <span
          className="absolute bottom-0 -left-[20%] h-[5px] rounded-full"
          style={{
            width: '140%',
            background: 'light-dark(rgba(55,58,64,0.35), rgba(241,242,243,0.35))',
            transform: on ? 'translateY(0%)' : 'translateY(120%)',
            transition: on ? 'transform 380ms cubic-bezier(0.4,0,0.2,1)' : 'transform 260ms ease-in',
          }}
        />
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true" className="relative z-10"
          style={{
            opacity: on ? 1 : 0,
            transform: on ? 'scale(1)' : 'scale(0.6)',
            transition: on
              ? 'opacity 200ms ease 260ms, transform 280ms cubic-bezier(0.34,1.56,0.64,1) 260ms'
              : 'opacity 150ms ease, transform 150ms ease',
          }}>
          <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}
