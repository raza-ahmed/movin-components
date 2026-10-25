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
                  ? 'radial-gradient(circle at 50% 40%, light-dark(#50535b, #c6c8cd) 0%, light-dark(#5f626a, #a7abb2) 35%, light-dark(#6d7179, #7d8087) 100%)'
                  : 'light-dark(#f3f4f7, #1a1c1f)',
                boxShadow: checked
                  ? '0 0 0 2px light-dark(rgba(95,98,106,0.3), rgba(167,171,178,0.3)), 0 0 14px 6px light-dark(rgba(95,98,106,0.45), rgba(167,171,178,0.45)), 0 0 28px 10px light-dark(rgba(95,98,106,0.2), rgba(167,171,178,0.2)), inset 0 1px 2px light-dark(rgba(66,69,76,0.5), rgba(229,230,233,0.5))'
                  : '0 0 0 2px light-dark(rgba(55,58,64,0.06), rgba(241,242,243,0.06)), inset 0 2px 6px light-dark(rgba(0, 0, 0, 0.42), rgba(0,0,0,0.7))',
                animation: checked ? 'led-pulse 2s ease-in-out infinite' : 'none',
              }}
            >
              <span
                className="h-3 w-3 rounded-full transition-all duration-300"
                style={{
                  background: checked
                    ? 'radial-gradient(circle at 40% 30%, light-dark(#373a40, #f1f2f3) 0%, light-dark(#42454c, #e5e6e9) 40%, light-dark(#50535b, #c6c8cd) 100%)'
                    : 'light-dark(rgba(55,58,64,0.06), rgba(241,242,243,0.06))',
                  boxShadow: checked ? '0 0 6px 3px light-dark(rgba(66,69,76,0.7), rgba(229,230,233,0.7))' : 'none',
                }}
              />
            </span>
            <span
              className="select-none text-xs tracking-wide transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
