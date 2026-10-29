"use client";

import { useEffect, useId, useRef, useState } from 'react';

const WET = 800; // ms a fresh letter stays wet

const css = `
  @keyframes field-quill-dip-a { 0%, 100% { transform: none; } 40% { transform: translate(14px, 6px) rotate(18deg); } }
  @keyframes field-quill-dip-b { 0%, 100% { transform: none; } 40% { transform: translate(14px, 6px) rotate(18deg); } }
  .field-quill { width: 260px; }
  .field-quill__label { display: block; margin-bottom: 8px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-quill__box {
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    border-bottom: 1.5px solid light-dark(#cbced3, #393c41);
    transition: border-color 0.2s;
  }
  .field-quill__box:focus-within { border-color: light-dark(#50535b, #c6c8cd); }
  .field-quill__input, .field-quill__mirror { padding: 0 34px 0 2px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-style: italic; letter-spacing: 0.01em; }
  .field-quill__input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: none; color: transparent; caret-color: light-dark(#50535b, #c6c8cd); }
  .field-quill__input::placeholder { color: light-dark(#6d7179, #7d8087); }
  .field-quill__mirror { position: absolute; inset: 0; display: flex; align-items: center; overflow: hidden; color: light-dark(#42454c, #e5e6e9); white-space: pre; pointer-events: none; }
  /* Wet ink: darker, a touch heavier and blooming, then it dries to the settled colour. */
  .field-quill__ch { transition: color 0.8s, text-shadow 0.8s; }
  .field-quill__ch[data-wet] { color: light-dark(#373a40, #f1f2f3); text-shadow: 0 0 0.6px light-dark(#373a40, #f1f2f3), 0 0 4px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent); transition: none; }
  .field-quill__nib { position: relative; display: inline-block; width: 0; height: 1em; }
  /* Before the first letter the quill rests in the pot, out of the placeholder's way. */
  .field-quill[data-empty] .field-quill__nib { display: none; }
  .field-quill__rest { position: absolute; right: 8px; bottom: 12px; width: 22px; height: 30px; overflow: visible; transform: rotate(10deg); transform-origin: 0 100%; }
  .field-quill__rest path { fill: light-dark(#50535b, #c6c8cd); }
  .field-quill__rest .field-quill__vane { fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 55%, transparent); }
  .field-quill__rest .field-quill__shaft { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.1; }
  .field-quill:not([data-empty]) .field-quill__rest { display: none; }
  .field-quill__nib svg { position: absolute; left: 1px; bottom: 6px; width: 22px; height: 30px; overflow: visible; transform-origin: 0 100%; }
  .field-quill__nib path { fill: light-dark(#50535b, #c6c8cd); }
  .field-quill__nib .field-quill__shaft { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.1; }
  .field-quill__nib .field-quill__vane { fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 55%, transparent); }
  .field-quill[data-dip='a'] .field-quill__nib svg { animation: field-quill-dip-a 0.5s ease-in-out; }
  .field-quill[data-dip='b'] .field-quill__nib svg { animation: field-quill-dip-b 0.5s ease-in-out; }
  .field-quill__pot { position: absolute; right: 2px; bottom: 6px; width: 20px; height: 16px; border-radius: 4px 4px 6px 6px; background: light-dark(#dbdde1, #2e3035); box-shadow: inset 0 3px 0 -1px light-dark(#fbfcfd, #121417), inset 0 0 0 1px light-dark(#cbced3, #393c41); }
  @media (prefers-reduced-motion: reduce) {
    .field-quill__nib svg { animation: none !important; }
    .field-quill__ch { transition: none; }
  }
`;

export function QuillInput() {
  const id = useId();
  const [value, setValue] = useState('');
  const [times, setTimes] = useState<number[]>([]);
  const [, tick] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onChange = (next: string) => {
    const now = performance.now();
    // Keep the times of the letters that did not change: the common start and end.
    let a = 0;
    while (a < value.length && a < next.length && value[a] === next[a]) a++;
    let b = 0;
    while (b < value.length - a && b < next.length - a && value[value.length - 1 - b] === next[next.length - 1 - b]) b++;
    setTimes([...times.slice(0, a), ...Array(next.length - a - b).fill(now), ...times.slice(times.length - b)]);
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => tick((n) => n + 1), WET + 20);
  };
  const now = typeof performance === 'undefined' ? 0 : performance.now();
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  // Every third word the quill goes back to the pot.
  const dip = Math.floor(words / 3);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-quill" data-empty={!value || undefined} data-dip={dip ? (dip % 2 ? 'a' : 'b') : undefined}>
        <label className="field-quill__label" htmlFor={id}>
          Dedication
        </label>
        <div className="field-quill__box">
          <input
            id={id}
            className="field-quill__input"
            value={value}
            maxLength={24}
            placeholder="For my mother"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="field-quill__mirror" aria-hidden="true">
            {[...value].map((c, i) => (
              <span key={i} className="field-quill__ch" data-wet={now - (times[i] ?? 0) < WET || undefined}>
                {c}
              </span>
            ))}
            <span className="field-quill__nib">
              <svg viewBox="0 0 22 30">
                <path className="field-quill__vane" d="M2 28C6 18 12 8 21 1C19 10 13 20 4 27Z" />
                <path className="field-quill__shaft" d="M1 29.5L3 25.5L4.5 26.5Z M3 25.5C8 16 13 9 21 1" />
              </svg>
            </span>
          </span>
          <svg className="field-quill__rest" viewBox="0 0 22 30" aria-hidden="true">
            <path className="field-quill__vane" d="M2 28C6 18 12 8 21 1C19 10 13 20 4 27Z" />
            <path className="field-quill__shaft" d="M1 29.5L3 25.5L4.5 26.5Z M3 25.5C8 16 13 9 21 1" />
          </svg>
          <span className="field-quill__pot" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
