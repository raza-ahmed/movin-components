"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-chips {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 320px;
    color: #ededed;
    font-size: 13px;
  }

  .field-chips__label {
    color: #a7a7a7;
  }

  .field-chips__box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    box-sizing: border-box;
    min-height: 46px;
    padding: 7px 8px;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background: #202020;
    cursor: text;
    transition: border-color 0.2s;
  }

  .field-chips__box:focus-within {
    border-color: #a7a7a7;
  }

  /* The list's chips flow in the same row as the input. */
  .field-chips__list {
    display: contents;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .field-chips__chip {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: 28px;
    padding: 0 4px 0 10px;
    border-radius: 7px;
    background: #3a3a3a;
    color: #f6f6f6;
    white-space: nowrap;
    cursor: default;
  }

  .field-chips__chip--nudge {
    animation: field-chips-nudge 0.45s cubic-bezier(0.3, 0, 0.3, 1);
  }

  @keyframes field-chips-nudge {
    0%,
    100% {
      background: #3a3a3a;
      transform: none;
    }
    20% {
      background: #7c7c7c;
      transform: translateX(-4px);
    }
    45% {
      transform: translateX(3px);
    }
    70% {
      transform: translateX(-2px);
    }
  }

  .field-chips__remove {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 5px;
    background: none;
    color: #a7a7a7;
    cursor: pointer;
  }

  .field-chips__remove:hover,
  .field-chips__remove:focus-visible {
    background: #4d4d4d;
    color: #f6f6f6;
  }

  .field-chips__remove:focus-visible {
    outline: 2px solid #a7a7a7;
    outline-offset: 1px;
  }

  .field-chips__remove svg {
    width: 12px;
    height: 12px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  .field-chips__input {
    flex: 1;
    min-width: 80px;
    height: 28px;
    margin: 0;
    padding: 0 4px;
    border: 0;
    outline: none;
    background: transparent;
    color: #f6f6f6;
    font: inherit;
    font-size: 14px;
  }

  .field-chips__input::placeholder {
    color: #7c7c7c;
  }

  .field-chips__status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-chips__chip--nudge {
      animation: none;
    }
  }
`;

const START = ['motion', 'css'];
const X = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 3.5l5 5m0-5-5 5" /></svg>';

export function TagChipsInput() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initChips(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="field-chips">
        <span className="field-chips__label">Tags</span>
        <div className="field-chips__box">
          {/* Chips are owned by the script from here on, so React renders none. */}
          <ul className="field-chips__list" aria-label="Tags" data-start={START.join(',')} />
          <input className="field-chips__input" type="text" placeholder="Add a tag" aria-label="Add a tag" enterKeyHint="enter" spellCheck={false} />
        </div>
        <span className="field-chips__status" aria-live="polite" />
      </div>
    </>
  );
}

// Enter or a comma turns the typed words into a chip; Backspace on an empty
// field melts the last chip back into text. Every change reflows with FLIP.
function initChips(root: HTMLElement): (() => void) | undefined {
  const box = root.querySelector<HTMLElement>('.field-chips__box');
  const list = root.querySelector<HTMLElement>('.field-chips__list');
  const input = root.querySelector<HTMLInputElement>('.field-chips__input');
  const status = root.querySelector<HTMLElement>('.field-chips__status');
  if (!box || !list || !input) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spring = 'cubic-bezier(0.3, 1.3, 0.5, 1)';

  const chips = () => Array.from(list.children) as HTMLElement[];
  const textOf = (li: HTMLElement) => li.querySelector('.field-chips__text')?.textContent ?? '';
  const say = (msg: string) => {
    if (status) status.textContent = msg;
  };
  const flip = (change: () => void) => {
    const els = [...chips(), input];
    const before = new Map(els.map((el) => [el, el.getBoundingClientRect()]));
    change();
    if (reduce) return;
    els.forEach((el) => {
      const a = before.get(el);
      if (!el.isConnected || !a) return;
      const b = el.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (dx || dy) el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 320, easing: spring });
    });
  };
  const make = (text: string) => {
    const li = document.createElement('li');
    li.className = 'field-chips__chip';
    const t = document.createElement('span');
    t.className = 'field-chips__text';
    t.textContent = text;
    const b = document.createElement('button');
    b.className = 'field-chips__remove';
    b.type = 'button';
    b.setAttribute('aria-label', `Remove ${text}`);
    b.innerHTML = X;
    li.append(t, b);
    return li;
  };
  const nudge = (li: HTMLElement) => {
    li.classList.remove('field-chips__chip--nudge');
    void li.offsetWidth;
    li.classList.add('field-chips__chip--nudge');
  };
  const add = (raw: string) => {
    const text = raw.trim().replace(/\s+/g, ' ');
    if (!text) return;
    const same = chips().find((li) => textOf(li).toLowerCase() === text.toLowerCase());
    if (same) {
      nudge(same);
      say(`${text} is already added`);
      return;
    }
    const li = make(text);
    flip(() => list.appendChild(li));
    if (!reduce) {
      li.animate([{ opacity: 0.4, transform: 'scale(0.7)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: spring });
    }
    say(`Added ${text}`);
  };
  const remove = (li: HTMLElement, back: boolean) => {
    if (li.dataset.leaving) return;
    li.dataset.leaving = '1';
    const text = textOf(li);
    const go = () => {
      flip(() => {
        li.remove();
        if (back) input.value = text;
      });
      say(`Removed ${text}`);
    };
    if (reduce) return go();
    li.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: back ? 'translateX(12px) scale(0.85)' : 'scale(0.6)' }], {
      duration: 150,
      easing: 'ease-in',
    }).onfinish = go;
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(input.value);
      input.value = '';
    } else if (e.key === 'Backspace' && !input.value && input.selectionStart === 0) {
      const last = chips().pop();
      if (last) {
        e.preventDefault();
        remove(last, true);
      }
    }
  };
  // A pasted "a, b, c" becomes three chips; whatever follows the last comma stays typed.
  const typed = () => {
    if (!input.value.includes(',')) return;
    const parts = input.value.split(',');
    input.value = parts.pop() ?? '';
    parts.forEach(add);
  };
  const click = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const x = target.closest('.field-chips__remove');
    if (x) {
      const li = x.closest<HTMLElement>('.field-chips__chip');
      if (li) remove(li, false);
      input.focus();
    } else if (target === box) {
      input.focus();
    }
  };

  (list.dataset.start ?? '').split(',').filter(Boolean).forEach((t) => list.appendChild(make(t)));
  box.addEventListener('click', click);
  input.addEventListener('keydown', key);
  input.addEventListener('input', typed);
  return () => {
    box.removeEventListener('click', click);
    input.removeEventListener('keydown', key);
    input.removeEventListener('input', typed);
    list.textContent = '';
  };
}
