"use client";

import * as React from "react";
const OPTIONS = ['Synapse', 'Cortex', 'Axon'];
const NODES = Array.from({length:6},(_,i)=>{
  const a=(i*60-90)*(Math.PI/180),r=14;
  return {x:Math.round(r*Math.cos(a)),y:Math.round(r*Math.sin(a))};
});
const C=20;

export function NeuralRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const [nodeKey, setNodeKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setNodeKey(k=>k+1); };

  return (
    <div className="flex flex-col gap-4">
      <style>{`
        @keyframes neural-pulse{0%{transform:scale(0);opacity:0}50%{transform:scale(1.4);opacity:1}100%{transform:scale(1);opacity:.85}}
        @media(prefers-reduced-motion:reduce){.neural-node{animation:none!important;transform:scale(1)!important;opacity:1!important}}
      `}</style>
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3.5">
            <input type="radio" name="neural-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)} className="absolute opacity-0 w-0 h-0 m-0"/>
            <span className="relative flex-shrink-0" style={{width:C*2,height:C*2}}>
              <svg width={C*2} height={C*2} className="absolute inset-0 overflow-visible">
                {NODES.map((n,i)=>(
                  <line key={i} x1={C} y1={C} x2={C+n.x} y2={C+n.y}
                    stroke={checked?'rgba(167,167,167,0.3)':'rgba(246,246,246,0.05)'}
                    strokeWidth=".75" style={{transition:'stroke 300ms ease'}}/>
                ))}
              </svg>
              {NODES.map((n,i)=>(
                <span key={`${nodeKey}-${i}`}
                  className={checked?'neural-node':''}
                  style={{
                    position:'absolute',width:5,height:5,borderRadius:'50%',
                    background:'#a7a7a7',
                    left:C+n.x-2.5,top:C+n.y-2.5,
                    opacity:checked?0:.15,
                    transform:checked?undefined:'scale(.6)',
                    animation:checked?`neural-pulse 400ms cubic-bezier(0.34,1.56,0.64,1) ${i*60}ms forwards`:'none',
                    boxShadow:checked?'0 0 6px rgba(167,167,167,0.8)':'none',
                  }}/>
              ))}
              <span
                className="absolute flex items-center justify-center rounded-full border-2 transition-all duration-200"
                style={{
                  width:14,height:14,left:C-7,top:C-7,
                  borderColor:checked?'#a7a7a7':'rgba(246,246,246,0.2)',
                  background:checked?'rgba(167,167,167,0.2)':'transparent',
                  boxShadow:checked?'0 0 10px rgba(167,167,167,0.5)':'none',
                }}
              >
                <span style={{width:5,height:5,borderRadius:'50%',background:'#a7a7a7',
                  transform:checked?'scale(1)':'scale(0)',
                  transition:'transform 250ms cubic-bezier(0.34,1.56,0.64,1)'}}/>
              </span>
            </span>
            <span className="select-none text-sm transition-colors duration-200"
              style={{fontWeight:checked?600:400,color:checked?'#a7a7a7':'rgba(246,246,246,0.55)'}}>
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
