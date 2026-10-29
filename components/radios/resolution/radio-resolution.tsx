"use client";

import { useEffect, useId, useRef, useState } from 'react';

const css = `
  .radio-resolution { display: grid; justify-items: center; gap: 12px; }
  .radio-resolution__screen {
    position: relative;
    width: 192px;
    height: 108px;
    overflow: hidden;
    border-radius: 8px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .radio-resolution__screen canvas { display: block; width: 192px; height: 108px; }
  .radio-resolution__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
  .radio-resolution__probe i:nth-child(1) { color: light-dark(#f3f4f7, #1a1c1f); }
  .radio-resolution__probe i:nth-child(2) { color: light-dark(#ebedf0, #232529); }
  .radio-resolution__probe i:nth-child(3) { color: light-dark(#dbdde1, #2e3035); }
  .radio-resolution__probe i:nth-child(4) { color: light-dark(#cbced3, #393c41); }
  .radio-resolution__probe i:nth-child(5) { color: light-dark(#6d7179, #7d8087); }
  .radio-resolution__probe i:nth-child(6) { color: light-dark(#50535b, #c6c8cd); }
  .radio-resolution__probe i:nth-child(7) { color: light-dark(#373a40, #f1f2f3); }
  .radio-resolution__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-resolution__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-resolution__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-resolution__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-resolution__opt:has(.radio-resolution__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-resolution__opt:has(.radio-resolution__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
`;

const W = 192;
const H = 108;
const QUALITIES = [
  { value: '240', label: '240p', cols: 24 },
  { value: '720', label: '720p', cols: 64 },
  { value: '4k', label: '4K', cols: 192 },
];

/** The scene, as a palette index (0 darkest … 6 lightest) at u, v in 0…1. */
function shade(u: number, v: number) {
  const sun = Math.hypot((u - 0.7) * 1.78, v - 0.3);
  if (sun < 0.1) return 6;
  const ridge = 0.6 - 0.24 * Math.max(0, 1 - Math.abs(u - 0.28) / 0.3) - 0.16 * Math.max(0, 1 - Math.abs(u - 0.62) / 0.24);
  if (v > 0.8) return Math.abs(u - 0.7) < 0.035 && v < 0.95 ? 5 : 2;
  const hill = 0.74 - 0.05 * Math.sin(u * 9);
  if (v > hill) return 4;
  if (v > ridge) return v < ridge + 0.05 && Math.abs(u - 0.28) < 0.06 ? 5 : 3;
  if (sun < 0.16) return 4;
  return v < 0.3 ? 0 : 1;
}

export function ResolutionRadio() {
  const name = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const shown = useRef(QUALITIES[0].cols);
  const [cols, setCols] = useState(QUALITIES[0].cols);

  useEffect(() => {
    const el = canvas.current!;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = W * dpr;
    el.height = H * dpr;
    const ctx = el.getContext('2d')!;
    const draw = (c: number) => {
      const palette = [...probe.current!.children].map((x) => getComputedStyle(x).color);
      const rows = Math.round((c * H) / W);
      const cw = el.width / c;
      const ch = el.height / rows;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < c; x++) {
          ctx.fillStyle = palette[shade((x + 0.5) / c, (y + 0.5) / rows)];
          ctx.fillRect(Math.floor(x * cw), Math.floor(y * ch), Math.ceil(cw), Math.ceil(ch));
        }
      }
    };
    // Step through the resolutions in between, so it sharpens (or breaks up) progressively.
    const from = shown.current;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const steps = still || from === cols ? [cols] : Array.from({ length: 6 }, (_, i) => Math.round(from * (cols / from) ** ((i + 1) / 6)));
    let i = 0;
    let timer = 0;
    const next = () => {
      draw(steps[i]);
      shown.current = steps[i];
      if (++i < steps.length) timer = window.setTimeout(next, 70);
    };
    next();
    return () => clearTimeout(timer);
  }, [cols]);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-resolution">
        <span className="radio-resolution__screen" aria-hidden="true">
          <span ref={probe} className="radio-resolution__probe">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <canvas ref={canvas} />
        </span>
        <div
          className="radio-resolution__opts"
          role="radiogroup"
          aria-label="Quality"
          onChange={(e) => setCols(QUALITIES.find((q) => q.value === (e.target as HTMLInputElement).value)!.cols)}
        >
          {QUALITIES.map((q, i) => (
            <label key={q.value} className="radio-resolution__opt">
              <input className="radio-resolution__input" type="radio" name={name} value={q.value} defaultChecked={i === 0} />
              {q.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
