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
                borderColor: checked ? 'light-dark(rgba(95,98,106,0.6), rgba(167,171,178,0.6))' : 'light-dark(rgba(109,113,121,0.3), rgba(125,128,135,0.3))',
                background: checked
                  ? 'radial-gradient(circle at 35% 30%, light-dark(rgba(55,58,64,0.55), rgba(241,242,243,0.55)) 0%, light-dark(#5f626a, #a7abb2) 30%, light-dark(#6d7179, #7d8087) 65%, light-dark(#dbdde1, #2e3035) 100%)'
                  : 'radial-gradient(circle at 50% 50%, light-dark(rgba(55,58,64,0.04), rgba(241,242,243,0.04)) 0%, light-dark(rgba(109,113,121,0.08), rgba(125,128,135,0.08)) 100%)',
                boxShadow: checked
                  ? '0 0 0 3px light-dark(rgba(109,113,121,0.2), rgba(125,128,135,0.2)), 0 4px 12px light-dark(rgba(109,113,121,0.45), rgba(125,128,135,0.45)), inset 0 1px 2px light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))'
                  : 'inset 0 2px 4px light-dark(rgba(0, 0, 0, 0.09), rgba(0,0,0,0.3))',
              }}
            >
              <span
                className="absolute rounded-full"
                style={{
                  top: '16%', left: '22%', width: '38%', height: '28%',
                  background: 'light-dark(rgba(55,58,64,0.65), rgba(241,242,243,0.65))',
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
                color: checked ? 'light-dark(rgba(55,58,64,0.95), rgba(241,242,243,0.95))' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
