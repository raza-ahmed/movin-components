"use client";

import * as React from "react";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ValidateInput({ placeholder = 'you@example.com' }: { placeholder?: string }) {
  const [value, setValue] = React.useState('');
  const [shakeKey, setShakeKey] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);

  const isValid = EMAIL_RE.test(value);
  const showCheck = value.length > 0 && isValid;
  const showError = submitted && !isValid;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isValid) setShakeKey((k) => k + 1);
  };

  return (
    <div className="w-full">
      <style>{`
        @keyframes icon-shake{0%,100%{transform:translateX(0) scale(1)}20%{transform:translateX(-3px) scale(1.1)}40%{transform:translateX(3px) scale(1.1)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}
        @media(prefers-reduced-motion:reduce){.val-icon{animation:none!important;transition:none!important}}
      `}</style>
      <div className="relative w-full">
        <input
          type="email"
          placeholder={placeholder}
          value={value}
          onChange={(e) => { setValue(e.target.value); setSubmitted(false); }}
          aria-invalid={showError}
          className="w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] py-2.5 pl-3.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none focus:ring-1 focus:ring-[color:light-dark(#5f626a,#a7abb2)] transition-[border-color] duration-200"
          style={{ paddingRight: 40, borderColor: showError ? 'light-dark(#373a40, #f1f2f3)' : showCheck ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))' }}
        />
        <div
          className="val-icon pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base transition-[opacity,color] duration-200"
          key={shakeKey}
          style={{
            opacity: showCheck || showError ? 1 : 0,
            color: showError ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(#50535b, #c6c8cd)',
            animation: shakeKey > 0 && showError ? 'icon-shake 400ms ease' : 'none',
          }}
        >
          {showError ? '✕' : '✓'}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-2 w-full rounded-md border border-[color:light-dark(#373a40,#f1f2f3)]/15 bg-[color:light-dark(#373a40,#f1f2f3)]/[0.08] py-1.5 text-[13px] text-[color:light-dark(#373a40ba,#f1f2f3b3)] cursor-pointer"
      >
        Submit
      </button>
    </div>
  );
}
