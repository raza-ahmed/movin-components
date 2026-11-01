"use client";

import { useState } from 'react';

const POSTS = ['Risograph test, third pass', 'Poster for the night market', 'Type study: grotesques', 'Zine cover, rejected', 'Sketchbook, March'];

const css = `
  .card-header { position: relative; width: 240px; height: 210px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); overflow: hidden; }
  .card-header__scroll { position: absolute; inset: 0; overflow-y: auto; border-radius: inherit; scrollbar-width: none; }
  .card-header__scroll::-webkit-scrollbar { display: none; }
  .card-header__scroll:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -2px; }
  .card-header__content { padding: 112px 14px 14px; }
  .card-header__cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
    background: repeating-linear-gradient(135deg, light-dark(#dbdde1, #2e3035) 0 9px, light-dark(#cbced3, #393c41) 9px 10px);
    box-shadow: 0 6px 12px -8px var(--card-header-shadow);
    pointer-events: none;
  }
  .card-header { --card-header-shadow: light-dark(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)); }
  .card-header__avatar {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: 52px;
    height: 52px;
    border: 3px solid light-dark(#f3f4f7, #1a1c1f);
    border-radius: 50%;
    background: light-dark(#5f626a, #a7abb2);
    color: light-dark(#fbfcfd, #121417);
    font-size: 15px;
    font-weight: 700;
    transform-origin: 0 0;
    pointer-events: none;
  }
  .card-header__bar { position: absolute; left: 44px; top: 12px; z-index: 2; margin: 0; font-size: 12px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); pointer-events: none; }
  .card-header__name { margin: 0; font-size: 15px; font-weight: 700; color: light-dark(#373a40, #f1f2f3); }
  .card-header__bio { margin: 2px 0 12px; font-size: 11.5px; color: light-dark(#5f626a, #a7abb2); }
  .card-header__posts { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
  .card-header__post { display: flex; align-items: center; gap: 10px; font-size: 11.5px; color: light-dark(#42454c, #e5e6e9); }
  .card-header__thumb { flex: none; width: 32px; height: 32px; border-radius: 6px; background: light-dark(#dbdde1, #2e3035); }
  .card-header__post:nth-child(even) .card-header__thumb { background: light-dark(#cbced3, #393c41); }
`;

export function HeaderCard() {
  const [p, setP] = useState(0);
  // Collapse over the first 70px of scroll: the cover shortens, the avatar shrinks up into the bar and the name fades in beside it.
  const name = Math.max(0, (p - 0.6) / 0.4);
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-header">
        <div className="card-header__scroll" tabIndex={0} aria-label="Mira Holt, profile" onScroll={(e) => setP(Math.min(1, e.currentTarget.scrollTop / 70))}>
          <div className="card-header__content">
            <p className="card-header__name">Mira Holt</p>
            <p className="card-header__bio">Prints, posters and slow animation.</p>
            <ul className="card-header__posts">
              {POSTS.map((t) => (
                <li key={t} className="card-header__post">
                  <span className="card-header__thumb" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span className="card-header__cover" style={{ height: 84 - 44 * p }} aria-hidden="true" />
        <span className="card-header__avatar" style={{ transform: `translate(${14 - 4 * p}px, ${58 - 51 * p}px) scale(${1 - 0.5 * p})` }} aria-hidden="true">
          MH
        </span>
        <p className="card-header__bar" style={{ opacity: name, transform: `translateY(${(1 - name) * 6}px)` }} aria-hidden="true">
          Mira Holt
        </p>
      </article>
    </>
  );
}
