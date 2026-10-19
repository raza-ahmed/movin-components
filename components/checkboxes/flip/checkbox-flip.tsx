"use client";

import * as React from "react";
export function FlipCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [animKey, setAnimKey] = React.useState(0);

  React.useEffect(() => {
    const id = 'anim-cb-flip';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-flip {
        0% { transform: perspective(120px) rotateY(0deg); }
        100% { transform: perspective(120px) rotateY(360deg); }
      }
      @media (prefers-reduced-motion: reduce) { [data-cb="flip"] { animation: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
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
          data-cb="flip"
          className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? '#7c7c7c' : 'transparent',
            borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
            transition: 'background 200ms ease, border-color 200ms ease',
            animation: 'cb-flip 380ms cubic-bezier(0.4,0,0.2,1) forwards',
          }}
        >
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
            <path
              d="M1.5 5L5 8.5L11.5 1.5"
              stroke="#f6f6f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={on ? 0 : 1}
              style={{
                transition: on
                  ? 'stroke-dashoffset 300ms cubic-bezier(0.16,1,0.3,1) 100ms'
                  : 'stroke-dashoffset 150ms ease-in',
              }}
            />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
