"use client";

import * as React from "react";
const css = `
  .toggle-mute { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-mute__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-mute__scene { position: relative; flex: none; }
  .toggle-mute__input:focus-visible + .toggle-mute__scene { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 8px; }
  @keyframes toggle-mute-pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
  .toggle-mute__scene { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 14px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: background-color 0.3s; }
  .toggle-mute__scene svg { width: 30px; height: 30px; overflow: visible; }
  .toggle-mute__cone { fill: light-dark(#42454c, #e5e6e9); }
  .toggle-mute__wave { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 1.8; stroke-linecap: round; transform-origin: 9px 15px; transform: scale(0.2); opacity: 0; transition: transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1), opacity 0.2s; }
  .toggle-mute__slash { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 0.3s 0.15s; }
  /* Sound on: the waves spread out, nearest first, and keep a soft pulse; the slash wipes away. */
  .toggle-mute__input:checked + .toggle-mute__scene { background: light-dark(#ebedf0, #232529); }
  .toggle-mute__input:checked + .toggle-mute__scene .toggle-mute__wave { transform: none; opacity: 1; animation: toggle-mute-pulse 1.6s ease-in-out infinite var(--d); transition-delay: var(--t); }
  .toggle-mute__input:checked + .toggle-mute__scene .toggle-mute__slash { stroke-dashoffset: 1; transition-delay: 0s; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-mute * { transition: none !important; animation: none !important; }
  }
`;

export function MuteToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-mute">
        <input className="toggle-mute__input" type="checkbox" role="switch" defaultChecked />
        <span className="toggle-mute__scene" aria-hidden="true">
          <svg viewBox="0 0 30 30">
            <path className="toggle-mute__cone" d="M3 11h4l6-5v18l-6-5H3Z" />
            <path className="toggle-mute__wave" d="M17 11a5 5 0 0 1 0 8" style={{ '--d': '0s', '--t': '0s' } as React.CSSProperties} />
            <path className="toggle-mute__wave" d="M20 7.5a10 10 0 0 1 0 15" style={{ '--d': '-0.3s', '--t': '0.06s' } as React.CSSProperties} />
            <path className="toggle-mute__wave" d="M23 4a15 15 0 0 1 0 22" style={{ '--d': '-0.6s', '--t': '0.12s' } as React.CSSProperties} />
            <path className="toggle-mute__slash" d="M4 4L26 26" pathLength={1} />
          </svg>
        </span>
        Sound
      </label>
    </>
  );
}
