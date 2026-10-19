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
        style={{ borderColor: focused ? 'rgba(167,167,167,0.5)' : 'rgba(246,246,246,0.12)' }}
      >
        <input
          type="text"
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="block w-full border-none bg-transparent px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none"
          style={{ background: focused ? 'rgba(167,167,167,0.04)' : 'rgba(246,246,246,0.04)' }}
        />
        {focused && (
          <div
            className="scan-line-el pointer-events-none absolute left-0 right-0 h-0.5"
            style={{
              background: 'linear-gradient(90deg,transparent,rgba(167,167,167,0.8),rgba(167,167,167,0.6),transparent)',
              animation: 'input-scan-sweep 2s linear infinite',
            }}
          />
        )}
      </div>
    </div>
  );
}
