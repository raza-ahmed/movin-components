"use client";

import * as React from "react";
export function FrostedInput({ placeholder = 'Frosted glass…' }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div
      className="inline-block rounded-xl p-6"
      style={{ background: 'linear-gradient(135deg,rgba(167,167,167,0.2),rgba(167,167,167,0.15),rgba(167,167,167,0.1))' }}
    >
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-52 rounded-lg text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none"
        style={{
          padding: '10px 14px',
          background: focused ? 'rgba(246,246,246,0.18)' : 'rgba(246,246,246,0.06)',
          backdropFilter: focused ? 'blur(12px) saturate(1.5)' : 'blur(0px)',
          WebkitBackdropFilter: focused ? 'blur(12px) saturate(1.5)' : 'blur(0px)',
          border: `1px solid ${focused ? 'rgba(246,246,246,0.35)' : 'rgba(246,246,246,0.15)'}`,
          boxShadow: focused ? '0 4px 20px rgba(0,0,0,0.2),inset 0 1px 0 rgba(246,246,246,0.15)' : 'none',
          transition: 'all 300ms ease',
        }}
      />
    </div>
  );
}
