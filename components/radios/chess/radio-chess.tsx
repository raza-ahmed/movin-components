"use client";

import { useId, useState } from 'react';

const css = `
  @keyframes radio-chess-land-a { 0% { opacity: 0; transform: translateY(-18px) scale(1.4); } 60% { opacity: 1; transform: translateY(2px) scale(0.92); } 100% { transform: none; } }
  @keyframes radio-chess-land-b { 0% { opacity: 0; transform: translateY(-18px) scale(1.4); } 60% { opacity: 1; transform: translateY(2px) scale(0.92); } 100% { transform: none; } }
  @keyframes radio-chess-flash-a { 0%, 40% { background-color: light-dark(#50535b, #c6c8cd); } 100% { background-color: light-dark(#cbced3, #393c41); } }
  @keyframes radio-chess-flash-b { 0%, 40% { background-color: light-dark(#50535b, #c6c8cd); } 100% { background-color: light-dark(#cbced3, #393c41); } }
  .radio-chess { display: grid; justify-items: center; gap: 14px; }
  .radio-chess__board { display: grid; grid-template-columns: repeat(3, 34px); border-radius: 6px; overflow: hidden; box-shadow: 0 0 0 1px light-dark(#cbced3, #393c41); }
  .radio-chess__square { position: relative; display: grid; place-items: center; width: 34px; height: 34px; background: light-dark(#ebedf0, #232529); }
  .radio-chess__square:nth-child(even) { background: light-dark(#dbdde1, #2e3035); }
  .radio-chess__board .radio-chess__square--target { background: light-dark(#cbced3, #393c41); }
  .radio-chess[data-flip='a'] .radio-chess__square--target { animation: radio-chess-flash-a 0.6s ease-out; }
  .radio-chess[data-flip='b'] .radio-chess__square--target { animation: radio-chess-flash-b 0.6s ease-out; }
  .radio-chess__piece {
    position: absolute;
    color: light-dark(#373a40, #f1f2f3);
    font-family: 'Apple Symbols', 'Segoe UI Symbol', 'DejaVu Sans', sans-serif;
    font-size: 26px;
    line-height: 1;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.15s, transform 0.15s;
  }
  .radio-chess:has(.radio-chess__input[value='queen']:checked) .radio-chess__piece--queen,
  .radio-chess:has(.radio-chess__input[value='rook']:checked) .radio-chess__piece--rook,
  .radio-chess:has(.radio-chess__input[value='bishop']:checked) .radio-chess__piece--bishop,
  .radio-chess:has(.radio-chess__input[value='knight']:checked) .radio-chess__piece--knight { opacity: 1; transform: none; }
  .radio-chess[data-flip='a']:has(.radio-chess__input[value='queen']:checked) .radio-chess__piece--queen,
  .radio-chess[data-flip='a']:has(.radio-chess__input[value='rook']:checked) .radio-chess__piece--rook,
  .radio-chess[data-flip='a']:has(.radio-chess__input[value='bishop']:checked) .radio-chess__piece--bishop,
  .radio-chess[data-flip='a']:has(.radio-chess__input[value='knight']:checked) .radio-chess__piece--knight { animation: radio-chess-land-a 0.45s cubic-bezier(0.3, 0, 0.3, 1); }
  .radio-chess[data-flip='b']:has(.radio-chess__input[value='queen']:checked) .radio-chess__piece--queen,
  .radio-chess[data-flip='b']:has(.radio-chess__input[value='rook']:checked) .radio-chess__piece--rook,
  .radio-chess[data-flip='b']:has(.radio-chess__input[value='bishop']:checked) .radio-chess__piece--bishop,
  .radio-chess[data-flip='b']:has(.radio-chess__input[value='knight']:checked) .radio-chess__piece--knight { animation: radio-chess-land-b 0.45s cubic-bezier(0.3, 0, 0.3, 1); }
  .radio-chess__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-chess__opt {
    position: relative;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-family: 'Apple Symbols', 'Segoe UI Symbol', 'DejaVu Sans', sans-serif;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-chess__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-chess__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-chess__opt:has(.radio-chess__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-chess__opt:has(.radio-chess__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-chess * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

// Text presentation (U+FE0E), so no platform swaps the pieces for emoji.
const PIECES = [
  { value: 'queen', label: 'Queen', glyph: '♛︎' },
  { value: 'rook', label: 'Rook', glyph: '♜︎' },
  { value: 'bishop', label: 'Bishop', glyph: '♝︎' },
  { value: 'knight', label: 'Knight', glyph: '♞︎' },
];

export function ChessRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-chess" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-chess__board" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`radio-chess__square${i === 1 ? ' radio-chess__square--target' : ''}`}>
              {i === 1 &&
                PIECES.map((p) => (
                  <span key={p.value} className={`radio-chess__piece radio-chess__piece--${p.value}`}>
                    {p.glyph}
                  </span>
                ))}
            </span>
          ))}
        </span>
        <div className="radio-chess__opts" role="radiogroup" aria-label="Promote to">
          {PIECES.map((p, i) => (
            <label key={p.value} className="radio-chess__opt">
              <input className="radio-chess__input" type="radio" name={name} value={p.value} aria-label={p.label} defaultChecked={i === 0} />
              <span aria-hidden="true">{p.glyph}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
