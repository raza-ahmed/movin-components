"use client";

import * as React from "react";
export function MorphLineCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    const id = 'anim-cb-morph-line';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-line-to-check { 0% { d: path("M3 6.5 L10 6.5"); } 40% { d: path("M1.5 6.5 L11.5 6.5"); } 100% { d: path("M1.5 5 L5 8.5 L11.5 1.5"); } }
      @keyframes cb-check-to-line { 0% { d: path("M1.5 5 L5 8.5 L11.5 1.5"); } 50% { d: path("M1.5 6.5 L11.5 6.5"); } 100% { d: path("M3 6.5 L10 6.5"); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { [data-cb="morph-line"] path { animation: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="morph-line" className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{ background: on ? 'light-dark(#dbdde1, #2e3035)' : 'transparent', borderColor: on ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'background 300ms ease, border-color 300ms ease' }}>
          <svg key={key} width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
            <path d={on ? 'M1.5 5 L5 8.5 L11.5 1.5' : 'M3 6.5 L10 6.5'} stroke="light-dark(#50535b, #c6c8cd)" strokeWidth={on ? 2.2 : 2.5} strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: on ? 'cb-line-to-check 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'cb-check-to-line 280ms ease-in forwards' }} />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
