"use client";

import { useEffect, useRef, useState } from 'react';

const KEYFRAMES = `
@keyframes power-spin {
  0%   { transform: rotate(0deg);   }
  100% { transform: rotate(360deg); }
}
@keyframes power-ripple {
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(1.9); opacity: 0;   }
}
`;

export function PowerToggle() {
  const [on, setOn] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const [rippleKey, setRippleKey] = useState(0);
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const toggle = () => {
    setOn(v => !v);
    setSpinKey(k => k + 1);
    setRippleKey(k => k + 1);
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Power"
      onClick={toggle}
      className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none transition-all duration-300"
      style={{
        background: on
          ? 'radial-gradient(circle at 40% 35%, light-dark(#50535b, #c6c8cd) 0%, light-dark(#5f626a, #a7abb2) 100%)'
          : 'light-dark(#f3f4f7, #1a1c1f)',
        boxShadow: on
          ? '0 0 0 2px light-dark(rgba(80,83,91,0.3), rgba(198,200,205,0.3)), 0 0 18px 6px light-dark(rgba(80,83,91,0.35), rgba(198,200,205,0.35)), inset 0 1px 2px light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))'
          : '0 0 0 2px light-dark(rgba(55,58,64,0.07), rgba(241,242,243,0.07)), inset 0 3px 8px light-dark(rgba(0, 0, 0, 0.48), rgba(0,0,0,0.8))',
      }}
    >
      {showRipple && (
        <span
          key={rippleKey}
          className="pointer-events-none absolute inset-0 rounded-full border-2"
          style={{
            borderColor: on ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.3), rgba(241,242,243,0.3))',
            animation: 'power-ripple 600ms ease-out forwards',
          }}
        />
      )}
      <span key={spinKey} style={{ animation: 'power-spin 500ms cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={on ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(rgba(55,58,64,0.3), rgba(241,242,243,0.3))'} strokeWidth="2.2" strokeLinecap="round"
          className="transition-all duration-300">
          <path d="M12 2v6" />
          <path d="M6.34 6.34a9 9 0 1 0 11.32 0" />
        </svg>
      </span>
    </button>
  );
}
