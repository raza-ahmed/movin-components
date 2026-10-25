"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-split-flap {
    display: inline-flex;
    gap: 3px;
    padding: 7px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    color: light-dark(#42454c, #e5e6e9);
    font: 600 18px/1 ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.25s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-split-flap:hover {
    border-color: light-dark(#6d7179, #7d8087);
  }

  .btn-split-flap:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }

  /* No-script fallback: the plain label. */
  .btn-split-flap__text {
    padding: 7px 8px;
    letter-spacing: 0.14em;
  }

  .btn-split-flap__cell {
    position: relative;
    width: 20px;
    height: 32px;
    perspective: 140px;
  }

  /* The hinge. */
  .btn-split-flap__cell::after {
    content: '';
    position: absolute;
    top: calc(50% - 0.5px);
    right: 0;
    left: 0;
    z-index: 3;
    height: 1px;
    background: light-dark(#fbfcfd, #121417);
  }

  .btn-split-flap__half,
  .btn-split-flap__leaf {
    position: absolute;
    right: 0;
    left: 0;
    height: 50%;
    overflow: hidden;
    backface-visibility: hidden;
  }

  .btn-split-flap__half--top,
  .btn-split-flap__leaf--top {
    top: 0;
    border-radius: 4px 4px 0 0;
    background: light-dark(#ebedf0, #232529);
    transform-origin: 50% 100%;
  }

  .btn-split-flap__half--bottom,
  .btn-split-flap__leaf--bottom {
    bottom: 0;
    border-radius: 0 0 4px 4px;
    background: light-dark(#f3f4f7, #1a1c1f);
    transform-origin: 50% 0;
  }

  .btn-split-flap__leaf {
    z-index: 2;
  }

  .btn-split-flap__leaf--bottom {
    transform: rotateX(90deg);
  }

  .btn-split-flap__glyph {
    display: block;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }

  .btn-split-flap__half--bottom .btn-split-flap__glyph,
  .btn-split-flap__leaf--bottom .btn-split-flap__glyph {
    margin-top: -16px;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-split-flap {
      transition: none;
    }
  }
`;

export function SplitFlapButton({ label = 'Check in', alt = 'Boarding' }: { label?: string; alt?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initSplitFlap(ref.current, label, alt) : undefined), [label, alt]);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-split-flap" type="button" aria-label={label}>
        <span className="btn-split-flap__text">{label}</span>
      </button>
    </>
  );
}

interface Cell {
  el: HTMLElement;
  top: HTMLElement;
  bottom: HTMLElement;
  leafTop: HTMLElement;
  leafBottom: HTMLElement;
  ch: string;
  token: number;
  anims: { cancel(): void }[];
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// One tile per letter, each a split-flap: static top/bottom halves plus two
// leaves. A flip drops the top leaf (old letter) to the hinge, then the bottom
// leaf (new letter) falls from it and bounces on its stop.
function initSplitFlap(root: HTMLElement, label: string, alt: string): (() => void) | undefined {
  // The plain label is the server-rendered and no-script fallback; the tiles replace it.
  const source = root.querySelector<HTMLElement>('.btn-split-flap__text');
  if (!source) return;
  source.hidden = true;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const len = Math.max(label.length, alt.length);
  // Centre both words on the same number of tiles.
  const words = [label, alt].map((s) => {
    const pad = Math.floor((len - s.length) / 2);
    return (' '.repeat(pad) + s.toUpperCase()).padEnd(len, ' ');
  });

  const part = (kind: string, side: string) => {
    const el = document.createElement('span');
    el.className = `btn-split-flap__${kind} btn-split-flap__${kind}--${side}`;
    const g = document.createElement('span');
    g.className = 'btn-split-flap__glyph';
    el.appendChild(g);
    return el;
  };
  const glyph = (el: HTMLElement) => el.firstChild as HTMLElement;

  const set = (cell: Cell, ch: string) => {
    cell.ch = ch;
    cell.top.textContent = cell.bottom.textContent = glyph(cell.leafTop).textContent = glyph(cell.leafBottom).textContent = ch;
  };

  const cells: Cell[] = [...words[0]].map((ch) => {
    const el = document.createElement('span');
    el.className = 'btn-split-flap__cell';
    el.setAttribute('aria-hidden', 'true');
    const top = part('half', 'top');
    const bottom = part('half', 'bottom');
    const leafTop = part('leaf', 'top');
    const leafBottom = part('leaf', 'bottom');
    el.append(top, bottom, leafTop, leafBottom);
    root.appendChild(el);
    const cell: Cell = { el, top: glyph(top), bottom: glyph(bottom), leafTop, leafBottom, ch, token: 0, anims: [] };
    set(cell, ch);
    return cell;
  });

  const stop = (cell: Cell) => {
    cell.token++;
    cell.anims.forEach((a) => a.cancel());
    cell.anims = [];
    set(cell, cell.ch);
  };

  const flip = (cell: Cell, next: string, token: number, then: () => void) => {
    cell.top.textContent = next;
    cell.bottom.textContent = cell.ch;
    glyph(cell.leafTop).textContent = cell.ch;
    glyph(cell.leafBottom).textContent = next;
    const a = cell.leafTop.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: 60, easing: 'ease-in', fill: 'forwards' });
    cell.anims = [a];
    a.onfinish = () => {
      if (cell.token !== token) return;
      const b = cell.leafBottom.animate(
        [
          { transform: 'rotateX(90deg)', offset: 0 },
          { transform: 'rotateX(0deg)', offset: 0.7 },
          { transform: 'rotateX(14deg)', offset: 0.85 },
          { transform: 'rotateX(0deg)', offset: 1 },
        ],
        { duration: 95, easing: 'ease-out', fill: 'forwards' },
      );
      cell.anims.push(b);
      b.onfinish = () => {
        if (cell.token !== token) return;
        a.cancel();
        b.cancel();
        cell.anims = [];
        set(cell, next);
        then();
      };
    };
  };

  const show = (word: string) => {
    cells.forEach((cell, i) => {
      stop(cell);
      const target = word[i];
      if (cell.ch === target) return;
      if (reduce.matches) return set(cell, target);
      const token = cell.token;
      // A few random letters, then the real one, staggered left to right.
      const seq = Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
      seq.push(target);
      const step = () => {
        const next = seq.shift();
        if (cell.token !== token || next === undefined) return;
        flip(cell, next, token, step);
      };
      const timer = setTimeout(step, i * 45);
      cell.anims.push({ cancel: () => clearTimeout(timer) });
    });
  };

  const on = () => show(words[1]);
  const off = () => {
    if (document.activeElement === root && root.matches(':focus-visible')) return;
    show(words[0]);
  };
  root.addEventListener('mouseenter', on);
  root.addEventListener('mouseleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);

  return () => {
    root.removeEventListener('mouseenter', on);
    root.removeEventListener('mouseleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
    cells.forEach((cell) => {
      stop(cell);
      cell.el.remove();
    });
    source.hidden = false;
  };
}
