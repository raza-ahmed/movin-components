"use client";

import { useState } from 'react';

const BASE = 1284;
const DIGITS = Array.from({ length: 10 }, (_, i) => i);

const css = `
  .card-follow { box-sizing: border-box; width: 240px; padding: 16px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-follow__top { display: flex; align-items: center; gap: 12px; }
  .card-follow__avatar { position: relative; flex: none; width: 52px; height: 52px; }
  .card-follow__face { position: absolute; inset: 5px; display: grid; place-items: center; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 700; }
  .card-follow__ring { position: absolute; inset: 0; width: 52px; height: 52px; transform: rotate(-90deg); }
  .card-follow__ring circle { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 0.6s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.15s; }
  .card-follow--on .card-follow__ring circle { stroke-dashoffset: 0; opacity: 1; }
  .card-follow__name { margin: 0; font-size: 14px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-follow__role { margin: 2px 0 0; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-follow__stats { display: flex; gap: 18px; margin: 14px 0; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-follow__stats b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; }
  .card-follow__count { display: flex; height: 18px; overflow: hidden; line-height: 18px; font-variant-numeric: tabular-nums; }
  .card-follow__reel { display: flex; flex-direction: column; transition: transform 0.5s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .card-follow__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .card-follow__stats > span { position: relative; }
  .card-follow__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    height: 34px;
    border: 0;
    border-radius: 10px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.25s, color 0.25s, transform 0.15s;
  }
  .card-follow__btn:active { transform: scale(0.97); }
  .card-follow__btn:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-follow--on .card-follow__btn { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  .card-follow__tick { width: 0; height: 14px; overflow: visible; transition: width 0.25s; }
  .card-follow--on .card-follow__tick { width: 14px; }
  .card-follow__tick path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.3s ease 0.15s; }
  .card-follow--on .card-follow__tick path { stroke-dashoffset: 0; }
  @media (prefers-reduced-motion: reduce) {
    .card-follow__ring circle, .card-follow__reel, .card-follow__tick, .card-follow__tick path { transition: none; }
  }
`;

// A number drawn as rolling digit reels; commas stay put.
function Count({ n }: { n: number }) {
  return (
    <span className="card-follow__count" aria-hidden="true">
      {n
        .toLocaleString('en-US')
        .split('')
        .map((c, i) =>
          c === ',' ? (
            <span key={i}>,</span>
          ) : (
            <span key={i} className="card-follow__reel" style={{ transform: `translateY(${-Number(c) * 18}px)` }}>
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          ),
        )}
    </span>
  );
}

export function FollowCard() {
  const [on, setOn] = useState(false);
  const followers = BASE + (on ? 1 : 0);
  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-follow${on ? ' card-follow--on' : ''}`}>
        <div className="card-follow__top">
          <div className="card-follow__avatar" aria-hidden="true">
            <span className="card-follow__face">MH</span>
            <svg className="card-follow__ring" viewBox="0 0 52 52">
              <circle cx={26} cy={26} r={25} pathLength={1} />
            </svg>
          </div>
          <div>
            <p className="card-follow__name">Mira Holt</p>
            <p className="card-follow__role">Motion designer</p>
          </div>
        </div>
        <div className="card-follow__stats">
          <span>
            <b>
              <Count n={followers} />
            </b>
            <span className="card-follow__sr">{followers.toLocaleString('en-US')} </span>
            Followers
          </span>
          <span>
            <b>312</b>Following
          </span>
        </div>
        <button type="button" className="card-follow__btn" aria-pressed={on} onClick={() => setOn((o) => !o)}>
          <svg className="card-follow__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
          </svg>
          {on ? 'Following' : 'Follow'}
        </button>
      </article>
    </>
  );
}
