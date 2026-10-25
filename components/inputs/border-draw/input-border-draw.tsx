"use client";

import * as React from "react";
export function BorderDrawInput({
  placeholder = "Focus me",
  type = "text",
}: {
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="relative w-full">
      {/* Top: left → right */}
      <span className={`absolute left-0 top-0 h-0.5 w-full origin-left bg-[color:light-dark(#5f626a,#a7abb2)] transition-transform duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-x-100" : "scale-x-0"}`} />
      {/* Right: top → bottom */}
      <span className={`absolute right-0 top-0 h-full w-0.5 origin-top bg-[color:light-dark(#5f626a,#a7abb2)] transition-transform delay-[220ms] duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-y-100" : "scale-y-0"}`} />
      {/* Bottom: right → left */}
      <span className={`absolute bottom-0 right-0 h-0.5 w-full origin-right bg-[color:light-dark(#5f626a,#a7abb2)] transition-transform delay-[440ms] duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-x-100" : "scale-x-0"}`} />
      {/* Left: bottom → top */}
      <span className={`absolute bottom-0 left-0 h-full w-0.5 origin-bottom bg-[color:light-dark(#5f626a,#a7abb2)] transition-transform delay-[660ms] duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-y-100" : "scale-y-0"}`} />
      {/* Reduced-motion fallback */}
      <span className={`pointer-events-none absolute inset-0 hidden border border-[color:light-dark(#5f626a,#a7abb2)] motion-reduce:block ${focused ? "opacity-100" : "opacity-0"}`} />

      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-[color:light-dark(#373a40,#f1f2f3)]/5 px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none"
      />
    </div>
  );
}
