"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-fold {
    display: inline-block;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: none;
    color: #111111;
    font: inherit;
    cursor: pointer;
    perspective: 420px;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-fold:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  .btn-fold__paper {
    position: relative;
    display: block;
    width: 168px;
    height: 56px;
    transform-style: preserve-3d;
  }

  .btn-fold__half {
    position: absolute;
    right: 0;
    left: 0;
    height: 50%;
    transform-style: preserve-3d;
  }

  /* The top half hinges on the crease line. */
  .btn-fold__half--top {
    top: 0;
    transform-origin: 50% 100%;
    transition: transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1);
  }

  .btn-fold__half--bottom {
    bottom: 0;
    transform: translateZ(-1px); /* folded flat, the top half must win, not flicker */
  }

  .btn-fold:hover .btn-fold__half--top {
    transform: rotateX(-14deg);
  }

  .btn-fold__face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #ededed;
    backface-visibility: hidden;
  }

  .btn-fold__half--top .btn-fold__face {
    border-radius: 12px 12px 0 0;
    box-shadow: inset 0 -1px 0 rgba(17, 17, 17, 0.08);
  }

  .btn-fold__half--bottom .btn-fold__face {
    border-radius: 0 0 12px 12px;
  }

  /* Each half shows its half of one full-height label. */
  .btn-fold__text {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 56px;
    font-size: 15px;
    font-weight: 600;
    line-height: 56px;
    text-align: center;
  }

  .btn-fold__half--bottom .btn-fold__text {
    top: -28px;
  }

  /* The underside of the top half, seen once it has folded over. */
  .btn-fold__back {
    position: absolute;
    inset: 0;
    border-radius: 0 0 12px 12px;
    background: linear-gradient(180deg, #a7a7a7, #c9c9c9);
    transform: rotateX(180deg);
    backface-visibility: hidden;
  }

  .btn-fold__shade {
    position: absolute;
    inset: 0;
    border-radius: 0 0 12px 12px;
    background: #111111;
    opacity: 0;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-fold__half--top {
      transition: none;
    }
    .btn-fold:hover .btn-fold__half--top {
      transform: none;
    }
  }
`;

export function FoldButton({ label = 'Send letter', alt = 'Sent' }: { label?: string; alt?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initFold(ref.current, label, alt) : undefined), [label, alt]);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-fold" type="button" aria-label={label}>
        <span className="btn-fold__paper" aria-hidden="true">
          <span className="btn-fold__half btn-fold__half--bottom">
            <span className="btn-fold__face">
              <span className="btn-fold__text">{label}</span>
            </span>
            <span className="btn-fold__shade" />
          </span>
          <span className="btn-fold__half btn-fold__half--top">
            <span className="btn-fold__face">
              <span className="btn-fold__text">{label}</span>
            </span>
            <span className="btn-fold__back" />
          </span>
        </span>
      </button>
    </>
  );
}

// Fold the top half down over the bottom, hold it folded while the label
// changes underneath, then unfold. The second-stage animations fill backwards
// so the flap and its shadow stay put through the pause instead of snapping up.
function initFold(root: HTMLElement, label: string, alt: string): (() => void) | undefined {
  const top = root.querySelector<HTMLElement>('.btn-fold__half--top');
  const shade = root.querySelector<HTMLElement>('.btn-fold__shade');
  const texts = root.querySelectorAll<HTMLElement>('.btn-fold__text');
  if (!top || !shade || !texts.length) return;
  const labels = [label, alt];
  let current = 0;
  let busy = false;
  const ease = 'cubic-bezier(0.45, 0, 0.2, 1)';
  const easeOut = 'cubic-bezier(0.35, 0, 0.15, 1)';

  const swap = () => {
    current = 1 - current;
    texts.forEach((t) => (t.textContent = labels[current]));
    root.setAttribute('aria-label', labels[current]);
  };

  const fold = () => {
    if (busy) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();
    busy = true;
    const from = getComputedStyle(top).transform; // starts from the hover lift, no jump
    const down = top.animate([{ transform: from === 'none' ? 'rotateX(0deg)' : from }, { transform: 'rotateX(-180deg)' }], {
      duration: 640,
      easing: ease,
      fill: 'forwards',
    });
    const dim = shade.animate([{ opacity: 0 }, { opacity: 0.45 }], { duration: 640, easing: ease, fill: 'forwards' });
    down.onfinish = () => {
      swap();
      // Land where CSS will hold it: on the hover lift if the cursor is still over it.
      const end = root.matches(':hover') ? 'rotateX(-14deg)' : 'rotateX(0deg)';
      const up = top.animate([{ transform: 'rotateX(-180deg)' }, { transform: end }], { duration: 820, delay: 380, easing: easeOut, fill: 'backwards' });
      shade.animate([{ opacity: 0.45 }, { opacity: 0 }], { duration: 820, delay: 380, easing: easeOut, fill: 'backwards' });
      down.cancel();
      dim.cancel();
      up.onfinish = () => {
        busy = false;
      };
    };
  };

  root.addEventListener('click', fold);
  return () => {
    root.removeEventListener('click', fold);
    top.getAnimations().forEach((a) => a.cancel());
    shade.getAnimations().forEach((a) => a.cancel());
    texts.forEach((t) => (t.textContent = label));
    root.setAttribute('aria-label', label);
  };
}
