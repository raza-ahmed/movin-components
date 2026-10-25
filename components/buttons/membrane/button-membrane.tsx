"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-membrane {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 176px;
    height: 56px;
    padding: 0;
    border: 0;
    border-radius: 14px;
    background: light-dark(#42454c, #e5e6e9);
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /* Once the script draws the skin, the skin is the button. Without it (or with
     reduced motion) the plain rounded rectangle above stays. */
  .btn-membrane--live {
    background: transparent;
  }

  .btn-membrane__skin {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }

  .btn-membrane__fill {
    fill: light-dark(#42454c, #e5e6e9);
  }

  .btn-membrane__label {
    position: relative;
    transform: translate(var(--btn-membrane-lx, 0px), var(--btn-membrane-ly, 0px));
    pointer-events: none;
  }

  .btn-membrane:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }
`;

export function MembraneButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initMembrane(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-membrane" type="button">
        <svg className="btn-membrane__skin" aria-hidden="true" focusable="false">
          <path className="btn-membrane__fill" />
        </svg>
        <span className="btn-membrane__label">Pull me</span>
      </button>
    </>
  );
}

interface Side {
  n: number; // bulge along the outward normal, px
  vn: number;
  tn: number;
  a: number; // where along the side the bulge peaks, 0..1
  va: number;
  ta: number;
}

// Each side of the rounded rectangle is a quadratic curve whose control point
// rides a spring. Leaving the button drags the exit edge after the cursor
// until it lets go (REACH) and wobbles home; a press squishes, release boings.
function initMembrane(root: HTMLElement): (() => void) | undefined {
  const path = root.querySelector<SVGPathElement>('.btn-membrane__fill');
  if (!path || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const REACH = 64;
  let w = 0;
  let h = 0;
  let r = 14;
  const sides: Side[] = [0, 1, 2, 3].map(() => ({ n: 0, vn: 0, tn: 0, a: 0.5, va: 0, ta: 0.5 }));
  const label = { x: 0, vx: 0, tx: 0, y: 0, vy: 0, ty: 0 };
  let armed = false;
  let held = false;
  let active = false;
  let raf = 0;
  let last = 0;

  const draw = () => {
    const [t, rt, b, l] = sides;
    const sw = w - 2 * r;
    const sh = h - 2 * r;
    path.setAttribute(
      'd',
      `M${r} 0Q${r + t.a * sw} ${-2 * t.n} ${w - r} 0A${r} ${r} 0 0 1 ${w} ${r}` +
        `Q${w + 2 * rt.n} ${r + rt.a * sh} ${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}` +
        `Q${r + b.a * sw} ${h + 2 * b.n} ${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}` +
        `Q${-2 * l.n} ${r + l.a * sh} 0 ${r}A${r} ${r} 0 0 1 ${r} 0Z`,
    );
    root.style.setProperty('--btn-membrane-lx', `${label.x.toFixed(2)}px`);
    root.style.setProperty('--btn-membrane-ly', `${label.y.toFixed(2)}px`);
  };

  const tick = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    let moving = false;
    for (const s of sides) {
      s.vn += (520 * (s.tn - s.n) - 16 * s.vn) * dt; // loose: it wobbles
      s.n += s.vn * dt;
      s.va += (260 * (s.ta - s.a) - 30 * s.va) * dt;
      s.a += s.va * dt;
      if (Math.abs(s.vn) > 0.02 || Math.abs(s.tn - s.n) > 0.02 || Math.abs(s.va) > 0.001 || Math.abs(s.ta - s.a) > 0.001) moving = true;
    }
    label.vx += (300 * (label.tx - label.x) - 22 * label.vx) * dt;
    label.x += label.vx * dt;
    label.vy += (300 * (label.ty - label.y) - 22 * label.vy) * dt;
    label.y += label.vy * dt;
    if (Math.abs(label.vx) + Math.abs(label.vy) > 0.02 || Math.abs(label.tx - label.x) + Math.abs(label.ty - label.y) > 0.02) moving = true;
    draw();
    raf = moving ? requestAnimationFrame(tick) : 0;
  };

  const kick = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const aim = (px: number, py: number) => {
    for (const s of sides) {
      s.tn = held ? -5 : 0;
      s.ta = 0.5;
    }
    label.tx = 0;
    label.ty = 0;
    if (px >= 0 && px <= w && py >= 0 && py <= h) {
      armed = true;
      label.tx = (px - w / 2) * 0.1;
      label.ty = (py - h / 2) * 0.16;
    } else if (armed) {
      // The side the cursor left through is the one it is furthest past.
      const d = [-py, px - w, py - h, -px];
      let side = 0;
      for (let j = 1; j < 4; j++) if (d[j] > d[side]) side = j;
      const dist = d[side];
      if (dist > REACH) {
        armed = false; // it lets go; the spring does the wobble
      } else {
        const s = sides[side];
        s.tn = dist * 0.8;
        s.ta = clamp(side % 2 === 0 ? (px - r) / (w - 2 * r) : (py - r) / (h - 2 * r), 0.12, 0.88);
        label.tx = clamp(side === 1 ? dist * 0.18 : side === 3 ? -dist * 0.18 : (px - w / 2) * 0.08, -12, 12);
        label.ty = clamp(side === 0 ? -dist * 0.22 : side === 2 ? dist * 0.22 : (py - h / 2) * 0.1, -12, 12);
      }
    }
  };

  const onMove = (e: PointerEvent) => {
    const box = root.getBoundingClientRect();
    const px = e.clientX - box.left;
    const py = e.clientY - box.top;
    const near = armed || held || (px >= 0 && px <= w && py >= 0 && py <= h);
    if (!near && !active) return; // nothing to do far away
    active = near;
    aim(px, py);
    kick();
  };

  const release = () => {
    armed = false;
    active = false;
    aim(-1e4, -1e4);
    kick();
  };

  const onDown = () => {
    held = true;
    for (const s of sides) s.tn = -5;
    kick();
  };

  const onUp = () => {
    if (!held) return;
    held = false;
    for (const s of sides) {
      s.tn = Math.max(0, s.tn);
      s.vn += 150; // the boing
    }
    kick();
  };

  const measure = () => {
    w = root.offsetWidth;
    h = root.offsetHeight;
    r = Math.min(14, h / 2 - 1);
    draw();
  };

  const ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  root.classList.add('btn-membrane--live');
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', release);
  window.addEventListener('blur', release);
  root.addEventListener('pointerdown', onDown);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);

  return () => {
    ro.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', release);
    window.removeEventListener('blur', release);
    root.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    root.classList.remove('btn-membrane--live');
    path.removeAttribute('d');
  };
}
