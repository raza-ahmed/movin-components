"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-handle {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 320px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 13px;
  }

  .field-handle__label {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-handle__box {
    display: flex;
    align-items: center;
    height: 46px;
    padding: 0 12px 0 14px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    cursor: text;
    transition: border-color 0.2s;
  }

  .field-handle__box:focus-within {
    border-color: light-dark(#5f626a, #a7abb2);
  }

  .field-handle__prefix {
    flex-shrink: 0;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 15px;
  }

  .field-handle__input {
    flex: 1;
    min-width: 0;
    height: 100%;
    margin: 0;
    padding: 0 0 0 1px;
    border: 0;
    outline: none;
    background: transparent;
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 15px;
  }

  .field-handle__input::placeholder {
    color: light-dark(#cbced3, #393c41);
  }

  .field-handle--refused .field-handle__box {
    animation: field-handle-nudge 0.3s ease-out;
  }

  @keyframes field-handle-nudge {
    25% {
      transform: translateX(-3px);
    }
    60% {
      transform: translateX(2px);
    }
  }

  /* Dots, tick and cross share one slot at the end of the field. */
  .field-handle__state {
    position: relative;
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 22px;
    height: 22px;
  }

  .field-handle__state > * {
    grid-area: 1 / 1;
  }

  .field-handle__dots {
    display: flex;
    gap: 3px;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .field-handle__dots span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: light-dark(#5f626a, #a7abb2);
  }

  .field-handle--checking .field-handle__dots {
    opacity: 1;
  }

  .field-handle--checking .field-handle__dots span {
    animation: field-handle-dot 0.9s ease-in-out infinite;
  }

  .field-handle--checking .field-handle__dots span:nth-child(2) {
    animation-delay: 0.12s;
  }

  .field-handle--checking .field-handle__dots span:nth-child(3) {
    animation-delay: 0.24s;
  }

  @keyframes field-handle-dot {
    0%,
    60%,
    100% {
      transform: none;
    }
    30% {
      transform: translateY(-4px);
    }
  }

  .field-handle__ok,
  .field-handle__no {
    width: 20px;
    height: 20px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .field-handle__ok {
    stroke: light-dark(#42454c, #e5e6e9);
    stroke-width: 2.4;
  }

  .field-handle__ok path {
    stroke-dasharray: 100 102;
    stroke-dashoffset: 101;
    transition: stroke-dashoffset 0.12s;
  }

  .field-handle--ok .field-handle__ok path {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.35s cubic-bezier(0.5, 0, 0.3, 1);
  }

  .field-handle__no {
    stroke: light-dark(#5f626a, #a7abb2);
    stroke-width: 2;
    transform: scale(0) rotate(-90deg);
    transition: transform 0.15s ease-in;
  }

  .field-handle--taken .field-handle__no {
    transform: none;
    transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
  }

  .field-handle--ok .field-handle__box {
    border-color: light-dark(#42454c, #e5e6e9);
  }

  .field-handle__msg {
    min-height: 1.4em;
    margin: 0;
    font-size: 12px;
  }

  .field-handle--ok .field-handle__msg {
    color: light-dark(#42454c, #e5e6e9);
  }

  .field-handle__ideas {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .field-handle__idea {
    margin: 0;
    padding: 5px 10px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#42454c, #e5e6e9);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    animation: field-handle-idea 0.4s cubic-bezier(0.3, 1.4, 0.5, 1) backwards;
    animation-delay: calc(var(--field-handle-i) * 70ms);
    transition: border-color 0.15s, background-color 0.15s;
  }

  .field-handle__idea:hover {
    border-color: light-dark(#6d7179, #7d8087);
    background: light-dark(#ebedf0, #232529);
  }

  .field-handle__idea:focus-visible {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  @keyframes field-handle-idea {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.9);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .field-handle *,
    .field-handle--refused .field-handle__box {
      transition-duration: 0s !important;
      animation: none !important;
    }
    .field-handle--checking .field-handle__dots span {
      animation: none !important;
    }
  }
`;

export function HandleCheckInput() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initHandle(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="field-handle" data-taken="admin design hello motion movin studio">
        <label className="field-handle__label">
          <span className="field-handle__name">Username</span>
          <span className="field-handle__box">
            <span className="field-handle__prefix">movin.design/</span>
            <input className="field-handle__input" type="text" placeholder="yourname" maxLength={20} spellCheck={false} autoComplete="username" autoCapitalize="off" />
            <span className="field-handle__state" aria-hidden="true">
              <span className="field-handle__dots">
                <span />
                <span />
                <span />
              </span>
              <svg className="field-handle__ok" viewBox="0 0 20 20">
                <path pathLength={100} d="M5 10.5l3.5 3.5 6.5-8" />
              </svg>
              <svg className="field-handle__no" viewBox="0 0 20 20">
                <path d="M6 6l8 8m0-8-8 8" />
              </svg>
            </span>
          </span>
        </label>
        <p className="field-handle__msg" aria-live="polite" />
        <div className="field-handle__ideas" />
      </div>
    </>
  );
}

// Refuses characters a handle can't use, then checks the name you stop on
// (debounced; a newer keystroke cancels an older answer) and offers free
// alternatives when it's taken.
function initHandle(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.field-handle__input');
  const msg = root.querySelector<HTMLElement>('.field-handle__msg');
  const ideas = root.querySelector<HTMLElement>('.field-handle__ideas');
  if (!input || !msg || !ideas) return;
  const taken = (root.dataset.taken ?? '').split(' ');
  let timer = 0;
  let ask = 0;

  // Stand-in for your API: swap the body for a fetch that resolves to true
  // when the name is taken.
  const lookup = (name: string) =>
    new Promise<boolean>((resolve) => window.setTimeout(() => resolve(taken.includes(name)), 500));

  const state = (s: '' | 'checking' | 'ok' | 'taken', text = '') => {
    (['checking', 'ok', 'taken'] as const).forEach((k) => root.classList.toggle(`field-handle--${k}`, k === s));
    msg.textContent = text;
  };
  const suggest = (name: string) => {
    ideas.textContent = '';
    if (!name) return;
    [`${name}_`, `${name}.studio`, `${name}hq`]
      .filter((n) => !taken.includes(n) && n.length <= 20)
      .forEach((n, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'field-handle__idea';
        b.style.setProperty('--field-handle-i', String(i));
        b.textContent = n;
        ideas.appendChild(b);
      });
  };
  const refuse = () => {
    root.classList.remove('field-handle--refused');
    void root.offsetWidth;
    root.classList.add('field-handle--refused');
  };
  const check = () => {
    const raw = input.value;
    const name = raw.toLowerCase().replace(/[^a-z0-9._]/g, '');
    if (name !== raw) {
      const at = (input.selectionStart ?? raw.length) - (raw.length - name.length);
      input.value = name;
      input.setSelectionRange(at, at);
      if (name !== raw.toLowerCase()) refuse();
    }
    window.clearTimeout(timer);
    const mine = ++ask;
    suggest('');
    if (!name) return state('');
    if (name.length < 3) return state('', 'At least 3 characters');
    state('checking');
    timer = window.setTimeout(() => {
      lookup(name).then((isTaken) => {
        if (mine !== ask) return; // they kept typing
        if (isTaken) {
          state('taken', `${name} is taken. Try one of these:`);
          suggest(name);
        } else {
          state('ok', `movin.design/${name} is yours`);
        }
      });
    }, 350);
  };
  const pick = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest('.field-handle__idea');
    if (!b) return;
    input.value = b.textContent ?? '';
    input.focus();
    check();
  };

  input.addEventListener('input', check);
  ideas.addEventListener('click', pick);
  return () => {
    window.clearTimeout(timer);
    ask++;
    input.removeEventListener('input', check);
    ideas.removeEventListener('click', pick);
    ideas.textContent = '';
  };
}
