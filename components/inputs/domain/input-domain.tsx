"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes field-domain-in { from { opacity: 0; transform: translateY(var(--from)); } }
  @keyframes field-domain-sweep { from { transform: scaleX(0); opacity: 1; } 70% { opacity: 1; } to { transform: scaleX(1); opacity: 0; } }
  @keyframes field-domain-draw { to { stroke-dashoffset: 0; } }
  .field-domain { width: 250px; }
  .field-domain__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-domain__box {
    position: relative;
    height: 42px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    transition: box-shadow 0.2s;
  }
  .field-domain__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-domain__input, .field-domain__mirror { padding: 0 36px 0 12px; font-family: inherit; font-size: 14px; letter-spacing: 0; }
  .field-domain__input { position: relative; z-index: 1; width: 100%; height: 100%; border: 0; outline: 0; background: none; color: light-dark(#373a40, #f1f2f3); }
  .field-domain__input::placeholder { color: light-dark(#5f626a, #a7abb2); }
  .field-domain__mirror { position: absolute; inset: 0; display: flex; align-items: center; white-space: pre; pointer-events: none; }
  .field-domain__typed { color: transparent; }
  .field-domain__ghost { color: light-dark(#5f626a, #a7abb2); animation: field-domain-in 0.22s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .field-domain__sweep { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: light-dark(#373a40, #f1f2f3); transform-origin: left; opacity: 0; animation: field-domain-sweep 0.5s ease-out; }
  .field-domain__ok { position: absolute; right: 10px; top: 12px; width: 18px; height: 18px; color: light-dark(#373a40, #f1f2f3); }
  .field-domain__ok path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: field-domain-draw 0.35s ease-out forwards; }
  @media (prefers-reduced-motion: reduce) {
    .field-domain__ghost, .field-domain__sweep, .field-domain__ok path { animation-duration: 0.01s; }
  }
  .field-domain__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-domain__top > :first-child { margin: 0; }
  .field-domain__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-domain__info svg { width: 14px; height: 14px; }
  .field-domain__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-domain__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-domain__info::after {
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
  .field-domain__info:hover::after, .field-domain__info:focus-visible::after { opacity: 1; transform: none; }
`;

const DOMAINS = ['gmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'hey.com', 'yahoo.com'];
const VALID = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function DomainInput() {
  const [value, setValue] = useState('sam@');
  const [pick, setPick] = useState(0);
  const [dir, setDir] = useState(1);
  const [flash, setFlash] = useState(0);

  const at = value.lastIndexOf('@');
  const typed = at > 0 ? value.slice(at + 1).toLowerCase() : null;
  const matches = typed === null ? [] : DOMAINS.filter((d) => d.startsWith(typed) && d !== typed);
  const choice = matches.length ? matches[((pick % matches.length) + matches.length) % matches.length] : '';
  const ghost = choice.slice(typed?.length ?? 0);

  const accept = () => {
    setValue(value + ghost);
    setFlash((f) => f + 1);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-domain">
        <div className="field-domain__top">
          <label className="field-domain__label" htmlFor="field-domain-input">
            Email
          </label>
          <button type="button" className="field-domain__info" aria-label="Tab accepts, arrows cycle" data-tip="Tab accepts, arrows cycle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
        </div>
        <div className="field-domain__box">
          <span className="field-domain__mirror" aria-hidden="true">
            <span className="field-domain__typed">{value}</span>
            {ghost && (
              <span key={choice} className="field-domain__ghost" style={{ '--from': `${dir * 8}px` } as React.CSSProperties}>
                {ghost}
              </span>
            )}
          </span>
          <input
            id="field-domain-input"
            className="field-domain__input"
            // A text field with the email keyboard: type="email" hides the caret position the Tab check needs.
            type="text"
            inputMode="email"
            value={value}
            placeholder="you@studio.com"
            autoComplete="off"
            spellCheck={false}
                        onChange={(e) => {
              setValue(e.target.value);
              setPick(0);
            }}
            onKeyDown={(e) => {
              if (!ghost) return;
              const end = e.currentTarget.selectionStart === value.length;
              if ((e.key === 'Tab' || e.key === 'ArrowRight') && end) {
                e.preventDefault();
                accept();
              }
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const step = e.key === 'ArrowDown' ? 1 : -1;
                setDir(step);
                setPick((p) => p + step);
              }
            }}
          />
          {flash > 0 && <span key={flash} className="field-domain__sweep" aria-hidden="true" />}
          {VALID.test(value) && (
            <svg className="field-domain__ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
