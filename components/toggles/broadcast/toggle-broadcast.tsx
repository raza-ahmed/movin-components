"use client";

import * as React from "react";
const css = `
  .toggle-broadcast { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-broadcast__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-broadcast__scene { position: relative; flex: none; }
  .toggle-broadcast__input:focus-visible + .toggle-broadcast__scene { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 8px; }
  @keyframes toggle-broadcast-wave { from { transform: scale(0.3); opacity: 0.9; } to { transform: scale(1); opacity: 0; } }
  @keyframes toggle-broadcast-blink { 50% { opacity: 0.3; } }
  .toggle-broadcast__scene { width: 72px; height: 60px; }
  .toggle-broadcast__mast { position: absolute; left: 29px; bottom: 0; width: 14px; height: 40px; background: light-dark(#6d7179, #7d8087); clip-path: polygon(40% 0, 60% 0, 100% 100%, 0 100%); }
  .toggle-broadcast__mast::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(-55deg, transparent 0 4px, light-dark(#ebedf0, #232529) 4px 5px), repeating-linear-gradient(55deg, transparent 0 4px, light-dark(#ebedf0, #232529) 4px 5px); }
  .toggle-broadcast__tip { position: absolute; left: 33px; top: 14px; width: 6px; height: 6px; border-radius: 50%; background: light-dark(#6d7179, #7d8087); transition: background-color 0.2s, box-shadow 0.2s; }
  .toggle-broadcast__ring { position: absolute; left: 36px; top: 17px; width: 64px; height: 64px; margin: -32px; border-radius: 50%; border: 1.5px solid light-dark(#42454c, #e5e6e9); opacity: 0; clip-path: polygon(0 0, 100% 0, 100% 55%, 0 55%); }
  .toggle-broadcast__tag { position: absolute; right: -6px; top: 0; padding: 1px 4px; border-radius: 3px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font-size: 8px; font-weight: 600; letter-spacing: 0.08em; opacity: 0; transform: scale(0.6); transition: opacity 0.2s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .toggle-broadcast__input:checked + .toggle-broadcast__scene .toggle-broadcast__tip { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px light-dark(#373a40, #f1f2f3); animation: toggle-broadcast-blink 1s steps(1) infinite; }
  .toggle-broadcast__input:checked + .toggle-broadcast__scene .toggle-broadcast__ring { animation: toggle-broadcast-wave 1.8s ease-out infinite var(--d); }
  .toggle-broadcast__input:checked + .toggle-broadcast__scene .toggle-broadcast__tag { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-broadcast * { animation: none !important; transition: none !important; }
    .toggle-broadcast__input:checked + .toggle-broadcast__scene .toggle-broadcast__ring:first-of-type { opacity: 0.6; transform: scale(0.6); }
  }
`;

export function BroadcastToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-broadcast">
        <input className="toggle-broadcast__input" type="checkbox" role="switch" />
        <span className="toggle-broadcast__scene" aria-hidden="true">
          {[0, -0.6, -1.2].map((d) => (
            <span key={d} className="toggle-broadcast__ring" style={{ '--d': `${d}s` } as React.CSSProperties} />
          ))}
          <span className="toggle-broadcast__mast" />
          <span className="toggle-broadcast__tip" />
          <span className="toggle-broadcast__tag">LIVE</span>
        </span>
        Go live
      </label>
    </>
  );
}
