"use client";

import * as React from "react";
export function GlowInput({
  placeholder = "Search…",
  type = "text",
}: {
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <input
      type={type}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full rounded-lg border bg-[#f6f6f6]/5 px-3.5 py-2.5 text-[15px] text-[#f6f6f6] placeholder:text-[#f6f6f6]/[0.55] outline-none transition-[border-color,box-shadow] duration-200 ease-in-out motion-reduce:transition-none"
      style={
        focused
          ? {
              borderColor: "#a7a7a7",
              boxShadow: "0 0 0 3px rgba(167,167,167,0.2), 0 0 20px rgba(167,167,167,0.15)",
            }
          : {
              borderColor: "rgba(246,246,246,0.15)",
              boxShadow: "0 0 0 0 transparent",
            }
      }
    />
  );
}
