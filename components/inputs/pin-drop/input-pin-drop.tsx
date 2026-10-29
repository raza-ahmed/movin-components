"use client";

import { useId, useState } from 'react';

// A rough world map, one character per dot (equirectangular, 24 by 10).
const MAP = [
  '.......####...######....',
  '..#######....#########..',
  '..######....##########..',
  '...#####...##########...',
  '....###....########.#...',
  '.....###....#####.......',
  '.....####...####...##...',
  '......###....##...####..',
  '......##..........###...',
  '.......#................',
];
const DOTS = MAP.flatMap((row, y) => [...row].flatMap((c, x) => (c === '#' ? [{ x, y }] : [])));
const CITIES = [
  { name: 'Lisbon', country: 'Portugal', x: 11, y: 3 },
  { name: 'Oslo', country: 'Norway', x: 13, y: 1 },
  { name: 'Cairo', country: 'Egypt', x: 14, y: 4 },
  { name: 'Tokyo', country: 'Japan', x: 21, y: 3 },
  { name: 'New York', country: 'United States', x: 6, y: 3 },
  { name: 'Lima', country: 'Peru', x: 7, y: 7 },
  { name: 'Sydney', country: 'Australia', x: 20, y: 8 },
  { name: 'Nairobi', country: 'Kenya', x: 14, y: 6 },
];
const STEP = 10;

const css = `
  @keyframes field-pin-drop-fall { 0% { transform: translateY(-28px) scale(0.8); opacity: 0; } 60% { transform: translateY(2px) scale(1.06, 0.9); opacity: 1; } 100% { transform: none; opacity: 1; } }
  @keyframes field-pin-drop-ring { from { transform: scale(0.3); opacity: 0.9; } to { transform: scale(2.6); opacity: 0; } }
  .field-pin-drop { display: grid; gap: 10px; width: 250px; }
  .field-pin-drop__map { position: relative; width: ${24 * STEP}px; height: ${10 * STEP}px; margin: 0 auto; }
  .field-pin-drop__dot { position: absolute; width: 3px; height: 3px; margin: -1.5px; border-radius: 50%; background: light-dark(#cbced3, #393c41); }
  .field-pin-drop__pin { position: absolute; width: 0; height: 0; }
  .field-pin-drop__pin svg { position: absolute; left: -7px; bottom: 0; width: 14px; height: 20px; overflow: visible; filter: drop-shadow(0 2px 2px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45))); animation: field-pin-drop-fall 0.5s cubic-bezier(0.5, 0, 0.5, 1.4) both; }
  .field-pin-drop__pin svg path { fill: light-dark(#373a40, #f1f2f3); }
  .field-pin-drop__pin svg circle { fill: light-dark(#f3f4f7, #1a1c1f); }
  .field-pin-drop__ring { position: absolute; left: -6px; top: -4px; width: 12px; height: 8px; border-radius: 50%; border: 1.5px solid light-dark(#42454c, #e5e6e9); animation: field-pin-drop-ring 0.9s ease-out 0.35s both; }
  .field-pin-drop__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-pin-drop__box { display: flex; align-items: center; height: 40px; padding: 0 12px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: box-shadow 0.2s; }
  .field-pin-drop__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .field-pin-drop__input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: none; color: light-dark(#373a40, #f1f2f3); font: inherit; font-size: 14px; }
  .field-pin-drop__input::placeholder { color: light-dark(#6d7179, #7d8087); }
  .field-pin-drop__where { color: light-dark(#5f626a, #a7abb2); font-size: 12px; white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) {
    .field-pin-drop__pin svg, .field-pin-drop__ring { animation: none !important; }
    .field-pin-drop__ring { display: none; }
  }
`;

export function PinDropInput() {
  const id = useId();
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  // A city counts once what you typed can only be that one.
  const hits = t.length >= 2 ? CITIES.filter((c) => c.name.toLowerCase().startsWith(t)) : [];
  const city = hits.length === 1 ? hits[0] : CITIES.find((c) => c.name.toLowerCase() === t);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-pin-drop">
        <div className="field-pin-drop__map" aria-hidden="true">
          {DOTS.map((d) => (
            <span key={`${d.x}-${d.y}`} className="field-pin-drop__dot" style={{ left: d.x * STEP + 5, top: d.y * STEP + 5 }} />
          ))}
          {city && (
            <span key={city.name} className="field-pin-drop__pin" style={{ left: city.x * STEP + 5, top: city.y * STEP + 5 }}>
              <span className="field-pin-drop__ring" />
              <svg viewBox="0 0 14 20">
                <path d="M7 20C3 14 0 10.5 0 7a7 7 0 0 1 14 0c0 3.5-3 7-7 13Z" />
                <circle cx="7" cy="7" r="2.6" />
              </svg>
            </span>
          )}
        </div>
        <div>
          <label className="field-pin-drop__label" htmlFor={id}>
            Meet me in
          </label>
          <div className="field-pin-drop__box">
            <input id={id} className="field-pin-drop__input" value={q} placeholder="Lisbon, Tokyo, Lima…" autoComplete="off" onChange={(e) => setQ(e.target.value)} />
            <span className="field-pin-drop__where" aria-live="polite">
              {city ? city.country : ''}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
