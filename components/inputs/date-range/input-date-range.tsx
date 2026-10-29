"use client";

import { useState } from 'react';

const css = `
  .field-date-range { width: 228px; }
  .field-date-range__head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .field-date-range__month { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .field-date-range__sum { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-variant-numeric: tabular-nums; }
  .field-date-range__dow, .field-date-range__row { display: grid; grid-template-columns: repeat(7, 1fr); }
  .field-date-range__dow span { color: light-dark(#5f626a, #a7abb2); font-size: 10px; line-height: 18px; text-align: center; }
  .field-date-range__row { position: relative; height: 26px; }
  /* One band per week row, gliding to cover the part of the range in that week. */
  .field-date-range__band {
    position: absolute;
    top: 2px;
    bottom: 2px;
    border-radius: 11px;
    background: light-dark(#ebedf0, #232529);
    transition: left 0.3s cubic-bezier(0.2, 0.8, 0.3, 1), width 0.3s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.2s;
  }
  .field-date-range__band[data-preview] { background: color-mix(in oklab, light-dark(#ebedf0, #232529) 60%, transparent); }
  .field-date-range__day {
    position: relative;
    margin: 2px auto;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    color: light-dark(#42454c, #e5e6e9);
    font-family: inherit; font-size: 12px; line-height: 22px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s, transform 0.2s;
  }
  .field-date-range__day:hover { color: light-dark(#373a40, #f1f2f3); }
  .field-date-range__day:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .field-date-range__day[data-end] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font-weight: 600; transform: scale(1.08); }
  @media (prefers-reduced-motion: reduce) { .field-date-range__band, .field-date-range__day { transition-duration: 0.01s; } }
`;

const YEAR = 2026;
const MONTH = 10; // November
const DAYS = new Date(YEAR, MONTH + 1, 0).getDate();
const LEAD = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7; // Monday-first offset
const ROWS = Math.ceil((LEAD + DAYS) / 7);
const name = (d: number) => new Date(YEAR, MONTH, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export function DateRangeInput() {
  const [start, setStart] = useState<number | null>(12);
  const [end, setEnd] = useState<number | null>(18);
  const [hover, setHover] = useState<number | null>(null);

  const pick = (d: number) => {
    if (start === null || end !== null) {
      setStart(d);
      setEnd(null);
    } else if (d < start) {
      setEnd(start);
      setStart(d);
    } else setEnd(d);
  };

  // While choosing the end, the band previews up to the hovered day.
  const a = start;
  const b = end ?? (start !== null && hover !== null ? hover : null);
  const [lo, hi] = a !== null && b !== null ? [Math.min(a, b), Math.max(a, b)] : [a, a];
  const nights = end !== null && start !== null ? end - start : 0;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-date-range" role="group" aria-label="Stay dates">
        <div className="field-date-range__head">
          <span className="field-date-range__month">November 2026</span>
          <span className="field-date-range__sum" aria-live="polite">
            {start !== null && end !== null ? `${start} to ${end} Nov · ${nights} night${nights === 1 ? '' : 's'}` : 'Pick the last night'}
          </span>
        </div>
        <div className="field-date-range__dow" aria-hidden="true">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        {Array.from({ length: ROWS }, (_, r) => {
          const first = r * 7 - LEAD + 1;
          const from = lo === null ? null : Math.max(lo, first);
          const to = hi === null ? null : Math.min(hi, first + 6);
          const show = from !== null && to !== null && from <= to;
          const col = (d: number) => d - first;
          return (
            <div key={r} className="field-date-range__row">
              <span
                className="field-date-range__band"
                data-preview={end === null || undefined}
                style={{
                  left: `calc(${show ? col(from!) : 0} * 100% / 7)`,
                  width: `calc(${show ? col(to!) - col(from!) + 1 : 0} * 100% / 7)`,
                  opacity: show ? 1 : 0,
                }}
              />
              {Array.from({ length: 7 }, (_, c) => {
                const d = first + c;
                if (d < 1 || d > DAYS) return <span key={c} />;
                return (
                  <button
                    key={c}
                    type="button"
                    className="field-date-range__day"
                    data-end={d === start || d === end || undefined}
                    aria-pressed={d === start || d === end}
                    aria-label={name(d)}
                    onClick={() => pick(d)}
                    onPointerEnter={() => setHover(d)}
                    onPointerLeave={() => setHover(null)}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
