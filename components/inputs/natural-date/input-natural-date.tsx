"use client";

import { useEffect, useState } from 'react';

const css = `
  @keyframes field-natural-date-flip { from { opacity: 0; transform: rotateX(-80deg); } }
  .field-natural-date { width: 250px; }
  .field-natural-date__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-natural-date__input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 15px;
    transition: box-shadow 0.2s;
  }
  .field-natural-date__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-natural-date__input::placeholder { color: light-dark(#5f626a, #a7abb2); }
  .field-natural-date__out { height: 58px; margin-top: 8px; perspective: 400px; }
  .field-natural-date__chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    background: light-dark(#ebedf0, #232529);
    transform-origin: 50% 0;
    animation: field-natural-date-flip 0.4s cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  .field-natural-date__cal {
    display: grid;
    flex: none;
    width: 36px;
    overflow: hidden;
    border-radius: 6px;
    background: light-dark(#fbfcfd, #121417);
    text-align: center;
  }
  .field-natural-date__cal i { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); font-family: inherit; font-size: 8px; font-weight: 600; line-height: 12px; font-style: normal; letter-spacing: 0.08em; text-transform: uppercase; }
  .field-natural-date__cal b { color: light-dark(#373a40, #f1f2f3); font-family: inherit; font-size: 15px; font-weight: 600; line-height: 24px; }
  .field-natural-date__when { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .field-natural-date__rel { color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  @media (prefers-reduced-motion: reduce) { .field-natural-date__chip { animation: none; } }
  .field-natural-date__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-natural-date__top > :first-child { margin: 0; }
  .field-natural-date__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-natural-date__info svg { width: 14px; height: 14px; }
  .field-natural-date__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-natural-date__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-natural-date__info::after {
    content: attr(data-tip);
    position: absolute;
    left: -6px;
    bottom: calc(100% + 6px);
    z-index: 5;
    padding: 4px 8px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-family: inherit; font-size: 11px; font-weight: 500; line-height: 1.3;
    width: max-content;
    max-width: 150px;
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
  }
  .field-natural-date__info:hover::after, .field-natural-date__info:focus-visible::after { opacity: 1; transform: none; }
`;

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** Reads phrases like "tomorrow 9am", "next fri 3pm", "in 3 days", "tonight". Null when nothing is recognised. */
function parse(text: string, now: Date): Date | null {
  const s = text.toLowerCase();
  const d = new Date(now);
  let hit = false;
  let time: [number, number] | null = null;
  if (/\btoday\b/.test(s)) hit = true;
  if (/\btomorrow\b|\btmrw\b/.test(s)) {
    d.setDate(d.getDate() + 1);
    hit = true;
  }
  if (/\btonight\b/.test(s)) {
    time = [20, 0];
    hit = true;
  }
  const wd = /\b(?:next\s+)?(sun|mon|tue|wed|thu|fri|sat)[a-z]*\b/.exec(s);
  if (wd) {
    const diff = (DAYS.indexOf(wd[1]) - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    hit = true;
  }
  const rel = /\bin\s+(\d+)\s*(min|minute|hour|hr|day|week)s?\b/.exec(s);
  if (rel) {
    const n = Number(rel[1]);
    const unit = rel[2];
    if (unit === 'min' || unit === 'minute') d.setMinutes(d.getMinutes() + n);
    else if (unit === 'hour' || unit === 'hr') d.setHours(d.getHours() + n);
    else d.setDate(d.getDate() + n * (unit === 'week' ? 7 : 1));
    hit = true;
  }
  const ampm = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/.exec(s);
  const clock = /\b(\d{1,2}):(\d{2})\b/.exec(s);
  if (ampm) time = [(Number(ampm[1]) % 12) + (ampm[3] === 'pm' ? 12 : 0), Number(ampm[2] ?? 0)];
  else if (clock) time = [Number(clock[1]), Number(clock[2])];
  else if (/\bnoon\b/.test(s)) time = [12, 0];
  else if (/\bmorning\b/.test(s)) time = [9, 0];
  else if (/\bevening\b/.test(s)) time = [18, 0];
  if (time) {
    d.setHours(time[0], time[1], 0, 0);
    hit = true;
  } else if (hit && !rel) d.setHours(9, 0, 0, 0);
  return hit ? d : null;
}

function relative(d: Date, now: Date) {
  const mins = Math.round((d.getTime() - now.getTime()) / 60000);
  if (mins < 0) return 'already passed';
  if (mins < 60) return `in ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `in ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'in 1 day' : `in ${days} days`;
}

export function NaturalDateInput() {
  const [value, setValue] = useState('next fri 3pm');
  // The clock is read after mount: a prerendered page would otherwise carry the build day.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const d = now && parse(value, now);
  const when = d && `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-natural-date">
        <div className="field-natural-date__top">
          <label className="field-natural-date__label" htmlFor="field-natural-date-input">
            Remind me
          </label>
          <button type="button" className="field-natural-date__info" aria-label="Try tomorrow 9am or sat noon" data-tip="Try tomorrow 9am or sat noon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
        </div>
        <input
          id="field-natural-date-input"
          className="field-natural-date__input"
          value={value}
          placeholder="tomorrow 9am"
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="field-natural-date__out" aria-live="polite">
          {d ? (
            <div key={d.getTime()} className="field-natural-date__chip">
              <span className="field-natural-date__cal" aria-hidden="true">
                <i>{d.toLocaleDateString('en-GB', { month: 'short' })}</i>
                <b>{d.getDate()}</b>
              </span>
              <span>
                <div className="field-natural-date__when">{when}</div>
                <div className="field-natural-date__rel">{relative(d, now!)}</div>
              </span>
            </div>
          ) : (
            null
          )}
        </div>
      </div>
    </>
  );
}
