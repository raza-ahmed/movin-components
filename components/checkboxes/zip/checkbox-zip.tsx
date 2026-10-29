"use client";

import * as React from "react";
const css = `
  .cb-zip { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-zip__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-zip__box { position: relative; width: 72px; height: 30px; border-radius: 6px; }
  .cb-zip__input:focus-visible + .cb-zip__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-zip__tape {
    position: absolute;
    left: 0;
    right: 0;
    height: 7px;
    background: light-dark(#dbdde1, #2e3035);
    transition: transform 0.3s ease;
  }
  .cb-zip__tape--top { top: 4px; border-radius: 3px 3px 0 0; transform: translateY(-3px) rotate(-2deg); transform-origin: 0 100%; }
  .cb-zip__tape--bottom { bottom: 4px; border-radius: 0 0 3px 3px; transform: translateY(3px) rotate(2deg); transform-origin: 0 0; }
  .cb-zip__tooth {
    position: absolute;
    left: calc(5px + var(--i) * 5px);
    width: 3px;
    height: 5px;
    border-radius: 1px;
    background: light-dark(#5f626a, #a7abb2);
    /* Unzipping, the teeth part from the right as the slider runs back. */
    transition: transform 0.18s ease calc((12 - var(--i)) * 0.03s), background-color 0.18s ease calc((12 - var(--i)) * 0.03s);
  }
  .cb-zip__tooth--top { top: 10px; transform: translateY(calc(-2px - var(--i) * 0.25px)); }
  .cb-zip__tooth--bottom { top: 15px; margin-left: 2.5px; transform: translateY(calc(2px + var(--i) * 0.25px)); }
  .cb-zip__slider {
    position: absolute;
    left: -3px;
    top: 7px;
    width: 12px;
    height: 16px;
    border-radius: 4px 7px 7px 4px;
    background: linear-gradient(light-dark(#42454c, #e5e6e9), light-dark(#5f626a, #a7abb2));
    box-shadow: 0 1px 3px color-mix(in oklab, light-dark(#fbfcfd, #121417) 60%, transparent);
    transition: left 0.42s cubic-bezier(0.6, 0, 0.4, 1);
  }
  .cb-zip__pull {
    position: absolute;
    left: 1px;
    top: 9px;
    width: 10px;
    height: 13px;
    border-radius: 2px 2px 4px 4px;
    background: light-dark(#50535b, #c6c8cd);
    box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2);
    transform-origin: 50% 0;
    transition: transform 0.3s ease;
  }
  .cb-zip__pull svg { position: absolute; left: 1px; top: 3px; width: 8px; height: 7px; }
  .cb-zip__pull path { fill: none; stroke: light-dark(#f3f4f7, #1a1c1f); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.15s; }
  .cb-zip__input:checked + .cb-zip__box .cb-zip__tape { transform: none; }
  .cb-zip__input:checked + .cb-zip__box .cb-zip__tooth { transform: none; background: light-dark(#50535b, #c6c8cd); transition-delay: calc(var(--i) * 0.03s); }
  .cb-zip__input:checked + .cb-zip__box .cb-zip__slider { left: 63px; }
  .cb-zip__input:checked + .cb-zip__box .cb-zip__pull { transform: rotate(-12deg); transition: transform 0.5s cubic-bezier(0.3, 1.8, 0.5, 1) 0.4s; }
  .cb-zip__input:checked + .cb-zip__box .cb-zip__pull path { stroke-dashoffset: 0; transition: stroke-dashoffset 0.2s ease 0.45s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-zip__box * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const TEETH = Array.from({ length: 12 }, (_, i) => i);

export function ZipCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-zip">
        <input className="cb-zip__input" type="checkbox" />
        <span className="cb-zip__box" aria-hidden="true">
          <span className="cb-zip__tape cb-zip__tape--top" />
          <span className="cb-zip__tape cb-zip__tape--bottom" />
          {TEETH.map((i) => (
            <span key={`t${i}`} className="cb-zip__tooth cb-zip__tooth--top" style={{ '--i': i } as React.CSSProperties} />
          ))}
          {TEETH.map((i) => (
            <span key={`b${i}`} className="cb-zip__tooth cb-zip__tooth--bottom" style={{ '--i': i } as React.CSSProperties} />
          ))}
          <span className="cb-zip__slider">
            <span className="cb-zip__pull">
              <svg viewBox="0 0 8 7">
                <path pathLength={1} d="M1 3.5L3.2 5.6L7 1.2" />
              </svg>
            </span>
          </span>
        </span>
        Lock my answers
      </label>
    </>
  );
}
