"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-filings {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 224px;
    height: 64px;
    padding: 0;
    overflow: hidden;
    border: 1px solid #3a3a3a;
    border-radius: 14px;
    background: #111111;
    color: #ededed;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.3s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-filings:hover {
    border-color: #7c7c7c;
  }

  .btn-filings:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  .btn-filings__field {
    position: absolute;
    inset: 6px 8px;
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    grid-template-rows: repeat(4, 1fr);
    place-items: center;
  }

  /* The bright half is the north end: it points at the cursor. */
  .btn-filings__needle {
    width: 11px;
    height: 2px;
    border-radius: 1px;
    background: linear-gradient(90deg, #4d4d4d 50%, #ededed 50%);
    opacity: var(--btn-filings-o, 0.45);
    transform: rotate(var(--btn-filings-a, 0deg)) scaleX(var(--btn-filings-s, 0.8));
    transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.4s;
  }

  .btn-filings__label {
    position: relative;
    padding: 4px 12px;
    border-radius: 8px;
    background: #111111;
    box-shadow: 0 0 14px 8px #111111;
    pointer-events: none;
  }

  .btn-filings--spin .btn-filings__needle {
    animation: btn-filings-spin 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--btn-filings-i) * 9ms);
  }

  @keyframes btn-filings-spin {
    from {
      rotate: 0deg;
    }
    to {
      rotate: 360deg;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-filings,
    .btn-filings__needle {
      transition: none;
    }
    .btn-filings--spin .btn-filings__needle {
      animation: none;
    }
  }
`;

export function FilingsButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initFilings(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-filings" type="button">
        <span className="btn-filings__field" aria-hidden="true" />
        <span className="btn-filings__label">Follow me</span>
      </button>
    </>
  );
}

// 52 needles, each turned to point at the cursor wherever it is on the page,
// brighter and longer the closer it is. A click spins the field once.
function initFilings(root: HTMLElement): (() => void) | undefined {
  const field = root.querySelector<HTMLElement>('.btn-filings__field');
  if (!field) return;
  const COLS = 13;
  const ROWS = 4;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const needles: HTMLElement[] = [];
  let centres: [number, number][] = [];
  let pointer: [number, number] | null = null;
  let raf = 0;

  for (let i = 0; i < COLS * ROWS; i++) {
    const n = document.createElement('span');
    n.className = 'btn-filings__needle';
    n.style.setProperty('--btn-filings-i', String(i));
    n.style.setProperty('--btn-filings-a', `${(Math.random() * 40 - 20).toFixed(0)}deg`);
    field.appendChild(n);
    needles.push(n);
  }

  const measure = () => {
    const box = root.getBoundingClientRect();
    centres = needles.map((n) => {
      const b = n.getBoundingClientRect();
      return [b.left + b.width / 2 - box.left, b.top + b.height / 2 - box.top];
    });
  };

  const update = () => {
    raf = 0;
    if (!pointer) return;
    const box = root.getBoundingClientRect();
    needles.forEach((n, i) => {
      const dx = pointer![0] - box.left - centres[i][0];
      const dy = pointer![1] - box.top - centres[i][1];
      const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 280);
      n.style.setProperty('--btn-filings-a', `${((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1)}deg`);
      n.style.setProperty('--btn-filings-o', (0.3 + near * 0.7).toFixed(2));
      n.style.setProperty('--btn-filings-s', (0.7 + near * 0.6).toFixed(2));
    });
  };

  const move = (e: PointerEvent) => {
    pointer = [e.clientX, e.clientY];
    if (!raf) raf = requestAnimationFrame(update);
  };

  const spin = () => {
    if (reduce) return;
    root.classList.remove('btn-filings--spin');
    void root.offsetWidth; // restart the spin
    root.classList.add('btn-filings--spin');
  };

  const done = (e: AnimationEvent) => {
    if (e.target === needles[needles.length - 1]) root.classList.remove('btn-filings--spin');
  };

  const ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  if (!reduce) document.addEventListener('pointermove', move, { passive: true });
  root.addEventListener('click', spin);
  root.addEventListener('animationend', done);

  return () => {
    ro.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('pointermove', move);
    root.removeEventListener('click', spin);
    root.removeEventListener('animationend', done);
    needles.forEach((n) => n.remove());
  };
}
