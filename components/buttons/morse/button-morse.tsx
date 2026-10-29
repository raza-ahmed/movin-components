"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .btn-morse {
    display: inline-flex;
    flex-direction: column;
    gap: 10px;
    width: 210px;
    padding: 12px 14px 12px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 14px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  .btn-morse:hover { border-color: light-dark(#6d7179, #7d8087); }
  .btn-morse:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-morse__head {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 600;
  }
  .btn-morse__lamp {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: light-dark(#dbdde1, #2e3035);
    transition: background-color 0.04s linear, box-shadow 0.04s linear;
  }
  .btn-morse__lamp[data-on] {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 12px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent);
  }
  .btn-morse__code {
    margin-left: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    font-weight: 500;
    color: light-dark(#5f626a, #a7abb2);
  }
  .btn-morse__tape {
    position: relative;
    height: 18px;
    border-radius: 6px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529);
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  }
  .btn-morse__reel { position: absolute; top: 0; bottom: 0; left: 0; will-change: transform; }
  .btn-morse__mark {
    position: absolute;
    top: 6px;
    height: 6px;
    border-radius: 3px;
    background: light-dark(#6d7179, #7d8087);
  }
  .btn-morse__readhead {
    position: absolute;
    left: 50%;
    top: 2px;
    bottom: 2px;
    width: 1px;
    background: light-dark(#42454c, #e5e6e9);
  }
`;

const CODE: Record<string, string> = { S: '...', E: '.', N: '-.', D: '-..' };
const WORD = 'SEND';
const U = 6; // px per Morse time unit

// Marks as [start, length] in units: dot 1, dash 3, 1 between marks, 3 between letters, 7 between words.
const MARKS: [number, number][] = [];
let cursor = 0;
for (const ch of WORD) {
  for (const sym of CODE[ch]) {
    const len = sym === '.' ? 1 : 3;
    MARKS.push([cursor, len]);
    cursor += len + 1;
  }
  cursor += 2;
}
const PERIOD = cursor + 4; // + the rest of a 7-unit word gap

export function MorseButton() {
  const reel = useRef<HTMLSpanElement>(null);
  const tape = useRef<HTMLSpanElement>(null);
  const sending = useRef(false);
  const [lamp, setLamp] = useState(false);

  useEffect(() => {
    let pos = -6;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (sending.current) pos += dt * 9; // 9 units per second
      const half = (tape.current?.clientWidth ?? 180) / 2;
      const p = ((pos % PERIOD) + PERIOD) % PERIOD;
      reel.current!.style.transform = `translateX(${(half - p * U).toFixed(1)}px)`;
      setLamp(sending.current && MARKS.some(([s, l]) => p >= s && p < s + l));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const on = () => (sending.current = !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const off = () => (sending.current = false);

  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-morse" onPointerEnter={on} onPointerLeave={off} onFocus={on} onBlur={off}>
        <span className="btn-morse__head">
          <span className="btn-morse__lamp" data-on={lamp || undefined} aria-hidden="true" />
          Send
          <span className="btn-morse__code" aria-hidden="true">
            {[...WORD].map((c) => CODE[c].replace(/-/g, '–')).join(' ')}
          </span>
        </span>
        <span ref={tape} className="btn-morse__tape" aria-hidden="true">
          <span ref={reel} className="btn-morse__reel">
            {/* Three periods laid end to end so the tape never runs out on screen. */}
            {[-1, 0, 1].flatMap((k) =>
              MARKS.map(([s, l]) => (
                <span
                  key={`${k}-${s}`}
                  className="btn-morse__mark"
                  style={{ left: (s + k * PERIOD) * U, width: l * U - 1 }}
                />
              )),
            )}
          </span>
          <span className="btn-morse__readhead" />
        </span>
      </button>
    </>
  );
}
