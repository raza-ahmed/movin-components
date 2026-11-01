"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  .card-note {
    position: relative;
    display: grid;
    place-items: center;
    width: 240px;
    height: 200px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-note__paper { position: relative; width: 150px; height: 132px; transform: rotate(-2.5deg); }
  .card-note__shadow { position: absolute; left: 8px; right: 8px; bottom: -4px; height: 20px; border-radius: 50%; background: var(--card-note-shadow); filter: blur(6px); }
  .card-note { --card-note-shadow: light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.55)); }
  /* The same note twice: the top part stays pinned, the bottom part hinges up on a horizontal fold. */
  .card-note__half { position: absolute; inset: 0; padding: 16px 14px; box-sizing: border-box; background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); }
  .card-note__half--top { clip-path: inset(0 0 45% 0); }
  .card-note__half--bottom { clip-path: inset(55% 0 0 0); transform-origin: 50% 55%; }
  .card-note__shade { position: absolute; inset: 0; background: var(--card-note-shadow); clip-path: inset(55% 0 0 0); pointer-events: none; }
  .card-note__pin { position: absolute; left: 50%; top: -5px; z-index: 2; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); box-shadow: 0 2px 3px var(--card-note-shadow); }
  .card-note__title { margin: 0 0 6px; font-size: 13px; font-weight: 700; }
  .card-note__line { margin: 0; font-size: 11.5px; line-height: 1.55; color: light-dark(#42454c, #e5e6e9); }
`;

function Body() {
  return (
    <>
      <p className="card-note__title">Before Friday</p>
      <p className="card-note__line">Call the printer by 3</p>
      <p className="card-note__line">Send the proofs to Ana</p>
      <p className="card-note__line">Book the van</p>
      <p className="card-note__line">Water the fern</p>
    </>
  );
}

export function NoteCard() {
  const [lift, setLift] = useState(0);
  const st = useRef({ a: 0, v: 0, gust: 0, raf: 0, on: false, x: 0, y: 0, t: 0 });

  // A gust from the pointer's speed pushes the flap up; it falls back on a loose spring, so it flutters.
  const kick = () => {
    const q = st.current;
    if (q.on) return;
    q.on = true;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-110 * (q.a - q.gust) - 6 * q.v) * dt;
      q.a += q.v * dt;
      q.gust *= Math.exp(-dt * 2.5);
      setLift(q.a);
      if (Math.abs(q.a) < 0.05 && Math.abs(q.v) < 0.1 && q.gust < 0.05) {
        q.on = false;
        q.a = 0;
        setLift(0);
        return;
      }
      q.raf = requestAnimationFrame(step);
    };
    q.raf = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);

  const onMove = (e: React.PointerEvent) => {
    const q = st.current;
    const now = performance.now();
    const dt = Math.max(8, now - q.t);
    const speed = (Math.hypot(e.clientX - q.x, e.clientY - q.y) / dt) * 1000;
    q.x = e.clientX;
    q.y = e.clientY;
    q.t = now;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || dt > 100) return;
    q.gust = Math.min(58, Math.max(q.gust, speed * 0.08));
    kick();
  };

  const a = Math.max(-12, lift);
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-note" onPointerMove={onMove} aria-label="Sticky note: Before Friday. Call the printer by 3, send the proofs to Ana, book the van, water the fern.">
        <div className="card-note__paper" aria-hidden="true">
          <span className="card-note__shadow" style={{ transform: `scale(${1 + a / 120})`, opacity: 1 - a / 90 }} />
          <div className="card-note__half card-note__half--top">
            <Body />
          </div>
          <div className="card-note__half card-note__half--bottom" style={{ transform: `perspective(420px) rotateX(${a}deg)` }}>
            <Body />
          </div>
          <span className="card-note__shade" style={{ opacity: a / 70, transform: `perspective(420px) rotateX(${a}deg)`, transformOrigin: '50% 55%' }} />
          <span className="card-note__pin" />
        </div>
      </article>
    </>
  );
}
