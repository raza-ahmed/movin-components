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
      {/* Top — left → right */}
      <span className={`absolute left-0 top-0 h-0.5 w-full origin-left bg-[#a7a7a7] transition-transform duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-x-100" : "scale-x-0"}`} />
      {/* Right — top → bottom */}
      <span className={`absolute right-0 top-0 h-full w-0.5 origin-top bg-[#a7a7a7] transition-transform delay-[220ms] duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-y-100" : "scale-y-0"}`} />
      {/* Bottom — right → left */}
      <span className={`absolute bottom-0 right-0 h-0.5 w-full origin-right bg-[#a7a7a7] transition-transform delay-[440ms] duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-x-100" : "scale-x-0"}`} />
      {/* Left — bottom → top */}
      <span className={`absolute bottom-0 left-0 h-full w-0.5 origin-bottom bg-[#a7a7a7] transition-transform delay-[660ms] duration-[220ms] ease-in-out motion-reduce:hidden ${focused ? "scale-y-100" : "scale-y-0"}`} />
      {/* Reduced-motion fallback */}
      <span className={`pointer-events-none absolute inset-0 hidden border border-[#a7a7a7] motion-reduce:block ${focused ? "opacity-100" : "opacity-0"}`} />

      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border border-[#f6f6f6]/10 bg-[#f6f6f6]/5 px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none"
      />
    </div>
  );
}
