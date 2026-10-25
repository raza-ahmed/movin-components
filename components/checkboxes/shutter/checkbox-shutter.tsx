"use client";

import * as React from "react";
export function ShutterCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    const id = 'anim-cb-shutter';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-shutter-open { 0% { clip-path: polygon(50% 0%, 50% 0%, 50% 50%, 50% 100%, 50% 100%, 50% 50%); } 100% { clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 50%); } }
      @keyframes cb-shutter-close { 0% { clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 50%); } 100% { clip-path: polygon(50% 0%, 50% 0%, 50% 50%, 50% 100%, 50% 100%, 50% 50%); } }
      @media (prefers-reduced-motion: reduce) { [data-cb="shutter"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => { setKey(k => k + 1); setOn(v => !v); };

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="shutter" className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{ borderColor: on ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'border-color 250ms ease' }}>
          <span key={key} className="absolute inset-0" style={{ background: 'light-dark(#5f626a, #a7abb2)', animation: on ? 'cb-shutter-open 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'cb-shutter-close 280ms ease-in forwards' }} />
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ position: 'relative', zIndex: 1, opacity: on ? 1 : 0, transition: on ? 'opacity 150ms ease 200ms' : 'opacity 100ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
