"use client";

import * as React from "react";
const OPTIONS = ['Layer 01', 'Layer 02', 'Layer 03'];

export function OffsetBlockRadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 p-2">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-3 rounded-sm px-3.5 py-[11px] motion-reduce:transition-none"
            style={{
              border: '2px solid light-dark(#373a40, #f1f2f3)',
              background: checked ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(#f3f4f7, #1a1c1f)',
              boxShadow: checked ? '0 0 0 light-dark(#373a40, #f1f2f3)' : '4px 4px 0 light-dark(#373a40, #f1f2f3)',
              transform: checked ? 'translate(4px,4px)' : 'translate(0,0)',
              transition: 'box-shadow 130ms cubic-bezier(0.22,1,0.36,1), transform 130ms cubic-bezier(0.22,1,0.36,1), background 130ms ease',
            }}
          >
            <input
              type="radio" name="offset-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full"
              style={{ border: `2.5px solid ${checked ? 'light-dark(#fbfcfd, #121417)' : 'light-dark(#373a40, #f1f2f3)'}` }}
            >
              <span style={{
                width:7,height:7,borderRadius:'50%',
                background: checked ? 'light-dark(#fbfcfd, #121417)' : 'light-dark(#373a40, #f1f2f3)',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 180ms cubic-bezier(0.34,1.56,0.64,1)',
              }}/>
            </span>
            <span
              className="select-none text-[13px] font-semibold tracking-wider transition-colors duration-100"
              style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', color: checked ? 'light-dark(#fbfcfd, #121417)' : 'light-dark(#373a40, #f1f2f3)' }}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}
