"use client";

import * as React from "react";
const OPTIONS = ['Draft', 'Approved', 'Rejected'];

export function StampRadioGroup() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2.5 p-1">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-3 rounded px-3.5 py-2.5 motion-reduce:transition-none"
            style={{
              border: `2.5px solid ${checked ? 'light-dark(#fbfcfd, #121417)' : 'light-dark(rgba(55,58,64,0.2), rgba(241,242,243,0.2))'}`,
              background: checked ? 'light-dark(#373a40, #f1f2f3)' : 'transparent',
              transform: checked ? 'scale(0.97)' : 'scale(1)',
              boxShadow: checked
                ? 'inset 2px 2px 0 rgba(0,0,0,0.4), inset -1px -1px 0 rgba(0,0,0,0.15)'
                : '2px 2px 0 light-dark(rgba(55,58,64,0.08), rgba(241,242,243,0.08))',
              transition: 'transform 120ms cubic-bezier(0.34,1.56,0.64,1), background 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
            }}
          >
            <input
              type="radio" name="stamp-radio" value={opt} checked={checked}
              onChange={() => setSelected(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <span
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all duration-150"
              style={{
                border: `2.5px solid ${checked ? 'light-dark(#fbfcfd, #121417)' : 'light-dark(rgba(55,58,64,0.25), rgba(241,242,243,0.25))'}`,
                background: checked ? 'light-dark(#fbfcfd, #121417)' : 'transparent',
              }}
            >
              {checked && <span style={{width:7,height:7,borderRadius:'50%',background:'light-dark(#373a40, #f1f2f3)'}}/>}
            </span>
            <span
              className="select-none text-sm uppercase tracking-wide transition-colors duration-150"
              style={{
                fontWeight: checked ? 600 : 500,
                color: checked ? 'light-dark(#fbfcfd, #121417)' : 'light-dark(rgba(55,58,64,0.73), rgba(241,242,243,0.62))',
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
