"use client";

import * as React from "react";
const TARGET = 30;

export function ProgressFillInput({ placeholder = `Write ${TARGET} chars…` }: { placeholder?: string }) {
  const [value, setValue] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const pct = Math.min(value.length / TARGET, 1);
  const isDone = pct >= 1;

  return (
    <div className="w-full">
      <style>{`@media(prefers-reduced-motion:reduce){.pf-bar{transition:none!important}}`}</style>
      <div className="relative w-full">
        <div
          className="pf-bar pointer-events-none absolute inset-px rounded-[7px] origin-left"
          style={{
            background: isDone ? 'light-dark(rgba(55,58,64,0.16), rgba(241,242,243,0.16))' : 'light-dark(rgba(95,98,106,0.12), rgba(167,171,178,0.12))',
            transform: `scaleX(${pct})`,
            transition: 'transform 200ms ease, background 300ms ease',
          }}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="relative w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none transition-[border-color] duration-200"
          style={{ borderColor: isDone ? 'light-dark(#373a40, #f1f2f3)' : focused ? 'light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5))' : 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))' }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px]">
        <span className="text-[color:light-dark(#373a40ba,#f1f2f39e)]">{value.length} / {TARGET}</span>
        {isDone && <span className="text-[color:light-dark(#373a40,#f1f2f3)]">Complete ✓</span>}
      </div>
    </div>
  );
}
