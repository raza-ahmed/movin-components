"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes field-telegraph-in { from { transform: translateX(10px); opacity: 0; } }
  .field-telegraph { width: 250px; }
  .field-telegraph__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-telegraph__out {
    width: 100%;
    height: 36px;
    padding: 0 10px;
    border: 0;
    outline: 0;
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 2px;
  }
  .field-telegraph__out:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-telegraph__tape { display: flex; align-items: center; justify-content: flex-end; gap: 4px; height: 22px; margin: 8px 0; padding: 0 10px; border-radius: 4px; background: light-dark(#fbfcfd, #121417); overflow: hidden; }
  .field-telegraph__sym { flex: none; height: 4px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); animation: field-telegraph-in 0.15s ease-out; }
  .field-telegraph__sym[data-k='.'] { width: 4px; }
  .field-telegraph__sym[data-k='-'] { width: 12px; }
  .field-telegraph__sym[data-k='/'] { width: 1px; height: 12px; background: light-dark(#cbced3, #393c41); }
  .field-telegraph__row { user-select: none; -webkit-user-select: none; display: flex; align-items: center; gap: 12px; }
  .field-telegraph__key {
    position: relative;
    width: 116px;
    height: 46px;
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;
    touch-action: none;
  }
  .field-telegraph__key:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 8px; }
  .field-telegraph__base { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; border-radius: 4px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .field-telegraph__lever {
    position: absolute;
    left: 12px;
    right: 8px;
    bottom: 14px;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087));
    transform-origin: 6% 50%;
    transform: rotate(-4deg);
    transition: transform 0.06s;
  }
  .field-telegraph__knob { position: absolute; right: -4px; top: -11px; width: 24px; height: 14px; border-radius: 12px 12px 4px 4px; background: light-dark(#42454c, #e5e6e9); box-shadow: inset 0 -2px 0 light-dark(#6d7179, #7d8087); }
  .field-telegraph__key[data-down] .field-telegraph__lever { transform: rotate(1deg); }
  .field-telegraph__lamp { width: 12px; height: 12px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); transition: background-color 0.05s, box-shadow 0.05s; }
  .field-telegraph__lamp[data-on] { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 10px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 55%, transparent); }
  .field-telegraph__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-telegraph__top > :first-child { margin: 0; }
  .field-telegraph__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-telegraph__info svg { width: 14px; height: 14px; }
  .field-telegraph__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-telegraph__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-telegraph__info::after {
    content: attr(data-tip);
    position: absolute;
    left: -6px;
    bottom: calc(100% + 6px);
    z-index: 5;
    padding: 4px 8px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-family: inherit; font-size: 11px; font-weight: 500; line-height: 1.3;
    width: max-content;
    max-width: 150px;
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
  }
  .field-telegraph__info:hover::after, .field-telegraph__info:focus-visible::after { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .field-telegraph__sym { animation: none; }
    .field-telegraph__lever, .field-telegraph__lamp { transition: none; }
  }
`;

const MORSE: Record<string, string> = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
  '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
  '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
  '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
};
const DASH = 220; // a press longer than this is a dash
const LETTER_GAP = 650;
const WORD_GAP = 1500;

export function TelegraphInput() {
  const [text, setText] = useState('HI ');
  const [code, setCode] = useState('');
  const [tape, setTape] = useState<{ k: string; id: number }[]>([]);
  const [down, setDown] = useState(false);
  const pressed = useRef(0);
  const seq = useRef(0);
  const timers = useRef<number[]>([]);
  const codeRef = useRef('');

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const press = () => {
    if (pressed.current) return;
    timers.current.forEach(clearTimeout);
    pressed.current = performance.now();
    setDown(true);
  };
  const lift = () => {
    if (!pressed.current) return;
    const held = performance.now() - pressed.current;
    pressed.current = 0;
    setDown(false);
    const k = held > DASH ? '-' : '.';
    codeRef.current += k;
    setCode(codeRef.current);
    setTape((t) => [...t, { k, id: seq.current++ }].slice(-22));
    // A pause ends the letter; a longer one ends the word.
    timers.current = [
      window.setTimeout(() => {
        const letter = MORSE[codeRef.current] ?? '?';
        codeRef.current = '';
        setCode('');
        setText((s) => (s + letter).slice(-24));
        setTape((t) => [...t, { k: '/', id: seq.current++ }].slice(-22));
      }, LETTER_GAP),
      window.setTimeout(() => setText((s) => (s.endsWith(' ') ? s : `${s} `)), WORD_GAP),
    ];
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-telegraph">
        <div className="field-telegraph__top">
          <label className="field-telegraph__label" htmlFor="field-telegraph-out">
            Message
          </label>
          <button type="button" className="field-telegraph__info" aria-label="Tap for a dot, hold for a dash" data-tip="Tap for a dot, hold for a dash">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
        </div>
        <input id="field-telegraph-out" className="field-telegraph__out" value={text + (code ? '_' : '')} onChange={(e) => setText(e.target.value.toUpperCase())} />
        <div className="field-telegraph__tape" aria-hidden="true">
          {tape.map((s) => (
            <span key={s.id} className="field-telegraph__sym" data-k={s.k} />
          ))}
        </div>
        <div className="field-telegraph__row">
          <button
            type="button"
            className="field-telegraph__key"
            aria-label="Morse key: tap for a dot, hold for a dash"
            data-down={down || undefined}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              press();
            }}
            onPointerUp={lift}
            onPointerCancel={lift}
            onKeyDown={(e) => {
              if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                e.preventDefault();
                press();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                lift();
              }
            }}
          >
            <span className="field-telegraph__base" />
            <span className="field-telegraph__lever">
              <span className="field-telegraph__knob" />
            </span>
          </button>
          <span className="field-telegraph__lamp" data-on={down || undefined} aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
