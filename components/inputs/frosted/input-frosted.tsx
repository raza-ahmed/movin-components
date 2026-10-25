"use client";

import * as React from "react";
export function FrostedInput({ placeholder = 'Frosted glass…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div
      className="inline-block rounded-xl p-6"
      style={{ background: 'linear-gradient(135deg,light-dark(rgba(95,98,106,0.2), rgba(167,171,178,0.2)),light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15)),light-dark(rgba(95,98,106,0.1), rgba(167,171,178,0.1)))' }}
    >
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-52 rounded-lg text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none"
        style={{
          padding: '10px 14px',
          background: focused ? 'light-dark(rgba(55,58,64,0.18), rgba(241,242,243,0.18))' : 'light-dark(rgba(55,58,64,0.06), rgba(241,242,243,0.06))',
          backdropFilter: focused ? 'blur(12px) saturate(1.5)' : 'blur(0px)',
          WebkitBackdropFilter: focused ? 'blur(12px) saturate(1.5)' : 'blur(0px)',
          border: `1px solid ${focused ? 'light-dark(rgba(55,58,64,0.35), rgba(241,242,243,0.35))' : 'light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))'}`,
          boxShadow: focused ? '0 4px 20px rgba(0,0,0,0.2),inset 0 1px 0 light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))' : 'none',
          transition: 'all 300ms ease',
        }}
      />
    </div>
  );
}
