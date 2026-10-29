"use client";

import { useId, useState } from 'react';

const css = `
  @keyframes radio-tuner-lock-a { 0% { opacity: 1; } 8%, 88% { opacity: 0.15; } 92% { opacity: 0.9; } 95% { opacity: 0.3; } 100% { opacity: 1; } }
  @keyframes radio-tuner-lock-b { 0% { opacity: 1; } 8%, 88% { opacity: 0.15; } 92% { opacity: 0.9; } 95% { opacity: 0.3; } 100% { opacity: 1; } }
  .radio-tuner { --radio-tuner-x: 24px; display: grid; gap: 10px; width: 236px; }
  .radio-tuner:has(.radio-tuner__input[value='news']:checked) { --radio-tuner-x: 102px; }
  .radio-tuner:has(.radio-tuner__input[value='lofi']:checked) { --radio-tuner-x: 170px; }
  .radio-tuner__dial {
    position: relative;
    height: 58px;
    overflow: hidden;
    border-radius: 10px;
    background: linear-gradient(light-dark(#f3f4f7, #1a1c1f), light-dark(#ebedf0, #232529));
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .radio-tuner__ticks {
    position: absolute;
    left: 10px;
    right: 16px;
    top: 10px;
    height: 12px;
    background:
      repeating-linear-gradient(90deg, light-dark(#6d7179, #7d8087) 0 1px, transparent 1px 40px) 0 0 / 100% 12px no-repeat,
      repeating-linear-gradient(90deg, light-dark(#cbced3, #393c41) 0 1px, transparent 1px 10px) 0 5px / 100% 7px no-repeat;
  }
  .radio-tuner__nums { position: absolute; left: 0; right: 0; top: 26px; height: 12px; }
  .radio-tuner__nums span { position: absolute; width: 30px; margin-left: -15px; color: light-dark(#5f626a, #a7abb2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; text-align: center; }
  .radio-tuner__band { position: absolute; left: 10px; bottom: 7px; color: light-dark(#5f626a, #a7abb2); font-size: 9px; font-weight: 600; letter-spacing: 0.12em; }
  .radio-tuner__lamp {
    position: absolute;
    right: 10px;
    bottom: 6px;
    padding: 1px 5px;
    border-radius: 3px;
    color: light-dark(#fbfcfd, #121417);
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 8px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent);
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.1em;
  }
  .radio-tuner[data-flip='a'] .radio-tuner__lamp { animation: radio-tuner-lock-a 1s linear; }
  .radio-tuner[data-flip='b'] .radio-tuner__lamp { animation: radio-tuner-lock-b 1s linear; }
  .radio-tuner__needle {
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 4px;
    width: 2px;
    border-radius: 1px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 6px light-dark(#42454c, #e5e6e9);
    transform: translateX(var(--radio-tuner-x));
    transition: transform 0.95s cubic-bezier(0.45, 0, 0.25, 1.08);
  }
  .radio-tuner__opts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .radio-tuner__opt {
    position: relative;
    display: grid;
    gap: 2px;
    padding: 6px 0;
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    text-align: center;
    cursor: pointer;
    transition: box-shadow 0.2s, background-color 0.2s;
  }
  .radio-tuner__name { color: light-dark(#42454c, #e5e6e9); font-size: 12px; font-weight: 600; }
  .radio-tuner__freq { color: light-dark(#5f626a, #a7abb2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; }
  .radio-tuner__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-tuner__opt:hover { box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087); }
  .radio-tuner__opt:has(.radio-tuner__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-tuner__opt:has(.radio-tuner__input:checked) { background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#50535b, #c6c8cd); }
  .radio-tuner__opt:has(.radio-tuner__input:checked) .radio-tuner__name { color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .radio-tuner * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

// 88 to 108 MHz across the dial, 10px per MHz from x = 10.
const NUMS = [88, 92, 96, 100, 104, 108];
const STATIONS = [
  { value: 'jazz', label: 'Jazz', freq: '89.5' },
  { value: 'news', label: 'News', freq: '97.3' },
  { value: 'lofi', label: 'Lo-fi', freq: '104.1' },
];

export function TunerRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-tuner" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-tuner__dial" aria-hidden="true">
          <span className="radio-tuner__ticks" />
          <span className="radio-tuner__nums">
            {NUMS.map((n) => (
              <span key={n} style={{ left: 10 + (n - 88) * 10 }}>
                {n}
              </span>
            ))}
          </span>
          <span className="radio-tuner__band">FM</span>
          <span className="radio-tuner__lamp">STEREO</span>
          <span className="radio-tuner__needle" />
        </span>
        <div className="radio-tuner__opts" role="radiogroup" aria-label="Station">
          {STATIONS.map((s, i) => (
            <label key={s.value} className="radio-tuner__opt">
              <input className="radio-tuner__input" type="radio" name={name} value={s.value} defaultChecked={i === 0} />
              <span className="radio-tuner__name">{s.label}</span>
              <span className="radio-tuner__freq">{s.freq}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
