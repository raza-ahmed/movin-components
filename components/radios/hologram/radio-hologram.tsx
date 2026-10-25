"use client";

import * as React from "react";
const OPTIONS = ['Projection A', 'Projection B', 'Projection C'];

export function HologramRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const [flickerKey, setFlickerKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setFlickerKey(k => k + 1); };

  return (
    <div className="flex w-56 flex-col gap-1.5">
      <style>{`
        @keyframes holo-flicker{0%{filter:brightness(1.5);transform:translateX(-1px);opacity:.6}15%{filter:brightness(2);transform:translateX(2px);opacity:1}30%{filter:brightness(1.2);transform:translateX(-1px);opacity:.8}45%{filter:brightness(1.8);transform:translateX(1px);opacity:1}100%{filter:brightness(1);transform:translateX(0);opacity:1}}
        @keyframes holo-scan{0%{background-position:0 0}100%{background-position:0 -20px}}
        @media(prefers-reduced-motion:reduce){.holo-flicker{animation:none!important}.holo-scanlines{display:none!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded px-3 py-2.5 transition-all duration-300"
            style={{
              background: checked ? 'light-dark(rgba(66,69,76,0.06), rgba(229,230,233,0.06))' : 'transparent',
              border: `1px solid ${checked ? 'light-dark(rgba(66,69,76,0.35), rgba(229,230,233,0.35))' : 'light-dark(rgba(55,58,64,0.07), rgba(241,242,243,0.07))'}`,
            }}
          >
            <input type="radio" name="hologram-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)} className="absolute opacity-0 w-0 h-0 m-0"/>
            {checked && (
              <div className="holo-scanlines pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,light-dark(rgba(66,69,76,0.04), rgba(229,230,233,0.04)) 2px,light-dark(rgba(66,69,76,0.04), rgba(229,230,233,0.04)) 4px)',
                  animation:'holo-scan 400ms linear infinite',
                }}/>
            )}
            <span
              className="relative z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
              style={{
                borderColor: checked ? 'light-dark(#42454c, #e5e6e9)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))',
                boxShadow: checked ? '0 0 8px light-dark(rgba(66,69,76,0.6), rgba(229,230,233,0.6))' : 'none',
              }}
            >
              <span style={{width:6,height:6,borderRadius:'50%',background:'light-dark(#42454c, #e5e6e9)',transform:checked?'scale(1)':'scale(0)',transition:'transform 250ms cubic-bezier(0.34,1.56,0.64,1)'}}/>
            </span>
            <span
              key={`holo-${flickerKey}-${opt}`}
              className={checked ? 'holo-flicker' : ''}
              style={{
                fontSize:13,fontWeight:checked?600:400,zIndex:1,userSelect:'none',letterSpacing:'0.03em',
                color: checked ? 'light-dark(#42454c, #e5e6e9)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
                textShadow: checked ? '0 0 8px light-dark(rgba(66,69,76,0.7), rgba(229,230,233,0.7)),0 0 20px light-dark(rgba(66,69,76,0.4), rgba(229,230,233,0.4))' : 'none',
                animation: checked ? 'holo-flicker 800ms ease-out forwards' : 'none',
              }}
            >{opt}</span>
          </label>
        );
      })}
    </div>
  );
}
