"use client";

import * as React from "react";
const OPTIONS = ['North', 'Center', 'South'];
const ITEM_H = 46;

export function MagneticRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[1]);
  const selectedIndex = OPTIONS.indexOf(selected);

  return (
    <div className="w-52">
      <div className="relative">
        <div
          className="absolute inset-x-0 rounded-lg border motion-reduce:transition-none"
          style={{
            height: ITEM_H,
            background: 'linear-gradient(135deg, light-dark(rgba(80,83,91,0.15), rgba(198,200,205,0.15)), light-dark(rgba(95,98,106,0.12), rgba(167,171,178,0.12)))',
            borderColor: 'light-dark(rgba(80,83,91,0.4), rgba(198,200,205,0.4))',
            boxShadow: '0 0 16px light-dark(rgba(80,83,91,0.2), rgba(198,200,205,0.2)), 0 0 4px light-dark(rgba(80,83,91,0.4), rgba(198,200,205,0.4))',
            transform: `translateY(${selectedIndex * ITEM_H}px)`,
            transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
        {OPTIONS.map((opt) => {
          const checked = selected === opt;
          return (
            <label key={opt} className="relative z-10 flex cursor-pointer items-center gap-2.5 pl-3.5 uppercase tracking-widest" style={{ height: ITEM_H }}>
              <input
                type="radio" name="magnetic-radio" value={opt} checked={checked}
                onChange={() => setSelected(opt)}
                className="absolute opacity-0 w-0 h-0 m-0"
              />
              <span
                className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
                style={{
                  borderColor: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))',
                  boxShadow: checked ? '0 0 8px light-dark(rgba(80,83,91,0.6), rgba(198,200,205,0.6))' : 'none',
                }}
              >
                <span style={{
                  width:7,height:7,borderRadius:'50%',background:'light-dark(#50535b, #c6c8cd)',
                  transform:checked?'scale(1)':'scale(0)',
                  transition:checked?'transform 400ms cubic-bezier(0.34,1.56,0.64,1)':'transform 180ms ease-in',
                }}/>
              </span>
              <span
                className="select-none text-[13px] font-semibold transition-colors duration-200"
                style={{ color: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))' }}
              >
                {opt}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
