"use client";

import { useEffect, useRef, useState } from 'react';

const OPTIONS = ['Alpha', 'Beta', 'Gamma'];

const KEYFRAMES = `
@keyframes radar-ring {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(2.6); opacity: 0;   }
}
`;

export function RadarRadioGroup() {
  const [selected, setSelected] = useState<string | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  return (
    <div className="flex flex-col gap-4 font-mono">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3.5">
            <input
              type="radio"
              name="radar-group"
              value={opt}
              checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span className="relative h-[22px] w-[22px] flex-shrink-0">
              {checked && (
                <span
                  className="absolute inset-0 rounded-full border-2 border-[#c9c9c9]"
                  style={{ animation: 'radar-ring 1.1s ease-out infinite', animationDelay: '0ms' }}
                />
              )}
              {checked && (
                <span
                  className="absolute inset-0 rounded-full border-2 border-[#c9c9c9]"
                  style={{ animation: 'radar-ring 1.1s ease-out infinite', animationDelay: '360ms' }}
                />
              )}
              <span
                className="absolute inset-0 rounded-full border-2 transition-all duration-200"
                style={{
                  borderColor: checked ? '#a7a7a7' : 'rgba(167,167,167,0.25)',
                  background: checked
                    ? 'radial-gradient(circle at 40% 35%, rgba(167,167,167,0.6) 0%, rgba(167,167,167,0.15) 60%, transparent 100%)'
                    : 'transparent',
                  boxShadow: checked ? '0 0 8px rgba(167,167,167,0.5)' : 'none',
                }}
              />
              <span
                className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-[#c9c9c9]"
                style={{
                  transform: checked
                    ? 'translate(-50%, -50%) scale(1)'
                    : 'translate(-50%, -50%) scale(0)',
                  transition: checked
                    ? 'transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'transform 160ms ease-in',
                }}
              />
            </span>
            <span
              className="select-none text-[13px] tracking-widest transition-colors duration-200"
              style={{ color: checked ? '#c9c9c9' : 'rgba(201,201,201,0.65)' }}
            >
              {`SIGNAL_${opt.toUpperCase()}`}
            </span>
          </label>
        );
      })}
    </div>
  );
}
