"use client";

import * as React from "react";
const OPTIONS = ['AM Band', 'FM Band', 'Digital'];

export function SignalRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const [signalKey, setSignalKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setSignalKey(k => k + 1); };

  return (
    <div className="flex flex-col gap-3.5">
      <style>{`
        @keyframes signal-arc{0%{transform:scale(.5);opacity:.8}100%{transform:scale(2.4);opacity:0}}
        @media(prefers-reduced-motion:reduce){.signal-arc{animation:none!important;opacity:0!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3.5">
            <input type="radio" name="signal-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)} className="absolute opacity-0 w-0 h-0 m-0"/>
            <span className="relative h-6 w-6 flex-shrink-0">
              {checked && [0,1,2].map((i) => (
                <span key={`${signalKey}-${i}`} className="signal-arc pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    border:'1.5px solid light-dark(rgba(95,98,106,0.8), rgba(167,171,178,0.8))',
                    animation:`signal-arc 1000ms ease-out ${i*200}ms both`,
                  }}
                />
              ))}
              <span
                className="absolute inset-0 flex items-center justify-center rounded-full border-2 transition-all duration-200"
                style={{
                  borderColor: checked ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))',
                  background: checked ? 'light-dark(rgba(95,98,106,0.12), rgba(167,171,178,0.12))' : 'transparent',
                  boxShadow: checked ? '0 0 10px light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5))' : 'none',
                }}
              >
                <span style={{
                  width:8,height:8,borderRadius:'50%',background:'light-dark(#5f626a, #a7abb2)',
                  transform:checked?'scale(1)':'scale(0)',
                  transition:'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
                }}/>
              </span>
            </span>
            <span className="select-none text-sm transition-colors duration-200"
              style={{ fontWeight:checked?600:400, color:checked?'light-dark(#5f626a, #a7abb2)':'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))' }}>
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
