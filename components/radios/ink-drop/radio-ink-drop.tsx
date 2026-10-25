"use client";

import * as React from "react";
const OPTIONS = ['Graphite', 'Obsidian', 'Midnight'];

export function InkDropRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);

  return (
    <div className="flex flex-col gap-3">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3">
            <input
              type="radio" name="ink-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full border-2 transition-colors duration-200 motion-reduce:[&_span]:transition-none"
              style={{ borderColor: checked ? 'transparent' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))' }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:'radial-gradient(circle,light-dark(#dbdde1, #2e3035) 0%,light-dark(#ebedf0, #232529) 60%,light-dark(#fbfcfd, #121417) 100%)',
                  transform: checked ? 'scale(1)' : 'scale(0)',
                  transformOrigin:'center center',
                  transition: checked
                    ? 'transform 480ms cubic-bezier(0.22,1,0.36,1)'
                    : 'transform 250ms ease-in',
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span style={{
                  width:6,height:6,borderRadius:'50%',background:'light-dark(rgba(55,58,64,0.9), rgba(241,242,243,0.9))',
                  transform: checked ? 'scale(1)' : 'scale(0)',
                  transition:'transform 300ms cubic-bezier(0.34,1.56,0.64,1) 100ms',
                }}/>
              </span>
            </span>
            <span
              className="select-none text-sm transition-colors duration-200"
              style={{
                fontWeight: checked ? 500 : 400,
                color: checked ? 'light-dark(rgba(55,58,64,0.95), rgba(241,242,243,0.95))' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
