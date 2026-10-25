"use client";

import * as React from "react";
import { useState } from "react";

const MAX = 40;

export function CountInput(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "maxLength">) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const count = value.length;
  const pct = count / MAX;
  const show = focused || count > 0;

  const barColor =
    pct >= 1 ? "bg-[color:light-dark(#373a40,#f1f2f3)]" : pct >= 0.8 ? "bg-[color:light-dark(#50535b,#c6c8cd)]" : "bg-[color:light-dark(#6d7179,#7d8087)]";
  const textColor =
    pct >= 1 ? "text-[color:light-dark(#373a40,#f1f2f3)]" : pct >= 0.8 ? "text-[color:light-dark(#50535b,#c6c8cd)]" : "text-[color:light-dark(#373a40ba,#f1f2f39e)]";

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={[
          "rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/[0.05] transition-colors duration-200",
          focused ? "border-[color:light-dark(#5f626a,#a7abb2)]" : "border-[color:light-dark(#373a40,#f1f2f3)]/15",
        ].join(" ")}
      >
        <input
          {...props}
          maxLength={MAX}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className="w-full bg-transparent px-4 py-2.5 text-[color:light-dark(#373a40,#f1f2f3)] outline-none placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)]"
        />
      </div>

      <div
        className="flex items-center gap-2"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-[color:light-dark(#373a40,#f1f2f3)]/10">
          <div
            className={`h-full rounded-full transition-all duration-150 ${barColor}`}
            style={{ width: `${Math.min(pct * 100, 100)}%` }}
          />
        </div>
        <span className={`text-[11px] tabular-nums transition-colors duration-200 ${textColor}`}>
          {count}/{MAX}
        </span>
      </div>
    </div>
  );
}
