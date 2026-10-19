"use client";

import * as React from "react";
const MAX = 80;
const R = 14;
const C = 2 * Math.PI * R;

function ringColor(pct: number) {
  if (pct >= 1) return '#f6f6f6';
  if (pct >= 0.85) return '#c9c9c9';
  return '#7c7c7c';
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
        className="w-full rounded-lg border bg-[#f6f6f6]/[0.06] py-2.5 pl-3.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none focus:ring-1 focus:ring-[#a7a7a7] transition-[border-color] duration-200"
        style={{ paddingRight: 48, borderColor: pct >= 1 ? '#f6f6f6' : 'rgba(246,246,246,0.15)' }}
      />
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8">
        <svg width={32} height={32} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={16} cy={16} r={R} fill="none" stroke="rgba(246,246,246,0.1)" strokeWidth={2} />
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
          style={{ color: pct >= 0.85 ? color : 'rgba(246,246,246,0.55)' }}
        >
          {remaining}
        </span>
      </div>
    </div>
  );
}
