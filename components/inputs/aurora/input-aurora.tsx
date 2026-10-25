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
          background: 'conic-gradient(from var(--aurora-angle),light-dark(rgba(55,58,64,0.5), rgba(241,242,243,0.5)),light-dark(rgba(55,58,64,0.05), rgba(241,242,243,0.05)),light-dark(rgba(55,58,64,0.3), rgba(241,242,243,0.3)),light-dark(rgba(55,58,64,0.08), rgba(241,242,243,0.08)),light-dark(rgba(55,58,64,0.5), rgba(241,242,243,0.5)))',
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
        className="relative w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.04] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none transition-[background,border-color] duration-300"
        style={{ borderColor: focused ? 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))' }}
      />
    </div>
  );
}
