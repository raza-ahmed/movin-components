"use client";

import * as React from "react";
export function WobbleInput({ placeholder = "Focus to wobble…" }: { placeholder?: string }) {
  const [wobbleKey, setWobbleKey] = React.useState(0);

  return (
    <div className="w-full">
      <style>{`
        @keyframes input-wobble {
          0%  {transform:rotate(0deg) translateX(0)}
          10% {transform:rotate(-2deg) translateX(-4px)}
          25% {transform:rotate(2deg) translateX(4px)}
          40% {transform:rotate(-1.5deg) translateX(-3px)}
          55% {transform:rotate(1deg) translateX(2px)}
          70% {transform:rotate(-0.5deg) translateX(-1px)}
          100%{transform:rotate(0deg) translateX(0)}
        }
        @media(prefers-reduced-motion:reduce){.wobble-input-el{animation:none!important}}
      `}</style>
      <input
        key={wobbleKey}
        type="text"
        placeholder={placeholder}
        onFocus={() => setWobbleKey((k) => k + 1)}
        className="wobble-input-el w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none"
        style={{
          borderColor: 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))',
          animation: wobbleKey > 0 ? 'input-wobble 400ms cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
        }}
      />
    </div>
  );
}
