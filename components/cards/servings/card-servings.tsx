"use client";

import { useState } from 'react';

const ITEMS = [
  { name: 'Spaghetti', per: 100, unit: ' g' },
  { name: 'Lemons', per: 0.5, unit: '' },
  { name: 'Parmesan', per: 25, unit: ' g' },
  { name: 'Butter', per: 15, unit: ' g' },
];
const fmt = (q: number, unit: string) => {
  const whole = Math.floor(q);
  return (q % 1 ? `${whole || ''}½` : String(whole)) + unit;
};

const css = `
  .card-servings { box-sizing: border-box; width: 240px; padding: 14px 16px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-servings__top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .card-servings__title { margin: 0; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-servings__step { display: flex; align-items: center; gap: 2px; padding: 2px; border-radius: 999px; background: light-dark(#ebedf0, #232529); }
  .card-servings__btn { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#373a40, #f1f2f3); font: inherit; font-size: 15px; line-height: 1; cursor: pointer; }
  .card-servings__btn:hover:not(:disabled) { background: light-dark(#dbdde1, #2e3035); }
  .card-servings__btn:disabled { color: light-dark(#cbced3, #393c41); cursor: default; }
  .card-servings__btn:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 1px; }
  .card-servings__n { min-width: 18px; font-size: 12px; font-weight: 700; text-align: center; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; }
  .card-servings__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .card-servings__list { margin: 0; padding: 0; list-style: none; }
  .card-servings__row { display: flex; justify-content: space-between; padding: 7px 0; border-top: 1px solid light-dark(#ebedf0, #232529); font-size: 12px; color: light-dark(#50535b, #c6c8cd); }
  /* Each quantity is a short window: the old figure rolls out as the new one rolls in. */
  .card-servings__qty { position: relative; display: inline-grid; overflow: hidden; height: 18px; color: light-dark(#373a40, #f1f2f3); font-weight: 600; font-variant-numeric: tabular-nums; }
  .card-servings__qty > span { grid-area: 1 / 1; justify-self: end; line-height: 18px; animation-duration: 0.4s; animation-timing-function: cubic-bezier(0.3, 1.3, 0.5, 1); animation-fill-mode: both; }
  .card-servings__qty > .card-servings__in--up { animation-name: card-servings-in-up; }
  .card-servings__qty > .card-servings__out--up { animation-name: card-servings-out-up; }
  .card-servings__qty > .card-servings__in--down { animation-name: card-servings-in-down; }
  .card-servings__qty > .card-servings__out--down { animation-name: card-servings-out-down; }
  @keyframes card-servings-in-up { from { transform: translateY(100%); opacity: 0; } }
  @keyframes card-servings-out-up { to { transform: translateY(-100%); opacity: 0; } }
  @keyframes card-servings-in-down { from { transform: translateY(-100%); opacity: 0; } }
  @keyframes card-servings-out-down { to { transform: translateY(100%); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .card-servings__qty > span { animation: none !important; }
    .card-servings__qty > [class*='card-servings__out'] { display: none; }
  }
`;

export function ServingsCard() {
  const [s, setS] = useState({ n: 2, prev: 2, dir: 'up', gen: 0 });
  const set = (n: number) => setS((o) => ({ n, prev: o.n, dir: n > o.n ? 'up' : 'down', gen: o.gen + 1 }));
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-servings">
        <div className="card-servings__top">
          <p className="card-servings__title">Lemon pasta</p>
          <div className="card-servings__step">
            <button type="button" className="card-servings__btn" aria-label="Fewer servings" disabled={s.n <= 1} onClick={() => set(s.n - 1)}>
              −
            </button>
            <span className="card-servings__n" aria-live="polite">
              {s.n}
              <span className="card-servings__sr"> servings</span>
            </span>
            <button type="button" className="card-servings__btn" aria-label="More servings" disabled={s.n >= 8} onClick={() => set(s.n + 1)}>
              +
            </button>
          </div>
        </div>
        <ul className="card-servings__list">
          {ITEMS.map((it, i) => (
            <li key={it.name} className="card-servings__row">
              {it.name}
              <span className="card-servings__qty">
                {/* Each row starts a beat after the one above. */}
                {s.gen > 0 && (
                  <span key={`o${s.gen}`} className={`card-servings__out--${s.dir}`} style={{ animationDelay: `${i * 60}ms` }} aria-hidden="true">
                    {fmt(it.per * s.prev, it.unit)}
                  </span>
                )}
                <span key={`i${s.gen}`} className={s.gen > 0 ? `card-servings__in--${s.dir}` : ''} style={{ animationDelay: `${i * 60}ms` }}>
                  {fmt(it.per * s.n, it.unit)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
