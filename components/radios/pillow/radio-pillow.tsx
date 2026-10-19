"use client";

import * as React from "react";
const OPTIONS = ['Silk', 'Velvet', 'Cotton'];
const BG = '#282828';
const DARK = 'rgba(0,0,0,0.5)';
const LIGHT = '#3a3a3a';

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
                background: checked ? '#f6f6f6' : 'transparent',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), background 200ms ease',
              }}/>
            </span>
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? '#f6f6f6' : '#a7a7a7',
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
