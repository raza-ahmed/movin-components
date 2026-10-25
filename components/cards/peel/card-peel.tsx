"use client";

import { useEffect, useRef } from 'react';

const css = `
  .card-peel {
    position: relative;
    width: 176px;
    height: 124px;
    touch-action: none;
  }

  .card-peel__under,
  .card-peel__sticker {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 2px;
    padding: 14px;
    border-radius: 14px;
  }

  .card-peel__under {
    border: 1px dashed light-dark(#cbced3, #393c41);
    background: light-dark(#f3f4f7, #1a1c1f);
  }

  .card-peel__under .card-peel__title {
    color: light-dark(#42454c, #e5e6e9);
  }

  .card-peel__under .card-peel__text {
    color: light-dark(#5f626a, #a7abb2);
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    letter-spacing: 0.04em;
  }

  .card-peel__sticker {
    background: linear-gradient(150deg, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
    clip-path: var(--card-peel-clip, none);
  }

  .card-peel__sticker .card-peel__title {
    color: light-dark(#fbfcfd, #121417);
  }

  .card-peel__sticker .card-peel__text {
    color: light-dark(#cbced3, #393c41);
  }

  .card-peel__title {
    font-size: 15px;
    font-weight: 600;
  }

  .card-peel__text {
    font-size: 12px;
  }

  /* The underside of the peeled part: the sticker region past the fold line,
     mirrored across it. Drawn on an oversized box so it can hang off the card. */
  .card-peel__flap-shadow {
    position: absolute;
    inset: -200px;
    pointer-events: none;
    filter: drop-shadow(-2px 4px 5px rgba(0, 0, 0, 0.4));
  }

  .card-peel__flap {
    position: absolute;
    inset: 0;
    background: linear-gradient(var(--card-peel-angle, 135deg), light-dark(#5f626a, #a7abb2), light-dark(#42454c, #e5e6e9) 45%, light-dark(#373a40, #f1f2f3));
    clip-path: var(--card-peel-flap, polygon(0 0, 0 0, 0 0));
  }

  .card-peel__corner {
    position: absolute;
    right: -6px;
    bottom: -6px;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: 0 0 14px 0;
    background: none;
    cursor: grab;
  }

  .card-peel__corner:active {
    cursor: grabbing;
  }

  .card-peel__corner:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: -4px;
  }
`;

export function PeelCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initPeel(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="card-peel">
        <div className="card-peel__under">
          <div className="card-peel__title">You found it</div>
          <div className="card-peel__text">Code: MOVIN-25</div>
        </div>
        <div className="card-peel__sticker">
          <div className="card-peel__title">Peel me</div>
          <div className="card-peel__text">Drag the corner</div>
        </div>
        <div className="card-peel__flap-shadow" aria-hidden="true">
          <div className="card-peel__flap" />
        </div>
        <button className="card-peel__corner" type="button" aria-label="Peel the sticker off" aria-pressed="false" />
      </div>
    </>
  );
}

type Pt = [number, number];

// Keep the part of polygon `pts` where side(q) <= 0 (one half-plane).
function cut(pts: Pt[], side: (q: Pt) => number): Pt[] {
  const out: Pt[] = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const sa = side(a);
    const sb = side(b);
    if (sa <= 0) out.push(a);
    if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) {
      const t = sa / (sa - sb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  });
  return out;
}

const poly = (pts: Pt[], d: number) => `polygon(${pts.map((q) => `${(q[0] + d).toFixed(1)}px ${(q[1] + d).toFixed(1)}px`).join(',')})`;

// The sticker's bottom-right corner is dragged to p. The fold is the
// perpendicular bisector of corner -> p: the sticker keeps the near side, and
// the far side is mirrored across the fold to become the flap's underside.
function initPeel(root: HTMLElement): (() => void) | undefined {
  const corner = root.querySelector<HTMLButtonElement>('.card-peel__corner');
  const shadow = root.querySelector<HTMLElement>('.card-peel__flap-shadow');
  if (!corner || !shadow) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PAD = 200; // the flap box overhangs the card by this much
  let w = 0;
  let h = 0;
  const p = { x: 0, y: 0 };
  const goal = { x: 0, y: 0 };
  let dragging = false;
  let moved = false;
  let off = false;
  let raf = 0;

  const draw = () => {
    const cx = w - p.x;
    const cy = h - p.y;
    const len = Math.hypot(cx, cy);
    if (len < 0.5) {
      root.style.removeProperty('--card-peel-clip');
      root.style.removeProperty('--card-peel-flap');
      return;
    }
    const nx = cx / len;
    const ny = cy / len;
    const mx = (w + p.x) / 2;
    const my = (h + p.y) / 2;
    const side = (q: Pt) => (q[0] - mx) * nx + (q[1] - my) * ny;
    const rect: Pt[] = [[0, 0], [w, 0], [w, h], [0, h]];
    const keep = cut(rect, side);
    const flap = cut(rect, (q) => -side(q)).map((q): Pt => [q[0] - 2 * side(q) * nx, q[1] - 2 * side(q) * ny]);
    root.style.setProperty('--card-peel-clip', keep.length ? poly(keep, 0) : 'polygon(0 0, 0 0, 0 0)');
    root.style.setProperty('--card-peel-flap', poly(flap, PAD));
    root.style.setProperty('--card-peel-angle', `${((Math.atan2(-ny, -nx) * 180) / Math.PI + 90).toFixed(1)}deg`);
  };

  const tick = () => {
    const k = dragging ? 0.5 : 0.18;
    p.x += (goal.x - p.x) * k;
    p.y += (goal.y - p.y) * k;
    draw();
    if (Math.abs(goal.x - p.x) + Math.abs(goal.y - p.y) > 0.3) raf = requestAnimationFrame(tick);
    else {
      p.x = goal.x;
      p.y = goal.y;
      draw();
      raf = 0;
    }
  };

  const aim = (x: number, y: number) => {
    goal.x = x;
    goal.y = y;
    if (reduce) {
      p.x = x;
      p.y = y;
      draw();
    } else if (!raf) raf = requestAnimationFrame(tick);
  };

  const peelOff = () => {
    off = true;
    corner.setAttribute('aria-pressed', 'true');
    corner.setAttribute('aria-label', 'Stick the sticker back');
    shadow.style.transition = 'opacity 0.5s 0.15s';
    shadow.style.opacity = '0';
    aim(-w * 1.06, -h * 1.06); // fold line just past the far corner: nothing left stuck
  };

  const stickBack = () => {
    off = false;
    corner.setAttribute('aria-pressed', 'false');
    corner.setAttribute('aria-label', 'Peel the sticker off');
    shadow.style.transition = 'opacity 0.25s';
    shadow.style.opacity = '';
    aim(w, h);
  };

  // Hovering lifts the corner a little: an invitation to pull.
  const hover = () => {
    if (!off && !dragging) aim(w - 18, h - 14);
  };
  const leave = () => {
    if (!off && !dragging) aim(w, h);
  };

  const down = (e: PointerEvent) => {
    if (off) return;
    dragging = true;
    moved = false;
    corner.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const box = root.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    moved = moved || Math.abs(x - w) + Math.abs(y - h) > 6;
    aim(Math.max(-w * 0.6, Math.min(w, x)), Math.max(-h * 0.6, Math.min(h, y)));
  };
  const up = () => {
    if (!dragging) return;
    dragging = false;
    // Past ~60% of the diagonal it comes off; otherwise it settles back.
    if (Math.hypot(w - goal.x, h - goal.y) > 0.6 * Math.hypot(w, h)) peelOff();
    else hover();
  };
  const click = () => {
    if (moved) {
      moved = false;
      return;
    }
    if (off) stickBack();
    else peelOff();
  };

  const measure = () => {
    w = root.offsetWidth;
    h = root.offsetHeight;
    if (!off && !dragging) {
      p.x = goal.x = w;
      p.y = goal.y = h;
    }
    draw();
  };

  const ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  corner.addEventListener('pointerdown', down);
  corner.addEventListener('pointermove', move);
  corner.addEventListener('pointerup', up);
  corner.addEventListener('pointercancel', up);
  corner.addEventListener('click', click);
  root.addEventListener('pointerenter', hover);
  root.addEventListener('pointerleave', leave);

  return () => {
    ro.disconnect();
    cancelAnimationFrame(raf);
    corner.removeEventListener('pointerdown', down);
    corner.removeEventListener('pointermove', move);
    corner.removeEventListener('pointerup', up);
    corner.removeEventListener('pointercancel', up);
    corner.removeEventListener('click', click);
    root.removeEventListener('pointerenter', hover);
    root.removeEventListener('pointerleave', leave);
    root.style.removeProperty('--card-peel-clip');
    root.style.removeProperty('--card-peel-flap');
    shadow.style.opacity = '';
  };
}
