"use client";

import { useEffect, useRef } from 'react';

const css = `
  .toggle-flap {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-flap__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-flap__board {
    display: flex;
    gap: 3px;
    padding: 6px;
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 6px 14px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45));
  }

  .toggle-flap__input:focus-visible + .toggle-flap__board {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 3px;
  }

  .toggle-flap__cell {
    position: relative;
    display: block;
    width: 26px;
    height: 36px;
    color: light-dark(#42454c, #e5e6e9);
    font: 700 22px/36px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-align: center;
    perspective: 120px;
    transition: color 0.3s;
  }

  /* Each half shows one half of a full-height letter. */
  .toggle-flap__half,
  .toggle-flap__leaf {
    position: absolute;
    left: 0;
    width: 100%;
    height: 50%;
    overflow: hidden;
    background: light-dark(#ebedf0, #232529);
    backface-visibility: hidden;
  }

  .toggle-flap__half > span,
  .toggle-flap__leaf > span {
    display: block;
    height: 36px;
  }

  .toggle-flap__half--top,
  .toggle-flap__leaf--top {
    top: 0;
    border-radius: 3px 3px 0 0;
    transform-origin: 50% 100%;
  }

  .toggle-flap__half--bottom,
  .toggle-flap__leaf--bottom {
    bottom: 0;
    border-radius: 0 0 3px 3px;
    transform-origin: 50% 0;
  }

  .toggle-flap__half--bottom > span,
  .toggle-flap__leaf--bottom > span {
    margin-top: -18px;
  }

  .toggle-flap__half--top,
  .toggle-flap__leaf--top {
    background: linear-gradient(light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529));
  }

  .toggle-flap__leaf--bottom {
    transform: rotateX(90deg);
  }

  /* The hinge. */
  .toggle-flap__cell::after {
    content: '';
    position: absolute;
    top: 17.5px;
    left: 0;
    width: 100%;
    height: 1px;
    background: light-dark(#fbfcfd, #121417);
  }

  .toggle-flap__input:checked + .toggle-flap__board .toggle-flap__cell {
    color: light-dark(#373a40, #f1f2f3);
  }
`;

export function FlapToggle() {
  const ref = useRef<HTMLLabelElement>(null);
  useEffect(() => (ref.current ? initFlap(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <label className="toggle-flap" ref={ref}>
        <input className="toggle-flap__input" type="checkbox" role="switch" />
        <span className="toggle-flap__board" aria-hidden="true">
          <span className="toggle-flap__cell">
            <span className="toggle-flap__half toggle-flap__half--top"><span>O</span></span>
            <span className="toggle-flap__half toggle-flap__half--bottom"><span>O</span></span>
            <span className="toggle-flap__leaf toggle-flap__leaf--top"><span>O</span></span>
            <span className="toggle-flap__leaf toggle-flap__leaf--bottom"><span>O</span></span>
          </span>
          <span className="toggle-flap__cell">
            <span className="toggle-flap__half toggle-flap__half--top"><span>F</span></span>
            <span className="toggle-flap__half toggle-flap__half--bottom"><span>F</span></span>
            <span className="toggle-flap__leaf toggle-flap__leaf--top"><span>F</span></span>
            <span className="toggle-flap__leaf toggle-flap__leaf--bottom"><span>F</span></span>
          </span>
          <span className="toggle-flap__cell">
            <span className="toggle-flap__half toggle-flap__half--top"><span>F</span></span>
            <span className="toggle-flap__half toggle-flap__half--bottom"><span>F</span></span>
            <span className="toggle-flap__leaf toggle-flap__leaf--top"><span>F</span></span>
            <span className="toggle-flap__leaf toggle-flap__leaf--bottom"><span>F</span></span>
          </span>
        </span>
        <span className="toggle-flap__label">Status</span>
      </label>
    </>
  );
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STEP = 90; // ms per flap

// Each switch clatters every letter through a few random flaps before it
// lands, one cell a beat behind the next; a letter that doesn't change stays.
function initFlap(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.toggle-flap__input');
  if (!input) return;
  const cells = Array.from(root.querySelectorAll<HTMLElement>('.toggle-flap__cell'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let run = 0;
  let running: Animation[] = [];

  const parts = (cell: HTMLElement) => ({
    top: cell.querySelector('.toggle-flap__half--top > span') as HTMLElement,
    bottom: cell.querySelector('.toggle-flap__half--bottom > span') as HTMLElement,
    leafTop: cell.querySelector('.toggle-flap__leaf--top') as HTMLElement,
    leafBottom: cell.querySelector('.toggle-flap__leaf--bottom') as HTMLElement,
  });
  const current = (cell: HTMLElement) => parts(cell).top.textContent ?? '';

  const show = (cell: HTMLElement, ch: string) => {
    const p = parts(cell);
    p.top.textContent = p.bottom.textContent = ch;
    p.leafTop.firstElementChild!.textContent = p.leafBottom.firstElementChild!.textContent = ch;
  };

  // One flap: the old top half falls away, then the new bottom half drops in.
  const flap = (cell: HTMLElement, from: string, to: string) => {
    const p = parts(cell);
    p.top.textContent = to;
    p.bottom.textContent = from;
    p.leafTop.firstElementChild!.textContent = from;
    p.leafBottom.firstElementChild!.textContent = to;
    const a = p.leafTop.animate(
      [{ transform: 'rotateX(0deg)', filter: 'brightness(1)' }, { transform: 'rotateX(-90deg)', filter: 'brightness(0.6)' }],
      { duration: STEP / 2, easing: 'ease-in', fill: 'forwards' },
    );
    const b = p.leafBottom.animate(
      [{ transform: 'rotateX(90deg)', filter: 'brightness(1.4)' }, { transform: 'rotateX(0deg)', filter: 'brightness(1)' }],
      { duration: STEP / 2, delay: STEP / 2, easing: 'ease-out', fill: 'forwards' },
    );
    running.push(a, b);
    return b.finished.then(() => {
      p.bottom.textContent = to;
      p.leafTop.firstElementChild!.textContent = to;
      a.cancel();
      b.cancel();
    });
  };

  const spin = (cell: HTMLElement, to: string, index: number, id: number) => {
    if (current(cell) === to) return;
    const seq: string[] = [];
    for (let i = 0; i < 3 + index; i++) seq.push(LETTERS.charAt(Math.floor(Math.random() * LETTERS.length)));
    seq.push(to);
    let chain: Promise<void> = new Promise((resolve) => setTimeout(resolve, index * 70));
    for (const ch of seq) {
      chain = chain.then(() => (id === run ? flap(cell, current(cell), ch) : undefined));
    }
    chain.catch(() => {});
  };

  const stop = () => {
    run++;
    running.forEach((a) => a.cancel());
    running = [];
  };

  const change = () => {
    const word = input.checked ? 'ON ' : 'OFF';
    stop();
    cells.forEach((cell, i) => {
      if (reduce.matches) return show(cell, word.charAt(i));
      show(cell, current(cell));
      spin(cell, word.charAt(i), i, run);
    });
  };

  input.addEventListener('change', change);
  return () => {
    stop();
    input.removeEventListener('change', change);
  };
}
