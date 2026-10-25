"use client";

import { useEffect, useId, useRef, type CSSProperties } from 'react';

const css = `
  .card-ink-reveal {
    position: relative;
    width: 184px;
    height: 128px;
    border-radius: 14px;
    cursor: none;
  }

  .card-ink-reveal__face {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 3px;
    padding: 16px;
    overflow: hidden;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 14px;
    background: radial-gradient(circle at 80% 20%, light-dark(#dbdde1, #2e3035), transparent 45%), light-dark(#f3f4f7, #1a1c1f);
  }

  .card-ink-reveal__title {
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    font-weight: 600;
  }

  .card-ink-reveal__text {
    color: light-dark(#5f626a, #a7abb2);
    font-size: 11px;
  }

  /* The inverted card, shown only where the gooey blobs are. */
  .card-ink-reveal__face--ink {
    border-color: light-dark(#42454c, #e5e6e9);
    background: radial-gradient(circle at 80% 20%, light-dark(#50535b, #c6c8cd), transparent 45%), light-dark(#373a40, #f1f2f3);
    -webkit-mask: url(#card-ink-reveal-mask);
    mask: url(#card-ink-reveal-mask);
  }

  .card-ink-reveal__face--ink .card-ink-reveal__title {
    color: light-dark(#fbfcfd, #121417);
  }

  .card-ink-reveal__face--ink .card-ink-reveal__text {
    color: light-dark(#cbced3, #393c41);
  }

  .card-ink-reveal__defs {
    position: absolute;
    width: 0;
    height: 0;
  }

  /* An alpha mask: only the blob's shape matters, not its colour. */
  .card-ink-reveal__defs mask {
    mask-type: alpha;
  }
`;

const SIZES = [30, 24, 19, 15, 11, 8]; // head, then a tapering tail

export function InkRevealCard() {
  const ref = useRef<HTMLDivElement>(null);
  // SVG ids are page-global: each card gets its own mask and filter.
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const maskId = `card-ink-reveal-mask-${uid}`;
  const gooId = `card-ink-reveal-goo-${uid}`;
  useEffect(() => (ref.current ? initInkReveal(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="card-ink-reveal">
        <div className="card-ink-reveal__face">
          <div className="card-ink-reveal__title">Negative space</div>
          <div className="card-ink-reveal__text">Move to reveal, click to flood</div>
        </div>
        <div className="card-ink-reveal__face card-ink-reveal__face--ink" aria-hidden="true" style={{ mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})` } as CSSProperties}>
          <div className="card-ink-reveal__title">Positive space</div>
          <div className="card-ink-reveal__text">Everything is inverted here</div>
        </div>
        <svg className="card-ink-reveal__defs" aria-hidden="true" focusable="false">
          <filter id={gooId}>
            <feGaussianBlur stdDeviation="7" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-100" y="-100" width="2000" height="2000">
            <g className="card-ink-reveal__blobs" filter={`url(#${gooId})`}>
              {SIZES.map((s) => (
                <circle key={s} r="0" />
              ))}
            </g>
          </mask>
        </svg>
      </div>
    </>
  );
}

// The head chases the cursor, each drop chases the one before it; the goo
// filter melts them into one blob, and the blob is the mask. A click floods.
function initInkReveal(root: HTMLElement): (() => void) | undefined {
  const circles = Array.from(root.querySelectorAll<SVGCircleElement>('.card-ink-reveal__blobs circle'));
  if (!circles.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blobs = circles.map(() => ({ x: 0, y: 0, r: 0 }));
  let target = { x: 0, y: 0 };
  let inside = false;
  let flood = false;
  let raf = 0;

  const tick = () => {
    let moving = false;
    const big = Math.hypot(root.offsetWidth, root.offsetHeight);
    blobs.forEach((b, i) => {
      const lead = i === 0 ? target : blobs[i - 1];
      const k = reduce ? 1 : i === 0 ? 0.3 : 0.32;
      b.x += (lead.x - b.x) * k;
      b.y += (lead.y - b.y) * k;
      const want = flood ? (i === 0 ? big : 0) : inside ? SIZES[i] : 0;
      b.r += (want - b.r) * (reduce ? 1 : 0.16);
      if (Math.abs(lead.x - b.x) + Math.abs(lead.y - b.y) + Math.abs(want - b.r) > 0.2) moving = true;
      circles[i].setAttribute('cx', b.x.toFixed(1));
      circles[i].setAttribute('cy', b.y.toFixed(1));
      circles[i].setAttribute('r', b.r.toFixed(1));
    });
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const local = (e: PointerEvent | MouseEvent) => {
    const box = root.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const enter = (e: PointerEvent) => {
    inside = true;
    target = local(e);
    // Start the whole trail at the entry point, so it does not streak in.
    if (!flood) blobs.forEach((b) => Object.assign(b, { x: target.x, y: target.y }));
    kick();
  };
  const move = (e: PointerEvent) => {
    target = local(e);
    kick();
  };
  const leave = () => {
    inside = false;
    flood = false;
    kick();
  };
  const click = (e: MouseEvent) => {
    flood = !flood;
    target = local(e);
    kick();
  };

  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('click', click);
  return () => {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('click', click);
    circles.forEach((c) => c.setAttribute('r', '0'));
  };
}
