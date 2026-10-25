"use client";

import { useState } from 'react';

export function IconToggle() {
  const [on, setOn] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={() => setOn(v => !v)}
      className="flex h-8 w-[60px] cursor-pointer items-center rounded-full border-none p-1 transition-all duration-300"
      style={{
        background: on
          ? 'linear-gradient(135deg, light-dark(#50535b, #c6c8cd) 0%, light-dark(#5f626a, #a7abb2) 100%)'
          : 'linear-gradient(135deg, light-dark(#ebedf0, #232529) 0%, light-dark(#dbdde1, #2e3035) 100%)',
        boxShadow: on ? '0 0 12px light-dark(rgba(80,83,91,0.4), rgba(198,200,205,0.4))' : '0 0 12px light-dark(rgba(109,113,121,0.25), rgba(125,128,135,0.25))',
      }}
    >
      <span
        className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-[350ms]"
        style={{
          background: on ? 'light-dark(rgba(55,58,64,0.95), rgba(241,242,243,0.95))' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))',
          transform: on ? 'translateX(28px)' : 'translateX(0)',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Sun */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="light-dark(#5f626a, #a7abb2)" strokeWidth="2.5" strokeLinecap="round"
          className="absolute transition-all duration-300"
          style={{
            transform: on ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
            opacity: on ? 1 : 0,
          }}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </svg>
        {/* Moon */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="light-dark(rgba(80,83,91,0.85), rgba(198,200,205,0.85))" strokeWidth="2.5" strokeLinecap="round"
          className="absolute transition-all duration-300"
          style={{
            transform: on ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)',
            opacity: on ? 0 : 1,
          }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      </span>
    </button>
  );
}
