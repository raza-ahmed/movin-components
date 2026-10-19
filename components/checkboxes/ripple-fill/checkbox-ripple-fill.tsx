"use client";

import * as React from "react";
export function RippleFillCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-ripple-fill';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `@media (prefers-reduced-motion: reduce) { [data-cb="ripple-fill"] * { transition: none !important; } }`;
    document.head.appendChild(el);
  }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0" />
        <span
          data-cb="ripple-fill"
          className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{
            borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
            transition: 'border-color 250ms ease',
          }}
        >
          <span
            className="absolute inset-0"
            style={{
              background: '#7c7c7c',
              clipPath: on ? 'circle(75% at 50% 50%)' : 'circle(0% at 50% 50%)',
              transition: on
                ? 'clip-path 360ms cubic-bezier(0.22, 1, 0.36, 1)'
                : 'clip-path 280ms cubic-bezier(0.55, 0, 1, 0.45)',
            }}
          />
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{
              position: 'relative', zIndex: 1,
              opacity: on ? 1 : 0,
              transform: on ? 'scale(1)' : 'scale(0.5)',
              transition: on
                ? 'opacity 180ms ease 200ms, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms'
                : 'opacity 120ms ease, transform 120ms ease',
            }}
          >
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
