"use client";

import * as React from "react";
const OPTIONS = ['Droplet', 'Wave', 'Surge'];

export function RippleRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const [rippleKey, setRippleKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setRippleKey(k => k + 1); };

  return (
    <div className="flex flex-col gap-3.5">
      <style>{`
        @keyframes ripple-out{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.8);opacity:0}}
        @media(prefers-reduced-motion:reduce){.ripple-ring{animation:none!important;opacity:0!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3">
            <input
              type="radio" name="ripple-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span className="relative h-[22px] w-[22px] flex-shrink-0">
              {checked && [0,1,2].map((i) => (
                <span key={`${rippleKey}-${i}`} className="ripple-ring absolute inset-0 rounded-full"
                  style={{
                    border:'1.5px solid rgba(124,124,124,0.7)',
                    animation:'ripple-out 900ms ease-out forwards',
                    animationDelay:`${i*130}ms`,
                  }}
                />
              ))}
              <span
                className="absolute inset-0 flex items-center justify-center rounded-full border-2 transition-all duration-200"
                style={{
                  borderColor: checked ? '#7c7c7c' : 'rgba(246,246,246,0.25)',
                  background: checked ? 'rgba(124,124,124,0.15)' : 'transparent',
                  boxShadow: checked ? '0 0 8px rgba(124,124,124,0.5)' : 'none',
                }}
              >
                <span style={{
                  width:8,height:8,borderRadius:'50%',background:'#7c7c7c',
                  transform:checked?'scale(1)':'scale(0)',
                  transition:'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
                }}/>
              </span>
            </span>
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{ color: checked ? 'rgba(246,246,246,0.92)' : 'rgba(246,246,246,0.55)' }}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
