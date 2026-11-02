"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Games', body: 'Eight cabinets on the floor today, and two of them are new this week.' },
  { label: 'Prizes', body: 'Three plush toys left on the top shelf, the big one at 900 tickets.' },
  { label: 'Scores', body: 'Your best this month is 42,310, fourth on the board.' },
  { label: 'Friends', body: 'Two friends are playing now, and one has invited you to a race.' },
];
const W = 240;
const H = 88;
const PAD = 8; // keeps the open prongs inside the glass at either end
const COL = (W - 2 * PAD) / TABS.length;
const CHIP_W = 46;
const CHIP_H = 26;
const REST = 54; // chip top, sitting in its slot
const PIVOT = 12; // where the cable leaves the carriage
const HUB = 4; // cable end to the top of the chip it holds
const LOW = REST - PIVOT - HUB; // cable length down on a chip
const DROP = LOW - 7; // lets go a little above the slot
const HIGH = 10; // cable length with the claw up
const OPEN = 24; // prong angle when open, in degrees
const home = (i: number) => PAD + i * COL + COL / 2;

type Chip = { held: boolean; dx: number; dy: number; r: number; vx: number; vy: number; vr: number };
type Pose = { x: number; L: number; th: number; g: number; chips: Chip[] };

const rest = (): Chip => ({ held: false, dx: 0, dy: 0, r: 0, vx: 0, vy: 0, vr: 0 });
// Where the cable ends, swung through th radians about the carriage.
const tip = (p: Pose) => ({ x: p.x - (p.L + HUB) * Math.sin(p.th), y: PIVOT + (p.L + HUB) * Math.cos(p.th) });
const holding = (i: number): Pose => {
  const p: Pose = { x: home(i), L: HIGH, th: 0, g: 1, chips: TABS.map(rest) };
  p.chips[i] = { ...rest(), held: true, dy: PIVOT + HIGH + HUB - REST };
  return p;
};

const css = `
  .tabs-claw { width: ${W}px; }
  .tabs-claw__machine { position: relative; height: ${H}px; border-radius: 14px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529), inset 0 10px 18px -12px rgb(0 0 0 / 0.5); overflow: hidden; }
  .tabs-claw__machine::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(112deg, transparent 22%, color-mix(in srgb, light-dark(#373a40, #f1f2f3) 6%, transparent) 22% 34%, transparent 34% 40%, color-mix(in srgb, light-dark(#373a40, #f1f2f3) 4%, transparent) 40% 44%, transparent 44%); pointer-events: none; z-index: 2; }
  .tabs-claw__rig { position: absolute; inset: 0; width: ${W}px; height: ${H}px; overflow: visible; pointer-events: none; z-index: 1; }
  .tabs-claw__rail { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 2; stroke-linecap: round; }
  .tabs-claw__floor { stroke: light-dark(#ebedf0, #232529); stroke-width: 1; }
  .tabs-claw__carriage { fill: light-dark(#cbced3, #393c41); }
  .tabs-claw__cable { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.5; }
  .tabs-claw__hub { fill: light-dark(#50535b, #c6c8cd); }
  .tabs-claw__prong { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .tabs-claw__shadow { position: absolute; top: ${REST + CHIP_H - 2}px; width: 40px; height: 2px; margin-left: -20px; border-radius: 50%; box-shadow: 0 1px 6px 2px rgb(0 0 0 / 0.35); }
  .tabs-claw__tab { position: absolute; top: ${REST}px; width: ${CHIP_W}px; height: ${CHIP_H}px; margin-left: ${-CHIP_W / 2}px; padding: 0; border: 0; border-radius: 8px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 1px 0 color-mix(in srgb, light-dark(#373a40, #f1f2f3) 8%, transparent); font: inherit; font-size: 12px; font-weight: 600; color: light-dark(#50535b, #c6c8cd); cursor: pointer; transform-origin: 50% 0; transition: background-color 0.2s, color 0.2s; }
  .tabs-claw__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-claw__tab[data-held] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-claw__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-claw__panel { padding: 12px 2px 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function ClawTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [pose, setPose] = useState<Pose>(() => holding(0));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const st = useRef({ p: holding(0), vx: 0, vL: 0, vth: 0, vg: 0, closing: false, raf: 0 });

  // The claw works through a chore list every frame, so a new pick can cut in at any point: put back
  // the chip it holds, rise, ride the gantry over, drop open, close on the chip and lift it out. It
  // hangs from a cable, so starting and stopping set it swinging.
  useEffect(() => {
    const s = st.current;
    const p = s.p;
    cancelAnimationFrame(s.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, { p: holding(sel), vx: 0, vL: 0, vth: 0, vg: 0, closing: false });
      setPose(s.p);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const held = p.chips.findIndex((c) => c.held);
      let tx = p.x;
      let tL = HIGH;
      let tg = p.g;
      if (held >= 0 && held !== sel) {
        tL = DROP;
        tg = p.L > DROP - 1.5 ? 0 : 1;
        if (p.g < 0.6) {
          // Let go: the chip drops the last few pixels into its slot.
          const t = tip(p);
          p.chips[held] = { held: false, dx: t.x - home(held), dy: t.y - REST, r: p.th, vx: 0, vy: s.vL * Math.cos(p.th), vr: s.vth };
        }
      } else if (held < 0) {
        tg = 0;
        if (Math.abs(p.x - home(sel)) > 2.5 || Math.abs(s.vx) > 60) {
          s.closing = false;
          if (p.L < HIGH + 10) tx = home(sel);
        } else {
          tx = home(sel);
          tL = LOW;
          // Only close once it is down on the chip, then keep closing.
          s.closing ||= p.L > LOW - 1;
          if (s.closing) tg = 1;
          if (p.g > 0.92) {
            p.chips[sel] = { ...rest(), held: true };
            s.closing = false;
          }
        }
      } else {
        tx = home(sel);
        tg = 1;
      }
      const ax = 170 * (tx - p.x) - 26 * s.vx;
      s.vx += ax * dt;
      p.x += s.vx * dt;
      s.vL += (650 * (tL - p.L) - 51 * s.vL) * dt;
      p.L += s.vL * dt;
      s.vg += (1100 * (tg - p.g) - 66 * s.vg) * dt;
      p.g = Math.max(0, Math.min(1, p.g + s.vg * dt));
      // A pendulum on the cable: shorter swings faster, and the carriage's pull sets it going.
      s.vth += ((-2400 / (p.L + 20)) * p.th - 5 * s.vth + 0.0008 * ax) * dt;
      p.th += s.vth * dt;
      let busy = Math.abs(p.x - home(sel)) > 0.2 || Math.abs(s.vx) > 1 || Math.abs(p.L - HIGH) > 0.2 || Math.abs(s.vL) > 1;
      busy ||= p.g < 0.99 || Math.abs(p.th) > 0.002 || Math.abs(s.vth) > 0.02 || held !== sel;
      const t = tip(p);
      p.chips.forEach((c, i) => {
        if (c.held) {
          Object.assign(c, { dx: t.x - home(i), dy: t.y - REST, r: p.th });
          return;
        }
        // Loose chips fall under gravity, bounce once or twice and straighten up.
        c.vy += 2600 * dt;
        c.dy += c.vy * dt;
        if (c.dy > 0) {
          c.dy = 0;
          c.vy = Math.abs(c.vy) < 40 ? 0 : -c.vy * 0.35;
        }
        c.vx += (-300 * c.dx - 30 * c.vx) * dt;
        c.dx += c.vx * dt;
        c.vr += (-500 * c.r - 26 * c.vr) * dt;
        c.r += c.vr * dt;
        busy ||= c.dy < -0.1 || Math.abs(c.vy) > 0 || Math.abs(c.dx) > 0.1 || Math.abs(c.r) > 0.002;
      });
      if (!busy) {
        Object.assign(s, { p: holding(sel), vx: 0, vL: 0, vth: 0, vg: 0, closing: false });
        setPose(s.p);
        return;
      }
      setPose({ ...p, chips: p.chips.map((c) => ({ ...c })) });
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [sel]);

  const n = TABS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  const open = OPEN * (1 - pose.g);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-claw">
        <div className="tabs-claw__machine" role="tablist" aria-label="Arcade" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => {
            const c = pose.chips[i];
            const lift = Math.min(1, -c.dy / 30);
            return (
              <span
                key={t.label}
                className="tabs-claw__shadow"
                aria-hidden="true"
                style={{ left: home(i) + c.dx, opacity: 1 - lift * 0.75, transform: `scaleX(${1 - lift * 0.45})` }}
              />
            );
          })}
          {TABS.map((t, i) => {
            const c = pose.chips[i];
            return (
              <button
                key={t.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-claw__tab"
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                data-held={c.held ? '' : undefined}
                style={{ left: home(i), transform: `translate(${c.dx}px, ${c.dy}px) rotate(${c.r}rad)` }}
                onClick={() => setSel(i)}
              >
                {t.label}
              </button>
            );
          })}
          <svg className="tabs-claw__rig" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <line className="tabs-claw__floor" x1="0" x2={W} y1={REST + CHIP_H + 0.5} y2={REST + CHIP_H + 0.5} />
            <line className="tabs-claw__rail" x1="10" x2={W - 10} y1="8" y2="8" />
            <rect className="tabs-claw__carriage" x={pose.x - 11} y="3" width="22" height="9" rx="3" />
            <g transform={`translate(${pose.x} ${PIVOT}) rotate(${(pose.th * 180) / Math.PI})`}>
              <line className="tabs-claw__cable" x1="0" y1="0" x2="0" y2={pose.L} />
              <g transform={`translate(0 ${pose.L})`}>
                <rect className="tabs-claw__hub" x="-11" y="-3" width="22" height="7" rx="2" />
                <path className="tabs-claw__prong" transform={`translate(-9 2) rotate(${open})`} d="M0 0C-8 1-16 5-16 11Q-16 17-12.5 20" />
                <path className="tabs-claw__prong" transform={`translate(9 2) rotate(${-open})`} d="M0 0C8 1 16 5 16 11Q16 17 12.5 20" />
              </g>
            </g>
          </svg>
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-claw__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
