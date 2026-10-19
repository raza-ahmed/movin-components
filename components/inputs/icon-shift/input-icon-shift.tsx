"use client";

import * as React from "react";
import { useState } from "react";

export function IconShiftInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={[
        "flex items-center overflow-hidden rounded-lg border bg-[#f6f6f6]/[0.05] transition-all duration-200",
        focused
          ? "border-[#a7a7a7] shadow-[0_0_0_3px_rgba(167,167,167,0.15)]"
          : "border-[#f6f6f6]/15 shadow-none",
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
            stroke={focused ? "#a7a7a7" : "rgba(246,246,246,0.3)"}
            strokeWidth="1.5"
            style={{ transition: "stroke 200ms ease" }}
          />
          <line
            x1="9.5" y1="9.5" x2="13" y2="13"
            stroke={focused ? "#a7a7a7" : "rgba(246,246,246,0.3)"}
            strokeWidth="1.5" strokeLinecap="round"
            style={{ transition: "stroke 200ms ease" }}
          />
        </svg>
      </div>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className="w-full bg-transparent px-3 py-2.5 text-[#f6f6f6] outline-none placeholder:text-[#f6f6f6]/[0.55]"
      />
    </div>
  );
}
