"use client";

import { useEffect, useRef } from 'react';

const css = `
  .card-orbit-profile {
    position: relative;
    width: 236px;
    height: 190px;
    border-radius: 18px;
    background: radial-gradient(circle at 50% 42%, light-dark(#ebedf0, #232529), light-dark(#f3f4f7, #1a1c1f) 70%);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    cursor: pointer;
  }
  .card-orbit-profile:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-orbit-profile__ring {
    position: absolute;
    left: 50%;
    top: 74px;
    width: 150px;
    height: 74px;
    margin: -37px 0 0 -75px;
    border-radius: 50%;
    border: 1px dashed light-dark(#dbdde1, #2e3035);
    transition: opacity 0.4s ease;
  }
  .card-orbit-profile[data-open] .card-orbit-profile__ring { opacity: 0; }
  .card-orbit-profile__avatar {
    position: absolute;
    left: 50%;
    top: 74px;
    width: 52px;
    height: 52px;
    margin: -26px 0 0 -26px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, light-dark(#42454c, #e5e6e9), light-dark(#6d7179, #7d8087) 70%);
    box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 0 0 4px light-dark(#6d7179, #7d8087);
    transition: transform 0.5s cubic-bezier(0.34, 1.3, 0.64, 1);
  }
  .card-orbit-profile[data-open] .card-orbit-profile__avatar { transform: translateY(-22px) scale(0.85); }
  .card-orbit-profile__name {
    position: absolute;
    left: 0;
    right: 0;
    top: 118px;
    text-align: center;
    transition: transform 0.5s cubic-bezier(0.34, 1.3, 0.64, 1);
  }
  .card-orbit-profile__name b { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-orbit-profile__name span { display: block; color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .card-orbit-profile[data-open] .card-orbit-profile__name { transform: translateY(-34px); }
  .card-orbit-profile__chip {
    position: absolute;
    left: 0;
    top: 0;
    padding: 3px 8px;
    border-radius: 999px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41);
    color: light-dark(#42454c, #e5e6e9);
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    will-change: transform;
  }
`;

const SKILLS = ['Motion', 'Figma', 'React', 'WebGL'];

export function OrbitProfileCard() {
  const root = useRef<HTMLDivElement>(null);
  const open = useRef(false);

  useEffect(() => {
    const el = root.current!;
    const chips = [...el.querySelectorAll<HTMLElement>('.card-orbit-profile__chip')];
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Row positions (centre x) for the settled state, laid out from the chips' real widths.
    const widths = chips.map((c) => c.offsetWidth);
    const total = widths.reduce((a, b) => a + b, 0) + 4 * (chips.length - 1);
    const rows: { x: number; y: number }[] = [];
    let x = (el.clientWidth - total) / 2;
    widths.forEach((w) => {
      rows.push({ x: x + w / 2, y: 158 });
      x += w + 4;
    });
    let mix = 0;
    let angle = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      mix += ((open.current ? 1 : 0) - mix) * Math.min(1, dt * 7);
      if (!still) angle += dt * 0.6 * (1 - mix);
      chips.forEach((c, i) => {
        const a = angle + (i / chips.length) * Math.PI * 2;
        // Orbit: an ellipse round the avatar; chips behind it shrink and dim.
        const ox = el.clientWidth / 2 + Math.cos(a) * 75;
        const oy = 74 + Math.sin(a) * 37;
        const depth = (Math.sin(a) + 1) / 2;
        const px = ox + (rows[i].x - ox) * mix;
        const py = oy + (rows[i].y - oy) * mix;
        const s = (0.8 + depth * 0.25) * (1 - mix) + mix;
        c.style.transform = `translate(${(px - widths[i] / 2).toFixed(1)}px, ${(py - 10).toFixed(1)}px) scale(${s.toFixed(3)})`;
        c.style.opacity = String((0.55 + depth * 0.45) * (1 - mix) + mix);
        c.style.zIndex = depth > 0.5 || mix > 0.5 ? '2' : '0';
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const set = (v: boolean) => {
    open.current = v;
    root.current!.toggleAttribute('data-open', v);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div
        ref={root}
        className="card-orbit-profile"
        tabIndex={0}
        role="group"
        aria-label={`Lena Park, motion designer. Skills: ${SKILLS.join(', ')}`}
        onPointerEnter={() => set(true)}
        onPointerLeave={() => set(false)}
        onFocus={() => set(true)}
        onBlur={() => set(false)}
      >
        <span className="card-orbit-profile__ring" aria-hidden="true" />
        <span className="card-orbit-profile__avatar" aria-hidden="true" style={{ zIndex: 1 }} />
        <div className="card-orbit-profile__name">
          <b>Lena Park</b>
          <span>Motion designer</span>
        </div>
        {SKILLS.map((s) => (
          <span key={s} className="card-orbit-profile__chip" aria-hidden="true">
            {s}
          </span>
        ))}
      </div>
    </>
  );
}
