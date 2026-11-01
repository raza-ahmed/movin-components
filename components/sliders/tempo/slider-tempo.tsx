"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const T = 18;
const Y = 26;
const MIN = 40;
const MAX = 200;
const at = (b: number) => T / 2 + ((b - MIN) / (MAX - MIN)) * (W - T);

type Pulse = { t0: number; x: number; strong: boolean };

const css = `
  .slider-tempo { position: relative; width: ${W}px; height: 74px; }
  .slider-tempo__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 52px; overflow: visible; }
  .slider-tempo__rail { stroke: light-dark(#ebedf0, #232529); stroke-width: 4; stroke-linecap: round; }
  .slider-tempo__fill { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 4; stroke-linecap: round; }
  .slider-tempo__run { fill: light-dark(#373a40, #f1f2f3); }
  .slider-tempo__wave { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.5; }
  .slider-tempo__thumb { fill: light-dark(#373a40, #f1f2f3); }
  .slider-tempo__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-tempo:has(.slider-tempo__input:focus-visible) .slider-tempo__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-tempo__value { position: absolute; left: 0; right: 0; top: 52px; display: flex; justify-content: space-between; align-items: center; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-tempo__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-tempo__beats { display: inline-flex; gap: 4px; margin-left: 8px; vertical-align: middle; }
  .slider-tempo__beat { width: 5px; height: 5px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); }
  .slider-tempo__beat--on { background: light-dark(#373a40, #f1f2f3); }
  .slider-tempo__input { position: absolute; left: 0; top: ${Y - 18}px; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-tempo__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 36px; }
  .slider-tempo__input::-moz-range-thumb { width: ${T}px; height: 36px; border: 0; }
`;

export function TempoSlider() {
  const [bpm, setBpm] = useState(96);
  const [beat, setBeat] = useState(-1);
  const [, setFrame] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const st = useRef({ bpm: 96, last: 0, n: -1, now: 0, raf: 0, pulses: [] as Pulse[] });

  // The thumb keeps time: every beat it kicks and sends a pulse both ways down the track,
  // with every fourth beat accented. Paused off screen.
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const step = (now: number) => {
      q.now = now;
      const gap = 60000 / q.bpm;
      if (now - q.last >= gap) {
        q.last = now - q.last < gap * 2 ? q.last + gap : now;
        q.n += 1;
        q.pulses = [...q.pulses.filter((p) => now - p.t0 < 700), { t0: now, x: at(q.bpm), strong: q.n % 4 === 0 }];
        setBeat(q.n % 4);
      }
      setFrame((f) => f + 1);
      q.raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(q.raf);
      if (e.isIntersecting) {
        q.last = performance.now();
        q.raf = requestAnimationFrame(step);
      }
    });
    io.observe(box.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(q.raf);
    };
  }, []);

  const q = st.current;
  const x = at(bpm);
  const latest = q.pulses[q.pulses.length - 1];
  const age = latest ? (q.now - latest.t0) / 1000 : 9;
  const kick = 1 + (latest?.strong ? 0.38 : 0.22) * Math.exp(-age / 0.09);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-tempo" ref={box}>
        <svg className="slider-tempo__svg" aria-hidden="true">
          <line className="slider-tempo__rail" x1={T / 2} y1={Y} x2={W - T / 2} y2={Y} />
          <line className="slider-tempo__fill" x1={T / 2} y1={Y} x2={x} y2={Y} />
          {q.pulses.map((p) => {
            const a = (q.now - p.t0) / 1000;
            if (a > 0.7) return null;
            const run = a * 260;
            return (
              <g key={p.t0}>
                <circle className="slider-tempo__wave" cx={p.x} cy={Y} r={T / 2 + a * 40} opacity={Math.max(0, 0.7 - a * 1.4)} />
                {[p.x - run, p.x + run].map((rx, i) =>
                  rx > 2 && rx < W - 2 ? <circle key={i} className="slider-tempo__run" cx={rx} cy={Y} r={p.strong ? 2.6 : 1.9} opacity={1 - a / 0.7} /> : null,
                )}
              </g>
            );
          })}
          <circle className="slider-tempo__thumb" cx={x} cy={Y} r={(T / 2) * kick} />
          <circle className="slider-tempo__ring" cx={x} cy={Y} r={T / 2 + 4} />
        </svg>
        <p className="slider-tempo__value" aria-hidden="true">
          <span>
            Tempo
            <span className="slider-tempo__beats">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`slider-tempo__beat${i === beat ? ' slider-tempo__beat--on' : ''}`} />
              ))}
            </span>
          </span>
          <b>{bpm} BPM</b>
        </p>
        <input
          className="slider-tempo__input"
          type="range"
          min={MIN}
          max={MAX}
          value={bpm}
          onChange={(e) => {
            setBpm(+e.target.value);
            st.current.bpm = +e.target.value;
          }}
          aria-label="Tempo"
          aria-valuetext={`${bpm} beats per minute`}
        />
      </div>
    </>
  );
}
