"use client";

import { useEffect, useRef } from 'react';

const css = `
  .loader-tesseract { display: block; width: 104px; height: 104px; }
  .loader-tesseract__edges { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1; stroke-linejoin: round; }
  .loader-tesseract__inner { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.2; }
  .loader-tesseract__nodes { fill: light-dark(#373a40, #f1f2f3); }
`;

// The 16 corners of a 4-cube (every sign combination of x, y, z, w) and its 32
// edges: the pairs of corners that differ in exactly one coordinate.
const V = Array.from({ length: 16 }, (_, i) => [0, 1, 2, 3].map((b) => ((i >> b) & 1 ? 1 : -1)));
const E: [number, number][] = [];
for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) if (!(i & (1 << b))) E.push([i, i | (1 << b)]);

function project(t: number) {
  const a = t * 0.9; // turn through the x–w plane: the inner cube swaps with the outer one
  const c = Math.cos(a);
  const s = Math.sin(a);
  const b = 0.45 + t * 0.25; // and slowly through y–z, so the 3D shadow keeps moving
  const cb = Math.cos(b);
  const sb = Math.sin(b);
  return V.map(([x, y, z, w]) => {
    const x1 = x * c - w * s;
    const w1 = x * s + w * c;
    const y1 = y * cb - z * sb;
    const z1 = y * sb + z * cb;
    const k4 = 1 / (2.6 - w1); // 4D → 3D perspective
    const X = x1 * k4;
    const Y = y1 * k4;
    const Z = z1 * k4;
    const k3 = 1 / (3 - Z); // 3D → 2D perspective
    return { x: 52 + X * k3 * 120, y: 52 + Y * k3 * 120, w: w1 };
  });
}

export function TesseractLoader() {
  const edges = useRef<SVGPathElement>(null);
  const inner = useRef<SVGPathElement>(null);
  const nodes = useRef<SVGGElement>(null);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const draw = (now: number) => {
      const p = project(still ? 0.6 : now / 1000);
      let d = '';
      let din = '';
      for (const [i, j] of E) {
        const seg = `M${p[i].x.toFixed(1)} ${p[i].y.toFixed(1)}L${p[j].x.toFixed(1)} ${p[j].y.toFixed(1)}`;
        // Edges of whichever cube is nearer in w are drawn brighter.
        if (p[i].w > 0 && p[j].w > 0) din += seg;
        else d += seg;
      }
      edges.current!.setAttribute('d', d);
      inner.current!.setAttribute('d', din);
      [...nodes.current!.children].forEach((n, i) => {
        n.setAttribute('cx', p[i].x.toFixed(1));
        n.setAttribute('cy', p[i].y.toFixed(1));
        n.setAttribute('r', p[i].w > 0 ? '1.8' : '1.1');
      });
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <svg className="loader-tesseract" viewBox="0 0 104 104" role="status" aria-label="Loading">
        <path ref={edges} className="loader-tesseract__edges" />
        <path ref={inner} className="loader-tesseract__inner" />
        <g ref={nodes} className="loader-tesseract__nodes">
          {V.map((_, i) => (
            <circle key={i} r={1.2} />
          ))}
        </g>
      </svg>
    </>
  );
}
