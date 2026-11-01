"use client";

import { useState } from 'react';

const W = 240;
const N = 15;
const KW = W / N;
const KH = 56;
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
// A black key sits after C, D, F, G and A.
const BLACK = Array.from({ length: N - 1 }, (_, i) => i).filter((i) => [0, 1, 3, 4, 5].includes(i % 7));
const note = (i: number) => `${NOTES[i % 7]}${4 + Math.floor(i / 7)}`;

const css = `
  .slider-keys { position: relative; width: ${W}px; height: 100px; }
  .slider-keys__pill {
    position: absolute;
    top: 0;
    width: 34px;
    height: 22px;
    margin-left: -17px;
    border-radius: 11px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-size: 12px;
    font-weight: 600;
    line-height: 22px;
    text-align: center;
    transition: left 0.3s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .slider-keys__board { position: absolute; left: 0; top: 30px; width: ${W}px; height: ${KH}px; }
  .slider-keys__white {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    width: ${KW}px;
    height: ${KH}px;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 0 0 4px 4px;
    background: light-dark(#ebedf0, #232529);
    transition: transform 0.18s cubic-bezier(0.3, 1.5, 0.5, 1), background-color 0.18s;
  }
  .slider-keys__white--near { background: light-dark(#dbdde1, #2e3035); }
  .slider-keys__white--on { background: light-dark(#42454c, #e5e6e9); border-color: light-dark(#42454c, #e5e6e9); }
  .slider-keys__black { position: absolute; top: 0; width: 10px; height: 32px; margin-left: -5px; border-radius: 0 0 3px 3px; background: light-dark(#6d7179, #7d8087); pointer-events: none; }
  .slider-keys:has(.slider-keys__input:focus-visible) .slider-keys__board { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 4px; }
  .slider-keys__input { position: absolute; left: 0; top: 30px; width: 100%; height: ${KH}px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-keys__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${KW}px; height: ${KH}px; }
  .slider-keys__input::-moz-range-thumb { width: ${KW}px; height: ${KH}px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-keys__pill, .slider-keys__white { transition: none; }
  }
`;

export function KeysSlider() {
  const [k, setK] = useState(4);
  const [held, setHeld] = useState(false);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-keys">
        <span className="slider-keys__pill" style={{ left: (k + 0.5) * KW }} aria-hidden="true">
          {note(k)}
        </span>
        <div className="slider-keys__board" aria-hidden="true">
          {Array.from({ length: N }, (_, i) => {
            // The chosen key goes down; its neighbours dip with it.
            const dip = Math.max(0, 1 - Math.abs(i - k) / 2);
            return (
              <span
                key={i}
                className={`slider-keys__white${i === k ? ' slider-keys__white--on' : dip ? ' slider-keys__white--near' : ''}`}
                style={{ left: i * KW, transform: `translateY(${dip * (held && i === k ? 4.5 : 3)}px)` }}
              />
            );
          })}
          {BLACK.map((i) => (
            <span key={i} className="slider-keys__black" style={{ left: (i + 1) * KW }} />
          ))}
        </div>
        <input
          className="slider-keys__input"
          type="range"
          min={0}
          max={N - 1}
          value={k}
          onPointerDown={() => setHeld(true)}
          onPointerUp={() => setHeld(false)}
          onPointerCancel={() => setHeld(false)}
          onChange={(e) => setK(+e.target.value)}
          aria-label="Note"
          aria-valuetext={note(k)}
        />
      </div>
    </>
  );
}
