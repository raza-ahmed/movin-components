"use client";

import * as React from "react";
import { useRef, useState } from 'react';

type Cols = { todo: string[]; done: string[] };
type Drag = { id: string; x: number; y: number; dx: number; dy: number; col: keyof Cols; at: number };

const X = { todo: 10, done: 124 };
const CW = 106;
const TOP = 36;
const ROW = 40;

const css = `
  .card-kanban { position: relative; width: 240px; height: 200px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); user-select: none; -webkit-user-select: none; }
  .card-kanban__col { position: absolute; top: 8px; bottom: 8px; width: ${CW + 8}px; margin-left: -4px; border-radius: 12px; transition: background-color 0.2s; }
  .card-kanban__col--target { background: light-dark(#ebedf0, #232529); }
  .card-kanban__head { position: absolute; top: 14px; margin: 0; font-size: 11px; font-weight: 600; color: light-dark(#50535b, #c6c8cd); }
  .card-kanban__head span { margin-left: 4px; color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; }
  .card-kanban__slot { position: absolute; width: ${CW}px; height: 34px; box-sizing: border-box; border: 1.5px dashed light-dark(#6d7179, #7d8087); border-radius: 9px; }
  .card-kanban__chip {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    box-sizing: border-box;
    width: ${CW}px;
    height: 34px;
    padding: 0 10px;
    border: 0;
    border-radius: 9px;
    background: light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 11.5px;
    text-align: left;
    white-space: nowrap;
    cursor: grab;
    touch-action: none;
    box-shadow: 0 1px 2px var(--card-kanban-shadow);
    transition: transform 0.4s cubic-bezier(0.3, 1.25, 0.5, 1), box-shadow 0.2s;
  }
  .card-kanban { --card-kanban-shadow: light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.5)); }
  .card-kanban__chip:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-kanban__chip--done { color: light-dark(#50535b, #c6c8cd); }
  .card-kanban__chip svg { flex: none; width: 12px; height: 12px; color: light-dark(#50535b, #c6c8cd); }
  .card-kanban__chip--held { z-index: 3; cursor: grabbing; box-shadow: 0 12px 20px -8px var(--card-kanban-shadow); transition: box-shadow 0.2s; }
  .card-kanban__live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) {
    .card-kanban__chip { transition: none; }
  }
`;

// Where every chip sits: the held one is taken out and slotted in where it would land.
function layout(cols: Cols, drag: Drag | null) {
  const out: Cols = { todo: cols.todo.filter((t) => t !== drag?.id), done: cols.done.filter((t) => t !== drag?.id) };
  if (drag) out[drag.col].splice(drag.at, 0, drag.id);
  return out;
}

export function KanbanCard() {
  const [cols, setCols] = useState<Cols>({ todo: ['Write brief', 'Pick type'], done: ['Moodboard'] });
  const [drag, setDrag] = useState<Drag | null>(null);
  const [said, setSaid] = useState('');
  const box = useRef<HTMLElement>(null);
  const moved = useRef(false);
  const view = layout(cols, drag);

  const local = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const target = (x: number, y: number, id: string) => {
    const col: keyof Cols = x < 120 ? 'todo' : 'done';
    const n = cols[col].filter((t) => t !== id).length;
    return { col, at: Math.max(0, Math.min(n, Math.round((y - TOP - 17) / ROW))) };
  };
  const move = (id: string, col: keyof Cols) => {
    setCols((c) => {
      const next = layout(c, { id, col, at: c[col].filter((t) => t !== id).length, x: 0, y: 0, dx: 0, dy: 0 });
      return next;
    });
    setSaid(`Moved ${id} to ${col === 'todo' ? 'To do' : 'Done'}`);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <article ref={box} className="card-kanban" aria-label="Board">
        {(['todo', 'done'] as const).map((c) => (
          <div key={c}>
            <span className={`card-kanban__col${drag?.col === c ? ' card-kanban__col--target' : ''}`} style={{ left: X[c] }} aria-hidden="true" />
            <p className="card-kanban__head" style={{ left: X[c] + 4 }}>
              {c === 'todo' ? 'To do' : 'Done'}
              <span>{view[c].length}</span>
            </p>
          </div>
        ))}
        {drag && <span className="card-kanban__slot" style={{ left: X[drag.col], top: TOP + drag.at * ROW }} aria-hidden="true" />}
        {(['todo', 'done'] as const).flatMap((c) =>
          view[c].map((id, i) => {
            const held = drag?.id === id;
            // The held chip follows the pointer, tilted; the rest glide to their slots.
            const t = held ? `translate(${drag.x - drag.dx}px, ${drag.y - drag.dy}px) rotate(4deg) scale(1.05)` : `translate(${X[c]}px, ${TOP + i * ROW}px)`;
            return (
              <button
                key={id}
                type="button"
                className={`card-kanban__chip${c === 'done' ? ' card-kanban__chip--done' : ''}${held ? ' card-kanban__chip--held' : ''}`}
                style={{ transform: t }}
                aria-label={`${id}, in ${c === 'todo' ? 'To do' : 'Done'}. Press to move it to ${c === 'todo' ? 'Done' : 'To do'}.`}
                onPointerDown={(e) => {
                  if (e.button) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  const p = local(e);
                  moved.current = false;
                  setDrag({ id, x: p.x, y: p.y, dx: p.x - X[c], dy: p.y - (TOP + i * ROW), col: c, at: i });
                }}
                onPointerMove={(e) => {
                  if (!drag || drag.id !== id) return;
                  const p = local(e);
                  if (Math.hypot(p.x - drag.dx - X[c], p.y - drag.dy - (TOP + i * ROW)) > 4) moved.current = true;
                  setDrag({ ...drag, x: p.x, y: p.y, ...target(p.x, p.y, id) });
                }}
                onPointerUp={() => {
                  if (!drag) return;
                  if (moved.current) {
                    setCols(layout(cols, drag));
                    if (drag.col !== (cols.todo.includes(id) ? 'todo' : 'done')) setSaid(`Moved ${id} to ${drag.col === 'todo' ? 'To do' : 'Done'}`);
                  }
                  setDrag(null);
                }}
                onPointerCancel={() => setDrag(null)}
                onClick={() => {
                  // A click (or Enter) without a drag sends the chip to the other column.
                  if (moved.current) moved.current = false;
                  else move(id, c === 'todo' ? 'done' : 'todo');
                }}
              >
                {c === 'done' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
                {id}
              </button>
            );
          }),
        )}
        <span className="card-kanban__live" aria-live="polite">
          {said}
        </span>
      </article>
    </>
  );
}
