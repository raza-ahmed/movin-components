"use client";

import * as React from "react";
export function CurtainCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-curtain';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `@media (prefers-reduced-motion: reduce) { [data-cb="curtain"] * { transition: none !important; } }`;
    document.head.appendChild(el);
  }, []);

  const panelStyle = (side: 'left' | 'right') => ({
    position: 'absolute' as const,
    top: 0,
    [side]: 0,
    width: '50%',
    height: '100%',
    background: 'light-dark(#6d7179, #7d8087)',
    zIndex: 1,
    transform: on ? `translateX(${side === 'left' ? '-100%' : '100%'})` : 'translateX(0)',
    transition: on
      ? 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)'
      : 'transform 280ms cubic-bezier(0.4, 0, 1, 1)',
  });

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0" />
        <span
          data-cb="curtain"
          className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[7px] border-2"
          style={{ borderColor: on ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))', transition: 'border-color 250ms ease' }}
        >
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="light-dark(#373a40, #f1f2f3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: on ? 1 : 0, transition: 'opacity 150ms ease 180ms' }} />
          </svg>
          <span style={panelStyle('left')} />
          <span style={panelStyle('right')} />
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
