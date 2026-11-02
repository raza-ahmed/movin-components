"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TRACKS = [
  { label: 'Intro', at: 0.04, body: 'Tape hiss, a count-in and the first chord. Forty seconds long.' },
  { label: 'Tides', at: 0.33, body: 'The single. Slow drums under a guitar that never quite resolves.' },
  { label: 'Night', at: 0.62, body: 'Recorded live in one take, with the rain on the studio roof.' },
  { label: 'Outro', at: 0.9, body: 'The intro played backwards, fading into the run-out.' },
];
const TAPE = 900;
const L = { x: 78, y: 72 };
const R = { x: 142, y: 72 };
// The tape packs grow and shrink as tape winds from one reel to the other.
const packL = (p: number) => 11 + 19 * (1 - p);
const packR = (p: number) => 11 + 19 * p;

const css = `
  .tabs-cassette { width: 240px; }
  .tabs-cassette__deck { display: block; width: 220px; height: 120px; margin: 0 auto; }
  .tabs-cassette__body { fill: light-dark(#dbdde1, #2e3035); }
  .tabs-cassette__label { fill: light-dark(#42454c, #e5e6e9); }
  .tabs-cassette__title { fill: light-dark(#f3f4f7, #1a1c1f); font-size: 11px; font-weight: 700; }
  .tabs-cassette__side { fill: light-dark(#cbced3, #393c41); font-size: 8px; font-weight: 700; letter-spacing: 0.08em; }
  .tabs-cassette__window { fill: light-dark(#fbfcfd, #121417); }
  .tabs-cassette__pack { fill: light-dark(#cbced3, #393c41); }
  .tabs-cassette__hub { fill: light-dark(#42454c, #e5e6e9); }
  .tabs-cassette__spoke { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 2.5; stroke-linecap: round; }
  .tabs-cassette__tape { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.5; }
  .tabs-cassette__foot { fill: light-dark(#cbced3, #393c41); }
  .tabs-cassette__read { display: flex; justify-content: space-between; margin: 6px 10px 8px; font-size: 11px; color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; }
  .tabs-cassette__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .tabs-cassette__list { display: grid; grid-template-columns: repeat(${TRACKS.length}, 1fr); gap: 4px; }
  .tabs-cassette__tab { height: 28px; border: 0; border-radius: 7px; background: light-dark(#ebedf0, #232529); color: light-dark(#50535b, #c6c8cd); font: inherit; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
  .tabs-cassette__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-cassette__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .tabs-cassette__panel { padding: 10px 2px 0; min-height: calc(3.1em + 10px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

function Reel({ c, r, a, clip }: { c: { x: number; y: number }; r: number; a: number; clip: string }) {
  return (
    <g>
      <circle className="tabs-cassette__pack" cx={c.x} cy={c.y} r={r} clipPath={`url(#${clip})`} />
      <circle className="tabs-cassette__hub" cx={c.x} cy={c.y} r={9} />
      <g transform={`rotate(${a} ${c.x} ${c.y})`}>
        {[0, 120, 240].map((d) => (
          <line key={d} className="tabs-cassette__spoke" x1={c.x} y1={c.y} x2={c.x} y2={c.y - 6} transform={`rotate(${d} ${c.x} ${c.y})`} />
        ))}
      </g>
    </g>
  );
}

export function CassetteTabs() {
  const id = useId();
  const clip = `tabs-cassette-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [sel, setSel] = useState(0);
  const [deck, setDeck] = useState({ p: TRACKS[0].at, aL: 0, aR: 0, mode: 'Playing' });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const st = useRef({ p: TRACKS[0].at, aL: 0, aR: 0, raf: 0 });

  // Winding to a track runs the reels fast, forward or back. Each reel turns at the speed the tape
  // leaves or reaches it, so the nearly empty one spins hardest; the counter follows the tape.
  useEffect(() => {
    const s = st.current;
    const from = s.p;
    const to = TRACKS[sel].at;
    cancelAnimationFrame(s.raf);
    if (from === to) return;
    const mode = to > from ? 'Fast forward' : 'Rewind';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.p = to;
      return setDeck({ p: to, aL: s.aL, aR: s.aR, mode: 'Playing' });
    }
    const dur = 350 + 1300 * Math.abs(to - from);
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
      const p = from + (to - from) * e;
      const dp = p - s.p;
      s.aL += ((dp * TAPE) / packL(p)) * (180 / Math.PI);
      s.aR += ((dp * TAPE) / packR(p)) * (180 / Math.PI);
      s.p = p;
      setDeck({ p, aL: s.aL, aR: s.aR, mode: k < 1 ? mode : 'Playing' });
      if (k < 1) s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [sel]);

  const rl = packL(deck.p);
  const rr = packR(deck.p);
  const n = TRACKS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-cassette">
        <svg className="tabs-cassette__deck" viewBox="0 0 220 120" aria-hidden="true">
          <defs>
            <clipPath id={clip}>
              <rect x={48} y={52} width={124} height={40} rx={6} />
            </clipPath>
          </defs>
          <rect className="tabs-cassette__body" x={4} y={4} width={212} height={112} rx={8} />
          <rect className="tabs-cassette__label" x={16} y={12} width={188} height={32} rx={3} />
          <text className="tabs-cassette__side" x={24} y={24}>
            SIDE A
          </text>
          <text className="tabs-cassette__title" x={24} y={37}>
            {TRACKS[sel].label}
          </text>
          <rect className="tabs-cassette__window" x={48} y={52} width={124} height={40} rx={6} />
          <path className="tabs-cassette__tape" d={`M${L.x} ${L.y + rl}L36 106H184L${R.x} ${R.y + rr}`} />
          <Reel c={L} r={rl} a={deck.aL} clip={clip} />
          <Reel c={R} r={rr} a={deck.aR} clip={clip} />
          <path className="tabs-cassette__foot" d="M44 116L54 104H166L176 116Z" />
        </svg>
        <p className="tabs-cassette__read" aria-hidden="true">
          <b>{deck.mode}</b>
          <span>{String(Math.round(deck.p * 600)).padStart(3, '0')}</span>
        </p>
        <div className="tabs-cassette__list" role="tablist" aria-label="Side A" onKeyDown={onKeyDown}>
          {TRACKS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-cassette__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {TRACKS.map((t, i) => (
          <div key={t.label} className="tabs-cassette__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
