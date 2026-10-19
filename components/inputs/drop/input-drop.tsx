"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-drop {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 320px;
    color: #a7a7a7;
    font-size: 13px;
  }

  .field-drop__box {
    position: relative;
    display: block;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background: #202020;
    transition: border-color 0.2s;
  }

  .field-drop__box:focus-within {
    border-color: #a7a7a7;
  }

  /* Input and mirror share every metric so the letters sit exactly on the
     input's own (transparent) text; kerning is off in both for the same reason. */
  .field-drop__input,
  .field-drop__mirror {
    box-sizing: border-box;
    padding: 0 14px;
    font: inherit;
    font-size: 16px;
    font-kerning: none;
    font-variant-ligatures: none;
    letter-spacing: 0;
  }

  .field-drop__input {
    display: block;
    width: 100%;
    height: 46px;
    margin: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: transparent;
    caret-color: #ededed;
  }

  .field-drop__input::placeholder {
    color: #7c7c7c;
  }

  .field-drop__input::selection {
    background: #4d4d4d;
  }

  .field-drop__mirror {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: inherit;
    color: #f6f6f6;
    white-space: pre;
    pointer-events: none;
  }

  .field-drop__line {
    position: relative;
    display: block;
  }

  .field-drop__char {
    display: inline-block;
  }

  .field-drop__char--in {
    animation: field-drop-in 0.5s cubic-bezier(0.3, 0, 0.3, 1) backwards;
  }

  @keyframes field-drop-in {
    0% {
      opacity: 0;
      transform: translateY(-130%) rotate(var(--field-drop-r));
    }
    55% {
      opacity: 1;
      transform: translateY(12%) rotate(0deg);
    }
    78% {
      transform: translateY(-5%);
    }
    100% {
      transform: none;
    }
  }

  /* A deleted letter keeps its place out of the flow and falls away. */
  .field-drop__char--out {
    position: absolute;
    animation: field-drop-out 0.45s cubic-bezier(0.5, 0, 0.9, 0.5) forwards;
  }

  @keyframes field-drop-out {
    to {
      opacity: 0;
      transform: translateY(160%) rotate(var(--field-drop-r));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .field-drop__char--in {
      animation: none;
    }
    .field-drop__char--out {
      display: none;
    }
  }
`;

export function DropLettersInput() {
  const ref = useRef<HTMLLabelElement>(null);
  useEffect(() => (ref.current ? initDrop(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <label ref={ref} className="field-drop">
        <span className="field-drop__name">Project name</span>
        <span className="field-drop__box">
          <input className="field-drop__input" type="text" placeholder="Name it something good" maxLength={40} spellCheck={false} autoComplete="off" />
          <span className="field-drop__mirror" aria-hidden="true">
            <span className="field-drop__line" />
          </span>
        </span>
      </label>
    </>
  );
}

// The input's own text is transparent; a mirror line draws each letter as a
// span over it. Diffing old and new text keeps the shared start and end, so
// only arriving letters drop in and only leaving letters fall out.
function initDrop(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.field-drop__input');
  const line = root.querySelector<HTMLElement>('.field-drop__line');
  if (!input || !line) return;
  let spans: HTMLElement[] = [];
  let text = '';

  const char = (c: string) => {
    const s = document.createElement('span');
    s.className = 'field-drop__char';
    s.textContent = c;
    s.style.setProperty('--field-drop-r', `${(Math.random() * 40 - 20).toFixed(0)}deg`);
    return s;
  };
  const scroll = () => {
    line.style.transform = `translateX(${-input.scrollLeft}px)`;
  };
  const update = () => {
    const v = input.value;
    let p = 0;
    while (p < text.length && p < v.length && text[p] === v[p]) p++;
    let s = 0;
    while (s < text.length - p && s < v.length - p && text[text.length - 1 - s] === v[v.length - 1 - s]) s++;
    const added = v.slice(p, v.length - s).split('').map(char);
    const removed = spans.splice(p, text.length - s - p, ...added);
    // Measure every leaving letter before any of them leaves the flow.
    const lefts = removed.map((r) => r.offsetLeft);
    removed.forEach((r, i) => {
      if (i > 24) return r.remove();
      r.style.left = `${lefts[i]}px`;
      r.classList.add('field-drop__char--out');
      r.addEventListener('animationend', () => r.remove());
      window.setTimeout(() => r.remove(), 600);
    });
    const next = spans[p + added.length] ?? null;
    // A paste cascades in left to right.
    added.forEach((a, i) => {
      a.classList.add('field-drop__char--in');
      if (i) a.style.animationDelay = `${Math.min(i, 30) * 18}ms`;
      line.insertBefore(a, next);
    });
    text = v;
    scroll();
  };
  const caret = () => {
    if (document.activeElement === input) scroll();
  };

  input.addEventListener('input', update);
  input.addEventListener('scroll', scroll);
  document.addEventListener('selectionchange', caret);
  update();
  return () => {
    input.removeEventListener('input', update);
    input.removeEventListener('scroll', scroll);
    document.removeEventListener('selectionchange', caret);
    line.textContent = '';
    spans = [];
  };
}
