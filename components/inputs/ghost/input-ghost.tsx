"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-ghost {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 320px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 13px;
  }

  .field-ghost__box {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    transition: border-color 0.2s;
  }

  .field-ghost__box:focus-within {
    border-color: light-dark(#5f626a, #a7abb2);
  }

  /* Input and mirror share every metric, so the grey ghost lines up exactly
     after the typed text. */
  .field-ghost__input,
  .field-ghost__mirror {
    box-sizing: border-box;
    padding: 0 14px;
    font: inherit;
    font-size: 15px;
    font-kerning: none;
    font-variant-ligatures: none;
    letter-spacing: 0;
  }

  .field-ghost__input {
    position: relative;
    flex: 1;
    min-width: 0;
    height: 46px;
    margin: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: light-dark(#373a40, #f1f2f3);
  }

  .field-ghost__input::placeholder {
    color: light-dark(#6d7179, #7d8087);
  }

  .field-ghost__mirror {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: pre;
    pointer-events: none;
  }

  .field-ghost__typed {
    color: transparent;
  }

  .field-ghost__rest {
    color: light-dark(#6d7179, #7d8087);
    transition: color 0.12s;
  }

  .field-ghost__key {
    position: relative;
    flex-shrink: 0;
    margin-right: 10px;
    padding: 3px 7px;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-bottom-width: 2px;
    border-radius: 5px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 11px;
    cursor: pointer;
    opacity: 0;
    transform: translateX(6px);
    pointer-events: none;
    transition: opacity 0.2s, transform 0.25s cubic-bezier(0.3, 1.4, 0.5, 1), border-bottom-width 0.08s, background-color 0.12s;
  }

  .field-ghost--hint .field-ghost__key {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }

  /* Accepting: the ghost washes solid and the key goes down. */
  .field-ghost--accept .field-ghost__rest {
    color: light-dark(#373a40, #f1f2f3);
  }

  .field-ghost--accept .field-ghost__key {
    border-bottom-width: 1px;
    background: light-dark(#dbdde1, #2e3035);
    transform: translateY(1px);
  }

  .field-ghost__status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-ghost__rest,
    .field-ghost__key {
      transition: none;
    }
  }
`;

export function GhostCompleteInput() {
  const ref = useRef<HTMLLabelElement>(null);
  useEffect(() => (ref.current ? initGhost(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <label ref={ref} className="field-ghost">
        <span className="field-ghost__name">Email</span>
        <span className="field-ghost__box">
          <span className="field-ghost__mirror" aria-hidden="true">
            <span className="field-ghost__typed" />
            <span className="field-ghost__rest" />
          </span>
          <input className="field-ghost__input" type="text" inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false} placeholder="you@example.com" />
          <span className="field-ghost__key" aria-hidden="true">
            Tab
          </span>
        </span>
        <span className="field-ghost__status" aria-live="polite" />
      </label>
    </>
  );
}

const DOMAINS = ['gmail.com', 'outlook.com', 'icloud.com', 'yahoo.com', 'hotmail.com', 'proton.me'];

// A mirror behind the input repeats the typed text invisibly, then the rest
// of the first domain that starts with what follows the @, in grey.
function initGhost(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.field-ghost__input');
  const typed = root.querySelector<HTMLElement>('.field-ghost__typed');
  const rest = root.querySelector<HTMLElement>('.field-ghost__rest');
  const key = root.querySelector<HTMLElement>('.field-ghost__key');
  const status = root.querySelector<HTMLElement>('.field-ghost__status');
  if (!input || !typed || !rest) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ghost = '';
  let said = '';
  let timer = 0;

  const suggest = () => {
    const v = input.value;
    const at = v.indexOf('@');
    const atEnd = input.selectionStart === v.length && input.selectionEnd === v.length;
    ghost = '';
    if (at > 0 && at === v.lastIndexOf('@') && atEnd && document.activeElement === input) {
      const part = v.slice(at + 1).toLowerCase();
      const hit = DOMAINS.find((d) => d.startsWith(part) && d !== part);
      if (hit) ghost = hit.slice(part.length);
    }
    // Hide it rather than misplace it once the text scrolls.
    if (input.scrollLeft > 0) ghost = '';
    typed.textContent = v;
    rest.textContent = ghost;
    root.classList.toggle('field-ghost--hint', !!ghost);
    // Announce a suggestion once, not on every keystroke that keeps it.
    const domain = ghost ? v.slice(at + 1) + ghost : '';
    if (domain !== said) {
      said = domain;
      if (status) status.textContent = domain ? `Suggestion: ${domain}. Press Tab to accept.` : '';
    }
  };
  // The ghost washes solid, then becomes part of the value.
  const accept = () => {
    if (!ghost) return false;
    const full = input.value + ghost;
    root.classList.add('field-ghost--accept');
    window.clearTimeout(timer);
    timer = window.setTimeout(
      () => {
        root.classList.remove('field-ghost--accept');
        input.value = full;
        input.setSelectionRange(full.length, full.length);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        if (status) status.textContent = `Completed ${full}`;
      },
      reduce ? 0 : 140,
    );
    return true;
  };
  const keydown = (e: KeyboardEvent) => {
    if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight') {
      if (accept()) e.preventDefault();
    }
  };
  // The key hint is for pointers and touch; keep focus in the field.
  const down = (e: PointerEvent) => e.preventDefault();
  const tap = (e: MouseEvent) => {
    e.preventDefault();
    accept();
  };
  const selection = () => {
    if (document.activeElement === input) suggest();
  };

  input.addEventListener('input', suggest);
  input.addEventListener('focus', suggest);
  input.addEventListener('blur', suggest);
  input.addEventListener('keydown', keydown);
  document.addEventListener('selectionchange', selection);
  key?.addEventListener('pointerdown', down);
  key?.addEventListener('click', tap);
  suggest();
  return () => {
    window.clearTimeout(timer);
    input.removeEventListener('input', suggest);
    input.removeEventListener('focus', suggest);
    input.removeEventListener('blur', suggest);
    input.removeEventListener('keydown', keydown);
    document.removeEventListener('selectionchange', selection);
    key?.removeEventListener('pointerdown', down);
    key?.removeEventListener('click', tap);
  };
}
