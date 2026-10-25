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
          className="w-full rounded-t-md border border-b-0 bg-[color:light-dark(#373a40,#f1f2f3)]/[0.04] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none"
          style={{ borderColor: 'light-dark(rgba(55,58,64,0.1), rgba(241,242,243,0.1))' }}
        />
        <div className="relative h-0.5 overflow-hidden" style={{ background: 'light-dark(rgba(55,58,64,0.1), rgba(241,242,243,0.1))' }}>
          {focused && (
            <div
              key={sweepKey}
              className="laser-beam absolute inset-0"
              style={{
                background: 'linear-gradient(90deg,transparent,light-dark(#5f626a, #a7abb2),light-dark(#373a40, #f1f2f3),light-dark(#5f626a, #a7abb2),transparent)',
                boxShadow: '0 0 10px light-dark(#5f626a, #a7abb2),0 0 20px light-dark(rgba(95,98,106,0.4), rgba(167,171,178,0.4))',
                transformOrigin: 'left center',
                animation: 'laser-sweep 300ms cubic-bezier(0.22,1,0.36,1) forwards',
              }}
            />
          )}
          <div
            className="absolute inset-0 transition-all"
            style={{
              background: focused ? 'light-dark(#50535b, #c6c8cd)' : 'transparent',
              boxShadow: focused ? '0 0 8px light-dark(rgba(80,83,91,0.8), rgba(198,200,205,0.8))' : 'none',
              transitionDelay: '290ms',
            }}
          />
        </div>
      </div>
    </div>
  );
}
