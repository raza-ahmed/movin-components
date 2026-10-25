"use client";

import * as React from "react";
import { useState } from "react";

export function SplitInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  const panelBase =
    "pointer-events-none absolute top-0 bottom-0 z-10 w-1/2 bg-[color:light-dark(#f3f4f7,#1a1c1f)] transition-transform duration-[380ms] [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-lg border transition-colors duration-300",
        "bg-gradient-to-r from-[color:light-dark(#ebedf0,#232529)] to-[color:light-dark(#ebedf0,#232529)]",
        focused ? "border-[color:light-dark(#5f626a,#a7abb2)]" : "border-[color:light-dark(#373a40,#f1f2f3)]/15",
      ].join(" ")}
    >
      {/* Left door */}
      <div
        className={`${panelBase} left-0`}
        style={{ transform: focused ? "translateX(-100%)" : "translateX(0)" }}
      />
      {/* Right door */}
      <div
        className={`${panelBase} right-0`}
        style={{ transform: focused ? "translateX(100%)" : "translateX(0)" }}
      />
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className="relative z-20 w-full bg-transparent px-4 py-2.5 text-[color:light-dark(#373a40,#f1f2f3)] outline-none placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)]"
      />
    </div>
  );
}
