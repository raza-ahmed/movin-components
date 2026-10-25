"use client";

import * as React from "react";
export function RetroLedCheckbox({ label }: { label?: string }) {
  const GRID = 5;
  const CHECK_ORDER = [20,21,16,11,22,17,12,23,18,13,24,19,14,9,4,8,3,7,2,1,6,0,5,10,15];
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const id = 'anim-cb-retro-led';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `@media (prefers-reduced-motion: reduce) { [data-cb="retro-led"] span { transition: none !important; } }`;
    document.head.appendChild(el);
  }, []);

  const delays = React.useMemo(() => {
    const map: Record<number, number> = {};
    CHECK_ORDER.forEach((cellIdx, order) => { map[cellIdx] = order * 22; });
    return map;
  }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0" />
        <span data-cb="retro-led" className="h-7 w-7 rounded-[5px] border-2"
          style={{ background: 'light-dark(#fbfcfd, #121417)', borderColor: on ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))', display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 1.5, padding: 3, boxSizing: 'border-box', transition: 'border-color 200ms ease' }}>
          {Array.from({ length: GRID * GRID }, (_, i) => (
            <span key={i} className="rounded-full" style={{ background: on ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.08), rgba(241,242,243,0.08))', boxShadow: on ? '0 0 3px light-dark(rgba(80,83,91,0.6), rgba(198,200,205,0.6))' : 'none', transition: on ? `background 80ms ease ${delays[i]}ms, box-shadow 80ms ease ${delays[i]}ms` : `background 60ms ease ${(CHECK_ORDER.length - 1 - CHECK_ORDER.indexOf(i)) * 16}ms` }} />
          ))}
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
