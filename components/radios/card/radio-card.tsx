"use client";

import { useState } from 'react';

const OPTIONS = [
  { value: 'basic', label: 'Basic', sub: '5 projects · 2 GB storage' },
  { value: 'pro', label: 'Pro', sub: 'Unlimited projects · 50 GB' },
  { value: 'team', label: 'Team', sub: 'Everything in Pro · SSO' },
];

export function CardRadioGroup() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex w-60 flex-col gap-2.5">
      {OPTIONS.map((opt) => {
        const checked = selected === opt.value;
        return (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 py-3 transition-all duration-200"
            style={{
              borderColor: checked ? 'rgba(167,167,167,0.5)' : 'rgba(246,246,246,0.08)',
              background: checked ? 'rgba(167,167,167,0.07)' : 'rgba(246,246,246,0.03)',
              boxShadow: checked ? 'inset 3px 0 0 #a7a7a7' : 'inset 3px 0 0 transparent',
            }}
          >
            <input
              type="radio"
              name="card-group"
              value={opt.value}
              checked={checked}
              onChange={() => setSelected(opt.value)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-sm font-semibold transition-colors duration-200"
                style={{ color: checked ? 'rgba(246,246,246,0.95)' : 'rgba(246,246,246,0.6)' }}
              >
                {opt.label}
              </div>
              <div
                className="truncate text-[11px] transition-colors duration-200"
                style={{ color: checked ? 'rgba(167,167,167,0.85)' : 'rgba(246,246,246,0.55)' }}
              >
                {opt.sub}
              </div>
            </div>
            <span
              className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
              style={{ borderColor: checked ? '#a7a7a7' : 'rgba(246,246,246,0.2)' }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#a7a7a7]"
                style={{
                  transform: checked ? 'scale(1)' : 'scale(0)',
                  transition: checked
                    ? 'transform 260ms cubic-bezier(0.34,1.56,0.64,1)'
                    : 'transform 150ms ease-in',
                }}
              />
            </span>
          </label>
        );
      })}
    </div>
  );
}
