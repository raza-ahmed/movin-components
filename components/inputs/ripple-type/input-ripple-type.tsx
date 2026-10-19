"use client";

import * as React from "react";
export function RippleTypeInput({ placeholder = 'Type here…' }: { placeholder?: string }) {
  const [rippleKey, setRippleKey] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setRippleKey((k) => k + 1);
  };

  return (
    <div className="w-full">
      <style>{`
        @keyframes ripple-border{
          0%{border-color:rgba(246,246,246,0.15);box-shadow:0 0 0 0 transparent}
          30%{border-color:#a7a7a7;box-shadow:0 0 0 3px rgba(167,167,167,0.2)}
          100%{border-color:rgba(167,167,167,0.5);box-shadow:0 0 0 0 transparent}
        }
        @media(prefers-reduced-motion:reduce){.ripple-inp{animation:none!important}}
      `}</style>
      <input
        key={rippleKey}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="ripple-inp w-full rounded-lg border bg-[#f6f6f6]/[0.06] px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none"
        style={{
          borderColor: focused ? 'rgba(167,167,167,0.5)' : 'rgba(246,246,246,0.15)',
          animation: rippleKey > 0 ? 'ripple-border 400ms ease forwards' : 'none',
        }}
      />
    </div>
  );
}
