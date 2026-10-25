"use client";

import * as React from "react";
const OPTIONS = ['Hyperion', 'Solaris', 'Quantum'];
const W = 220, H = 48, R = 7;
const PERIMETER = 2 * (W + H);

export function NeonTraceRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const [traceKey, setTraceKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setTraceKey(k => k + 1); };

  return (
    <div className="flex flex-col gap-2">
      <style>{`
        @keyframes neon-trace{from{stroke-dashoffset:${PERIMETER}}to{stroke-dashoffset:0}}
        @media(prefers-reduced-motion:reduce){.neon-trace-path{animation:none!important;stroke-dashoffset:0}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            onClick={() => handleSelect(opt)}
            className="relative flex cursor-pointer items-center gap-2.5 pl-3.5"
            style={{
              width: W, height: H, borderRadius: R,
              background: checked ? 'light-dark(rgba(66,69,76,0.04), rgba(229,230,233,0.04))' : 'light-dark(rgba(55,58,64,0.02), rgba(241,242,243,0.02))',
              border: `1px solid ${checked ? 'light-dark(rgba(66,69,76,0.08), rgba(229,230,233,0.08))' : 'light-dark(rgba(55,58,64,0.07), rgba(241,242,243,0.07))'}`,
            }}
          >
            <input
              type="radio" name="neon-trace-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            {checked && (
              <svg key={`trace-${traceKey}`} width={W} height={H} className="pointer-events-none absolute inset-0 overflow-visible">
                <rect x=".75" y=".75" width={W-1.5} height={H-1.5} rx={R} ry={R}
                  fill="none" stroke="light-dark(#42454c, #e5e6e9)" strokeWidth="1.5"
                  strokeDasharray={PERIMETER}
                  className="neon-trace-path"
                  style={{
                    animation:'neon-trace 700ms cubic-bezier(0.4,0,0.2,1) forwards',
                    filter:'drop-shadow(0 0 3px light-dark(#42454c, #e5e6e9)) drop-shadow(0 0 8px light-dark(#42454c, #e5e6e9))',
                  }}
                />
              </svg>
            )}
            <span
              className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
              style={{ borderColor: checked ? 'light-dark(#42454c, #e5e6e9)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))' }}
            >
              <span style={{
                width:6,height:6,borderRadius:'50%',background:'light-dark(#42454c, #e5e6e9)',
                transform:checked?'scale(1)':'scale(0)',
                transition:'transform 280ms cubic-bezier(0.34,1.56,0.64,1)',
              }}/>
            </span>
            <span
              className="select-none text-[13px] font-medium tracking-wide transition-all duration-200"
              style={{
                color:checked?'light-dark(#42454c, #e5e6e9)':'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
                textShadow:checked?'0 0 8px light-dark(rgba(66,69,76,0.4), rgba(229,230,233,0.4))':'none',
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
