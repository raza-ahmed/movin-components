"use client";

import * as React from "react";
export function CheckboxToggle({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        role="checkbox" aria-label={label ?? "Remember me"}
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] border-2 p-0 transition-[background,border-color] duration-200 ease-out motion-reduce:[&_svg]:transition-none"
        style={{
          background: on ? '#7c7c7c' : 'transparent',
          borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
        }}
      >
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"
          style={{
            transform: on ? 'scale(1)' : 'scale(0.3)',
            opacity: on ? 1 : 0,
            transition: 'transform 240ms cubic-bezier(0.34,1.56,0.64,1), opacity 180ms ease',
          }}
        >
          <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#f6f6f6" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {label && <span className="text-sm text-[#f6f6f6]/80 select-none">{label}</span>}
    </label>
  );
}
