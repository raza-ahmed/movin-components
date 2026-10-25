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
        className="glitch-inp w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none focus:ring-1 focus:ring-[color:light-dark(#5f626a,#a7abb2)] transition-[border-color,background] duration-200"
        style={{
          borderColor: hasError ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))',
          background: hasError ? 'light-dark(rgba(55,58,64,0.1), rgba(241,242,243,0.1))' : 'light-dark(rgba(55,58,64,0.06), rgba(241,242,243,0.06))',
          animation: glitchKey > 0 ? 'glitch-jitter 500ms ease forwards' : 'none',
        }}
      />
      {hasError && <p className="mt-1 text-xs text-[color:light-dark(#42454c,#e5e6e9)]">This field is required.</p>}
      <button
        onClick={handleSubmit}
        className="mt-2 w-full cursor-pointer rounded-md border border-[color:light-dark(#373a40,#f1f2f3)]/15 bg-[color:light-dark(#373a40,#f1f2f3)]/[0.08] py-1.5 text-[13px] text-[color:light-dark(#373a40ba,#f1f2f3b3)]"
      >
        Submit (empty to trigger)
      </button>
    </div>
  );
}
