"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Bag', body: 'Two items, ready to go. Change a size or take out anything you no longer want.' },
  { label: 'Delivery', body: 'Standard arrives Thursday. Next day is $6 more if you order before 8pm.' },
  { label: 'Payment', body: 'Card, wallet or bank transfer. Nothing is charged until the order ships.' },
];
const W = 240;
const COL = W / TABS.length;
const PITCH = 6;
const TEETH = W / PITCH;

const css = `
  .tabs-zip { width: ${W}px; }
  .tabs-zip__list { display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); }
  .tabs-zip__tab { border: 0; padding: 6px 0 8px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-zip__tab:hover, .tabs-zip__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-zip__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-zip__track { display: block; width: ${W}px; height: 28px; overflow: visible; }
  .tabs-zip__tape { fill: light-dark(#ebedf0, #232529); }
  .tabs-zip__tooth { fill: light-dark(#cbced3, #393c41); }
  .tabs-zip__tooth--shut { fill: light-dark(#50535b, #c6c8cd); }
  .tabs-zip__slider { fill: light-dark(#373a40, #f1f2f3); }
  .tabs-zip__pull { fill: light-dark(#42454c, #e5e6e9); }
  .tabs-zip__panel { padding: 6px 0 0; min-height: calc(3.1em + 6px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function ZipTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [pose, setPose] = useState({ x: COL / 2, a: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const st = useRef({ x: COL / 2, v: 0, a: 0, av: 0, raf: 0 });

  // The slider rides to the chosen tab on a spring. Its pull swings back from the speed and then hangs still.
  useEffect(() => {
    const s = st.current;
    const goal = sel * COL + COL / 2;
    cancelAnimationFrame(s.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, { x: goal, v: 0, a: 0, av: 0 });
      setPose({ x: goal, a: 0 });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-90 * (s.x - goal) - 17 * s.v) * dt;
      s.x += s.v * dt;
      const want = Math.max(-35, Math.min(35, -s.v * 0.12));
      s.av += (-160 * (s.a - want) - 9 * s.av) * dt;
      s.a += s.av * dt;
      if (Math.abs(s.x - goal) < 0.05 && Math.abs(s.v) < 0.5 && Math.abs(s.a) < 0.2 && Math.abs(s.av) < 1) {
        Object.assign(s, { x: goal, v: 0, a: 0, av: 0 });
        setPose({ x: goal, a: 0 });
        return;
      }
      setPose({ x: s.x, a: s.a });
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [sel]);

  // Behind the slider the teeth are meshed in one line; ahead of it the two rows part in a V.
  const gap = (x: number) => Math.max(0, Math.min(6, (x - pose.x - 7) * 0.08));
  const n = TABS.length;
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
      <div className="tabs-zip">
        <div className="tabs-zip__list" role="tablist" aria-label="Checkout" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-zip__tab"
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
        <svg className="tabs-zip__track" viewBox={`0 0 ${W} 28`} aria-hidden="true">
          <rect className="tabs-zip__tape" y={2} width={W} height={3} rx={1.5} />
          <rect className="tabs-zip__tape" y={13} width={W} height={3} rx={1.5} />
          {Array.from({ length: TEETH }, (_, i) => {
            const x = i * PITCH + 1;
            const d = gap(x + 2);
            return <rect key={`a${i}`} className={`tabs-zip__tooth${d ? '' : ' tabs-zip__tooth--shut'}`} x={x} y={5 - d} width={4} height={4} rx={1} />;
          })}
          {Array.from({ length: TEETH }, (_, i) => {
            const x = i * PITCH + 4;
            const d = gap(x + 2);
            return <rect key={`b${i}`} className={`tabs-zip__tooth${d ? '' : ' tabs-zip__tooth--shut'}`} x={x} y={9 + d} width={4} height={4} rx={1} />;
          })}
          <g transform={`translate(${pose.x} 9)`}>
            <g transform={`rotate(${pose.a} 0 4)`}>
              <path className="tabs-zip__pull" fillRule="evenodd" d="M-4 3H4V16A4 4 0 0 1-4 16ZM-1.5 10H1.5V15H-1.5Z" />
            </g>
            <rect className="tabs-zip__slider" x={-8} y={-6} width={16} height={11} rx={3.5} />
          </g>
        </svg>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-zip__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
