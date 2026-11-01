"use client";

import { useEffect, useRef, useState } from 'react';

const FRESH = ['Jun: proofs look good', 'Invoice 1042 paid', 'Lea shared a board', 'Tom: van is booked'];
const READY = 50;

const css = `
  .card-refresh { box-sizing: border-box; width: 240px; padding: 12px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-refresh__head { display: flex; align-items: center; justify-content: space-between; margin: 0 2px 8px; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-refresh__btn { display: grid; place-items: center; width: 26px; height: 26px; padding: 0; border: 0; border-radius: 50%; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); cursor: pointer; }
  .card-refresh__btn:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-refresh__btn svg { width: 13px; height: 13px; }
  .card-refresh__view { position: relative; height: 146px; border-radius: 10px; overflow: hidden; touch-action: none; cursor: grab; user-select: none; -webkit-user-select: none; }
  .card-refresh__pull { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; justify-content: center; gap: 6px; height: ${READY}px; font-size: 10.5px; color: light-dark(#5f626a, #a7abb2); }
  .card-refresh__arrow { width: 14px; height: 14px; color: light-dark(#42454c, #e5e6e9); }
  .card-refresh__ring { width: 14px; height: 14px; box-sizing: border-box; border: 2px solid light-dark(#dbdde1, #2e3035); border-top-color: light-dark(#373a40, #f1f2f3); border-radius: 50%; animation: card-refresh-spin 0.7s linear infinite; }
  @keyframes card-refresh-spin { to { transform: rotate(360deg); } }
  .card-refresh__list { position: relative; margin: 0; padding: 0; list-style: none; background: light-dark(#f3f4f7, #1a1c1f); }
  .card-refresh__list--settle { transition: transform 0.45s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .card-refresh__item { display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 4px; border-bottom: 1px solid light-dark(#ebedf0, #232529); font-size: 11.5px; color: light-dark(#42454c, #e5e6e9); overflow: hidden; }
  .card-refresh__item::before { content: ''; flex: none; width: 8px; height: 8px; border-radius: 50%; background: light-dark(#cbced3, #393c41); }
  .card-refresh__item--new { animation: card-refresh-in 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .card-refresh__item--new::before { background: light-dark(#373a40, #f1f2f3); }
  @keyframes card-refresh-in { from { height: 0; opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .card-refresh__list--settle { transition: none; }
    .card-refresh__item--new { animation: none; }
  }
`;

export function RefreshCard() {
  const [items, setItems] = useState(['Ana: the prints are in', 'Deploy finished in 41s', 'Standup moved to 10:30']);
  const [fresh, setFresh] = useState<string | null>(null);
  const [pull, setPull] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'pull' | 'load'>('idle');
  const start = useRef(0);
  const next = useRef(0);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const load = () => {
    setPhase('load');
    setPull(44);
    timer.current = window.setTimeout(() => {
      const item = FRESH[next.current++ % FRESH.length];
      setItems((l) => [item, ...l].slice(0, 4));
      setFresh(item);
      setPull(0);
      setPhase('idle');
    }, 900);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-refresh">
        <div className="card-refresh__head">
          Inbox
          <button type="button" className="card-refresh__btn" aria-label="Refresh" disabled={phase === 'load'} onClick={load}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
            </svg>
          </button>
        </div>
        {/* Pull down past READY and let go to refresh; the pull eases off the further you go. */}
        <div
          className="card-refresh__view"
          onPointerDown={(e) => {
            if (phase === 'load') return;
            e.currentTarget.setPointerCapture(e.pointerId);
            start.current = e.clientY;
            setPhase('pull');
          }}
          onPointerMove={(e) => {
            if (phase !== 'pull') return;
            const dy = Math.max(0, e.clientY - start.current);
            setPull(80 * (1 - Math.exp(-dy / 110)));
          }}
          onPointerUp={() => {
            if (phase !== 'pull') return;
            if (pull >= READY) load();
            else {
              setPull(0);
              setPhase('idle');
            }
          }}
          onPointerCancel={() => {
            setPull(0);
            setPhase('idle');
          }}
        >
          <div className="card-refresh__pull" style={{ opacity: Math.min(1, pull / 30) }} aria-hidden="true">
            {phase === 'load' ? (
              <span className="card-refresh__ring" />
            ) : (
              <svg className="card-refresh__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${Math.min(180, (pull / READY) * 180)}deg)` }}>
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            )}
            {phase === 'load' ? 'Refreshing…' : pull >= READY ? 'Release to refresh' : 'Pull to refresh'}
          </div>
          <ul className={`card-refresh__list${phase === 'pull' ? '' : ' card-refresh__list--settle'}`} style={{ transform: `translateY(${pull}px)` }} aria-live="polite">
            {items.map((t) => (
              <li key={t} className={`card-refresh__item${t === fresh ? ' card-refresh__item--new' : ''}`}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
