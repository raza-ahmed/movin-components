"use client";

import * as React from "react";
const css = `
  .toggle-bloom { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-bloom__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-bloom__track { position: relative; width: 48px; height: 56px; border-radius: 10px; }
  .toggle-bloom__input:focus-visible + .toggle-bloom__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-bloom__stem { position: absolute; left: 23px; top: 22px; width: 2px; height: 34px; border-radius: 1px; background: light-dark(#cbced3, #393c41); }
  .toggle-bloom__leaf {
    position: absolute;
    left: 25px;
    top: 38px;
    width: 12px;
    height: 7px;
    border-radius: 0 100% 0 100%;
    background: light-dark(#cbced3, #393c41);
    transform-origin: 0 100%;
    transform: rotate(-10deg);
  }
  .toggle-bloom__head { position: absolute; left: 24px; top: 22px; }
  .toggle-bloom__petal {
    position: absolute;
    left: -5px;
    top: -18px;
    width: 10px;
    height: 18px;
    border-radius: 50% 50% 45% 45% / 65% 65% 35% 35%;
    background: light-dark(#6d7179, #7d8087);
    transform-origin: 50% 100%;
    transform: rotate(calc(var(--a) * 0.08)) scale(0.45, 0.6);
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) calc((5 - var(--i)) * 0.03s), background-color 0.4s;
  }
  .toggle-bloom__core {
    position: absolute;
    left: -5px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: light-dark(#5f626a, #a7abb2);
    transform: scale(0.5);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s, box-shadow 0.3s;
  }
  .toggle-bloom__input:checked + .toggle-bloom__track .toggle-bloom__petal {
    transform: rotate(var(--a)) scale(1);
    background: light-dark(#42454c, #e5e6e9);
    transition-delay: calc(var(--i) * 0.05s);
  }
  .toggle-bloom__input:checked + .toggle-bloom__track .toggle-bloom__core { transform: none; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px light-dark(#50535b, #c6c8cd); transition-delay: 0.25s; }
  .toggle-bloom__input:checked + .toggle-bloom__track .toggle-bloom__leaf { background: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-bloom__track * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function BloomToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-bloom">
        <input className="toggle-bloom__input" type="checkbox" role="switch" />
        <span className="toggle-bloom__track" aria-hidden="true">
          <span className="toggle-bloom__stem" />
          <span className="toggle-bloom__leaf" />
          <span className="toggle-bloom__head">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="toggle-bloom__petal" style={{ '--a': `${i * 60}deg`, '--i': i } as React.CSSProperties} />
            ))}
            <span className="toggle-bloom__core" />
          </span>
        </span>
        Bloom
      </label>
    </>
  );
}
