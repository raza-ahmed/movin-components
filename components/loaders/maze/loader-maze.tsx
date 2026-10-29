"use client";

const css = `
  @keyframes loader-maze-solve {
    0% { stroke-dashoffset: 1; opacity: 1; }
    70% { stroke-dashoffset: 0; opacity: 1; }
    85% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes loader-maze-goal {
    0%, 66% { opacity: 0.35; transform: scale(1); }
    72% { opacity: 1; transform: scale(1.8); }
    85% { opacity: 1; transform: scale(1); }
    100% { opacity: 0.35; }
  }
  .loader-maze { display: block; width: 96px; height: 96px; }
  .loader-maze__walls { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 0.1; stroke-linecap: square; }
  .loader-maze__route {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 0.16;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    animation: loader-maze-solve 3s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  .loader-maze__goal {
    fill: light-dark(#373a40, #f1f2f3);
    transform-box: fill-box;
    transform-origin: center;
    animation: loader-maze-goal 3s ease infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-maze__route, .loader-maze__goal { animation: none; stroke-dashoffset: 0; }
  }
`;

const N = 7;

/** A perfect maze (one route between any two cells) carved by a seeded depth-first walk. */
function carve() {
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const open = new Set<string>(); // "a-b" passages between cell indexes
  const seen = new Set<number>([0]);
  const stack = [0];
  while (stack.length) {
    const c = stack[stack.length - 1];
    const x = c % N;
    const y = Math.floor(c / N);
    const next = [
      x > 0 && c - 1,
      x < N - 1 && c + 1,
      y > 0 && c - N,
      y < N - 1 && c + N,
    ].filter((n): n is number => n !== false && !seen.has(n));
    if (!next.length) {
      stack.pop();
      continue;
    }
    const n = next[Math.floor(rand() * next.length)];
    open.add(`${Math.min(c, n)}-${Math.max(c, n)}`);
    seen.add(n);
    stack.push(n);
  }
  return open;
}

const OPEN = carve();
const isOpen = (a: number, b: number) => OPEN.has(`${Math.min(a, b)}-${Math.max(a, b)}`);

// Walls: the outer frame (with an entrance top-left and exit bottom-right) plus every closed side.
let WALLS = `M1 0H${N}V${N - 1}M${N - 1} ${N}H0V1`;
for (let y = 0; y < N; y++)
  for (let x = 0; x < N; x++) {
    const c = y * N + x;
    if (x < N - 1 && !isOpen(c, c + 1)) WALLS += `M${x + 1} ${y}V${y + 1}`;
    if (y < N - 1 && !isOpen(c, c + N)) WALLS += `M${x} ${y + 1}H${x + 1}`;
  }

// The route: breadth-first from the first cell to the last, through open passages only.
function solve() {
  const prev = new Map<number, number>([[0, -1]]);
  const queue = [0];
  while (queue.length) {
    const c = queue.shift()!;
    if (c === N * N - 1) break;
    const x = c % N;
    for (const n of [x > 0 ? c - 1 : -1, x < N - 1 ? c + 1 : -1, c - N, c + N]) {
      if (n < 0 || n >= N * N || prev.has(n) || !isOpen(c, n)) continue;
      prev.set(n, c);
      queue.push(n);
    }
  }
  const path: number[] = [];
  for (let c = N * N - 1; c !== -1; c = prev.get(c)!) path.unshift(c);
  return path;
}
const ROUTE =
  'M0.5 -0.4' +
  solve()
    .map((c) => `L${(c % N) + 0.5} ${Math.floor(c / N) + 0.5}`)
    .join('') +
  `L${N - 0.5} ${N + 0.4}`;

export function MazeLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <svg className="loader-maze" viewBox={`-0.6 -0.6 ${N + 1.2} ${N + 1.2}`} role="status" aria-label="Loading">
        <path className="loader-maze__walls" d={WALLS} />
        <path className="loader-maze__route" d={ROUTE} pathLength={1} />
        <circle className="loader-maze__goal" cx={N - 0.5} cy={N + 0.4} r={0.22} />
      </svg>
    </>
  );
}
