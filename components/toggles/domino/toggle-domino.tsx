"use client";

import * as React from "react";
const css = `
  .toggle-domino { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-domino__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-domino__track { position: relative; width: 92px; height: 34px; border-radius: 6px; }
  .toggle-domino__input:focus-visible + .toggle-domino__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-domino__floor { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; border-radius: 1px; background: light-dark(#dbdde1, #2e3035); }
  .toggle-domino__tile {
    position: absolute;
    bottom: 2px;
    width: 6px;
    height: 24px;
    border-radius: 2px;
    background: light-dark(#50535b, #c6c8cd);
    box-shadow: inset -1.5px 0 0 light-dark(#6d7179, #7d8087);
    transform-origin: 100% 100%;
    /* Standing back up runs the chain in reverse, like a rewind. */
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) calc((5 - var(--i)) * 0.05s), background-color 0.3s;
  }
  .toggle-domino__bell {
    position: absolute;
    right: 0;
    bottom: 2px;
    width: 12px;
    height: 8px;
    border-radius: 6px 6px 1px 1px;
    background: light-dark(#cbced3, #393c41);
    transition: background-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  /* Each tile tips onto the next, faster as the chain goes, and the last one rings the bell. */
  .toggle-domino__input:checked + .toggle-domino__track .toggle-domino__tile {
    transform: rotate(var(--rest));
    background: light-dark(#373a40, #f1f2f3);
    transition: transform 0.22s cubic-bezier(0.55, 0, 1, 0.6) calc(var(--i) * 0.11s), background-color 0.2s calc(var(--i) * 0.11s);
  }
  .toggle-domino__input:checked + .toggle-domino__track .toggle-domino__bell {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 10px 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent);
    transform: scale(1.15);
    transition-delay: 0.75s;
  }
  @media (prefers-reduced-motion: reduce) {
    .toggle-domino__track * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// Leaning angles where each tile comes to rest against the next; the last falls flat by the bell.
const TILES = [0, 1, 2, 3, 4, 5].map((i) => ({ left: 4 + i * 12, rest: i === 5 ? 78 : 35 }));

export function DominoToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-domino">
        <input className="toggle-domino__input" type="checkbox" role="switch" />
        <span className="toggle-domino__track" aria-hidden="true">
          <span className="toggle-domino__floor" />
          {TILES.map((t, i) => (
            <span key={i} className="toggle-domino__tile" style={{ left: t.left, '--i': i, '--rest': `${t.rest}deg` } as React.CSSProperties} />
          ))}
          <span className="toggle-domino__bell" />
        </span>
        Chain reaction
      </label>
    </>
  );
}
