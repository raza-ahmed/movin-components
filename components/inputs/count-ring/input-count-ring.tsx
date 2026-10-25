"use client";

import * as React from "react";
const MAX = 80;
const R = 14;
const C = 2 * Math.PI * R;

function ringColor(pct: number) {
  if (pct >= 1) return 'light-dark(#373a40, #f1f2f3)';
  if (pct >= 0.85) return 'light-dark(#50535b, #c6c8cd)';
  return 'light-dark(#6d7179, #7d8087)';
}

export function CountRingInput({ placeholder = 'Write something…' }: { placeholder?: string }) {
  const [value, setValue] = React.useState('');
  const pct = Math.min(value.length / MAX, 1);
  const color = ringColor(pct);
  const remaining = MAX - value.length;

  return (
    <div className="relative w-full">
      <style>{`@media(prefers-reduced-motion:reduce){.count-ring-c{transition:none!important}}`}</style>
      <input
        type="text"
        maxLength={MAX}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] py-2.5 pl-3.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none focus:ring-1 focus:ring-[color:light-dark(#5f626a,#a7abb2)] transition-[border-color] duration-200"
        style={{ paddingRight: 48, borderColor: pct >= 1 ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))' }}
      />
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8">
        <svg width={32} height={32} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={16} cy={16} r={R} fill="none" stroke="light-dark(rgba(55,58,64,0.1), rgba(241,242,243,0.1))" strokeWidth={2} />
          <circle
            className="count-ring-c"
            cx={16} cy={16} r={R}
            fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 200ms ease,stroke 200ms ease' }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold transition-colors duration-200"
          style={{ color: pct >= 0.85 ? color : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))' }}
        >
          {remaining}
        </span>
      </div>
    </div>
  );
}
