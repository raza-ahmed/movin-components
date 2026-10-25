"use client";

import * as React from "react";
export function FlipToggle() {
  const [on, setOn] = React.useState(false);
  const [animKey, setAnimKey] = React.useState(0);
  const [direction, setDirection] = React.useState<'right' | 'left' | null>(null);

  const toggle = () => {
    const next = !on;
    setDirection(next ? 'right' : 'left');
    setAnimKey((k) => k + 1);
    setOn(next);
  };

  return (
    <>
      <style>{`
        @keyframes thumb-flip-right {
          0%   { transform: translateX(0px)  scaleX(1); }
          35%  { transform: translateX(11px) scaleX(0.05); }
          36%  { transform: translateX(22px) scaleX(0.05); }
          100% { transform: translateX(22px) scaleX(1); }
        }
        @keyframes thumb-flip-left {
          0%   { transform: translateX(22px) scaleX(1); }
          35%  { transform: translateX(11px) scaleX(0.05); }
          36%  { transform: translateX(0px)  scaleX(0.05); }
          100% { transform: translateX(0px)  scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flip-thumb { animation-duration: 0ms !important; }
        }
      `}</style>
      <button
        type="button"
        role="switch" aria-label="Notifications"
        aria-checked={on}
        onClick={toggle}
        className="flex cursor-pointer items-center rounded-full border-none p-1"
        style={{
          width: 52, height: 30,
          background: on ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))',
          transition: 'background 250ms ease',
        }}
      >
        <span
          key={animKey}
          className="flip-thumb block rounded-full"
          style={{
            width: 22, height: 22,
            background: on ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(rgba(55,58,64,0.7), rgba(241,242,243,0.7))',
            transformOrigin: 'center',
            animation: direction ? `thumb-flip-${direction} 320ms ease-in-out forwards` : undefined,
            transform: direction ? undefined : on ? 'translateX(22px)' : 'translateX(0)',
          }}
        />
      </button>
    </>
  );
}
