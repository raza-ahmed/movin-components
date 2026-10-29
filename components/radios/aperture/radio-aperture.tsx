"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  .radio-aperture { --radio-aperture-d: 40px; --radio-aperture-tw: 0deg; display: grid; justify-items: center; gap: 14px; }
  .radio-aperture:has(.radio-aperture__input[value='4']:checked) { --radio-aperture-d: 24px; --radio-aperture-tw: 18deg; }
  .radio-aperture:has(.radio-aperture__input[value='11']:checked) { --radio-aperture-d: 9px; --radio-aperture-tw: 36deg; }
  .radio-aperture__lens {
    position: relative;
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 4px 10px -4px color-mix(in oklab, light-dark(#fbfcfd, #121417) 70%, transparent);
  }
  .radio-aperture__iris {
    position: absolute;
    inset: 8px;
    overflow: hidden;
    border-radius: 50%;
    background: radial-gradient(circle, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd) 55%, light-dark(#6d7179, #7d8087));
  }
  /* Each blade is a half-plane whose edge sits --d from the centre; six of them leave a hexagon. */
  .radio-aperture__blade {
    position: absolute;
    left: -44px;
    top: 44px;
    width: 176px;
    height: 88px;
    background: linear-gradient(light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529) 40%);
    box-shadow: inset 0 1px 0 light-dark(#5f626a, #a7abb2);
    transform-origin: 88px 0;
    transform: rotate(calc(var(--i) * 60deg + var(--radio-aperture-tw))) translateY(var(--radio-aperture-d));
    transition: transform 0.6s cubic-bezier(0.4, 1.2, 0.5, 1);
  }
  .radio-aperture__ring { position: absolute; inset: 4px; border-radius: 50%; box-shadow: inset 0 0 0 4px light-dark(#dbdde1, #2e3035), inset 0 0 0 5px light-dark(#cbced3, #393c41); pointer-events: none; }
  .radio-aperture__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-aperture__opt {
    position: relative;
    padding: 5px 11px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    font-style: italic;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-aperture__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-aperture__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-aperture__opt:has(.radio-aperture__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-aperture__opt:has(.radio-aperture__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-aperture * { transition-duration: 0.01s !important; }
  }
`;

const STOPS = ['1.8', '4', '11'];

export function ApertureRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-aperture">
        <span className="radio-aperture__lens" aria-hidden="true">
          <span className="radio-aperture__iris">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="radio-aperture__blade" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </span>
          <span className="radio-aperture__ring" />
        </span>
        <div className="radio-aperture__opts" role="radiogroup" aria-label="Aperture">
          {STOPS.map((s, i) => (
            <label key={s} className="radio-aperture__opt">
              <input className="radio-aperture__input" type="radio" name={name} value={s} defaultChecked={i === 0} />
              f/{s}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
