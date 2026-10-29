"use client";

import { useState } from 'react';

const css = `
  @keyframes field-redact-cover { from { background-size: 0% 100%; } }
  .field-redact { width: 256px; }
  .field-redact__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .field-redact__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-redact__toggle { padding: 3px 8px; border: 0; border-radius: 6px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font-family: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
  .field-redact__toggle:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .field-redact__box { position: relative; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: box-shadow 0.2s; }
  .field-redact__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-redact__area, .field-redact__mirror { padding: 10px 12px; font-family: inherit; font-size: 13px; line-height: 20px; font-kerning: none; white-space: pre-wrap; overflow-wrap: break-word; }
  .field-redact__area { display: block; width: 100%; height: 82px; border: 0; outline: 0; resize: none; background: none; color: light-dark(#373a40, #f1f2f3); overflow: hidden; }
  .field-redact__mirror { position: absolute; inset: 0; color: transparent; pointer-events: none; }
  /* The bar wipes across each match; revealing wipes it back off. */
  .field-redact__bar {
    border-radius: 2px;
    background: linear-gradient(light-dark(#373a40, #f1f2f3), light-dark(#373a40, #f1f2f3)) no-repeat 0 0 / 100% 100%;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    animation: field-redact-cover 0.45s cubic-bezier(0.6, 0, 0.3, 1);
    transition: background-size 0.4s cubic-bezier(0.6, 0, 0.3, 1);
  }
  .field-redact[data-reveal] .field-redact__bar { background-size: 0% 100%; box-shadow: inset 0 -2px 0 light-dark(#6d7179, #7d8087); }
  @media (prefers-reduced-motion: reduce) { .field-redact__bar { animation: none; transition: none; } }
  .field-redact__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-redact__top > :first-child { margin: 0; }
  .field-redact__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-redact__info svg { width: 14px; height: 14px; }
  .field-redact__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-redact__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-redact__info::after {
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
  .field-redact__info:hover::after, .field-redact__info:focus-visible::after { opacity: 1; transform: none; }
`;

// Email addresses, then anything that looks like a phone or card number.
const SECRET = /[\w.+-]+@[\w-]+\.[\w.]+|\+?\d[\d ().-]{6,}\d/g;

export function RedactInput() {
  const [value, setValue] = useState('Call me on 415 555 0199 or write to sam@studio.io before Friday.');
  const [reveal, setReveal] = useState(false);

  const parts: { text: string; secret: boolean; at: number }[] = [];
  let last = 0;
  for (const m of value.matchAll(SECRET)) {
    if (m.index! > last) parts.push({ text: value.slice(last, m.index), secret: false, at: last });
    parts.push({ text: m[0], secret: true, at: m.index! });
    last = m.index! + m[0].length;
  }
  if (last < value.length) parts.push({ text: value.slice(last), secret: false, at: last });

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-redact" data-reveal={reveal || undefined}>
        <div className="field-redact__head">
          <div className="field-redact__top">
            <label className="field-redact__label" htmlFor="field-redact-area">
              Notes
            </label>
            <button type="button" className="field-redact__info" aria-label="Hides phone numbers and emails" data-tip="Hides phone numbers and emails">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
          </div>
          <button type="button" className="field-redact__toggle" aria-pressed={reveal} onClick={() => setReveal(!reveal)}>
            {reveal ? 'Hide' : 'Reveal'}
          </button>
        </div>
        <div className="field-redact__box">
          <textarea id="field-redact-area" className="field-redact__area" value={value} spellCheck={false} onChange={(e) => setValue(e.target.value)} />
          <div className="field-redact__mirror" aria-hidden="true">
            {parts.map((p) =>
              p.secret ? (
                <span key={`${p.at}${p.text}`} className="field-redact__bar">
                  {p.text}
                </span>
              ) : (
                <span key={`${p.at}t`}>{p.text}</span>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
