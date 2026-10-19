"use client";

import * as React from "react";
export function NeumorphicInput({ placeholder = "Soft surface…" }: { placeholder?: string }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="inline-block rounded-xl p-5" style={{ background: '#282828' }}>
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-52 rounded-lg border-none text-[15px] placeholder:text-[#f6f6f6]/[0.55] outline-none text-[#f6f6f6]/85 transition-shadow duration-[250ms] ease-in-out motion-reduce:transition-none"
        style={{
          background: '#282828',
          padding: '11px 16px',
          outline: focused ? '1px solid rgba(167,167,167,0.3)' : '1px solid transparent',
          boxShadow: focused
            ? 'inset 4px 4px 10px rgba(0,0,0,0.5),inset -4px -4px 10px rgba(246,246,246,0.04)'
            : '5px 5px 14px rgba(0,0,0,0.5),-5px -5px 14px rgba(246,246,246,0.04)',
        }}
      />
    </div>
  );
}
