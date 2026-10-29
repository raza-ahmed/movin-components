"use client";

const css = `
  @keyframes loader-fractal-cell {
    0% { opacity: 0.12; }
    10% { opacity: 1; }
    45% { opacity: 1; }
    65%, 100% { opacity: 0.12; }
  }
  .loader-fractal { display: block; width: 96px; height: 84px; }
  .loader-fractal__cell {
    fill: light-dark(#373a40, #f1f2f3);
    opacity: 0.12;
    animation: loader-fractal-cell 2.4s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-fractal__cell { animation: none; opacity: 0.7; }
  }
`;

type P = [number, number];

/** The Sierpinski triangle to `depth`, as its smallest triangles in recursive (corner-first) order. */
function sierpinski(a: P, b: P, c: P, depth: number): P[][] {
  if (depth === 0) return [[a, b, c]];
  const mid = (p: P, q: P): P => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const ab = mid(a, b);
  const bc = mid(b, c);
  const ca = mid(c, a);
  return [...sierpinski(a, ab, ca, depth - 1), ...sierpinski(ab, b, bc, depth - 1), ...sierpinski(ca, bc, c, depth - 1)];
}

const H = 96 * (Math.sqrt(3) / 2);
// Shrink each cell toward its own centre so the recursion's gaps read clearly.
const CELLS = sierpinski([48, 0], [0, H], [96, H], 3).map((t) => {
  const cx = (t[0][0] + t[1][0] + t[2][0]) / 3;
  const cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
  return t.map(([x, y]) => `${(cx + (x - cx) * 0.82).toFixed(2)},${(cy + (y - cy) * 0.82).toFixed(2)}`).join(' ');
});

export function FractalLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <svg className="loader-fractal" viewBox={`0 0 96 ${H.toFixed(2)}`} role="status" aria-label="Loading">
        {CELLS.map((pts, i) => (
          <polygon key={i} className="loader-fractal__cell" points={pts} style={{ animationDelay: `${(i * 0.05).toFixed(2)}s` }} />
        ))}
      </svg>
    </>
  );
}
