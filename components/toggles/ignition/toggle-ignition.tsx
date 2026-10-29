"use client";

import * as React from "react";
const css = `
  .toggle-ignition { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-ignition__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-ignition__track { position: relative; width: 56px; height: 56px; border-radius: 50%; }
  .toggle-ignition__input:focus-visible + .toggle-ignition__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-ignition__barrel {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, light-dark(#dbdde1, #2e3035), light-dark(#f3f4f7, #1a1c1f));
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 4px 10px -6px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
  }
  .toggle-ignition__tick {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 4px;
    height: 4px;
    margin: -2px 0 0 -2px;
    border-radius: 50%;
    background: light-dark(#dbdde1, #2e3035);
    transform: rotate(var(--a)) translateY(-25px);
    transition: background-color 0.15s, box-shadow 0.15s;
  }
  .toggle-ignition__key {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 30px;
    margin: -15px 0 0 -5px;
    border-radius: 5px;
    background: linear-gradient(90deg, light-dark(#5f626a, #a7abb2), light-dark(#42454c, #e5e6e9) 50%, light-dark(#5f626a, #a7abb2));
    box-shadow: 0 2px 4px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
    transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .toggle-ignition__key::before { content: ''; position: absolute; left: 3px; top: 4px; width: 4px; height: 4px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); }
  .toggle-ignition__input:checked + .toggle-ignition__track .toggle-ignition__key { transform: rotate(75deg); }
  /* The dash lights sweep round once the key is turned. */
  .toggle-ignition__input:checked + .toggle-ignition__track .toggle-ignition__tick {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 4px light-dark(#42454c, #e5e6e9);
    transition-delay: calc(0.25s + var(--i) * 0.06s);
  }
  @media (prefers-reduced-motion: reduce) {
    .toggle-ignition__track * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const TICKS = [-60, -36, -12, 12, 36, 60, 84, 108];

export function IgnitionToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-ignition">
        <input className="toggle-ignition__input" type="checkbox" role="switch" />
        <span className="toggle-ignition__track" aria-hidden="true">
          {TICKS.map((a, i) => (
            <span key={a} className="toggle-ignition__tick" style={{ '--a': `${a}deg`, '--i': i } as React.CSSProperties} />
          ))}
          <span className="toggle-ignition__barrel" />
          <span className="toggle-ignition__key" />
        </span>
        Engine
      </label>
    </>
  );
}
