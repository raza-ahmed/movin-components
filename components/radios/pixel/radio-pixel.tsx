"use client";

import * as React from "react";
const OPTIONS = ['Player 1', 'Player 2', 'Player 3'];
const GRID = 4, PIXEL_SIZE = 4, PIXEL_GAP = 1;

export function PixelDot({ checked, pixelKey }: { checked: boolean; pixelKey: number }) {
  return (
    <span style={{ display:'grid', gridTemplateColumns:`repeat(${GRID},${PIXEL_SIZE}px)`, gap: PIXEL_GAP, flexShrink:0 }}>
      {Array.from({length: GRID*GRID},(_,i) => (
        <span
          key={`${pixelKey}-${i}`}
          style={{
            width:PIXEL_SIZE, height:PIXEL_SIZE,
            background: checked ? 'light-dark(#5f626a, #a7abb2)' : 'light-dark(rgba(55,58,64,0.12), rgba(241,242,243,0.12))',
            transform: checked ? 'scale(1)' : 'scale(0)',
            transition: checked
              ? `transform 120ms cubic-bezier(0.34,1.56,0.64,1) ${i*18}ms,background 120ms ease`
              : 'transform 80ms ease-in,background 80ms ease',
          }}
        />
      ))}
    </span>
  );
}

export function PixelRadioGroup() {
  const [selected, setSelected] = React.useState<string>(OPTIONS[0]!);
  const [pixelKey, setPixelKey] = React.useState(0);

  const handleSelect = (opt: string) => { setSelected(opt); setPixelKey(k => k + 1); };

  return (
    <div className="flex flex-col gap-3.5">
      {OPTIONS.map((opt) => {
        const checked = selected === opt;
        return (
          <label key={opt} className="flex cursor-pointer items-center gap-3">
            <input
              type="radio" name="pixel-radio" value={opt} checked={checked}
              onChange={() => handleSelect(opt)}
              className="absolute opacity-0 w-0 h-0 m-0"
            />
            <PixelDot checked={checked} pixelKey={pixelKey} />
            <span
              className="select-none text-[13px] tracking-wider transition-colors duration-200"
              style={{
                fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontWeight: checked ? 600 : 400,
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
