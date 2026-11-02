"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const ACTS = [
  { label: 'Act I', body: 'A harbour town at dawn. Nobody has noticed the boat yet.' },
  { label: 'Act II', body: 'The boat is empty. The town argues about what that means.' },
  { label: 'Act III', body: 'A storm, a lost key and a long night at the lighthouse.' },
  { label: 'Act IV', body: 'Morning again, and the boat is gone as quietly as it came.' },
];
const PITCH = 80;
const MOVE = 150;
const HOLD = 110;
// The strip's x for a frame centred in the gate.
const xOf = (f: number) => 80 - f * PITCH;

const css = `
  .tabs-film { width: 240px; }
  .tabs-film__view { position: relative; height: 76px; overflow: hidden; border-radius: 6px; }
  .tabs-film__strip {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    gap: 8px;
    height: 76px;
    padding: 13px 4px;
    box-sizing: border-box;
    background:
      repeating-linear-gradient(90deg, light-dark(#fbfcfd, #121417) 0 6px, transparent 6px 14px) 3px 4px / 100% 5px no-repeat,
      repeating-linear-gradient(90deg, light-dark(#fbfcfd, #121417) 0 6px, transparent 6px 14px) 3px 67px / 100% 5px no-repeat,
      light-dark(#ebedf0, #232529);
  }
  .tabs-film__frame { flex: none; width: 72px; height: 50px; border-radius: 2px; overflow: hidden; }
  .tabs-film__frame svg { display: block; width: 100%; height: 100%; }
  .tabs-film__bg { fill: light-dark(#dbdde1, #2e3035); }
  .tabs-film__a { fill: light-dark(#6d7179, #7d8087); }
  .tabs-film__b { fill: light-dark(#50535b, #c6c8cd); }
  /* Outside the gate the strip is in shadow; the gate is the lit frame. */
  .tabs-film__dim { position: absolute; top: 0; bottom: 0; width: 82px; background: color-mix(in srgb, light-dark(#fbfcfd, #121417) 62%, transparent); pointer-events: none; }
  .tabs-film__gate { position: absolute; left: 82px; top: 11px; width: 76px; height: 54px; box-sizing: border-box; border: 2px solid light-dark(#373a40, #f1f2f3); border-radius: 4px; pointer-events: none; }
  .tabs-film__shutter { position: absolute; inset: 0; background: light-dark(#fbfcfd, #121417); opacity: 0; }
  .tabs-film__list { display: grid; grid-template-columns: repeat(${ACTS.length}, 1fr); margin-top: 8px; }
  .tabs-film__tab { border: 0; padding: 6px 0; background: none; font: inherit; font-size: 12.5px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.25s; }
  .tabs-film__tab:hover, .tabs-film__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-film__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-film__panel { padding: 6px 0 0; min-height: calc(3.1em + 6px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

function Scene({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 72 50" aria-hidden="true">
      <rect className="tabs-film__bg" width={72} height={50} />
      {i === 0 && (
        <>
          <circle className="tabs-film__b" cx={50} cy={30} r={9} />
          <rect className="tabs-film__a" y={34} width={72} height={16} />
        </>
      )}
      {i === 1 && (
        <>
          <rect className="tabs-film__a" y={36} width={72} height={14} />
          <path className="tabs-film__b" d="M24 34H48L44 40H28Z M36 34V16L46 30Z" />
        </>
      )}
      {i === 2 && (
        <>
          <rect className="tabs-film__a" x={30} y={14} width={10} height={36} />
          <path className="tabs-film__b" d="M35 14L72 4V22Z" />
        </>
      )}
      {i === 3 && (
        <>
          <circle className="tabs-film__b" cx={20} cy={16} r={6} />
          <rect className="tabs-film__a" y={36} width={72} height={14} />
        </>
      )}
    </svg>
  );
}

export function FilmTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const shutter = useRef<HTMLSpanElement>(null);

  // A projector moves film in steps: the strip jumps one frame, holds, jumps again, and the shutter
  // closes over the gate during each pull so only still frames are seen.
  useEffect(() => {
    const el = strip.current!;
    const x0 = new DOMMatrix(getComputedStyle(el).transform).e;
    el.getAnimations().forEach((a) => a.cancel());
    shutter.current!.getAnimations().forEach((a) => a.cancel());
    const x1 = xOf(sel);
    el.style.transform = `translateX(${x1}px)`;
    const steps = Math.ceil(Math.abs(x1 - x0) / PITCH - 0.01);
    if (!steps || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dir = Math.sign(x1 - x0);
    const total = steps * (MOVE + HOLD) - HOLD;
    const frames: Keyframe[] = [];
    const blinks: Keyframe[] = [];
    let t = 0;
    let x = x0;
    for (let k = 0; k < steps; k++) {
      const nx = k === steps - 1 ? x1 : xOf(Math.round((80 - x) / PITCH) - dir);
      frames.push({ transform: `translateX(${x}px)`, offset: t / total, easing: 'cubic-bezier(0.6, 0, 0.4, 1)' });
      blinks.push({ opacity: 0, offset: t / total }, { opacity: 0.85, offset: (t + MOVE * 0.25) / total }, { opacity: 0.85, offset: (t + MOVE * 0.75) / total });
      t += MOVE;
      frames.push({ transform: `translateX(${nx}px)`, offset: t / total });
      blinks.push({ opacity: 0, offset: t / total });
      t += HOLD;
      x = nx;
    }
    el.animate(frames, { duration: total });
    shutter.current!.animate(blinks, { duration: total });
  }, [sel]);

  const n = ACTS.length;
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
      <div className="tabs-film">
        <div className="tabs-film__view" aria-hidden="true">
          <div className="tabs-film__strip" ref={strip} style={{ transform: `translateX(${xOf(0)}px)` }}>
            {ACTS.map((a, i) => (
              <span key={a.label} className="tabs-film__frame">
                <Scene i={i} />
              </span>
            ))}
          </div>
          <span className="tabs-film__dim" style={{ left: 0 }} />
          <span className="tabs-film__dim" style={{ right: 0 }} />
          <span className="tabs-film__gate">
            <span className="tabs-film__shutter" ref={shutter} />
          </span>
        </div>
        <div className="tabs-film__list" role="tablist" aria-label="Acts" onKeyDown={onKeyDown}>
          {ACTS.map((a, i) => (
            <button
              key={a.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-film__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {a.label}
            </button>
          ))}
        </div>
        {ACTS.map((a, i) => (
          <div key={a.label} className="tabs-film__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {a.body}
          </div>
        ))}
      </div>
    </>
  );
}
