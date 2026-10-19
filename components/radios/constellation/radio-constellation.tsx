"use client";

import * as React from "react";
const OPTIONS = ['Orion', 'Cassiopeia', 'Lyra'];
const STARS = [{x:0,y:-12},{x:11,y:-6},{x:7,y:8},{x:-7,y:8},{x:-11,y:-6}];
const LINES = [[0,1],[1,2],[2,3],[3,4],[4,0]];
const C = 14;

export function ConstellationRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const [starKey, setStarKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setStarKey(k=>k+1); };

  return (
    <div className="flex flex-col gap-4">
      <style>{`
        @keyframes star-appear{0%{transform:scale(0);opacity:0}70%{transform:scale(1.4);opacity:1}100%{transform:scale(1);opacity:1}}
        @keyframes star-twinkle{0%,100%{opacity:1}50%{opacity:.3}}
        @media(prefers-reduced-motion:reduce){.star-dot{animation:none!important;opacity:1!important;transform:scale(1)!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3.5">
            <input type="radio" name="constellation-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)} className="absolute opacity-0 w-0 h-0 m-0"/>
            <span className="relative flex-shrink-0" style={{width:C*2,height:C*2}}>
              <svg width={C*2} height={C*2} className="absolute inset-0 overflow-visible">
                {checked && LINES.map(([a,b],i)=>(
                  <line key={`${starKey}-l-${i}`}
                    x1={C+STARS[a].x} y1={C+STARS[a].y} x2={C+STARS[b].x} y2={C+STARS[b].y}
                    stroke="rgba(201,201,201,0.25)" strokeWidth=".75"
                    style={{opacity:0,animation:`star-appear 400ms ease-out ${50+i*60}ms forwards`}}/>
                ))}
              </svg>
              {checked && STARS.map((s,i)=>(
                <span key={`${starKey}-s-${i}`} className="star-dot absolute rounded-full"
                  style={{
                    width:4,height:4,background:'#c9c9c9',
                    left:C+s.x-2,top:C+s.y-2,
                    boxShadow:'0 0 4px rgba(201,201,201,0.9)',
                    animation:`star-appear 350ms cubic-bezier(0.34,1.56,0.64,1) ${i*70}ms both,star-twinkle ${1200+i*300}ms ease-in-out ${i*70+400}ms infinite`,
                  }}/>
              ))}
              <span
                className="absolute flex items-center justify-center rounded-full border-2 transition-all duration-200"
                style={{
                  width:16,height:16,left:C-8,top:C-8,
                  borderColor:checked?'#c9c9c9':'rgba(246,246,246,0.2)',
                  background:checked?'rgba(201,201,201,0.12)':'transparent',
                  boxShadow:checked?'0 0 8px rgba(201,201,201,0.5)':'none',
                }}
              >
                <span style={{width:6,height:6,borderRadius:'50%',background:'#c9c9c9',
                  transform:checked?'scale(1)':'scale(0)',
                  transition:'transform 250ms cubic-bezier(0.34,1.56,0.64,1)'}}/>
              </span>
            </span>
            <span className="select-none text-sm transition-colors duration-200"
              style={{fontWeight:checked?500:400,color:checked?'#c9c9c9':'rgba(246,246,246,0.55)'}}>
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
