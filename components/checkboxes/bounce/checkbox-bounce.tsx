"use client";

import * as React from "react";
export function BounceCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [animKey, setAnimKey] = React.useState(0);
  const [animIn, setAnimIn] = React.useState(true);

  React.useEffect(() => {
    const id = 'anim-cb-bounce';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-bounce-in {
        0% { transform: scale(1); } 25% { transform: scale(0.8); }
        55% { transform: scale(1.22); } 75% { transform: scale(0.94); }
        100% { transform: scale(1); }
      }
      @keyframes cb-bounce-out {
        0% { transform: scale(1); } 30% { transform: scale(1.14); }
        65% { transform: scale(0.93); } 100% { transform: scale(1); }
      }
      @media (prefers-reduced-motion: reduce) { [data-cb="bounce"] { animation: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    setAnimIn(!on);
    setAnimKey((k) => k + 1);
    setOn((v) => !v);
  };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"}
          type="checkbox"
          checked={on}
          onChange={toggle}
          className="absolute opacity-0 w-0 h-0"
        />
        <span
          key={animKey}
          data-cb="bounce"
          className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? 'light-dark(#6d7179, #7d8087)' : 'transparent',
            borderColor: on ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))',
            transition: 'background 180ms ease, border-color 180ms ease',
            animation: `${animIn ? 'cb-bounce-in' : 'cb-bounce-out'} 440ms ease forwards`,
          }}
        >
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
            <path
              d="M1.5 5L5 8.5L11.5 1.5"
              stroke="light-dark(#373a40, #f1f2f3)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: on ? 1 : 0, transition: 'opacity 130ms ease 70ms' }}
            />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
