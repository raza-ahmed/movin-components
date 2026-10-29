"use client";

import { useState } from 'react';

const css = `
  @keyframes field-url-in { from { opacity: 0; transform: translateY(5px) scale(0.92); } }
  .field-url { width: 256px; }
  .field-url__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-url__input {
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font: 13px ui-monospace, SFMono-Regular, Menlo, monospace;
    transition: box-shadow 0.2s;
  }
  .field-url__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-url__parts { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-height: 58px; margin: 8px 0 0; padding: 0; list-style: none; }
  .field-url__part {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 7px;
    border-radius: 6px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#373a40, #f1f2f3);
    font: 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    animation: field-url-in 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) both;
  }
  .field-url__part svg { width: 11px; height: 11px; }
  .field-url__part[data-kind='host'] { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); font-weight: 600; }
  .field-url__part[data-kind='query'] { background: none; box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41); color: light-dark(#42454c, #e5e6e9); }
  .field-url__part[data-kind='query'] b { color: light-dark(#5f626a, #a7abb2); font-weight: 400; }
  .field-url__sep { color: light-dark(#6d7179, #7d8087); font-size: 11px; }
  @media (prefers-reduced-motion: reduce) { .field-url__part { animation: none; } }
  .field-url__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-url__top > :first-child { margin: 0; }
  .field-url__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-url__info svg { width: 14px; height: 14px; }
  .field-url__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-url__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-url__info::after {
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
  .field-url__info:hover::after, .field-url__info:focus-visible::after { opacity: 1; transform: none; }
`;

function parse(raw: string) {
  const s = raw.trim();
  if (!s || /\s/.test(s)) return null;
  try {
    const u = new URL(/^[a-z]+:\/\//i.test(s) ? s : `https://${s}`);
    if (!u.hostname.includes('.')) return null;
    return u;
  } catch {
    return null;
  }
}

export function UrlInput() {
  const [value, setValue] = useState('https://movin.design/components/toggles?sort=new');
  const u = parse(value);
  const segs = u ? u.pathname.split('/').filter(Boolean) : [];
  const params = u ? [...u.searchParams.entries()] : [];
  let n = 0;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-url">
        <div className="field-url__top">
          <label className="field-url__label" htmlFor="field-url-input">
            Link
          </label>
          <button type="button" className="field-url__info" aria-label="Paste a link to split it" data-tip="Paste a link to split it">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
        </div>
        <input
          id="field-url-input"
          className="field-url__input"
          type="url"
          value={value}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
        />
        {u ? (
          <ul className="field-url__parts" aria-label="Address parts">
            <li className="field-url__part" style={{ animationDelay: `${n++ * 50}ms` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                {u.protocol === 'https:' ? <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" /> : <path d="M7 11V8a5 5 0 0 1 9.5-2M5 11h14v10H5z" />}
              </svg>
              {u.protocol === 'https:' ? 'secure' : u.protocol.replace(':', '')}
            </li>
            <li key={u.hostname} className="field-url__part" data-kind="host" style={{ animationDelay: `${n++ * 50}ms` }}>
              {u.hostname.replace(/^www\./, '')}
            </li>
            {segs.map((s, i) => (
              <li key={`${i}${s}`} style={{ display: 'contents' }}>
                <span className="field-url__sep" aria-hidden="true">
                  /
                </span>
                <span className="field-url__part" style={{ animationDelay: `${n++ * 50}ms` }}>
                  {decodeURIComponent(s)}
                </span>
              </li>
            ))}
            {params.map(([k, v]) => (
              <li key={`${k}=${v}`} className="field-url__part" data-kind="query" style={{ animationDelay: `${n++ * 50}ms` }}>
                <b>{k}</b>
                {v}
              </li>
            ))}
          </ul>
        ) : (
          <div className="field-url__parts" />
        )}
      </div>
    </>
  );
}
