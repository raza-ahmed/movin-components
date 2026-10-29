"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .card-synth {
    width: 236px;
    padding: 12px;
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-synth__screen {
    display: block;
    width: 212px;
    height: 70px;
    border-radius: 10px;
    background:
      linear-gradient(light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 100% 17.5px,
      linear-gradient(90deg, light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 21.2px 100%,
      light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-synth__wave { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.6; stroke-linejoin: round; filter: drop-shadow(0 0 3px light-dark(#50535b, #c6c8cd)); }
  .card-synth__knobs { display: flex; justify-content: space-around; margin-top: 12px; }
  .card-synth__control { display: grid; justify-items: center; gap: 6px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
  .card-synth__knob {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529));
    box-shadow: 0 0 0 4px light-dark(#fbfcfd, #121417), 0 0 0 5px light-dark(#dbdde1, #2e3035), 0 6px 10px -4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    cursor: ns-resize;
    touch-action: none;
  }
  .card-synth__knob:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 6px; }
  .card-synth__knob::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 5px;
    width: 3px;
    height: 12px;
    margin-left: -1.5px;
    border-radius: 2px;
    background: light-dark(#373a40, #f1f2f3);
  }
  .card-synth__value { color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; letter-spacing: 0; text-transform: none; }
`;

const W = 212;
const H = 70;

/** A knob: drag up/down (or arrow keys) to turn it through 270 degrees. */
function Knob({ label, value, onChange, format }: { label: string; value: number; onChange: (v: number) => void; format: (v: number) => string }) {
  const drag = useRef<{ y: number; v: number } | null>(null);
  return (
    <div className="card-synth__control">
      <span
        className="card-synth__knob"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={format(value)}
        style={{ transform: `rotate(${-135 + value * 270}deg)` }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, v: value };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          onChange(Math.min(1, Math.max(0, drag.current.v + (drag.current.y - e.clientY) / 120)));
        }}
        onPointerUp={() => (drag.current = null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowRight') onChange(Math.min(1, value + 0.05));
          if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') onChange(Math.max(0, value - 0.05));
        }}
      />
      {label}
      <span className="card-synth__value">{format(value)}</span>
    </div>
  );
}

export function SynthCard() {
  const wave = useRef<SVGPathElement>(null);
  const [freq, setFreq] = useState(0.35);
  const [shape, setShape] = useState(0.2);
  const params = useRef({ freq, shape });
  params.current = { freq, shape };

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const draw = (now: number) => {
      const { freq: f, shape: s } = params.current;
      const cycles = 1 + f * 6;
      const phase = still ? 0 : now / 400;
      let d = '';
      for (let i = 0; i <= 120; i++) {
        const u = i / 120;
        const x = (u * cycles + phase) % 1;
        // Shape morphs sine → triangle → square → saw as the knob turns.
        const sine = Math.sin(x * Math.PI * 2);
        const tri = 1 - 4 * Math.abs(x - 0.5);
        const sq = x < 0.5 ? 1 : -1;
        const saw = 2 * x - 1;
        const k = s * 3;
        const seg = Math.min(2, Math.floor(k));
        const t = k - seg;
        const pair = [
          [sine, -tri],
          [-tri, sq],
          [sq, saw],
        ][seg];
        const y = pair[0] * (1 - t) + pair[1] * t;
        d += `${i ? 'L' : 'M'}${(u * W).toFixed(1)} ${(H / 2 - y * 24).toFixed(1)}`;
      }
      wave.current!.setAttribute('d', d);
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [freq, shape]);

  const shapes = ['Sine', 'Triangle', 'Square', 'Saw'];
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-synth" role="group" aria-label="Oscillator">
        <svg className="card-synth__screen" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <path ref={wave} className="card-synth__wave" />
        </svg>
        <div className="card-synth__knobs">
          <Knob label="Freq" value={freq} onChange={setFreq} format={(v) => `${Math.round(110 * 2 ** (v * 3))} Hz`} />
          <Knob label="Shape" value={shape} onChange={setShape} format={(v) => shapes[Math.round(v * 3)]} />
        </div>
      </div>
    </>
  );
}
