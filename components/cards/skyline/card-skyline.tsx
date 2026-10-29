"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .card-skyline {
    width: 252px;
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    cursor: crosshair;
  }
  .card-skyline:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-skyline__head { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 14px 0; }
  .card-skyline__head b { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .card-skyline__read { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-variant-numeric: tabular-nums; }
  .card-skyline canvas { display: block; width: 252px; height: 164px; }
  .card-skyline__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
  .card-skyline__probe i:nth-child(1) { color: light-dark(#fbfcfd, #121417); }
  .card-skyline__probe i:nth-child(2) { color: light-dark(#ebedf0, #232529); }
  .card-skyline__probe i:nth-child(3) { color: light-dark(#373a40, #f1f2f3); }
`;

const W = 252;
const H = 164;
const WEEKS = 12;
const S = 13; // cell pitch
// Twelve weeks ending Sunday 25 October 2026.
const START = new Date(2026, 7, 3);

// Activity: a rising trend, quiet weekends and a few spikes.
const DATA = Array.from({ length: WEEKS }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const n = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453;
    const r = n - Math.floor(n);
    const base = (d > 4 ? 1 : 5) + w * 0.7;
    return Math.max(0, Math.round(base * (0.3 + r * 1.3) + (r > 0.93 ? 10 : 0) - (r < 0.12 ? base : 0)));
  }),
);
const MAX = Math.max(...DATA.flat());
const TOTAL = DATA.flat().reduce((a, b) => a + b, 0);

const rgb = (c: string) => (c.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',')})`;
const easeOutBack = (x: number) => 1 + 2.4 * (x - 1) ** 3 + 1.4 * (x - 1) ** 2;

function inside(pt: [number, number], poly: number[][]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export function SkylineCard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const born = useRef(0);
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const pickedRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const el = canvas.current!;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = W * dpr;
    el.height = H * dpr;
    const ctx = el.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    born.current = performance.now();
    let yaw = 0.7;
    let pitch = 0.5;
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - born.current) / 1000;
      const p = ptr.current;
      // The pointer turns the city; at rest it drifts slowly on its own.
      const yawT = p ? 0.25 + (p.x / W) * 0.95 : 0.7 + (still ? 0 : Math.sin(now / 2600) * 0.12);
      const pitchT = p ? 0.38 + (p.y / H) * 0.22 : 0.5;
      yaw += (yawT - yaw) * 0.08;
      pitch += (pitchT - pitch) * 0.08;
      const [c0, cEmpty, cFull] = [...probe.current!.children].map((c) => rgb(getComputedStyle(c).color));
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const zk = Math.sqrt(1 - pitch * pitch);
      const proj = (x: number, y: number, z: number): [number, number] => {
        const xr = x * cy - y * sy;
        const yr = x * sy + y * cy;
        return [W / 2 + xr, 96 + yr * pitch - z * zk];
      };
      const cells: { w: number; d: number; x: number; y: number; depth: number }[] = [];
      DATA.forEach((col, w) =>
        col.forEach((_, d) => {
          const x = (w - (WEEKS - 1) / 2) * S;
          const y = (d - 3) * S;
          cells.push({ w, d, x, y, depth: x * sy + y * cy });
        }),
      );
      cells.sort((a, b) => a.depth - b.depth);
      ctx.clearRect(0, 0, W, H);
      const faces: { poly: number[][]; w: number; d: number }[] = [];
      const pk = pickedRef.current;
      for (const c of cells) {
        const v = DATA[c.w][c.d];
        // Bars rise in a diagonal wave from the oldest corner.
        const k = still ? 1 : easeOutBack(Math.min(1, Math.max(0, (t - (c.w + c.d) * 0.035) / 0.65)));
        const z = Math.max(1.2, (v / MAX) * 58 * k);
        const tone = v ? 0.18 + 0.82 * (v / MAX) ** 0.8 : 0;
        const hot = pk && pk[0] === c.w && pk[1] === c.d;
        const top = mix(cEmpty, cFull, hot ? 1 : tone);
        const r = S * 0.41;
        const corners = [
          [c.x - r, c.y - r],
          [c.x + r, c.y - r],
          [c.x + r, c.y + r],
          [c.x - r, c.y + r],
        ];
        // Sides whose outward normal faces the viewer, darker the more they turn away from the light.
        const sides: [number, number, number, number][] = [
          [0, 1, 0, -1],
          [1, 2, 1, 0],
          [2, 3, 0, 1],
          [3, 0, -1, 0],
        ];
        for (const [a, b, nx, ny] of sides) {
          const facing = nx * sy + ny * cy;
          if (facing <= 0) continue;
          const poly = [proj(corners[a][0], corners[a][1], 0), proj(corners[b][0], corners[b][1], 0), proj(corners[b][0], corners[b][1], z), proj(corners[a][0], corners[a][1], z)];
          ctx.beginPath();
          poly.forEach(([px, py], i) => ctx[i ? 'lineTo' : 'moveTo'](px, py));
          ctx.closePath();
          ctx.fillStyle = mix(rgb(top), c0, nx * cy - ny * sy > 0 ? 0.32 : 0.52);
          ctx.fill();
          faces.push({ poly, w: c.w, d: c.d });
        }
        const poly = corners.map(([x, y]) => proj(x, y, z));
        ctx.beginPath();
        poly.forEach(([px, py], i) => ctx[i ? 'lineTo' : 'moveTo'](px, py));
        ctx.closePath();
        ctx.fillStyle = top;
        ctx.fill();
        if (hot) {
          ctx.strokeStyle = mix(c0, cFull, 0);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        faces.push({ poly, w: c.w, d: c.d });
      }
      // Hit-test front to back: the first face under the pointer is the bar you see.
      let hit: [number, number] | null = null;
      if (p) {
        for (let i = faces.length - 1; i >= 0; i--) {
          if (inside([p.x, p.y], faces[i].poly)) {
            hit = [faces[i].w, faces[i].d];
            break;
          }
        }
      }
      if (hit?.[0] !== pickedRef.current?.[0] || hit?.[1] !== pickedRef.current?.[1]) {
        pickedRef.current = hit;
        setPicked(hit);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const day = picked && new Date(START.getFullYear(), START.getMonth(), START.getDate() + picked[0] * 7 + picked[1]);
  const read = picked
    ? `${day!.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${DATA[picked[0]][picked[1]]}`
    : 'Last 12 weeks';

  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="card-skyline"
        tabIndex={0}
        role="img"
        aria-label={`${TOTAL.toLocaleString('en-GB')} contributions in the last 12 weeks, as a 3D bar chart`}
        onPointerMove={(e) => {
          const r = canvas.current!.getBoundingClientRect();
          ptr.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        }}
        onPointerLeave={() => (ptr.current = null)}
        onClick={() => (born.current = performance.now())}
      >
        <span ref={probe} className="card-skyline__probe" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="card-skyline__head">
          <b>{TOTAL.toLocaleString('en-GB')} contributions</b>
          <span className="card-skyline__read">{read}</span>
        </div>
        <canvas ref={canvas} aria-hidden="true" />
      </div>
    </>
  );
}
