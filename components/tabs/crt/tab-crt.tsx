"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const CHANNELS = [
  { label: 'News', title: 'Evening news', body: 'Floods in the valley, and the bridge reopens Monday.' },
  { label: 'Sport', title: 'Match of the day', body: 'Late winner at the harbour ground, 2 to 1.' },
  { label: 'Film', title: 'Late film', body: 'A silent-era heist, starting in ten minutes.' },
];
// Off: the picture squeezes to a bright line, then the line to a dot. On: the reverse, overshooting a little.
const OFF: Keyframe[] = [
  { transform: 'scale(1, 1)', filter: 'brightness(1)' },
  { transform: 'scale(1, 0.012)', filter: 'brightness(4)', offset: 0.6 },
  { transform: 'scale(0, 0.012)', filter: 'brightness(4)' },
];
const ON: Keyframe[] = [
  { transform: 'scale(0, 0.012)', filter: 'brightness(4)' },
  { transform: 'scale(1, 0.012)', filter: 'brightness(3)', offset: 0.35 },
  { transform: 'scale(1, 1.05)', filter: 'brightness(1.4)', offset: 0.8 },
  { transform: 'scale(1, 1)', filter: 'brightness(1)' },
];

const css = `
  .tabs-crt { width: 240px; }
  .tabs-crt__set { padding: 10px; border-radius: 18px; background: light-dark(#ebedf0, #232529); }
  .tabs-crt__screen { position: relative; height: 104px; border-radius: 14px / 18px; overflow: hidden; background: light-dark(#fbfcfd, #121417); }
  .tabs-crt__picture { position: absolute; inset: 0; padding: 16px; background: radial-gradient(ellipse at 50% 40%, light-dark(#dbdde1, #2e3035), light-dark(#f3f4f7, #1a1c1f)); }
  .tabs-crt__screen::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(transparent 0 2px, color-mix(in srgb, light-dark(#fbfcfd, #121417) 35%, transparent) 2px 3px); pointer-events: none; }
  .tabs-crt__title { margin: 0 0 6px; font-size: 15px; font-weight: 700; color: light-dark(#373a40, #f1f2f3); }
  .tabs-crt__body { margin: 0; font-size: 12.5px; line-height: 1.5; color: light-dark(#42454c, #e5e6e9); }
  .tabs-crt__list { display: flex; gap: 6px; margin-top: 10px; }
  .tabs-crt__tab { flex: 1; height: 28px; border: 0; border-radius: 8px; background: light-dark(#dbdde1, #2e3035); color: light-dark(#50535b, #c6c8cd); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
  .tabs-crt__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-crt__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .tabs-crt__tab span { margin-right: 5px; font-variant-numeric: tabular-nums; opacity: 0.7; }
`;

export function CrtTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [shown, setShown] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const picture = useRef<HTMLDivElement>(null);
  const on = useRef(0);

  // The old channel switches off, the picture swaps while it is a dot, and the new one switches on.
  useEffect(() => {
    const el = picture.current!;
    const running = el.getAnimations();
    running.forEach((a) => a.cancel());
    if (sel === on.current) {
      if (running.length) el.animate(ON, { duration: 380, easing: 'ease-out' });
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      on.current = sel;
      return setShown(sel);
    }
    let live = true;
    const off = el.animate(OFF, { duration: 300, easing: 'ease-in', fill: 'forwards' });
    off.onfinish = () => {
      if (!live) return;
      on.current = sel;
      setShown(sel);
      el.animate(ON, { duration: 380, easing: 'ease-out' });
      off.cancel();
    };
    return () => {
      live = false;
    };
  }, [sel]);

  const n = CHANNELS.length;
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
      <div className="tabs-crt">
        <div className="tabs-crt__set">
          <div className="tabs-crt__screen">
            <div className="tabs-crt__picture" ref={picture}>
              {CHANNELS.map((c, i) => (
                <div key={c.label} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={shown !== i}>
                  <p className="tabs-crt__title">{c.title}</p>
                  <p className="tabs-crt__body">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="tabs-crt__list" role="tablist" aria-label="Channels" onKeyDown={onKeyDown}>
          {CHANNELS.map((c, i) => (
            <button
              key={c.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-crt__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span aria-hidden="true">{i + 1}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
