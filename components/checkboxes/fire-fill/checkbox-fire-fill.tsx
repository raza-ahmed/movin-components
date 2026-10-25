"use client";

import * as React from "react";
export function FireFillCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-fire-fill';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-fire-flicker-a { 0% { clip-path: polygon(0% 100%, 20% 65%, 35% 75%, 50% 55%, 65% 70%, 80% 50%, 100% 65%, 100% 100%); } 33% { clip-path: polygon(0% 100%, 15% 60%, 30% 78%, 50% 48%, 70% 72%, 85% 55%, 100% 68%, 100% 100%); } 66% { clip-path: polygon(0% 100%, 25% 70%, 40% 58%, 55% 65%, 68% 52%, 82% 68%, 100% 60%, 100% 100%); } 100% { clip-path: polygon(0% 100%, 20% 65%, 35% 75%, 50% 55%, 65% 70%, 80% 50%, 100% 65%, 100% 100%); } }
      @media (prefers-reduced-motion: reduce) { [data-cb="fire-fill"] * { transition: none !important; animation: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="fire-fill" className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{ borderColor: on ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'border-color 300ms ease' }}>
          <span className="absolute left-0 right-0 bottom-0" style={{ height: '130%', background: 'linear-gradient(0deg, light-dark(#6d7179, #7d8087) 0%, light-dark(#5f626a, #a7abb2) 40%, light-dark(#50535b, #c6c8cd) 80%)', transform: on ? 'translateY(0%)' : 'translateY(100%)', transition: on ? 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 280ms cubic-bezier(0.55, 0, 1, 0.45)', animation: on ? 'cb-fire-flicker-a 600ms ease-in-out infinite' : 'none' }} />
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ position: 'relative', zIndex: 1, opacity: on ? 1 : 0, transition: on ? 'opacity 200ms ease 280ms' : 'opacity 120ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
