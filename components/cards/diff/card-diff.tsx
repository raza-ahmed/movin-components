"use client";

import { useState } from 'react';

type Line = { n: string; text: string; kind?: 'del' | 'add' };
const LINES: Line[] = [
  { n: '1', text: 'export function sign(id) {' },
  { n: '2', text: '  const t = make(id);', kind: 'del' },
  { n: '2', text: '  const t = make(id, 900);', kind: 'add' },
  { n: '3', text: '  log(t);', kind: 'del' },
  { n: '3', text: '  return t;' },
  { n: '4', text: '}' },
];

const css = `
  .card-diff { box-sizing: border-box; width: 240px; padding: 12px 0 10px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-diff__head { display: flex; align-items: center; gap: 8px; padding: 0 12px 10px; }
  .card-diff__file { font: 600 12px ui-monospace, SFMono-Regular, Menlo, monospace; color: light-dark(#373a40, #f1f2f3); }
  .card-diff__stat { font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; color: light-dark(#5f626a, #a7abb2); opacity: 0; transition: opacity 0.3s; }
  .card-diff--after .card-diff__stat { opacity: 1; }
  .card-diff__tabs { display: flex; margin-left: auto; padding: 2px; border-radius: 7px; background: light-dark(#ebedf0, #232529); }
  .card-diff__tab { height: 22px; padding: 0 8px; border: 0; border-radius: 5px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 10.5px; font-weight: 600; cursor: pointer; }
  .card-diff__tab[aria-pressed='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .card-diff__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 1px; }
  .card-diff__code { margin: 0; font: 10.5px/1.75 ui-monospace, SFMono-Regular, Menlo, monospace; color: light-dark(#42454c, #e5e6e9); }
  /* A row folds open or shut by animating its grid track between 0fr and 1fr. */
  .card-diff__row { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
  .card-diff__row > div { display: flex; min-height: 0; overflow: hidden; }
  .card-diff__n { flex: none; width: 30px; padding-right: 8px; text-align: right; color: light-dark(#5f626a, #a7abb2); }
  .card-diff__text { position: relative; white-space: pre; }
  .card-diff__row--del > div { background: light-dark(#ebedf0, #232529); }
  .card-diff__row--add > div { background: light-dark(#ebedf0, #232529); box-shadow: inset 2px 0 light-dark(#373a40, #f1f2f3); }
  .card-diff__text::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: light-dark(#50535b, #c6c8cd); transform: scaleX(0); transform-origin: left; }
  .card-diff--after .card-diff__row--del { grid-template-rows: 0fr; transition-delay: 0.3s; }
  .card-diff--after .card-diff__row--del .card-diff__text::after { transform: scaleX(1); transition: transform 0.3s ease-out; }
  .card-diff__row--add { grid-template-rows: 0fr; }
  .card-diff--after .card-diff__row--add { grid-template-rows: 1fr; transition-delay: 0.45s; }
  @media (prefers-reduced-motion: reduce) {
    .card-diff__row, .card-diff--after .card-diff__row--del, .card-diff--after .card-diff__row--add { transition: none; }
    .card-diff--after .card-diff__row--del .card-diff__text::after { transition: none; }
  }
`;

export function DiffCard() {
  const [after, setAfter] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-diff${after ? ' card-diff--after' : ''}`}>
        <div className="card-diff__head">
          <span className="card-diff__file">sign.ts</span>
          <span className="card-diff__stat" aria-hidden={!after}>
            +1 −2
          </span>
          <div className="card-diff__tabs" role="group" aria-label="Version">
            {[false, true].map((a) => (
              <button key={String(a)} type="button" className="card-diff__tab" aria-pressed={after === a} onClick={() => setAfter(a)}>
                {a ? 'After' : 'Before'}
              </button>
            ))}
          </div>
        </div>
        <div className="card-diff__code">
          {LINES.map((l, i) => {
            const hidden = (l.kind === 'del' && after) || (l.kind === 'add' && !after);
            return (
              <div key={i} className={`card-diff__row${l.kind ? ` card-diff__row--${l.kind}` : ''}`} aria-hidden={hidden}>
                <div>
                  <span className="card-diff__n">{after && l.kind ? (l.kind === 'add' ? '+' : '−') : l.n}</span>
                  <code className="card-diff__text">{l.text}</code>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </>
  );
}
