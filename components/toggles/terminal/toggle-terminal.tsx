"use client";

import { useEffect, useState } from 'react';

const css = `
  @keyframes toggle-terminal-blink { 50% { opacity: 0; } }
  .toggle-terminal { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-terminal__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-terminal__track {
    display: grid;
    gap: 3px;
    width: 132px;
    padding: 7px 9px;
    border-radius: 8px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    line-height: 1.3;
    white-space: pre;
  }
  .toggle-terminal__input:focus-visible + .toggle-terminal__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-terminal__cmd { color: light-dark(#373a40, #f1f2f3); }
  .toggle-terminal__cmd b { color: light-dark(#5f626a, #a7abb2); font-weight: 400; }
  .toggle-terminal__caret { display: inline-block; width: 6px; height: 11px; margin-left: 1px; vertical-align: -1px; background: light-dark(#42454c, #e5e6e9); animation: toggle-terminal-blink 1s steps(1) infinite; }
  .toggle-terminal__out { min-height: 14px; color: light-dark(#5f626a, #a7abb2); }
  .toggle-terminal__out--on { color: light-dark(#42454c, #e5e6e9); }
`;

const CMD = { on: 'wifi --on', off: 'wifi --off' };
const OUT = { on: '● connected', off: '○ disconnected' };

export function TerminalToggle() {
  const [on, setOn] = useState(false);
  const [typed, setTyped] = useState(CMD.off.length);
  const cmd = on ? CMD.on : CMD.off;

  // Each change retypes the command, then prints its result.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setTyped(cmd.length);
    setTyped(0);
    const id = window.setInterval(() => setTyped((n) => (n >= cmd.length ? n : n + 1)), 45);
    return () => clearInterval(id);
  }, [cmd]);

  const done = typed >= cmd.length;
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-terminal">
        <input className="toggle-terminal__input" type="checkbox" role="switch" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <span className="toggle-terminal__track" aria-hidden="true">
          <span className="toggle-terminal__cmd">
            <b>$ </b>
            {cmd.slice(0, typed)}
            {!done && <span className="toggle-terminal__caret" />}
          </span>
          <span className={`toggle-terminal__out${on ? ' toggle-terminal__out--on' : ''}`}>
            {done ? (on ? OUT.on : OUT.off) : ''}
            {done && <span className="toggle-terminal__caret" />}
          </span>
        </span>
        Wi-Fi
      </label>
    </>
  );
}
