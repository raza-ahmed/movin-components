"use client";

import * as React from "react";
const OPTIONS = ['Silk', 'Velvet', 'Cotton'];
const BG = 'light-dark(#ebedf0, #232529)';
const DARK = 'rgba(0,0,0,0.5)';
const LIGHT = 'light-dark(#dbdde1, #2e3035)';

export function PillowRadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 rounded-2xl p-4" style={{ background: BG }}>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-shadow duration-200 motion-reduce:transition-none"
            style={{
              background: BG,
              boxShadow: checked
                ? `inset 4px 4px 8px ${DARK}, inset -4px -4px 8px ${LIGHT}`
                : `5px 5px 10px ${DARK}, -5px -5px 10px ${LIGHT}`,
            }}
          >
            <input
              type="radio" name="pillow-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full transition-shadow duration-200"
              style={{
                background: BG,
                boxShadow: checked
                  ? `inset 3px 3px 6px ${DARK}, inset -3px -3px 6px ${LIGHT}`
                  : `3px 3px 6px ${DARK}, -3px -3px 6px ${LIGHT}`,
              }}
            >
              <span style={{
                width:8,height:8,borderRadius:'50%',
                background: checked ? 'light-dark(#373a40, #f1f2f3)' : 'transparent',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), background 200ms ease',
              }}/>
            </span>
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(#5f626a, #a7abb2)',
              }}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
