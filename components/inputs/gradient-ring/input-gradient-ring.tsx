"use client";

import * as React from "react";
import { useEffect, useState } from "react";

const css = `
  @property --gr-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }
  @keyframes gr-spin { to { --gr-angle: 360deg; } }
  .gr-ring-active {
    background: conic-gradient(from var(--gr-angle), light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087), light-dark(#6d7179, #7d8087), light-dark(#5f626a, #a7abb2), light-dark(#6d7179, #7d8087));
    animation: gr-spin 2s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .gr-ring-active { animation: none; }
  }
`;

export function GradientRingInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const id = "gr-input-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
  }, []);

  return (
    <div className="relative">
      {/* Spinning gradient ring */}
      <div
        className={focused ? "gr-ring-active absolute -inset-0.5 rounded-[10px]" : "absolute -inset-0.5 rounded-[10px]"}
        style={{ opacity: focused ? 1 : 0, transition: "opacity 250ms ease" }}
      />
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className="relative w-full rounded-lg border border-[color:light-dark(#373a40,#f1f2f3)]/15 bg-[color:light-dark(#fbfcfd,#121417)] px-4 py-2.5 text-[color:light-dark(#373a40,#f1f2f3)] outline-none placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)]"
      />
    </div>
  );
}
