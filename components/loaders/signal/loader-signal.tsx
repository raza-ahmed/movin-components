"use client";

const css = `
  .loader-signal { display: block; width: 96px; height: 80px; overflow: visible; }
  .loader-signal__arc {
    fill: none;
    stroke: light-dark(#dbdde1, #2e3035);
    stroke-width: 6;
    stroke-linecap: round;
  }
  .loader-signal__dot { fill: light-dark(#dbdde1, #2e3035); }
  /* The source lights first, then each arc outward; all hold, then go dark together. */
  @keyframes loader-signal-dot {
    0% { fill: light-dark(#dbdde1, #2e3035); }
    10%, 80% { fill: light-dark(#373a40, #f1f2f3); }
    90%, 100% { fill: light-dark(#dbdde1, #2e3035); }
  }
  @keyframes loader-signal-a1 {
    0%, 22% { stroke: light-dark(#dbdde1, #2e3035); }
    30%, 80% { stroke: light-dark(#373a40, #f1f2f3); }
    90%, 100% { stroke: light-dark(#dbdde1, #2e3035); }
  }
  @keyframes loader-signal-a2 {
    0%, 38% { stroke: light-dark(#dbdde1, #2e3035); }
    46%, 80% { stroke: light-dark(#373a40, #f1f2f3); }
    90%, 100% { stroke: light-dark(#dbdde1, #2e3035); }
  }
  @keyframes loader-signal-a3 {
    0%, 54% { stroke: light-dark(#dbdde1, #2e3035); }
    62%, 80% { stroke: light-dark(#373a40, #f1f2f3); }
    90%, 100% { stroke: light-dark(#dbdde1, #2e3035); }
  }
  .loader-signal__arc--1 { animation: loader-signal-a1 2s ease infinite; }
  .loader-signal__arc--2 { animation: loader-signal-a2 2s ease infinite; }
  .loader-signal__arc--3 { animation: loader-signal-a3 2s ease infinite; }
  .loader-signal__dot { animation: loader-signal-dot 2s ease infinite; }
  @media (prefers-reduced-motion: reduce) {
    .loader-signal__arc, .loader-signal__dot { animation-duration: 6s; }
  }
`;

// Concentric arcs about (48, 70), 90 degrees wide, opening upward.
const arc = (r: number) => {
  const a = Math.PI / 4;
  const x = (s: number) => (48 + s * Math.sin(a) * r).toFixed(2);
  const y = (70 - Math.cos(a) * r).toFixed(2);
  return `M${x(-1)} ${y}A${r} ${r} 0 0 1 ${x(1)} ${y}`;
};

export function SignalLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <svg className="loader-signal" viewBox="0 0 96 80" role="status" aria-label="Loading">
        <g>
          <circle className="loader-signal__dot" cx={48} cy={70} r={5} />
          <path className="loader-signal__arc loader-signal__arc--1" d={arc(20)} />
          <path className="loader-signal__arc loader-signal__arc--2" d={arc(37)} />
          <path className="loader-signal__arc loader-signal__arc--3" d={arc(54)} />
        </g>
      </svg>
    </>
  );
}
