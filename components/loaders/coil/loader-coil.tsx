"use client";

const css = `
  @keyframes loader-coil-stretch {
    0%, 100% { transform: scaleY(0.55); }
    50% { transform: scaleY(1); }
  }
  @keyframes loader-coil-bob {
    0%, 100% { transform: translateY(-31px); }
    50% { transform: translateY(0); }
  }
  .loader-coil { position: relative; width: 70px; height: 112px; }
  .loader-coil__mount {
    position: absolute;
    left: 15px;
    right: 15px;
    top: 0;
    height: 3px;
    border-radius: 2px;
    background: light-dark(#6d7179, #7d8087);
  }
  .loader-coil__spring {
    position: absolute;
    left: 50%;
    top: 3px;
    width: 30px;
    height: 70px;
    margin-left: -15px;
    overflow: visible;
    transform-origin: top;
    animation: loader-coil-stretch 1.3s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  .loader-coil__spring path {
    fill: none;
    stroke: light-dark(#42454c, #e5e6e9);
    stroke-width: 1.5;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .loader-coil__spring path.loader-coil__back { stroke: light-dark(#cbced3, #393c41); }
  .loader-coil__weight {
    position: absolute;
    left: 50%;
    top: 73px;
    width: 26px;
    height: 22px;
    margin-left: -13px;
    border-radius: 5px 5px 8px 8px;
    background: linear-gradient(light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087));
    box-shadow: inset 0 1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent);
    animation: loader-coil-bob 1.3s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-coil__spring, .loader-coil__weight { animation-duration: 5s; }
  }
`;

// A helix seen side-on: front half-turns (bright) and back half-turns (dim), alternating.
const TURNS = 8;
const front: string[] = [];
const back: string[] = [];
for (let i = 0; i < TURNS; i++) {
  const y = (i / TURNS) * 70;
  const h = 70 / TURNS;
  front.push(`M0 ${y.toFixed(2)}C10 ${(y + h * 0.15).toFixed(2)} 30 ${(y + h * 0.35).toFixed(2)} 30 ${(y + h / 2).toFixed(2)}`);
  back.push(`M30 ${(y + h / 2).toFixed(2)}C20 ${(y + h * 0.65).toFixed(2)} 0 ${(y + h * 0.85).toFixed(2)} 0 ${(y + h).toFixed(2)}`);
}

export function CoilLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-coil" role="status" aria-label="Loading">
        <span className="loader-coil__mount" aria-hidden="true" />
        <svg className="loader-coil__spring" viewBox="0 0 30 70" preserveAspectRatio="none" aria-hidden="true">
          <path className="loader-coil__back" d={back.join('')} />
          <path d={front.join('')} />
        </svg>
        <span className="loader-coil__weight" aria-hidden="true" />
      </div>
    </>
  );
}
