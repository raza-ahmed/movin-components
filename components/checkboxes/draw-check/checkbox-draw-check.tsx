"use client";

import * as React from "react";
export function DrawCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        role="checkbox" aria-label={label ?? "Remember me"}
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] border-2 p-0 transition-[background,border-color] duration-200 ease-out motion-reduce:[&_path]:transition-none"
        style={{
          background: on ? 'light-dark(#6d7179, #7d8087)' : 'transparent',
          borderColor: on ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))',
          transform: on ? 'scale(1.08)' : 'scale(1)',
          transition:
            'background 200ms ease, border-color 200ms ease, transform 150ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
          <path
            d="M1.5 5L5 8.5L11.5 1.5"
            stroke="light-dark(#373a40, #f1f2f3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={on ? 0 : 1}
            style={{
              transition: on
                ? 'stroke-dashoffset 350ms cubic-bezier(0.16,1,0.3,1)'
                : 'stroke-dashoffset 200ms ease-in',
            }}
          />
        </svg>
      </button>
      {label && <span className="select-none text-sm text-[color:light-dark(#373a40,#f1f2f3)]/80">{label}</span>}
    </label>
  );
}
