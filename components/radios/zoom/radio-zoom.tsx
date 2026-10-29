"use client";

import { useId, useState } from 'react';

const css = `
  @keyframes radio-zoom-breathe-a { 0%, 100% { filter: blur(0); } 45% { filter: blur(1.6px); } }
  @keyframes radio-zoom-breathe-b { 0%, 100% { filter: blur(0); } 45% { filter: blur(1.6px); } }
  .radio-zoom { --radio-zoom-s: 1; display: grid; justify-items: center; gap: 12px; }
  .radio-zoom:has(.radio-zoom__input[value='50']:checked) { --radio-zoom-s: 1.7; }
  .radio-zoom:has(.radio-zoom__input[value='85']:checked) { --radio-zoom-s: 2.8; }
  .radio-zoom__frame {
    position: relative;
    width: 200px;
    height: 112px;
    overflow: hidden;
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .radio-zoom__scene {
    position: absolute;
    inset: 0;
    width: 200px;
    height: 112px;
    transform: scale(var(--radio-zoom-s));
    transform-origin: 72px 74px;
    transition: transform 0.7s cubic-bezier(0.3, 0, 0.2, 1);
  }
  .radio-zoom[data-flip='a'] .radio-zoom__scene { animation: radio-zoom-breathe-a 0.7s ease-in-out; }
  .radio-zoom[data-flip='b'] .radio-zoom__scene { animation: radio-zoom-breathe-b 0.7s ease-in-out; }
  .radio-zoom__sun { fill: light-dark(#50535b, #c6c8cd); }
  .radio-zoom__far { fill: light-dark(#ebedf0, #232529); }
  .radio-zoom__near { fill: light-dark(#dbdde1, #2e3035); }
  .radio-zoom__snow { fill: light-dark(#6d7179, #7d8087); }
  .radio-zoom__trunk { fill: light-dark(#6d7179, #7d8087); }
  .radio-zoom__crown { fill: light-dark(#5f626a, #a7abb2); }
  .radio-zoom__corner { position: absolute; width: 10px; height: 10px; border: 0 solid light-dark(#42454c, #e5e6e9); }
  .radio-zoom__corner:nth-child(2) { left: 8px; top: 8px; border-width: 1.5px 0 0 1.5px; }
  .radio-zoom__corner:nth-child(3) { right: 8px; top: 8px; border-width: 1.5px 1.5px 0 0; }
  .radio-zoom__corner:nth-child(4) { left: 8px; bottom: 8px; border-width: 0 0 1.5px 1.5px; }
  .radio-zoom__corner:nth-child(5) { right: 8px; bottom: 8px; border-width: 0 1.5px 1.5px 0; }
  .radio-zoom__focus { position: absolute; left: 64px; top: 58px; width: 16px; height: 16px; border: 1px solid color-mix(in oklab, light-dark(#373a40, #f1f2f3) 70%, transparent); }
  .radio-zoom__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-zoom__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-zoom__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-zoom__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-zoom__opt:has(.radio-zoom__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-zoom__opt:has(.radio-zoom__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-zoom * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

const LENSES = ['24', '50', '85'];

export function ZoomRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-zoom" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-zoom__frame" aria-hidden="true">
          <svg className="radio-zoom__scene" viewBox="0 0 200 112">
            <circle className="radio-zoom__sun" cx="150" cy="30" r="10" />
            <path className="radio-zoom__far" d="M0 80L40 44L70 64L110 30L150 66L200 40V112H0Z" />
            <path className="radio-zoom__snow" d="M100 39L110 30L120 39L114 37L110 40L105 37Z" />
            <path className="radio-zoom__near" d="M0 92C40 80 90 84 120 88C150 92 180 84 200 86V112H0Z" />
            <rect className="radio-zoom__trunk" x="70.5" y="66" width="3" height="18" />
            <path className="radio-zoom__crown" d="M72 48L82 70H62Z" />
          </svg>
          <span className="radio-zoom__corner" />
          <span className="radio-zoom__corner" />
          <span className="radio-zoom__corner" />
          <span className="radio-zoom__corner" />
          <span className="radio-zoom__focus" />
        </span>
        <div className="radio-zoom__opts" role="radiogroup" aria-label="Focal length">
          {LENSES.map((l, i) => (
            <label key={l} className="radio-zoom__opt">
              <input className="radio-zoom__input" type="radio" name={name} value={l} defaultChecked={i === 0} />
              {l}mm
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
