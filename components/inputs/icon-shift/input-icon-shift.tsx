"use client";

import * as React from "react";
import { useState } from "react";

export function IconShiftInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={[
        "flex items-center overflow-hidden rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.05] transition-all duration-200",
        focused
          ? "border-[color:light-dark(#5f626a,#a7abb2)] shadow-[0_0_0_3px_light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15))]"
          : "border-[color:light-dark(#373a40,#f1f2f3)]/15 shadow-none",
      ].join(" ")}
    >
      <div
        className="flex flex-shrink-0 items-center pl-3"
        style={{
          transform: focused ? "translateX(-2px) rotate(15deg)" : "translateX(0) rotate(0deg)",
          transition: "transform 300ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle
            cx="6.5" cy="6.5" r="4"
            stroke={focused ? "light-dark(#5f626a, #a7abb2)" : "light-dark(rgba(55,58,64,0.3), rgba(241,242,243,0.3))"}
            strokeWidth="1.5"
            style={{ transition: "stroke 200ms ease" }}
          />
          <line
            x1="9.5" y1="9.5" x2="13" y2="13"
            stroke={focused ? "light-dark(#5f626a, #a7abb2)" : "light-dark(rgba(55,58,64,0.3), rgba(241,242,243,0.3))"}
            strokeWidth="1.5" strokeLinecap="round"
            style={{ transition: "stroke 200ms ease" }}
          />
        </svg>
      </div>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className="w-full bg-transparent px-3 py-2.5 text-[color:light-dark(#373a40,#f1f2f3)] outline-none placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)]"
      />
    </div>
  );
}
