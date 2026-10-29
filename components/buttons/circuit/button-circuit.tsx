"use client";

const css = `
  @keyframes btn-circuit-flow {
    from { stroke-dashoffset: 12; opacity: 1; }
    to { stroke-dashoffset: -100; opacity: 1; }
  }
  .btn-circuit {
    position: relative;
    width: 300px;
    height: 140px;
  }
  .btn-circuit__board {
    position: absolute;
    inset: 0;
    overflow: visible;
    pointer-events: none;
  }
  .btn-circuit__trace { fill: none; stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1.5; stroke-linejoin: round; }
  .btn-circuit__pad { fill: light-dark(#fbfcfd, #121417); stroke: light-dark(#cbced3, #393c41); stroke-width: 1.5; }
  .btn-circuit__pulse {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 12 200;
    stroke-dashoffset: 12;
    opacity: 0;
    filter: drop-shadow(0 0 3px light-dark(#373a40, #f1f2f3));
  }
  .btn-circuit:hover .btn-circuit__pulse,
  .btn-circuit:focus-within .btn-circuit__pulse { animation: btn-circuit-flow 1.1s cubic-bezier(0.5, 0, 0.75, 0) infinite; }
  .btn-circuit:hover .btn-circuit__pad,
  .btn-circuit:focus-within .btn-circuit__pad { stroke: light-dark(#50535b, #c6c8cd); transition: stroke 0.3s ease; }
  .btn-circuit__btn {
    position: absolute;
    left: 92px;
    top: 50px;
    width: 116px;
    height: 40px;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#5f626a, #a7abb2);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  /* Powers up once the first current has had time to arrive. */
  .btn-circuit:hover .btn-circuit__btn,
  .btn-circuit__btn:focus-visible {
    color: light-dark(#373a40, #f1f2f3);
    border-color: light-dark(#42454c, #e5e6e9);
    box-shadow: 0 0 22px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 24%, transparent), inset 0 0 12px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 12%, transparent);
    transition-delay: 0.55s;
  }
  .btn-circuit__btn:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .btn-circuit:hover .btn-circuit__pulse,
    .btn-circuit:focus-within .btn-circuit__pulse { animation: none; }
    .btn-circuit:hover .btn-circuit__btn { transition-delay: 0s; }
  }
`;

// Each trace runs from its pad INTO the button, so the pulses travel inward.
const TRACES = [
  'M8 26 H46 L70 50 V60 H92',
  'M8 70 H92',
  'M8 114 H42 L64 92 V80 H92',
  'M292 26 H254 L230 50 V60 H208',
  'M292 70 H208',
  'M292 114 H258 L236 92 V80 H208',
  'M150 6 V50',
  'M126 134 V114 L140 100 V90',
];
const PADS: [number, number][] = [
  [8, 26], [8, 70], [8, 114], [292, 26], [292, 70], [292, 114], [150, 6], [126, 134],
];

export function CircuitButton() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="btn-circuit">
        <svg className="btn-circuit__board" viewBox="0 0 300 140" aria-hidden="true">
          {TRACES.map((d) => (
            <path key={d} d={d} className="btn-circuit__trace" />
          ))}
          {TRACES.map((d, i) => (
            <path
              key={`p${d}`}
              d={d}
              pathLength={100}
              className="btn-circuit__pulse"
              style={{ animationDelay: `${(i * 0.13) % 0.5}s` }}
            />
          ))}
          {PADS.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} className="btn-circuit__pad" />
          ))}
        </svg>
        <button type="button" className="btn-circuit__btn">
          Power
        </button>
      </div>
    </>
  );
}
