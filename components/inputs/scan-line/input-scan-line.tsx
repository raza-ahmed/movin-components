"use client";

import * as React from "react";
export function ScanLineInput({ placeholder = 'Focus for scan…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="w-full">
      <style>{`
        @keyframes input-scan-sweep{0%{top:0%;opacity:.8}80%{opacity:.8}100%{top:100%;opacity:0}}
        @media(prefers-reduced-motion:reduce){.scan-line-el{display:none!important}}
      `}</style>
      <div
        className="relative overflow-hidden rounded-lg border transition-[border-color] duration-200"
        style={{ borderColor: focused ? 'light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5))' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))' }}
      >
        <input
          type="text"
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="block w-full border-none bg-transparent px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none"
          style={{ background: focused ? 'light-dark(rgba(95,98,106,0.04), rgba(167,171,178,0.04))' : 'light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04))' }}
        />
        {focused && (
          <div
            className="scan-line-el pointer-events-none absolute left-0 right-0 h-0.5"
            style={{
              background: 'linear-gradient(90deg,transparent,light-dark(rgba(95,98,106,0.8), rgba(167,171,178,0.8)),light-dark(rgba(95,98,106,0.6), rgba(167,171,178,0.6)),transparent)',
              animation: 'input-scan-sweep 2s linear infinite',
            }}
          />
        )}
      </div>
    </div>
  );
}
