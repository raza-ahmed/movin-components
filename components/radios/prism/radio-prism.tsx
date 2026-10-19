"use client";

import * as React from "react";
const OPTIONS = ['Standard', 'Express', 'Overnight'];

export function PrismRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);

  return (
    <div className="flex flex-col gap-1.5">
      <style>{`
        @keyframes prism-sweep{0%{background-position:200% center}100%{background-position:0% center}}
        @media(prefers-reduced-motion:reduce){.prism-label{animation:none!important;background-position:0% center!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-all duration-200"
            style={{
              borderColor: checked ? 'rgba(246,246,246,0.12)' : 'rgba(246,246,246,0.05)',
              background: checked ? 'rgba(246,246,246,0.03)' : 'transparent',
            }}
          >
            <input
              type="radio" name="prism-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
              style={{
                background: checked
                  ? 'linear-gradient(135deg,#7c7c7c,#a7a7a7,#c9c9c9,#ededed,#a7a7a7,#7c7c7c)'
                  : 'transparent',
                border: checked ? 'none' : '2px solid rgba(246,246,246,0.2)',
                boxShadow: checked ? '0 0 10px rgba(124,124,124,0.5)' : 'none',
              }}
            >
              {checked && <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(246,246,246,0.9)'}} />}
            </span>
            <span
              key={`prism-${opt}-${checked}`}
              className={checked ? 'prism-label select-none text-sm font-semibold' : 'select-none text-sm'}
              style={checked ? {
                backgroundImage:'linear-gradient(90deg,#7c7c7c,#a7a7a7,#c9c9c9,#ededed,#a7a7a7,#7c7c7c,#7c7c7c)',
                backgroundSize:'200% auto',
                WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',
                animation:'prism-sweep 800ms cubic-bezier(0.4,0,0.2,1) forwards',
              } : { color:'rgba(246,246,246,0.55)' }}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
