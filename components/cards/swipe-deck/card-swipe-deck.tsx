"use client";

import { useEffect, useRef } from 'react';

const css = `
  .card-swipe-deck {
    position: relative;
    width: 150px;
    height: 188px;
    outline: none;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .card-swipe-deck:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 8px;
    border-radius: 16px;
  }

  /* Position in the deck comes from --card-swipe-deck-i (0 = top), set by the script. */
  .card-swipe-deck__card {
    position: absolute;
    inset: 0 0 18px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 14px;
    border: 1px solid #3a3a3a;
    border-radius: 14px;
    background: linear-gradient(160deg, #282828, #202020);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    opacity: calc(1 - max(0, var(--card-swipe-deck-i, 0) - 2));
    transform: translate(var(--card-swipe-deck-dx, 0px), calc(var(--card-swipe-deck-i, 0) * 9px + var(--card-swipe-deck-dy, 0px))) rotate(var(--card-swipe-deck-rot, 0deg)) scale(calc(1 - var(--card-swipe-deck-i, 0) * 0.05));
    transform-origin: 50% 100%;
    transition: transform 0.45s cubic-bezier(0.3, 1.35, 0.5, 1), opacity 0.3s;
  }

  .card-swipe-deck__card:first-child {
    cursor: grab;
  }

  .card-swipe-deck--drag .card-swipe-deck__card:first-child {
    cursor: grabbing;
    transition: none;
  }

  .card-swipe-deck__num {
    color: #7c7c7c;
    font: 600 11px ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  }

  .card-swipe-deck__title {
    margin-top: auto;
    color: #ededed;
    font-size: 16px;
    font-weight: 600;
  }

  .card-swipe-deck__text {
    margin-top: 3px;
    color: #a7a7a7;
    font-size: 11px;
  }

  .card-swipe-deck__stamp {
    position: absolute;
    top: 16px;
    padding: 2px 8px;
    border: 2px solid #ededed;
    border-radius: 6px;
    color: #ededed;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0;
  }

  .card-swipe-deck__stamp--keep {
    right: 12px;
    opacity: var(--card-swipe-deck-keep, 0);
    transform: rotate(12deg);
  }

  .card-swipe-deck__stamp--skip {
    left: 12px;
    border-color: #7c7c7c;
    color: #7c7c7c;
    opacity: var(--card-swipe-deck-skip, 0);
    transform: rotate(-12deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .card-swipe-deck__card {
      transition: none;
    }
  }
`;

const CARDS = [
  { num: '01', title: 'Swiss grid', text: 'Drag me sideways' },
  { num: '02', title: 'Bauhaus', text: 'Form follows function' },
  { num: '03', title: 'Brutalism', text: 'Raw and honest' },
  { num: '04', title: 'Memphis', text: 'Loud on purpose' },
];

export function SwipeDeckCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initSwipeDeck(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="card-swipe-deck" tabIndex={0} role="group" aria-label="Card deck. Drag the top card, or use the left and right arrow keys.">
        {CARDS.map((c) => (
          <div key={c.num} className="card-swipe-deck__card">
            <span className="card-swipe-deck__num">{c.num}</span>
            <span className="card-swipe-deck__title">{c.title}</span>
            <span className="card-swipe-deck__text">{c.text}</span>
            <span className="card-swipe-deck__stamp card-swipe-deck__stamp--keep" aria-hidden="true">
              Keep
            </span>
            <span className="card-swipe-deck__stamp card-swipe-deck__stamp--skip" aria-hidden="true">
              Skip
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

const POSE_VARS = ['--card-swipe-deck-dx', '--card-swipe-deck-dy', '--card-swipe-deck-rot', '--card-swipe-deck-keep', '--card-swipe-deck-skip'];

// The deck order lives in the DOM (first child on top), so the script moves
// nodes React rendered: it puts them back in their original order on cleanup.
function initSwipeDeck(root: HTMLElement): () => void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const THROW = 70;
  const original = Array.from(root.children) as HTMLElement[];
  let start: { x: number; y: number } | null = null;
  let dx = 0;
  let dy = 0;
  let busy = false;

  const cards = () => Array.from(root.querySelectorAll<HTMLElement>('.card-swipe-deck__card'));

  const layout = () => {
    const list = cards();
    list.forEach((c, i) => {
      c.style.setProperty('--card-swipe-deck-i', String(i));
      c.style.zIndex = String(list.length - i);
      c.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });
  };

  const pose = (card: HTMLElement, x: number, y: number) => {
    card.style.setProperty('--card-swipe-deck-dx', `${x.toFixed(1)}px`);
    card.style.setProperty('--card-swipe-deck-dy', `${y.toFixed(1)}px`);
    card.style.setProperty('--card-swipe-deck-rot', `${(x * 0.09).toFixed(2)}deg`);
    card.style.setProperty('--card-swipe-deck-keep', Math.max(0, Math.min(1, x / THROW)).toFixed(2));
    card.style.setProperty('--card-swipe-deck-skip', Math.max(0, Math.min(1, -x / THROW)).toFixed(2));
  };

  const clear = (card: HTMLElement) => POSE_VARS.forEach((p) => card.style.removeProperty(p));

  // Fly off, then slip in at the back of the deck while the rest move up.
  const fling = (dir: number) => {
    const top = cards()[0];
    if (!top || busy) return;
    busy = true;
    const done = () => {
      clear(top);
      top.style.transition = 'none';
      root.appendChild(top);
      layout();
      void top.offsetWidth;
      top.style.transition = '';
      dx = dy = 0;
      busy = false;
    };
    if (reduce) return done();
    top.style.transition = 'none';
    const anim = top.animate(
      [
        { translate: '0 0', rotate: '0deg', opacity: 1 },
        { translate: `${dir * 260 - dx}px 40px`, rotate: `${dir * 18}deg`, opacity: 0 },
      ],
      { duration: 380, easing: 'cubic-bezier(0.3, 0.5, 0.4, 1)' },
    );
    anim.onfinish = done;
  };

  const down = (e: PointerEvent) => {
    const top = cards()[0];
    if (busy || !top || !top.contains(e.target as Node)) return;
    start = { x: e.clientX, y: e.clientY };
    root.setPointerCapture(e.pointerId);
    root.classList.add('card-swipe-deck--drag');
  };
  const move = (e: PointerEvent) => {
    if (!start) return;
    dx = e.clientX - start.x;
    dy = (e.clientY - start.y) * 0.4;
    pose(cards()[0], dx, dy);
  };
  const up = () => {
    if (!start) return;
    start = null;
    root.classList.remove('card-swipe-deck--drag');
    if (Math.abs(dx) > THROW) fling(dx > 0 ? 1 : -1);
    else {
      clear(cards()[0]); // springs home on the transition
      dx = dy = 0;
    }
  };
  const key = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    pose(cards()[0], dir * 30, 0); // a nudge to show the stamp before it goes
    window.setTimeout(() => {
      dx = dir * 30;
      dy = 0;
      fling(dir);
    }, reduce ? 0 : 120);
  };

  layout();
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', key);
  return () => {
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('pointercancel', up);
    root.removeEventListener('keydown', key);
    original.forEach((c) => {
      clear(c);
      c.style.removeProperty('--card-swipe-deck-i');
      c.style.zIndex = '';
      c.removeAttribute('aria-hidden');
      root.appendChild(c);
    });
  };
}
