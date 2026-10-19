"use client";

import * as React from "react";
export function PulseRingCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [ringKey, setRingKey] = React.useState<number | null>(null);

  React.useEffect(() => {
    const id = 'anim-cb-pulse-ring';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-pulse-ring {
        0% { transform: scale(1); opacity: 0.65; }
        100% { transform: scale(2.4); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) { [data-cb="pulse-ring"] { animation: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) setRingKey((k) => (k === null ? 0 : k + 1));
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
        {ringKey !== null && (
          <span
            key={ringKey}
            data-cb="pulse-ring"
            className="absolute inset-0 rounded-[7px] border-2 border-[#7c7c7c] pointer-events-none"
            style={{ animation: 'cb-pulse-ring 550ms ease-out forwards' }}
          />
        )}
        <span
          className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? '#7c7c7c' : 'transparent',
            borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
            transition: 'background 200ms ease, border-color 200ms ease',
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
                  ? 'stroke-dashoffset 320ms cubic-bezier(0.16,1,0.3,1)'
                  : 'stroke-dashoffset 180ms ease-in',
              }}
            />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
