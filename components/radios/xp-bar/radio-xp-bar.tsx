"use client";

import * as React from "react";
const OPTIONS = [
  { label:'Novice', xp:'XP +50',  color:'#7c7c7c' },
  { label:'Adept',  xp:'XP +150', color:'#c9c9c9' },
  { label:'Master', xp:'XP +500', color:'#f6f6f6' },
];
const SPARKS = [{x:0,y:-10},{x:6,y:-8},{x:-6,y:-8},{x:8,y:-4}];

export function XPBarRadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [fillKey, setFillKey] = React.useState(0);

  const handleSelect = (label: string) => { setSelected(label); setFillKey(k => k + 1); };

  return (
    <div className="flex w-56 flex-col gap-2.5">
      <style>{`
        @keyframes xp-fill{from{width:0%}to{width:100%}}
        @keyframes xp-spark{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--sx),var(--sy)) scale(0);opacity:0}}
        @media(prefers-reduced-motion:reduce){.xp-fill-bar{animation:none!important;width:100%!important}.xp-spark{animation:none!important;opacity:0!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt.label;
        return (
          <label
            key={opt.label}
            className="flex cursor-pointer flex-col gap-1.5 rounded-lg border px-3 py-2.5 transition-all duration-200"
            style={{
              background: checked ? `${opt.color}0f` : 'rgba(246,246,246,0.02)',
              borderColor: checked ? `${opt.color}40` : 'rgba(246,246,246,0.07)',
            }}
          >
            <input
              type="radio" name="xp-radio" value={opt.label} checked={checked}
              onChange={() => handleSelect(opt.label)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <div className="flex items-center justify-between">
              <span className="select-none text-[13px] font-semibold tracking-wide transition-colors duration-200"
                style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', color: checked ? opt.color : 'rgba(246,246,246,0.55)' }}>
                {opt.label}
              </span>
              <span className="text-[10px] font-semibold tracking-wider transition-colors duration-200"
                style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', color: checked ? opt.color : 'rgba(246,246,246,0.55)' }}>
                {opt.xp}
              </span>
            </div>
            <div className="relative h-1 overflow-hidden rounded-sm" style={{ background:'rgba(246,246,246,0.08)' }}>
              {checked && (
                <div key={fillKey} className="xp-fill-bar h-full rounded-sm"
                  style={{
                    background:`linear-gradient(90deg,${opt.color}88,${opt.color}ff)`,
                    boxShadow:`0 0 6px ${opt.color}`,
                    animation:'xp-fill 600ms cubic-bezier(0.4,0,0.2,1) forwards',
                  }}
                />
              )}
              {checked && SPARKS.map((s,i) => (
                <span key={`${fillKey}-${i}`} className="xp-spark absolute top-1/2 right-0 h-[3px] w-[3px] rounded-full"
                  style={{
                    background:opt.color,
                    ['--sx']:`${s.x}px`,['--sy']:`${s.y}px`,
                    animation:`xp-spark 500ms ease-out ${300+i*40}ms forwards`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </label>
        );
      })}
    </div>
  );
}
