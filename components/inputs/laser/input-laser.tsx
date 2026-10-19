"use client";

import * as React from "react";
export function LaserInput({ placeholder = "Focus me…" }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);
  const [sweepKey, setSweepKey] = React.useState(0);

  const handleFocus = () => { setFocused(true); setSweepKey((k) => k + 1); };

  return (
    <div className="w-full">
      <style>{`
        @keyframes laser-sweep { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @media(prefers-reduced-motion:reduce){.laser-beam{animation:none!important;transform:scaleX(1)!important}}
      `}</style>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={() => setFocused(false)}
          className="w-full rounded-t-md border border-b-0 bg-[#f6f6f6]/[0.04] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none"
          style={{ borderColor: 'rgba(246,246,246,0.1)' }}
        />
        <div className="relative h-0.5 overflow-hidden" style={{ background: 'rgba(246,246,246,0.1)' }}>
          {focused && (
            <div
              key={sweepKey}
              className="laser-beam absolute inset-0"
              style={{
                background: 'linear-gradient(90deg,transparent,#a7a7a7,#f6f6f6,#a7a7a7,transparent)',
                boxShadow: '0 0 10px #a7a7a7,0 0 20px rgba(167,167,167,0.4)',
                transformOrigin: 'left center',
                animation: 'laser-sweep 300ms cubic-bezier(0.22,1,0.36,1) forwards',
              }}
            />
          )}
          <div
            className="absolute inset-0 transition-all"
            style={{
              background: focused ? '#c9c9c9' : 'transparent',
              boxShadow: focused ? '0 0 8px rgba(201,201,201,0.8)' : 'none',
              transitionDelay: '290ms',
            }}
          />
        </div>
      </div>
    </div>
  );
}
