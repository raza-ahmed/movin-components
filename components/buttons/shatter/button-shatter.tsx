"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-shatter {
    position: relative;
    display: inline-block;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: none;
    font: inherit;
    cursor: pointer;
    perspective: 520px;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-shatter:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  .btn-shatter__face {
    display: grid;
    place-items: center;
    width: 168px;
    height: 56px;
    border-radius: 12px;
    background: linear-gradient(180deg, #f6f6f6, #c9c9c9);
    box-shadow: inset 0 -2px 0 rgba(17, 17, 17, 0.14);
    color: #111111;
    font-size: 15px;
    font-weight: 600;
    transition: scale 0.2s;
  }

  .btn-shatter:hover .btn-shatter__face {
    scale: 1.02;
  }

  /* Clones of the face, each clipped to one triangle. */
  .btn-shatter__shard {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    will-change: transform;
  }

  .btn-shatter--broken > .btn-shatter__face:not(.btn-shatter__shard) {
    visibility: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-shatter__face {
      transition: none;
    }
  }
`;

export function ShatterButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initShatter(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-shatter" type="button">
        <span className="btn-shatter__face">Break it</span>
      </button>
    </>
  );
}

type Point = [number, number];

// On click the face is cloned 24 times, each clone clipped to one triangle of a
// jittered grid. Each shard flies away from the click point in 3D, hangs, and
// flies back; the real face returns when the last one lands.
function initShatter(root: HTMLElement): (() => void) | undefined {
  const face = root.querySelector<HTMLElement>('.btn-shatter__face');
  if (!face) return;
  const COLS = 6;
  const ROWS = 2;
  let shards: HTMLElement[] = [];
  let busy = false;

  const clear = () => {
    shards.forEach((s) => s.remove());
    shards = [];
    root.classList.remove('btn-shatter--broken');
    busy = false;
  };

  const shatter = (e: MouseEvent) => {
    if (busy) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      face.animate([{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }], { duration: 300 });
      return;
    }
    busy = true;
    const w = face.offsetWidth;
    const h = face.offsetHeight;
    const box = face.getBoundingClientRect();
    // From the click point; from the centre for a keyboard press.
    const ox = e.detail ? e.clientX - box.left : w / 2;
    const oy = e.detail ? e.clientY - box.top : h / 2;

    const pts: Point[][] = [];
    for (let r = 0; r <= ROWS; r++) {
      pts.push([]);
      for (let c = 0; c <= COLS; c++) {
        const edge = r === 0 || r === ROWS || c === 0 || c === COLS;
        pts[r].push([
          (c / COLS) * w + (edge ? 0 : (Math.random() - 0.5) * (w / COLS) * 0.6),
          (r / ROWS) * h + (edge ? 0 : (Math.random() - 0.5) * (h / ROWS) * 0.5),
        ]);
      }
    }
    const tris: Point[][] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const a = pts[y][x], b = pts[y][x + 1], c = pts[y + 1][x + 1], d = pts[y + 1][x];
        if (Math.random() < 0.5) tris.push([a, b, c], [a, c, d]);
        else tris.push([a, b, d], [b, c, d]);
      }
    }

    const rest = 'translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    const rnd = (spread: number) => ((Math.random() - 0.5) * spread).toFixed(0);
    let left = tris.length;
    for (const tri of tris) {
      const shard = face.cloneNode(true) as HTMLElement;
      shard.classList.add('btn-shatter__shard');
      shard.setAttribute('aria-hidden', 'true');
      shard.style.clipPath = `polygon(${tri.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',')})`;
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
      const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      shard.style.transformOrigin = `${cx}px ${cy}px`;
      root.appendChild(shard);
      shards.push(shard);

      const dx = cx - ox;
      const dy = cy - oy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const power = 1.3 - Math.min(1, dist / w); // shards near the hit fly furthest
      const reach = 26 + Math.random() * 60 * power;
      const tx = ((dx / dist) * reach).toFixed(1);
      const ty = (dy / dist) * reach * 1.4 - 8;
      const tz = (30 + Math.random() * 110).toFixed(0);
      const spin = `rotateX(${rnd(140)}deg) rotateY(${rnd(140)}deg) rotateZ(${rnd(120)}deg)`;
      const out = `translate3d(${tx}px,${ty.toFixed(1)}px,${tz}px) ${spin}`;
      const drift = `translate3d(${tx}px,${(ty + 5).toFixed(1)}px,${tz}px) ${spin}`;
      const lit = `brightness(${(0.55 + Math.random() * 0.7).toFixed(2)})`;
      const anim = shard.animate(
        [
          { transform: rest, filter: 'brightness(1)', offset: 0, easing: 'cubic-bezier(0.12, 0.9, 0.25, 1)' },
          { transform: out, filter: lit, offset: 0.4, easing: 'linear' },
          { transform: drift, filter: lit, offset: 0.56, easing: 'cubic-bezier(0.7, 0, 0.25, 1)' },
          { transform: rest, filter: 'brightness(1)', offset: 1 },
        ],
        { duration: 1400 + Math.random() * 250 },
      );
      anim.onfinish = () => {
        if (--left) return;
        clear();
        face.animate([{ scale: '1.06' }, { scale: '1' }], { duration: 260, easing: 'cubic-bezier(0.3, 1.6, 0.5, 1)' });
      };
    }
    root.classList.add('btn-shatter--broken');
  };

  root.addEventListener('click', shatter);
  return () => {
    root.removeEventListener('click', shatter);
    clear();
  };
}
