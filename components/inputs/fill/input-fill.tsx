"use client";

import * as React from "react";
import { useState } from "react";

export function FillInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-lg border transition-colors duration-200",
        focused ? "border-[color:light-dark(#5f626a,#a7abb2)]" : "border-[color:light-dark(#373a40,#f1f2f3)]/15",
      ].join(" ")}
    >
      {/* Fill layer */}
      <div
        className="pointer-events-none absolute inset-0 bg-[color:light-dark(#5f626a,#a7abb2)]/10 will-change-transform"
        style={{
          transform: focused ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 380ms cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className={[
          "relative w-full bg-transparent px-4 py-2.5 text-[color:light-dark(#373a40,#f1f2f3)] outline-none placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)]",
          focused ? "bg-transparent" : "bg-[color:light-dark(#373a40,#f1f2f3)]/[0.05]",
        ].join(" ")}
        style={{ transition: "background 380ms ease" }}
      />
    </div>
  );
}
