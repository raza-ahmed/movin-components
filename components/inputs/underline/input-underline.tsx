"use client";

import * as React from "react";
export function UnderlineInput({
  placeholder = "Your name",
  type = "text",
}: {
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border-b border-[#f6f6f6]/20 bg-transparent py-2 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none"
      />
      <span
        className={[
          "absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#a7a7a7] transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
          focused ? "scale-x-100" : "scale-x-0",
        ].join(" ")}
      />
    </div>
  );
}
