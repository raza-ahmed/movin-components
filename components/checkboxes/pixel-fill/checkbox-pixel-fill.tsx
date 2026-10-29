"use client";

import * as React from "react";
export function PixelFillCheckbox({ label }: { label?: string }) {
  const SIZE = 4;
  const CELLS = SIZE * SIZE;

  // A seeded shuffle: the same order on the server and in the browser, so hydration matches.
  function shuffle(arr: number[]) {
    const a = [...arr];
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const [on, setOn] = React.useState(false);
  const order = React.useMemo(() => shuffle(Array.from({ length: CELLS }, (_, i) => i)), []);

  React.useEffect(() => {
    const id = 'anim-cb-pixel-fill';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `@media (prefers-reduced-motion: reduce) { [data-cb="pixel-fill"] span { transition: none !important; } }`;
    document.head.appendChild(el);
  }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"} type="checkbox" checked={on} onChange={() => setOn(v => !v)} className="absolute opacity-0 w-0 h-0" />
        <span
          data-cb="pixel-fill"
          className="grid h-7 w-7 rounded-[7px] border-2 overflow-hidden p-0.5 gap-px"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            borderColor: on ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))',
            transition: 'border-color 200ms ease',
          }}
        >
          {Array.from({ length: CELLS }, (_, i) => (
            <span
              key={i}
              className="rounded-[1px]"
              style={{
                background: on ? 'light-dark(#6d7179, #7d8087)' : 'transparent',
                transition: on
                  ? `background 80ms ease ${order[i] * 18}ms`
                  : `background 60ms ease ${(CELLS - 1 - order[i]) * 12}ms`,
              }}
            />
          ))}
        </span>
      </div>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
