"use client";

import * as React from "react";
export function NeumorphicInput({ placeholder = "Soft surface…" }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="inline-block rounded-xl p-5" style={{ background: 'light-dark(#ebedf0, #232529)' }}>
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-52 rounded-lg border-none text-[15px] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none text-[color:light-dark(#373a40,#f1f2f3)]/85 transition-shadow duration-[250ms] ease-in-out motion-reduce:transition-none"
        style={{
          background: 'light-dark(#ebedf0, #232529)',
          padding: '11px 16px',
          outline: focused ? '1px solid light-dark(rgba(95,98,106,0.3), rgba(167,171,178,0.3))' : '1px solid transparent',
          boxShadow: focused
            ? 'inset 4px 4px 10px light-dark(rgba(0, 0, 0, 0.15), rgba(0,0,0,0.5)),inset -4px -4px 10px light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04))'
            : '5px 5px 14px light-dark(rgba(0, 0, 0, 0.15), rgba(0,0,0,0.5)),-5px -5px 14px light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04))',
        }}
      />
    </div>
  );
}
