"use client";

import * as React from "react";
export function AuroraInput({ placeholder = 'Focus for aurora…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="relative w-full">
      <style>{`
        @property --aurora-angle{syntax:'<angle>';initial-value:0deg;inherits:false}
        @keyframes aurora-drift{to{--aurora-angle:360deg}}
        @media(prefers-reduced-motion:reduce){.aurora-bg{animation-play-state:paused!important}}
      `}</style>
      <div
        className="aurora-bg pointer-events-none absolute -inset-0.5 rounded-lg blur-lg transition-opacity duration-[400ms]"
        style={{
          background: 'conic-gradient(from var(--aurora-angle),rgba(246,246,246,0.5),rgba(246,246,246,0.05),rgba(246,246,246,0.3),rgba(246,246,246,0.08),rgba(246,246,246,0.5))',
          opacity: focused ? 1 : 0,
          animation: 'aurora-drift 4s linear infinite',
          animationPlayState: focused ? 'running' : 'paused',
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="relative w-full rounded-lg border bg-[#f6f6f6]/[0.04] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none transition-[background,border-color] duration-300"
        style={{ borderColor: focused ? 'rgba(246,246,246,0.25)' : 'rgba(246,246,246,0.12)' }}
      />
    </div>
  );
}
