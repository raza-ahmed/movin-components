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
          0%{border-color:light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15));box-shadow:0 0 0 0 transparent}
          30%{border-color:light-dark(#5f626a, #a7abb2);box-shadow:0 0 0 3px light-dark(rgba(95,98,106,0.2), rgba(167,171,178,0.2))}
          100%{border-color:light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5));box-shadow:0 0 0 0 transparent}
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
        className="ripple-inp w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.06] px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none"
        style={{
          borderColor: focused ? 'light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5))' : 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))',
          animation: rippleKey > 0 ? 'ripple-border 400ms ease forwards' : 'none',
        }}
      />
    </div>
  );
}
