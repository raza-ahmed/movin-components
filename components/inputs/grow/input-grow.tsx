"use client";

import { useState } from 'react';

const css = `
  @keyframes field-grow-num { from { opacity: 0; transform: translateY(-6px); } }
  .field-grow { width: 250px; }
  .field-grow__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-grow__box {
    display: flex;
    border-radius: 10px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    /* The height follows the lines with a little spring. */
    transition: height 0.38s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.2s;
  }
  .field-grow__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-grow__gutter { flex: none; width: 28px; padding: 8px 0; background: light-dark(#f3f4f7, #1a1c1f); color: light-dark(#6d7179, #7d8087); font: 12px/18px ui-monospace, SFMono-Regular, Menlo, monospace; text-align: right; overflow: hidden; }
  .field-grow__gutter span { display: block; padding-right: 7px; animation: field-grow-num 0.25s ease-out; }
  .field-grow__gutter span[data-cur] { color: light-dark(#42454c, #e5e6e9); }
  .field-grow__area {
    flex: 1;
    min-width: 0;
    padding: 8px 10px;
    border: 0;
    outline: 0;
    resize: none;
    background: none;
    color: light-dark(#373a40, #f1f2f3);
    font: 12px/18px ui-monospace, SFMono-Regular, Menlo, monospace;
    white-space: pre;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .field-grow__area[data-scroll] { overflow-y: auto; }
  .field-grow__foot { display: flex; justify-content: space-between; margin-top: 6px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-variant-numeric: tabular-nums; }
  @media (prefers-reduced-motion: reduce) { .field-grow__box { transition: box-shadow 0.2s; } .field-grow__gutter span { animation: none; } }
`;

const LINE = 18;
const MIN = 2;
const MAX = 7;

export function GrowInput() {
  const [value, setValue] = useState("const ease = 'out';\nconst ms = 240;");
  const [line, setLine] = useState(1);
  const lines = value.split('\n').length;
  const rows = Math.max(MIN, Math.min(MAX, lines));

  const caretLine = (el: HTMLTextAreaElement) => setLine(el.value.slice(0, el.selectionStart).split('\n').length);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-grow">
        <label className="field-grow__label" htmlFor="field-grow-area">
          Snippet
        </label>
        <div className="field-grow__box" style={{ height: rows * LINE + 16 }}>
          <div className="field-grow__gutter" aria-hidden="true">
            {Array.from({ length: lines }, (_, i) => (
              <span key={i} data-cur={i + 1 === line || undefined}>
                {i + 1}
              </span>
            ))}
          </div>
          <textarea
            id="field-grow-area"
            className="field-grow__area"
            value={value}
            rows={rows}
            spellCheck={false}
            data-scroll={lines > MAX || undefined}
            onChange={(e) => {
              setValue(e.target.value);
              caretLine(e.target);
            }}
            onSelect={(e) => caretLine(e.currentTarget)}
            onScroll={(e) => {
              const g = e.currentTarget.previousElementSibling as HTMLElement;
              g.scrollTop = e.currentTarget.scrollTop;
            }}
          />
        </div>
        <div className="field-grow__foot">
          <span>
            Ln {line}, {lines} line{lines === 1 ? '' : 's'}
          </span>
          <span>{value.length} chars</span>
        </div>
      </div>
    </>
  );
}
