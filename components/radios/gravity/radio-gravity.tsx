"use client";

import * as React from "react";
const OPTIONS = ['Apex', 'Mid', 'Base'];

export function GravityRadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [dropKey, setDropKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setDropKey(k => k + 1); };

  return (
    <div className="flex flex-col gap-3">
      <style>{`
        @keyframes gravity-drop{0%{transform:scale(1) translateY(-16px);opacity:0}30%{opacity:1}55%{transform:scale(1) translateY(0)}65%{transform:scaleX(1.3) scaleY(0.7) translateY(0)}75%{transform:scaleX(.9) scaleY(1.1) translateY(-4px)}85%{transform:scaleX(1.05) scaleY(.97) translateY(0)}100%{transform:scale(1) translateY(0);opacity:1}}
        @media(prefers-reduced-motion:reduce){.gravity-drop{animation:none!important;transform:none!important;opacity:1!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3">
            <input
              type="radio" name="gravity-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span className="relative h-[22px] w-[22px] flex-shrink-0">
              <span
                className="absolute inset-0 rounded-full border-2 transition-colors duration-200"
                style={{ borderColor: checked ? '#a7a7a7' : 'rgba(246,246,246,0.2)' }}
              />
              {checked && (
                <span
                  key={dropKey}
                  className="gravity-drop absolute rounded-full"
                  style={{
                    top:3,left:3,right:3,bottom:3,
                    background:'radial-gradient(circle at 40% 35%,#a7a7a7,#7c7c7c)',
                    animation:'gravity-drop 600ms cubic-bezier(0.55,0,1,1) forwards',
                    boxShadow:'0 2px 8px rgba(167,167,167,0.5)',
                  }}
                />
              )}
            </span>
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 600 : 400,
                color: checked ? '#a7a7a7' : 'rgba(246,246,246,0.55)',
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
