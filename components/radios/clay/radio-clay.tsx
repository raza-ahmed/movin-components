"use client";

import * as React from "react";
const OPTIONS = [
  { label: 'Chalk',  color: '#f6f6f6', shadow: 'rgba(246,246,246,0.35)' },
  { label: 'Stone',   color: '#c9c9c9', shadow: 'rgba(201,201,201,0.35)' },
  { label: 'Slate',  color: '#a7a7a7', shadow: 'rgba(167,167,167,0.35)' },
];

export function ClayRadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [squishKey, setSquishKey] = React.useState(0);

  const handleSelect = (label: string) => { setSelected(label); setSquishKey(k => k + 1); };

  return (
    <div className="flex flex-col gap-2.5">
      <style>{`
        @keyframes clay-squish{0%{transform:scale(1)}25%{transform:scaleX(1.35) scaleY(0.65)}60%{transform:scaleX(.85) scaleY(1.15)}80%{transform:scaleX(1.07) scaleY(.95)}100%{transform:scale(1)}}
        @media(prefers-reduced-motion:reduce){.clay-squish{animation:none!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt.label;
        return (
          <label
            key={opt.label}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition-all duration-200"
            style={{
              background: checked ? `${opt.color}18` : 'rgba(246,246,246,0.03)',
              borderColor: checked ? `${opt.color}60` : 'rgba(246,246,246,0.08)',
            }}
          >
            <input
              type="radio" name="clay-radio" value={opt.label} checked={checked}
              onChange={() => handleSelect(opt.label)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              key={`clay-${squishKey}-${opt.label}`}
              className={checked ? 'clay-squish' : ''}
              style={{
                width:24,height:24,borderRadius:'50%',flexShrink:0,
                background: checked
                  ? `radial-gradient(circle at 35% 35%,${opt.color}ff,${opt.color}bb)`
                  : 'rgba(246,246,246,0.08)',
                boxShadow: checked
                  ? `0 4px 12px ${opt.shadow},inset 0 -2px 4px rgba(0,0,0,.15),inset 0 2px 4px rgba(246,246,246,.3)`
                  : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                transition:'background 250ms ease,box-shadow 250ms ease',
                animation: checked ? 'clay-squish 500ms cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
              }}
            />
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{ fontWeight: checked ? 600 : 400, color: checked ? opt.color : 'rgba(246,246,246,0.55)' }}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
