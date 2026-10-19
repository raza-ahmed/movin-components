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
            background: isDone ? 'rgba(246,246,246,0.16)' : 'rgba(167,167,167,0.12)',
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
          className="relative w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none transition-[border-color] duration-200"
          style={{ borderColor: isDone ? '#f6f6f6' : focused ? 'rgba(167,167,167,0.5)' : 'rgba(246,246,246,0.15)' }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px]">
        <span className="text-[#f6f6f6]/[0.55]">{value.length} / {TARGET}</span>
        {isDone && <span className="text-[#f6f6f6]">Complete ✓</span>}
      </div>
    </div>
  );
}
