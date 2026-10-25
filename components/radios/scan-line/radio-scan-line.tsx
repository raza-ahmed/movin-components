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
              background: checked ? 'light-dark(rgba(80,83,91,0.04), rgba(198,200,205,0.04))' : 'transparent',
              borderBottom: `1px solid ${checked ? 'light-dark(rgba(80,83,91,0.5), rgba(198,200,205,0.5))' : 'light-dark(rgba(55,58,64,0.08), rgba(241,242,243,0.08))'}`,
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
                  background: 'linear-gradient(90deg,transparent,light-dark(#50535b, #c6c8cd) 40%,light-dark(#50535b, #c6c8cd))',
                  transformOrigin: 'left center',
                  animation: 'radio-scan-sweep 550ms cubic-bezier(0.4,0,0.2,1) forwards',
                  boxShadow: '0 0 8px light-dark(rgba(80,83,91,0.8), rgba(198,200,205,0.8))',
                }}
              />
            )}
            <span
              className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
              style={{
                borderColor: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))',
                boxShadow: checked ? '0 0 6px light-dark(rgba(80,83,91,0.5), rgba(198,200,205,0.5))' : 'none',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'light-dark(#50535b, #c6c8cd)',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 240ms cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </span>
            <span
              className="select-none text-xs tracking-widest transition-all duration-200"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
                textShadow: checked ? '0 0 8px light-dark(rgba(80,83,91,0.6), rgba(198,200,205,0.6))' : 'none',
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
