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
      className="w-full rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/5 px-3.5 py-2.5 text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] placeholder:text-[color:light-dark(#373a40ba,#f1f2f39e)] outline-none transition-[border-color,box-shadow] duration-200 ease-in-out motion-reduce:transition-none"
      style={
        focused
          ? {
              borderColor: "light-dark(#5f626a, #a7abb2)",
              boxShadow: "0 0 0 3px light-dark(rgba(95,98,106,0.2), rgba(167,171,178,0.2)), 0 0 20px light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15))",
            }
          : {
              borderColor: "light-dark(rgba(55,58,64,0.15), rgba(241,242,243,0.15))",
              boxShadow: "0 0 0 0 transparent",
            }
      }
    />
  );
}
