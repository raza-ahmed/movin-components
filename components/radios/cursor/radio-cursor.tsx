"use client";

import * as React from "react";
const OPTIONS = ['Photon', 'Nebula', 'Aurora'];
const ITEM_H = 44;

export function CursorRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  const selectedIndex = OPTIONS.indexOf(selected);

  return (
    <div className="w-56">
      <div className="relative">
        <div
          className="absolute inset-x-0 rounded-lg border motion-reduce:transition-none"
          style={{
            height: ITEM_H,
            background: 'light-dark(rgba(109,113,121,0.15), rgba(125,128,135,0.15))',
            borderColor: 'light-dark(rgba(109,113,121,0.35), rgba(125,128,135,0.35))',
            boxShadow: '0 0 12px light-dark(rgba(109,113,121,0.2), rgba(125,128,135,0.2))',
            transform: `translateY(${selectedIndex * ITEM_H}px)`,
            transition: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        {OPTIONS.map((opt) => {
          const checked = selected === opt;
          return (
            <label key={opt} className="relative z-10 flex cursor-pointer items-center gap-2.5 pl-3.5" style={{ height: ITEM_H }}>
              <input
                type="radio"
                name="cursor-radio"
                value={opt}
                checked={checked}
                onChange={() => setSelected(opt)}
                className="absolute opacity-0 w-0 h-0 m-0"
              />
              <span
                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
                style={{ borderColor: checked ? 'light-dark(#6d7179, #7d8087)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))' }}
              >
                <span
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'light-dark(#6d7179, #7d8087)',
                    transform: checked ? 'scale(1)' : 'scale(0)',
                    transition: 'transform 240ms cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
              </span>
              <span
                className="select-none text-sm transition-colors duration-200"
                style={{
                  fontWeight: checked ? 600 : 400,
                  color: checked ? 'light-dark(rgba(55,58,64,0.95), rgba(241,242,243,0.95))' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
                }}
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
