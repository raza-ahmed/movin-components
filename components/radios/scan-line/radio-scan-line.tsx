"use client";

import * as React from "react";
const OPTIONS = ['SIGNAL_A', 'SIGNAL_B', 'SIGNAL_C'];

export function ScanLineRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);

  return (
    <div className="flex w-56 flex-col gap-1.5">
      <style>{`
        @keyframes radio-scan-sweep{0%{transform:scaleX(0);opacity:1}65%{transform:scaleX(1);opacity:.9}100%{transform:scaleX(1);opacity:0}}
        @media(prefers-reduced-motion:reduce){.radio-scan-sweep{animation:none!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded px-3 py-2.5 transition-all duration-200"
            style={{
              background: checked ? 'rgba(201,201,201,0.04)' : 'transparent',
              borderBottom: `1px solid ${checked ? 'rgba(201,201,201,0.5)' : 'rgba(246,246,246,0.08)'}`,
            }}
          >
            <input
              type="radio"
              name="scan-radio"
              value={opt}
              checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            {checked && (
              <div
                key={`sweep-${opt}-${Date.now()}`}
                className="radio-scan-sweep pointer-events-none absolute bottom-0 left-0 right-0"
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg,transparent,#c9c9c9 40%,#c9c9c9)',
                  transformOrigin: 'left center',
                  animation: 'radio-scan-sweep 550ms cubic-bezier(0.4,0,0.2,1) forwards',
                  boxShadow: '0 0 8px rgba(201,201,201,0.8)',
                }}
              />
            )}
            <span
              className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
              style={{
                borderColor: checked ? '#c9c9c9' : 'rgba(246,246,246,0.2)',
                boxShadow: checked ? '0 0 6px rgba(201,201,201,0.5)' : 'none',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#c9c9c9',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 240ms cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </span>
            <span
              className="select-none text-xs tracking-widest transition-all duration-200"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: checked ? '#c9c9c9' : 'rgba(246,246,246,0.55)',
                textShadow: checked ? '0 0 8px rgba(201,201,201,0.6)' : 'none',
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
