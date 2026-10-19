"use client";

import * as React from "react";
const OPTIONS = ['Option A', 'Option B', 'Option C'];

export function RadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3.5">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-2.5">
            <input
              type="radio"
              name="radio-group"
              value={opt}
              checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 motion-reduce:[&_span]:transition-none"
              style={{
                borderColor: checked ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
                boxShadow: checked ? '0 0 0 3px rgba(124,124,124,0.20)' : '0 0 0 0px rgba(124,124,124,0)',
                transition: 'border-color 200ms ease, box-shadow 250ms ease',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#7c7c7c',
                  transform: checked ? 'scale(1)' : 'scale(0)',
                  transition: checked
                    ? 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)'
                    : 'transform 180ms ease-in',
                }}
              />
            </span>
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{ color: checked ? 'rgba(246,246,246,0.95)' : 'rgba(246,246,246,0.55)' }}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
