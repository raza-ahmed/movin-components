"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

const css = `
  .card-cart { position: relative; box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-cart__bag { position: absolute; right: 12px; top: 10px; z-index: 2; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  .card-cart__bag svg { width: 15px; height: 15px; }
  .card-cart__bag--bump { animation: card-cart-bump 0.4s cubic-bezier(0.3, 1.8, 0.5, 1); }
  @keyframes card-cart-bump {
    30% { transform: scale(1.25) rotate(-8deg); }
  }
  .card-cart__count { position: absolute; right: -3px; top: -3px; min-width: 15px; height: 15px; padding: 0 3px; box-sizing: border-box; border-radius: 8px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font-size: 9px; font-weight: 700; line-height: 15px; text-align: center; animation: card-cart-pop 0.4s cubic-bezier(0.3, 1.8, 0.5, 1); }
  @keyframes card-cart-pop {
    from { transform: scale(0); }
  }
  .card-cart__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .card-cart__art { display: block; width: 212px; height: 92px; border-radius: 10px; background: light-dark(#ebedf0, #232529); }
  .card-cart__mug { fill: light-dark(#50535b, #c6c8cd); }
  .card-cart__rim { fill: light-dark(#42454c, #e5e6e9); }
  .card-cart__handle { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 6; }
  .card-cart__steam { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 2; stroke-linecap: round; }
  .card-cart__fly { position: absolute; left: 106px; top: 46px; z-index: 3; width: 28px; height: 28px; border-radius: 8px; background: light-dark(#50535b, #c6c8cd); pointer-events: none; }
  .card-cart__row { display: flex; align-items: baseline; justify-content: space-between; margin: 10px 0; }
  .card-cart__name { margin: 0; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-cart__price { font-size: 13px; font-weight: 600; color: light-dark(#50535b, #c6c8cd); }
  .card-cart__add { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; height: 34px; border: 0; border-radius: 10px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: transform 0.15s; }
  .card-cart__add:active { transform: scale(0.97); }
  .card-cart__add:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-cart__add svg { width: 14px; height: 14px; }
  @media (prefers-reduced-motion: reduce) {
    .card-cart__bag--bump, .card-cart__count { animation: none; }
  }
`;

// A copy of the product flies up and over into the bag (WAAPI). Each press gets its own copy, so quick presses all land.
function Flyer({ id, onLand }: { id: number; onLand: (id: number) => void }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const a = el.current!.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: 'translate(52px, -64px) scale(0.75)', opacity: 1, offset: 0.55 },
        { transform: 'translate(92px, -51px) scale(0.3)', opacity: 0.4 },
      ],
      { duration: 650, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
    );
    a.onfinish = () => onLand(id);
    return () => a.cancel();
  }, [id, onLand]);
  return <span ref={el} className="card-cart__fly" aria-hidden="true" />;
}

export function CartCard() {
  const [count, setCount] = useState(0);
  const [flights, setFlights] = useState<number[]>([]);
  const [added, setAdded] = useState(false);
  const [bump, setBump] = useState(0);
  const seq = useRef(0);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // When a copy lands the bag bumps and the count goes up.
  const land = useCallback((id: number) => {
    setFlights((f) => f.filter((x) => x !== id));
    setCount((c) => c + 1);
    setBump((b) => b + 1);
  }, []);

  const add = () => {
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1400);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setCount((c) => c + 1);
    const id = ++seq.current;
    setFlights((f) => [...f, id]);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-cart">
        <span key={bump} className={`card-cart__bag${bump ? ' card-cart__bag--bump' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 7h12l-1 13H7L6 7zM9 7a3 3 0 0 1 6 0" />
          </svg>
          {count > 0 && (
            <span key={count} className="card-cart__count" aria-hidden="true">
              {count}
            </span>
          )}
        </span>
        <span className="card-cart__sr" role="status">
          {count ? `${count} in cart` : ''}
        </span>
        <svg className="card-cart__art" viewBox="0 0 212 92" aria-hidden="true">
          <path className="card-cart__steam" d="M98 22 q-4 -6 0 -12 M108 20 q-4 -6 0 -12" />
          <path className="card-cart__handle" d="M126 44 q16 0 16 12 q0 12 -16 12" />
          <rect className="card-cart__mug" x={84} y={32} width={44} height={46} rx={7} />
          <rect className="card-cart__rim" x={84} y={32} width={44} height={6} rx={3} />
        </svg>
        {flights.map((id) => (
          <Flyer key={id} id={id} onLand={land} />
        ))}
        <div className="card-cart__row">
          <p className="card-cart__name">Stoneware mug</p>
          <span className="card-cart__price">$24</span>
        </div>
        <button type="button" className="card-cart__add" onClick={add}>
          {added && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          )}
          {added ? 'Added' : 'Add to cart'}
        </button>
      </article>
    </>
  );
}
