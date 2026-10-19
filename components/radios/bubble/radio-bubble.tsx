"use client";

import { useState } from 'react';

const OPTIONS = ['Starter', 'Pro', 'Enterprise'];

export function BubbleRadioGroup() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3.5">
            <input
              type="radio"
              name="bubble-group"
              value={opt}
              checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="relative h-[30px] w-[30px] flex-shrink-0 rounded-full border-2 transition-all duration-300"
              style={{
                borderColor: checked ? 'rgba(167,167,167,0.6)' : 'rgba(124,124,124,0.3)',
                background: checked
                  ? 'radial-gradient(circle at 35% 30%, rgba(246,246,246,0.55) 0%, #a7a7a7 30%, #7c7c7c 65%, #3a3a3a 100%)'
                  : 'radial-gradient(circle at 50% 50%, rgba(246,246,246,0.04) 0%, rgba(124,124,124,0.08) 100%)',
                boxShadow: checked
                  ? '0 0 0 3px rgba(124,124,124,0.2), 0 4px 12px rgba(124,124,124,0.45), inset 0 1px 2px rgba(246,246,246,0.25)'
                  : 'inset 0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              <span
                className="absolute rounded-full"
                style={{
                  top: '16%', left: '22%', width: '38%', height: '28%',
                  background: 'rgba(246,246,246,0.65)',
                  filter: 'blur(2px)',
                  opacity: checked ? 1 : 0,
                  transform: checked ? 'scale(1)' : 'scale(0.4)',
                  transition: 'opacity 280ms ease, transform 300ms cubic-bezier(0.34,1.4,0.64,1)',
                }}
              />
            </span>
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? 'rgba(246,246,246,0.95)' : 'rgba(246,246,246,0.55)',
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
