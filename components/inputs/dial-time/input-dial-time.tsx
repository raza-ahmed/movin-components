"use client";

import * as React from "react";
import { useId, useState } from 'react';

const TICKS = Array.from({ length: 12 }, (_, i) => i);

// "930" → "09:30", "1745" → "17:45": digits only, the colon goes in by itself.
function mask(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2)}` : d;
}

const css = `
  .field-dial-time { display: flex; align-items: center; gap: 18px; width: 260px; }
  .field-dial-time__clock { position: relative; flex: none; width: 84px; height: 84px; border-radius: 50%; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 10px 20px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .field-dial-time__tick { position: absolute; left: 50%; top: 5px; width: 1.5px; height: 5px; margin-left: -0.75px; background: light-dark(#6d7179, #7d8087); transform-origin: 50% 37px; transform: rotate(calc(var(--k) * 30deg)); }
  .field-dial-time__tick:nth-child(3n + 1) { height: 8px; width: 2px; background: light-dark(#50535b, #c6c8cd); }
  .field-dial-time__hand { position: absolute; left: 50%; bottom: 50%; border-radius: 2px; transform-origin: 50% 100%; transition: transform 0.9s cubic-bezier(0.3, 1.25, 0.4, 1); }
  .field-dial-time__hand--h { width: 3px; height: 22px; margin-left: -1.5px; background: light-dark(#373a40, #f1f2f3); transform: rotate(var(--h)); }
  .field-dial-time__hand--m { width: 2px; height: 32px; margin-left: -1px; background: light-dark(#50535b, #c6c8cd); transform: rotate(var(--m)); }
  .field-dial-time__pin { position: absolute; left: 50%; top: 50%; width: 7px; height: 7px; margin: -3.5px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 2px light-dark(#f3f4f7, #1a1c1f); }
  .field-dial-time__field { flex: 1; min-width: 0; }
  .field-dial-time__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-dial-time__input { width: 100%; height: 44px; padding: 0 12px; border: 0; border-radius: 10px; outline: 0; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font: 500 22px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.06em; transition: box-shadow 0.2s; }
  .field-dial-time__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .field-dial-time__input::placeholder { color: light-dark(#cbced3, #393c41); }
  .field-dial-time__input[aria-invalid='true'] { box-shadow: inset 0 0 0 1px light-dark(#50535b, #c6c8cd); }
  .field-dial-time__part { display: block; margin-top: 6px; color: light-dark(#5f626a, #a7abb2); font-size: 12px; }
  @media (prefers-reduced-motion: reduce) {
    .field-dial-time__hand { transition: none; }
  }
`;

export function DialTimeInput() {
  const id = useId();
  const [value, setValue] = useState('');
  const m = value.match(/^(\d{2}):(\d{2})$/);
  const h = m ? +m[1]! : 10;
  const min = m ? +m[2]! : 10;
  const valid = !m || (h < 24 && min < 60);
  const ok = m && valid;
  const part = !ok ? 'Type a 24-hour time' : h < 5 ? 'Small hours' : h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : h < 21 ? 'Evening' : 'Night';
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-dial-time">
        <span
          className="field-dial-time__clock"
          aria-hidden="true"
          style={{ '--h': `${((h % 12) + min / 60) * 30}deg`, '--m': `${min * 6}deg` } as React.CSSProperties}
        >
          {TICKS.map((k) => (
            <span key={k} className="field-dial-time__tick" style={{ '--k': k } as React.CSSProperties} />
          ))}
          <span className="field-dial-time__hand field-dial-time__hand--h" />
          <span className="field-dial-time__hand field-dial-time__hand--m" />
          <span className="field-dial-time__pin" />
        </span>
        <div className="field-dial-time__field">
          <label className="field-dial-time__label" htmlFor={id}>
            Pickup time
          </label>
          <input
            id={id}
            className="field-dial-time__input"
            inputMode="numeric"
            placeholder="09:30"
            value={value}
            aria-invalid={!valid}
            aria-describedby={`${id}-part`}
            onChange={(e) => setValue(mask(e.target.value))}
          />
          <span id={`${id}-part`} className="field-dial-time__part" aria-live="polite">
            {valid ? part : 'That time does not exist'}
          </span>
        </div>
      </div>
    </>
  );
}
