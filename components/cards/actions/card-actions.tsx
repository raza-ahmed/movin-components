"use client";

import { useEffect, useRef, useState } from 'react';

const ROWS = [
  { id: 'a', from: 'Ana Ruiz', text: 'The prints are in, come by after 4' },
  { id: 'b', from: 'Jun Bae', text: 'Proofs attached, two small fixes' },
];
const LEFT = 112;
const RIGHT = 56;

const css = `
  .card-actions { box-sizing: border-box; width: 240px; padding: 12px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-actions__head { margin: 0 2px 8px; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-actions__list { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
  .card-actions__row { position: relative; height: 54px; border-radius: 10px; overflow: hidden; transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s; }
  .card-actions__row--gone { height: 0; opacity: 0; }
  .card-actions__under { position: absolute; inset: 0; display: flex; justify-content: space-between; background: light-dark(#ebedf0, #232529); }
  .card-actions__pair { display: flex; }
  .card-actions__act { display: grid; place-items: center; width: ${RIGHT}px; border: 0; background: light-dark(#cbced3, #393c41); color: light-dark(#373a40, #f1f2f3); font: inherit; font-size: 10.5px; font-weight: 600; cursor: pointer; }
  .card-actions__act--flag { background: light-dark(#6d7179, #7d8087); color: light-dark(#fbfcfd, #121417); }
  .card-actions__act--del { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .card-actions__act:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -3px; }
  .card-actions__front {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    padding: 9px 12px;
    background: light-dark(#dbdde1, #2e3035);
    cursor: grab;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
  }
  .card-actions__front--settle { transition: transform 0.4s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .card-actions__front:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -2px; border-radius: 10px; }
  .card-actions__from { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-actions__flag { width: 7px; height: 7px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); }
  .card-actions__text { margin: 2px 0 0; overflow: hidden; font-size: 11px; color: light-dark(#50535b, #c6c8cd); white-space: nowrap; text-overflow: ellipsis; }
  @media (prefers-reduced-motion: reduce) {
    .card-actions__row, .card-actions__front--settle { transition: none; }
  }
`;

// Past an open position the row keeps moving, but only a quarter as far as the pointer.
const resist = (dx: number) => (dx < -LEFT ? -LEFT + (dx + LEFT) * 0.25 : dx > RIGHT ? RIGHT + (dx - RIGHT) * 0.25 : dx);

export function ActionsCard() {
  const [open, setOpen] = useState<{ id: string; dx: number } | null>(null);
  const [drag, setDrag] = useState<{ id: string; x0: number; dx: number; base: number } | null>(null);
  const [gone, setGone] = useState<string | null>(null);
  const [flags, setFlags] = useState<string[]>([]);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const remove = (id: string) => {
    setOpen(null);
    setGone(id);
    // The demo puts it back after a moment.
    timer.current = window.setTimeout(() => setGone(null), 1600);
  };
  const offset = (id: string) => (drag?.id === id ? drag.dx : open?.id === id ? open.dx : 0);

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-actions">
        <p className="card-actions__head">Inbox</p>
        <ul className="card-actions__list">
          {ROWS.map((r) => {
            const dx = offset(r.id);
            const isOpen = open?.id === r.id;
            return (
              <li key={r.id} className={`card-actions__row${gone === r.id ? ' card-actions__row--gone' : ''}`}>
                <div className="card-actions__under">
                  <button
                    type="button"
                    className="card-actions__act card-actions__act--flag"
                    tabIndex={isOpen && open!.dx > 0 ? 0 : -1}
                    onClick={() => {
                      setFlags((f) => (f.includes(r.id) ? f.filter((x) => x !== r.id) : [...f, r.id]));
                      setOpen(null);
                    }}
                  >
                    {flags.includes(r.id) ? 'Unflag' : 'Flag'}
                  </button>
                  <span className="card-actions__pair">
                    <button type="button" className="card-actions__act" tabIndex={isOpen && open!.dx < 0 ? 0 : -1} onClick={() => remove(r.id)}>
                      Archive
                    </button>
                    <button type="button" className="card-actions__act card-actions__act--del" tabIndex={isOpen && open!.dx < 0 ? 0 : -1} onClick={() => remove(r.id)}>
                      Delete
                    </button>
                  </span>
                </div>
                <div
                  className={`card-actions__front${drag?.id === r.id ? '' : ' card-actions__front--settle'}`}
                  style={{ transform: `translateX(${dx}px)` }}
                  tabIndex={0}
                  role="group"
                  aria-label={`${r.from}: ${r.text}. Left arrow for actions, right arrow to flag.`}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag({ id: r.id, x0: e.clientX, dx, base: dx });
                  }}
                  onPointerMove={(e) => drag?.id === r.id && setDrag({ ...drag, dx: resist(drag.base + e.clientX - drag.x0) })}
                  onPointerUp={() => {
                    if (!drag) return;
                    // Let go past halfway and it stays open; otherwise it springs shut.
                    const to = drag.dx < -LEFT / 2 ? -LEFT : drag.dx > RIGHT * 0.7 ? RIGHT : 0;
                    setOpen(to ? { id: r.id, dx: to } : null);
                    setDrag(null);
                  }}
                  onPointerCancel={() => setDrag(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') setOpen({ id: r.id, dx: -LEFT });
                    else if (e.key === 'ArrowRight') setOpen(isOpen && open!.dx < 0 ? null : { id: r.id, dx: RIGHT });
                    else if (e.key === 'Escape') setOpen(null);
                    else return;
                    e.preventDefault();
                  }}
                >
                  <span className="card-actions__from">
                    {flags.includes(r.id) && <span className="card-actions__flag" role="img" aria-label="Flagged" />}
                    {r.from}
                  </span>
                  <p className="card-actions__text">{r.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </article>
    </>
  );
}
