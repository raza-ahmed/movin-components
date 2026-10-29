"use client";

import { useState } from 'react';

const css = `
  @keyframes field-slug-pop { from { opacity: 0; transform: translateY(-5px) scale(1.4); } }
  .field-slug { width: 250px; }
  .field-slug__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-slug__input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 15px;
    transition: box-shadow 0.2s;
  }
  .field-slug__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-slug__url {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529);
  }
  .field-slug__path { flex: 1; min-width: 0; color: light-dark(#5f626a, #a7abb2); font: 11px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-all; }
  .field-slug__path b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; }
  .field-slug__ch { display: inline-block; animation: field-slug-pop 0.3s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .field-slug__copy {
    flex: none;
    padding: 3px 8px;
    border: 0;
    border-radius: 6px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#42454c, #e5e6e9);
    font-family: inherit; font-size: 10px; font-weight: 600;
    cursor: pointer;
  }
  .field-slug__copy:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .field-slug__ch { animation: none; } }
`;

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export function SlugInput() {
  const [value, setValue] = useState('Motion Design: 10 Tips & Tricks');
  const [copied, setCopied] = useState(false);
  const slug = slugify(value);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-slug">
        <label className="field-slug__label" htmlFor="field-slug-input">
          Post title
        </label>
        <input
          id="field-slug-input"
          className="field-slug__input"
          value={value}
          spellCheck={false}
          onChange={(e) => {
            setValue(e.target.value);
            setCopied(false);
          }}
        />
        <div className="field-slug__url">
          <span className="field-slug__path" aria-label={`Address: movin.design/blog/${slug}`}>
            movin.design/blog/
            <b>
              {[...slug].map((c, i) => (
                // A character only replays its pop when it actually changes.
                <span key={`${i}${c}`} className="field-slug__ch">
                  {c}
                </span>
              ))}
            </b>
          </span>
          <button
            type="button"
            className="field-slug__copy"
            onClick={() => {
              navigator.clipboard?.writeText(`https://movin.design/blog/${slug}`).catch(() => {});
              setCopied(true);
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </>
  );
}
