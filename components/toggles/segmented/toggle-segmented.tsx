"use client";

import * as React from "react";
const OPTIONS = ['Off', 'On'] as const;
type Option = typeof OPTIONS[number];

export function SegmentedToggle({ defaultValue = 'Off' }: { defaultValue?: Option }) {
  const [active, setActive] = React.useState<Option>(defaultValue);
  return (
    <div role="group" aria-label="Toggle" className="relative inline-flex rounded-[10px] p-[3px]"
      style={{ background: 'light-dark(rgba(55,58,64,0.07), rgba(241,242,243,0.07))' }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[3px] top-[3px] rounded-[7px] border transition-[left] duration-[280ms] ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none"
        style={{
          left: active === 'On' ? 'calc(50%)' : '3px',
          width: 'calc(50% - 3px)',
          background: 'light-dark(rgba(55,58,64,0.13), rgba(241,242,243,0.13))',
          borderColor: 'light-dark(rgba(55,58,64,0.1), rgba(241,242,243,0.1))',
        }}
      />
      {OPTIONS.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => setActive(label)}
          className="relative z-10 cursor-pointer rounded-[7px] border-none bg-transparent px-[18px] py-[5px] font-[inherit] text-[13px] transition-colors duration-[220ms] ease-out"
          style={{
            color: active === label ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
            fontWeight: active === label ? 600 : 400,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
