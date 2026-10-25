"use client";

import * as React from "react";
export function SlideToggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);

  return (
    <button
      type="button"
      role="switch" aria-label="Notifications"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={[
        "relative flex h-[30px] w-[52px] cursor-pointer items-center rounded-full border-none p-1 transition-colors duration-200 ease-in-out motion-reduce:transition-none",
        on ? "bg-[color:light-dark(#50535b,#c6c8cd)]" : "bg-[color:light-dark(#373a40,#f1f2f3)]/15",
      ].join(" ")}
    >
      <span
        className={[
          "block h-[22px] w-[22px] rounded-full bg-[color:light-dark(#373a40,#f1f2f3)] transition-transform duration-300 motion-reduce:transition-none",
          on ? "translate-x-[22px]" : "translate-x-0",
        ].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      />
    </button>
  );
}
