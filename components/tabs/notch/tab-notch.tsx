"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const ICONS = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />,
  explore: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  likes: <path d="M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.3-7 9.6-7 9.6z" />,
  profile: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" />
    </>
  ),
};

const TABS = [
  { label: 'Home', icon: ICONS.home, body: 'Fresh work from the people you follow.' },
  { label: 'Explore', icon: ICONS.explore, body: 'Trending tags and new creators this week.' },
  { label: 'Likes', icon: ICONS.likes, body: 'Everything you liked, newest first.' },
  { label: 'Profile', icon: ICONS.profile, body: 'Your posts, followers and settings.' },
];

const W = 260;
const H = 56;
const INSET = 24;
const centre = (i: number) => INSET + ((W - INSET * 2) / TABS.length) * (i + 0.5);

/** The bar, with a smooth dip under the active icon. */
const bar = (x: number) => {
  const c = Math.max(centre(0), Math.min(centre(TABS.length - 1), x));
  return `M0 16A16 16 0 0 1 16 0H${c - 34}C${c - 20} 0 ${c - 23} 28 ${c} 28S${c + 20} 0 ${c + 34} 0H${W - 16}A16 16 0 0 1 ${W} 16V${H - 16}A16 16 0 0 1 ${W - 16} ${H}H16A16 16 0 0 1 0 ${H - 16}Z`;
};

const css = `
  .tabs-notch { width: ${W}px; }
  .tabs-notch__panel { min-height: calc(3.1em + 8px); padding: 0 6px 8px; color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  .tabs-notch__bar { position: relative; height: ${H}px; margin-top: 18px; }
  .tabs-notch__svg { position: absolute; inset: 0; width: ${W}px; height: ${H}px; overflow: visible; }
  .tabs-notch__shape { fill: light-dark(#fbfcfd, #232529); filter: drop-shadow(0 4px 12px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.35))); }
  .tabs-notch__orb {
    position: absolute;
    top: -17px;
    left: -20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    box-shadow: 0 4px 10px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.45));
  }
  .tabs-notch__orb svg { position: absolute; left: 10px; top: 10px; opacity: 0; transform: scale(0.5); transition: opacity 0.2s, transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .tabs-notch__orb svg.tabs-notch__icon--on { opacity: 1; transform: none; transition-delay: 0.12s; }
  .tabs-notch__list { position: absolute; inset: 0 ${INSET}px; display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); }
  .tabs-notch__tab { position: relative; border: 0; border-radius: 12px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; cursor: pointer; transition: color 0.2s; }
  .tabs-notch__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-notch__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -4px; }
  .tabs-notch__icon { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .tabs-notch__tab .tabs-notch__icon { position: absolute; left: 50%; top: 18px; margin-left: -10px; transition: opacity 0.2s, transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1); }
  .tabs-notch__tab[aria-selected='true'] .tabs-notch__icon { opacity: 0; transform: translateY(-10px) scale(0.6); }
  .tabs-notch__name { position: absolute; left: 0; right: 0; bottom: 7px; font-size: 12px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); opacity: 0; transform: translateY(4px); transition: opacity 0.2s, transform 0.3s; }
  .tabs-notch__tab[aria-selected='true'] .tabs-notch__name { opacity: 1; transform: none; transition-delay: 0.15s; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-notch__orb svg, .tabs-notch__tab .tabs-notch__icon, .tabs-notch__name { transition: none !important; }
  }
`;

export function NotchTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [x, setX] = useState(centre(0));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const sim = useRef({ x: centre(0), v: 0, raf: 0 });

  // The notch and its orb travel on a spring, overshooting a touch before they settle.
  useEffect(() => {
    const m = sim.current;
    const target = centre(sel);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      m.x = target;
      setX(target);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      m.v += (-190 * (m.x - target) - 21 * m.v) * dt;
      m.x += m.v * dt;
      if (Math.abs(m.x - target) < 0.05 && Math.abs(m.v) < 0.5) {
        m.x = target;
        setX(target);
        return;
      }
      setX(m.x);
      m.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(m.raf);
    m.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(m.raf);
  }, [sel]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
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
      <div className="tabs-notch">
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-notch__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
        <div className="tabs-notch__bar">
          <svg className="tabs-notch__svg" aria-hidden="true">
            <path className="tabs-notch__shape" d={bar(x)} />
          </svg>
          <span className="tabs-notch__orb" style={{ transform: `translateX(${x}px)` }} aria-hidden="true">
            {TABS.map((t, i) => (
              <svg key={t.label} className={`tabs-notch__icon${sel === i ? ' tabs-notch__icon--on' : ''}`} viewBox="0 0 24 24">
                {t.icon}
              </svg>
            ))}
          </span>
          <div className="tabs-notch__list" role="tablist" aria-label="App" onKeyDown={onKeyDown}>
            {TABS.map((t, i) => (
              <button
                key={t.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-notch__tab"
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => setSel(i)}
              >
                <svg className="tabs-notch__icon" viewBox="0 0 24 24" aria-hidden="true">
                  {t.icon}
                </svg>
                <span className="tabs-notch__name">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
