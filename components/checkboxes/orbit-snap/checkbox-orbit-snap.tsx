"use client";

import * as React from "react";
export function OrbitSnapCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  const [orbiting, setOrbiting] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const id = 'anim-cb-orbit-snap';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes cb-orbit { from { transform: rotate(0deg) translateX(17px); } to { transform: rotate(360deg) translateX(17px); } }
      @media (prefers-reduced-motion: reduce) { [data-cb="orbit-snap"] * { animation: none !important; transition: none !important; } }
    `;
    document.head.appendChild(el);
  }, []);

  const toggle = () => {
    const next = !on;
    if (next) {
      setOrbiting(true);
      timeoutRef.current = setTimeout(() => { setOrbiting(false); setOn(true); }, 700);
    } else { setOrbiting(false); setOn(false); }
  };
  React.useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={toggle} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="orbit-snap" className="relative flex h-7 w-7 items-center justify-center overflow-visible rounded-[7px] border-2"
          style={{ background: on ? 'light-dark(#6d7179, #7d8087)' : 'transparent', borderColor: on || orbiting ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'background 200ms ease, border-color 200ms ease' }}>
          {orbiting && <span className="absolute rounded-full" style={{ top: '50%', left: '50%', width: 8, height: 8, marginTop: -4, marginLeft: -4, background: 'light-dark(#5f626a, #a7abb2)', animation: 'cb-orbit 600ms linear infinite', boxShadow: '0 0 6px light-dark(rgba(95,98,106,0.8), rgba(167,171,178,0.8))' }} />}
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
            style={{ opacity: on && !orbiting ? 1 : 0, transform: on && !orbiting ? 'scale(1)' : 'scale(0.5)', transition: 'opacity 180ms ease, transform 240ms cubic-bezier(0.34,1.56,0.64,1)' }}>
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
