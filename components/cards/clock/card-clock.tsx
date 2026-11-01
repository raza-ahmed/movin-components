"use client";

import { useEffect, useRef, useState } from 'react';

const CITIES = [
  { name: 'London', tz: 'Europe/London' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'New York', tz: 'America/New_York' },
];
const S = 112;
const C = S / 2;

const css = `
  .card-clock { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-clock__top { display: flex; align-items: center; gap: 14px; }
  .card-clock__face { flex: none; width: ${S}px; height: ${S}px; }
  .card-clock__dial { fill: light-dark(#ebedf0, #232529); }
  .card-clock__tick { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.5; stroke-linecap: round; }
  .card-clock__tick--hour { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2.5; }
  .card-clock__hand { stroke-linecap: round; transform-box: view-box; transform-origin: ${C}px ${C}px; }
  .card-clock__hand--h { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 4; transition: transform 0.9s cubic-bezier(0.3, 1.35, 0.5, 1); }
  .card-clock__hand--m { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.5; transition: transform 0.9s cubic-bezier(0.3, 1.35, 0.5, 1) 0.05s; }
  .card-clock__hand--s { stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.2; transition: transform 0.25s cubic-bezier(0.3, 2, 0.5, 1); }
  .card-clock__pin { fill: light-dark(#373a40, #f1f2f3); }
  .card-clock__cities { display: grid; gap: 4px; flex: 1; }
  .card-clock__city { height: 28px; padding: 0 10px; border: 0; border-radius: 8px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12px; text-align: left; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
  .card-clock__city[aria-pressed='true'] { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .card-clock__city:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 1px; }
  .card-clock__read { display: flex; align-items: baseline; gap: 8px; margin: 10px 0 0; }
  .card-clock__read b { font-size: 22px; font-weight: 700; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; }
  .card-clock__read span { font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .card-clock__hand--h, .card-clock__hand--m, .card-clock__hand--s { transition: none; }
  }
`;

function timeIn(tz: string, now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23', timeZoneName: 'shortOffset' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  return { h: +get('hour'), m: +get('minute'), s: +get('second'), zone: get('timeZoneName') };
}
// Keep an angle within half a turn of the last one, so a hand always takes the short way round.
const near = (prev: number, a: number) => a + 360 * Math.round((prev - a) / 360);

export function ClockCard() {
  const [city, setCity] = useState(0);
  // The first render is a fixed time so the server and the browser agree; the live time takes over after.
  const [now, setNow] = useState<Date | null>(null);
  const last = useRef({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    let id = 0;
    const tick = () => {
      setNow(new Date());
      id = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
    return () => clearTimeout(id);
  }, []);

  const t = now ? timeIn(CITIES[city].tz, now) : { h: 10, m: 8, s: 36, zone: 'GMT' };
  const q = last.current;
  q.h = near(q.h, ((t.h % 12) + t.m / 60) * 30);
  q.m = near(q.m, (t.m + t.s / 60) * 6);
  q.s = near(q.s, t.s * 6);
  const hand = (cls: string, a: number, len: number) => <line className={`card-clock__hand card-clock__hand--${cls}`} x1={C} y1={C + 8} x2={C} y2={C - len} style={{ transform: `rotate(${a}deg)` }} />;

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-clock">
        <div className="card-clock__top">
          <svg className="card-clock__face" viewBox={`0 0 ${S} ${S}`} aria-hidden="true">
            <circle className="card-clock__dial" cx={C} cy={C} r={C - 1} />
            {Array.from({ length: 12 }, (_, i) => (
              <line
                key={i}
                className={`card-clock__tick${i % 3 === 0 ? ' card-clock__tick--hour' : ''}`}
                x1={C}
                y1={8}
                x2={C}
                y2={i % 3 === 0 ? 16 : 13}
                transform={`rotate(${i * 30} ${C} ${C})`}
              />
            ))}
            {hand('h', q.h, 28)}
            {hand('m', q.m, 42)}
            {hand('s', q.s, 46)}
            <circle className="card-clock__pin" cx={C} cy={C} r={3.5} />
          </svg>
          <div className="card-clock__cities" role="group" aria-label="City">
            {CITIES.map((c, i) => (
              <button key={c.name} type="button" className="card-clock__city" aria-pressed={city === i} onClick={() => setCity(i)}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <p className="card-clock__read">
          <b>
            {String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}
          </b>
          <span>
            {CITIES[city].name} · {t.zone}
          </span>
        </p>
      </article>
    </>
  );
}
