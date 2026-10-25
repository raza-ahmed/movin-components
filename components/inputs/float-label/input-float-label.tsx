"use client";

import * as React from "react";
export function FloatLabelInput({
  id,
  label,
  type = "text",
}: {
  id: string;
  label: string;
  type?: string;
}) {
  const [focused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState("");
  const lifted = focused || value.length > 0;

  return (
    <div
      className={[
        "relative w-full cursor-text rounded-lg border bg-[color:light-dark(#373a40,#f1f2f3)]/5 transition-colors duration-200",
        focused ? "border-[color:light-dark(#5f626a,#a7abb2)]" : "border-[color:light-dark(#373a40,#f1f2f3)]/15",
      ].join(" ")}
    >
      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute left-3.5 transition-all duration-200 ease-in-out motion-reduce:transition-none",
          lifted
            ? "top-2 text-[11px] text-[color:light-dark(#5f626a,#a7abb2)]"
            : "top-1/2 -translate-y-1/2 text-[15px] text-[color:light-dark(#373a40ba,#f1f2f39e)]",
        ].join(" ")}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={[
          "w-full bg-transparent text-[15px] text-[color:light-dark(#373a40,#f1f2f3)] outline-none transition-[padding] duration-200 motion-reduce:transition-none",
          lifted ? "px-3.5 pb-2.5 pt-[22px]" : "px-3.5 py-3.5",
        ].join(" ")}
      />
    </div>
  );
}
