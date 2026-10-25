"use client";

import * as React from "react";
export function TiltHoverCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-tilt-hover';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `@media (prefers-reduced-motion: reduce) { [data-cb="tilt-hover"] { transition: none !important; transform: none !important; } [data-cb="tilt-hover"] * { transition: none !important; } }`;
    document.head.appendChild(el);
  }, []);

  const tilt = hovered && !on ? 'perspective(300px) rotateX(12deg) rotateY(-14deg) scale(1.08)' : 'perspective(300px) rotateX(0deg) rotateY(0deg) scale(1)';

  return (
    <label className="flex cursor-pointer items-center gap-2" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="tilt-hover" className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? 'light-dark(#6d7179, #7d8087)' : 'transparent',
            borderColor: on ? 'light-dark(#5f626a, #a7abb2)' : hovered ? 'light-dark(rgba(95,98,106,0.6), rgba(167,171,178,0.6))' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))',
            transform: tilt,
            transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), background 220ms ease, border-color 220ms ease',
            boxShadow: hovered && !on ? '4px 6px 16px light-dark(rgba(95,98,106,0.25), rgba(167,171,178,0.25))' : on ? '0 2px 8px light-dark(rgba(95,98,106,0.3), rgba(167,171,178,0.3))' : 'none',
          }}>
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.6)', transition: on ? 'opacity 160ms ease 80ms, transform 240ms cubic-bezier(0.34,1.56,0.64,1) 80ms' : 'opacity 120ms ease, transform 120ms ease' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
