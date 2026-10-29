"use client";

import { useId, useState } from 'react';

const css = `
  @keyframes field-match-shake { 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
  .field-match { display: grid; width: 250px; }
  .field-match__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-match__input { width: 100%; height: 40px; padding: 0 12px; border: 0; border-radius: 10px; outline: 0; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font: 500 14px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.2em; transition: box-shadow 0.2s; }
  .field-match__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .field-match__input::placeholder { color: light-dark(#6d7179, #7d8087); letter-spacing: 0; font-family: system-ui, sans-serif; }
  /* The beads between the fields: one per character of the password, linked once the confirmation matches it. */
  .field-match__chain { position: relative; display: flex; align-items: center; gap: 6px; height: 26px; padding: 0 14px; }
  .field-match__bead { position: relative; width: 7px; height: 7px; border-radius: 50%; box-shadow: inset 0 0 0 1.2px light-dark(#6d7179, #7d8087); transition: background-color 0.2s, box-shadow 0.2s, transform 0.3s cubic-bezier(0.3, 1.8, 0.5, 1); }
  .field-match__bead::after { content: ''; position: absolute; left: 7px; top: 3px; width: 6px; height: 1.2px; background: light-dark(#42454c, #e5e6e9); transform: scaleX(0); transform-origin: 0 50%; transition: transform 0.2s; }
  .field-match__bead[data-on] { background: light-dark(#42454c, #e5e6e9); box-shadow: none; transform: scale(1.1); }
  .field-match__bead[data-on][data-link]::after { transform: scaleX(1); }
  .field-match__bead[data-bad] { box-shadow: inset 0 0 0 1.5px light-dark(#373a40, #f1f2f3); animation: field-match-shake 0.25s 2; }
  .field-match__status { margin-left: auto; color: light-dark(#5f626a, #a7abb2); font-size: 11.5px; white-space: nowrap; }
  .field-match[data-done] .field-match__status { color: light-dark(#373a40, #f1f2f3); }
  .field-match[data-done] .field-match__bead { background: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .field-match__bead { animation: none !important; transition: none; }
  }
`;

export function MatchInput() {
  const id = useId();
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const n = Math.min(a.length, 14);
  let same = 0;
  while (same < b.length && same < a.length && a[same] === b[same]) same++;
  const bad = b.length > same;
  const done = a.length > 0 && a === b;
  const status = !a ? '' : done ? 'Passwords match' : bad ? 'Doesn’t match yet' : b ? `${same} of ${a.length}` : '';
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-match" data-done={done || undefined}>
        <label className="field-match__label" htmlFor={`${id}-a`}>
          New password
        </label>
        <input id={`${id}-a`} className="field-match__input" type="password" value={a} placeholder="At least 8 characters" autoComplete="new-password" onChange={(e) => setA(e.target.value)} />
        <div className="field-match__chain">
          {Array.from({ length: n }, (_, i) => (
            <span
              key={i}
              className="field-match__bead"
              aria-hidden="true"
              data-on={i < same || undefined}
              data-link={(i < same - 1 || (done && i < n - 1)) || undefined}
              data-bad={(bad && i === same) || undefined}
            />
          ))}
          <span id={`${id}-s`} className="field-match__status" aria-live="polite">
            {status}
          </span>
        </div>
        <label className="field-match__label" htmlFor={`${id}-b`}>
          Confirm password
        </label>
        <input
          id={`${id}-b`}
          className="field-match__input"
          type="password"
          value={b}
          aria-describedby={`${id}-s`}
          aria-invalid={bad}
          autoComplete="new-password"
          onChange={(e) => setB(e.target.value)}
        />
      </div>
    </>
  );
}
