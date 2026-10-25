"use client";

import * as React from "react";
const OPTIONS = ['INIT', 'EXEC', 'HALT'];
const GLYPHS = '0123456789ABCDEFアイウエオ!@#$%^&*';
const CYCLES = 6;

function useMatrixDecode(text: string, active: boolean) {
  const [display, setDisplay] = React.useState(text);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!active) { setDisplay(text); return; }
    const chars = text.split('');
    const resolved = new Array(chars.length).fill(false);
    let step = 0;
    const totalSteps = chars.length * CYCLES;
    const tick = () => {
      const out = chars.map((ch, i) => {
        if (resolved[i]) return ch;
        const progress = step - i * CYCLES;
        if (progress >= CYCLES) { resolved[i] = true; return ch; }
        if (progress < 0) return ch;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      setDisplay(out.join(''));
      step++;
      if (step <= totalSteps) timerRef.current = setTimeout(tick, 40);
    };
    tick();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, text]);

  return display;
}

export function MatrixOption({ opt, checked, onChange }: { opt: string; checked: boolean; onChange: () => void }) {
  const decoded = useMatrixDecode(opt, checked);
  return (
    <label
      className="flex cursor-pointer items-center gap-3 rounded px-3 py-2.5 transition-colors duration-200"
      style={{
        background: checked ? 'light-dark(rgba(80,83,91,0.05), rgba(198,200,205,0.05))' : 'transparent',
        borderBottom: `1px solid ${checked ? 'light-dark(rgba(80,83,91,0.3), rgba(198,200,205,0.3))' : 'light-dark(rgba(80,83,91,0.08), rgba(198,200,205,0.08))'}`,
      }}
    >
      <input type="radio" name="matrix-radio" value={opt} checked={checked} onChange={onChange}
        aria-label={opt} className="absolute opacity-0 w-0 h-0 m-0"/>
      <span style={{
        width:8,height:14,flexShrink:0,
        background: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(80,83,91,0.2), rgba(198,200,205,0.2))',
        boxShadow: checked ? '0 0 6px light-dark(rgba(80,83,91,0.8), rgba(198,200,205,0.8))' : 'none',
        transition:'background 200ms ease,box-shadow 200ms ease',
      }}/>
      <span className="select-none text-[13px] tracking-widest transition-all duration-200"
        style={{
          fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', minWidth:60,
          color: checked ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(rgba(80,83,91,0.84), rgba(198,200,205,0.78))',
          textShadow: checked ? '0 0 8px light-dark(rgba(80,83,91,0.7), rgba(198,200,205,0.7))' : 'none',
        }}>
        {decoded}
      </span>
    </label>
  );
}

export function MatrixRadioGroup() {
  const [selected, setSelected] = React.useState(OPTIONS[0]);
  return (
    <div className="flex flex-col gap-1 rounded p-1" style={{ background:'light-dark(#fbfcfd, #121417)', border:'1px solid light-dark(rgba(80,83,91,0.15), rgba(198,200,205,0.15))' }}>
      {OPTIONS.map((opt) => (
        <MatrixOption key={opt} opt={opt} checked={selected === opt} onChange={() => setSelected(opt)}/>
      ))}
    </div>
  );
}
