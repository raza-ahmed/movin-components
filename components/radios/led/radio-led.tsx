"use client";

import { useEffect, useRef, useState } from 'react';

const OPTIONS = ['Low', 'Mid', 'High'];

const KEYFRAMES = `
@keyframes led-pulse {
  0%   { opacity: 1;   transform: scale(1);    }
  50%  { opacity: 0.6; transform: scale(1.15); }
  100% { opacity: 1;   transform: scale(1);    }
}
`;

export function LEDRadioGroup() {
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
    <div className="flex items-center gap-7">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer flex-col items-center gap-2.5">
            <input
              type="radio"
              name="led-group"
              value={opt}
              checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300"
              style={{
                background: checked
                  ? 'radial-gradient(circle at 50% 40%, #c9c9c9 0%, #a7a7a7 35%, #7c7c7c 100%)'
                  : '#202020',
                boxShadow: checked
                  ? '0 0 0 2px rgba(167,167,167,0.3), 0 0 14px 6px rgba(167,167,167,0.45), 0 0 28px 10px rgba(167,167,167,0.2), inset 0 1px 2px rgba(237,237,237,0.5)'
                  : '0 0 0 2px rgba(246,246,246,0.06), inset 0 2px 6px rgba(0,0,0,0.7)',
                animation: checked ? 'led-pulse 2s ease-in-out infinite' : 'none',
              }}
            >
              <span
                className="h-3 w-3 rounded-full transition-all duration-300"
                style={{
                  background: checked
                    ? 'radial-gradient(circle at 40% 30%, #f6f6f6 0%, #ededed 40%, #c9c9c9 100%)'
                    : 'rgba(246,246,246,0.06)',
                  boxShadow: checked ? '0 0 6px 3px rgba(237,237,237,0.7)' : 'none',
                }}
              />
            </span>
            <span
              className="select-none text-xs tracking-wide transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? '#c9c9c9' : 'rgba(246,246,246,0.55)',
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
