"use client";

import * as React from "react";
const OPTIONS = ['Target Alpha', 'Target Beta', 'Target Gamma'];
const B = 8;

export function Bracket({ corner, visible }: { corner: string; visible: boolean }) {
  const isTop = corner === 'tl' || corner === 'tr';
  const isLeft = corner === 'tl' || corner === 'bl';
  const off = visible ? 0 : 6;
  return (
    <span style={{
      position:'absolute',width:B,height:B,
      borderColor:'light-dark(#5f626a, #a7abb2)',borderStyle:'solid',borderWidth:0,
      borderTopWidth:isTop?2:0,borderBottomWidth:!isTop?2:0,
      borderLeftWidth:isLeft?2:0,borderRightWidth:!isLeft?2:0,
      top:isTop?off:undefined,bottom:!isTop?off:undefined,
      left:isLeft?off:undefined,right:!isLeft?off:undefined,
      opacity:visible?1:0.2,
      transition:'top 200ms cubic-bezier(0.34,1.56,0.64,1),bottom 200ms cubic-bezier(0.34,1.56,0.64,1),left 200ms cubic-bezier(0.34,1.56,0.64,1),right 200ms cubic-bezier(0.34,1.56,0.64,1),opacity 200ms ease',
    }}/>
  );
}

export function TargetingRadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2.5">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="relative flex cursor-pointer items-center gap-3 rounded px-3.5 py-2.5 transition-colors duration-200"
            style={{ background: checked ? 'light-dark(rgba(95,98,106,0.06), rgba(167,171,178,0.06))' : 'transparent' }}
          >
            <input
              type="radio" name="targeting-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            {(['tl','tr','bl','br']).map(c => <Bracket key={c} corner={c} visible={checked}/>)}
            <span
              className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
              style={{
                borderColor: checked ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))',
                boxShadow: checked ? '0 0 8px light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5))' : 'none',
              }}
            >
              <span style={{
                width:7,height:7,borderRadius:'50%',background:'light-dark(#5f626a, #a7abb2)',
                transform:checked?'scale(1)':'scale(0)',
                transition:'transform 250ms cubic-bezier(0.34,1.56,0.64,1)',
              }}/>
            </span>
            <span
              className="select-none text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
              style={{
                fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: checked ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
