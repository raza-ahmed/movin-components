"use client";

import * as React from "react";
const W = 320, H = 44, R = 8;
const PERIM = 2 * (W + H - 4 * R) + 2 * Math.PI * R;

export function ElectricInput({ placeholder = 'Focus to electrify…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);
  const [traceKey, setTraceKey] = React.useState(0);

  const handleFocus = () => { setFocused(true); setTraceKey((k) => k + 1); };

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes el-trace{from{stroke-dashoffset:${PERIM}}to{stroke-dashoffset:0}}
        @media(prefers-reduced-motion:reduce){.el-path{animation:none!important;stroke-dashoffset:0!important}}
      `}</style>
      <input
        type="text"
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        className="w-full rounded-lg border bg-[#f6f6f6]/[0.04] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none transition-[background,border-color] duration-300"
        style={{ borderColor: 'rgba(246,246,246,0.12)', background: focused ? 'rgba(201,201,201,0.04)' : undefined }}
      />
      <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H}>
        <rect
          key={traceKey}
          className="el-path"
          x={1} y={1} width={W - 2} height={H - 2} rx={R - 1}
          fill="none" stroke="#c9c9c9" strokeWidth={1.5} strokeLinecap="round"
          strokeDasharray={PERIM} strokeDashoffset={focused ? 0 : PERIM}
          style={{
            filter: focused ? 'drop-shadow(0 0 4px #c9c9c9) drop-shadow(0 0 8px rgba(201,201,201,0.5))' : 'none',
            animation: traceKey > 0 && focused ? 'el-trace 600ms cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
          }}
        />
      </svg>
    </div>
  );
}
