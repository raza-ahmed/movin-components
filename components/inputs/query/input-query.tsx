"use client";

import { useState } from 'react';

const css = `
  @keyframes field-query-pill { from { background-color: light-dark(#cbced3, #393c41); box-shadow: 0 0 0 3px light-dark(#cbced3, #393c41); } }
  @keyframes field-query-menu { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }
  .field-query { position: relative; width: 256px; }
  .field-query__box {
    position: relative;
    display: flex;
    align-items: center;
    height: 42px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: box-shadow 0.2s;
  }
  .field-query__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-query__icon { position: absolute; left: 11px; width: 16px; height: 16px; color: light-dark(#5f626a, #a7abb2); }
  .field-query__input, .field-query__mirror { padding: 0 10px 0 34px; font-family: inherit; font-size: 14px; font-kerning: none; letter-spacing: 0; }
  .field-query__input { position: relative; z-index: 1; width: 100%; height: 100%; border: 0; outline: 0; background: none; color: transparent; caret-color: light-dark(#373a40, #f1f2f3); }
  .field-query__input::placeholder { color: light-dark(#5f626a, #a7abb2); }
  .field-query__mirror { position: absolute; inset: 0; display: flex; align-items: center; overflow: hidden; color: light-dark(#42454c, #e5e6e9); white-space: pre; pointer-events: none; }
  /* Pills are drawn with a background and a spread shadow, never padding, so the text stays aligned with the caret. */
  .field-query__pill { border-radius: 4px; background: light-dark(#ebedf0, #232529); box-shadow: 0 0 0 2px light-dark(#ebedf0, #232529); animation: field-query-pill 0.35s ease-out; }
  .field-query__key { color: light-dark(#5f626a, #a7abb2); }
  .field-query__val { color: light-dark(#373a40, #f1f2f3); }
  .field-query__not { color: light-dark(#5f626a, #a7abb2); text-decoration: line-through; text-decoration-color: light-dark(#6d7179, #7d8087); }
  .field-query__phrase { color: light-dark(#373a40, #f1f2f3); font-style: normal; text-decoration: underline dotted light-dark(#6d7179, #7d8087); text-underline-offset: 3px; }
  .field-query__menu {
    position: absolute;
    left: 0;
    right: 0;
    top: 48px;
    z-index: 2;
    margin: 0;
    padding: 4px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 12px 24px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    list-style: none;
    animation: field-query-menu 0.18s ease-out;
  }
  .field-query__opt { display: flex; justify-content: space-between; padding: 6px 8px; border-radius: 6px; color: light-dark(#42454c, #e5e6e9); font-size: 12px; cursor: pointer; }
  .field-query__opt span { color: light-dark(#5f626a, #a7abb2); }
  .field-query__opt[aria-selected='true'] { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) { .field-query__pill, .field-query__menu { animation: none; } }
`;

const KEYS: Record<string, { hint: string; values: string[] }> = {
  'tag:': { hint: 'topic', values: ['motion', 'loader', 'button', '3d', 'scroll'] },
  'by:': { hint: 'creator', values: ['raza', 'studio', 'anon'] },
  'is:': { hint: 'state', values: ['saved', 'new', 'pick'] },
  'type:': { hint: 'kind', values: ['clip', 'component', 'shader'] },
};
const KEY_RE = /^(-?)(tag|by|is|type):(\S*)$/;

function Token({ text, start }: { text: string; start: number }) {
  const m = KEY_RE.exec(text);
  if (m) {
    return (
      <span key={`${start}${m[2]}`} className="field-query__pill">
        <span className="field-query__key">
          {m[1]}
          {m[2]}:
        </span>
        <span className="field-query__val">{m[3]}</span>
      </span>
    );
  }
  if (/^-\S+/.test(text)) return <span className="field-query__not">{text}</span>;
  if (/^"/.test(text)) return <span className="field-query__phrase">{text}</span>;
  return <>{text}</>;
}

export function QueryInput() {
  const [value, setValue] = useState('tag:motion -gradient by:');
  const [active, setActive] = useState(0);
  // Suggestions show only while the field is focused, so the field rests minimal.
  const [focused, setFocused] = useState(false);

  // Suggest keys while typing a bare word, and values once a key is typed.
  const last = value.split(/\s/).pop() ?? '';
  const km = KEY_RE.exec(last);
  const options: { insert: string; label: string; hint: string }[] = km
    ? KEYS[`${km[2]}:`].values.filter((v) => v.startsWith(km[3]) && v !== km[3]).map((v) => ({ insert: `${km[1]}${km[2]}:${v} `, label: v, hint: km[2] }))
    : /^-?[a-z]+$/.test(last)
      ? Object.keys(KEYS)
          .filter((k) => k.startsWith(last.replace(/^-/, '')))
          .map((k) => ({ insert: `${last.startsWith('-') ? '-' : ''}${k}`, label: k, hint: KEYS[k].hint }))
      : [];
  const open = focused && options.length > 0;
  const pick = (o: (typeof options)[number]) => {
    setValue(value.slice(0, value.length - last.length) + o.insert);
    setActive(0);
  };

  let at = 0;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-query">
        <div className="field-query__box">
          <svg className="field-query__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <span className="field-query__mirror" aria-hidden="true">
            <span>
            {value.split(/(\s+)/).map((t, i) => {
              const start = at;
              at += t.length;
              return <Token key={i} text={t} start={start} />;
            })}
            </span>
          </span>
          <input
            className="field-query__input"
            value={value}
            placeholder="Search, or try tag: by: is:"
            aria-label="Search"
            role="combobox"
            aria-expanded={open}
            aria-controls="field-query-menu"
            aria-autocomplete="list"
            aria-activedescendant={open ? `field-query-opt-${active % options.length}` : undefined}
            autoComplete="off"
            spellCheck={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              setValue(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (!open) return;
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length);
              }
              if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                pick(options[active % options.length]);
              }
            }}
          />
        </div>
        {open && (
          <ul id="field-query-menu" className="field-query__menu" role="listbox" aria-label="Suggestions">
            {options.map((o, i) => (
              <li
                key={o.label}
                id={`field-query-opt-${i}`}
                className="field-query__opt"
                role="option"
                aria-selected={i === active % options.length}
                onPointerDown={(e) => {
                  e.preventDefault();
                  pick(o);
                }}
              >
                {o.label}
                <span>{o.hint}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
