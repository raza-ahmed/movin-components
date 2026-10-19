"use client";

import * as React from "react";
export function GlitchErrorInput({ placeholder = 'Required field…' }: { placeholder?: string }) {
  const [value, setValue] = React.useState('');
  const [glitchKey, setGlitchKey] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);

  const handleSubmit = () => {
    if (!value.trim()) { setHasError(true); setGlitchKey((k) => k + 1); }
    else setHasError(false);
  };

  return (
    <div className="w-full">
      <style>{`
        @keyframes glitch-jitter{
          0%{transform:translateX(0);filter:none}
          10%{transform:translateX(-4px);filter:invert(1)}
          20%{transform:translateX(4px);filter:brightness(1.8)}
          30%{transform:translateX(-3px);filter:invert(1)}
          40%{transform:translateX(3px);filter:brightness(0.6)}
          60%{transform:translateX(2px);filter:brightness(1.3)}
          100%{transform:translateX(0);filter:none}
        }
        @media(prefers-reduced-motion:reduce){.glitch-inp{animation:none!important}}
      `}</style>
      <input
        key={glitchKey}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { setValue(e.target.value); setHasError(false); }}
        aria-invalid={hasError}
        className="glitch-inp w-full rounded-lg border bg-[#f6f6f6]/[0.06] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none focus:ring-1 focus:ring-[#a7a7a7] transition-[border-color,background] duration-200"
        style={{
          borderColor: hasError ? '#f6f6f6' : 'rgba(246,246,246,0.15)',
          background: hasError ? 'rgba(246,246,246,0.1)' : 'rgba(246,246,246,0.06)',
          animation: glitchKey > 0 ? 'glitch-jitter 500ms ease forwards' : 'none',
        }}
      />
      {hasError && <p className="mt-1 text-xs text-[#ededed]">This field is required.</p>}
      <button
        onClick={handleSubmit}
        className="mt-2 w-full cursor-pointer rounded-md border border-[#f6f6f6]/15 bg-[#f6f6f6]/[0.08] py-1.5 text-[13px] text-[#f6f6f6]/70"
      >
        Submit (empty to trigger)
      </button>
    </div>
  );
}
