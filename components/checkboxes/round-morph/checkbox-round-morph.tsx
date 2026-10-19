"use client";

import * as React from "react";
export function RoundMorphCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-round-morph';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `@media (prefers-reduced-motion: reduce) { [data-cb="round-morph"] { transition: none !important; } [data-cb="round-morph"] * { transition: none !important; } }`;
    document.head.appendChild(el);
  }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0" />
        <span
          data-cb="round-morph"
          className="flex h-7 w-7 items-center justify-center border-2"
          style={{
            borderRadius: on ? '50%' : 7,
            background: on ? '#7c7c7c' : 'transparent',
            borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
            transition: 'border-radius 350ms cubic-bezier(0.34, 1.56, 0.64, 1), background 280ms ease, border-color 280ms ease',
          }}
        >
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.6)', transition: on ? 'opacity 200ms ease 150ms, transform 300ms cubic-bezier(0.34,1.56,0.64,1) 150ms' : 'opacity 150ms ease, transform 150ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
