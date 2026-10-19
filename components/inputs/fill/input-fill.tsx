"use client";

import * as React from "react";
import { useState } from "react";

export function FillInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-lg border transition-colors duration-200",
        focused ? "border-[#a7a7a7]" : "border-[#f6f6f6]/15",
      ].join(" ")}
    >
      {/* Fill layer */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#a7a7a7]/10 will-change-transform"
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
          "relative w-full bg-transparent px-4 py-2.5 text-[#f6f6f6] outline-none placeholder:text-[#f6f6f6]/[0.55]",
          focused ? "bg-transparent" : "bg-[#f6f6f6]/[0.05]",
        ].join(" ")}
        style={{ transition: "background 380ms ease" }}
      />
    </div>
  );
}
