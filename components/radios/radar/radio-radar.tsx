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
                  className="absolute inset-0 rounded-full border-2 border-[color:light-dark(#50535b,#c6c8cd)]"
                  style={{ animation: 'radar-ring 1.1s ease-out infinite', animationDelay: '0ms' }}
                />
              )}
              {checked && (
                <span
                  className="absolute inset-0 rounded-full border-2 border-[color:light-dark(#50535b,#c6c8cd)]"
                  style={{ animation: 'radar-ring 1.1s ease-out infinite', animationDelay: '360ms' }}
                />
              )}
              <span
                className="absolute inset-0 rounded-full border-2 transition-all duration-200"
                style={{
                  borderColor: checked ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(95,98,106,0.25), rgba(167,171,178,0.25))',
                  background: checked
                    ? 'radial-gradient(circle at 40% 35%, light-dark(rgba(95,98,106,0.6), rgba(167,171,178,0.6)) 0%, light-dark(rgba(95,98,106,0.15), rgba(167,171,178,0.15)) 60%, transparent 100%)'
                    : 'transparent',
                  boxShadow: checked ? '0 0 8px light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5))' : 'none',
                }}
              />
              <span
                className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-[color:light-dark(#50535b,#c6c8cd)]"
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
              style={{ color: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(80,83,91,0.84), rgba(198,200,205,0.78))' }}
            >
              {`SIGNAL_${opt.toUpperCase()}`}
            </span>
          </label>
        );
      })}
    </div>
  );
}
