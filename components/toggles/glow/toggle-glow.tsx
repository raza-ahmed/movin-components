"use client";

import * as React from "react";
export function GlowToggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);

  return (
    <button
      type="button"
      role="switch" aria-label="Notifications"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={[
        "relative flex h-[30px] w-[52px] cursor-pointer items-center rounded-full border-none p-1 transition-[background,box-shadow] duration-300 ease-in-out motion-reduce:transition-none",
        on ? "bg-[#a7a7a7]" : "bg-[#f6f6f6]/15",
      ].join(" ")}
      style={
        on
          ? { boxShadow: "0 0 0 4px rgba(167,167,167,0.25), 0 0 16px rgba(167,167,167,0.4)" }
          : { boxShadow: "0 0 0 0 transparent" }
      }
    >
      <span
        className={[
          "block h-[22px] w-[22px] rounded-full bg-[#f6f6f6] transition-transform duration-300 motion-reduce:transition-none",
          on ? "translate-x-[22px]" : "translate-x-0",
        ].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      />
    </button>
  );
}
