"use client";

import * as React from "react";
export function CheckPopCheckbox({ label }: { label?: string }) {
  const [on, setOn] = React.useState(false);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative h-7 w-7 flex-shrink-0">
        <input aria-label={label ?? "Remember me"}
          type="checkbox"
          checked={on}
          onChange={() => setOn((v) => !v)}
          className="absolute opacity-0 w-0 h-0"
        />
        <span
          className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2"
          style={{
            background: on ? '#7c7c7c' : 'transparent',
            borderColor: on ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
            transition: 'background 200ms ease, border-color 200ms ease',
          }}
        >
          <svg
            width="13"
            height="10"
            viewBox="0 0 13 10"
            fill="none"
            aria-hidden="true"
            style={{
              transform: on ? 'scale(1)' : 'scale(0)',
              transformOrigin: '50% 50%',
              transition: on
                ? 'transform 350ms cubic-bezier(0.34,1.56,0.64,1)'
                : 'transform 150ms cubic-bezier(0.4,0,1,1)',
            }}
          >
            <path
              d="M1.5 5L5 8.5L11.5 1.5"
              stroke="#f6f6f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {label && <span className="select-none text-sm text-[#f6f6f6]/80">{label}</span>}
    </label>
  );
}
