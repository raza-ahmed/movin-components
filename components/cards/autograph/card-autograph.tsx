"use client";

// A loose cursive "Maya" in one stroke, then the dot and the underline flourish.
const SIGN = [
  'M6 44C9 34 12 20 15 13C17 20 18 30 21 38C24 28 27 19 30 13C32 22 31 33 33 40C35 33 40 29 45 30C49 31 48 38 43 40C39 41 38 35 41 32C44 29 48 30 49 33L49 40C51 35 53 31 56 29C56 35 57 40 61 39C65 37 67 31 68 29C67 41 66 53 60 59C55 63 51 58 55 53C60 47 69 44 75 40C77 33 82 29 87 30C91 31 90 38 85 40C81 41 80 35 83 32C86 29 90 30 91 33L91 40C93 42 98 40 103 35',
  'M18 54C46 50 84 48 124 51',
];

const css = `
  .card-autograph {
    display: grid;
    gap: 12px;
    width: 250px;
    padding: 16px 18px 14px;
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 12px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    outline: none;
  }
  .card-autograph:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .card-autograph__top { display: flex; align-items: center; gap: 12px; }
  .card-autograph__avatar { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41); }
  .card-autograph__name { color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-weight: 600; }
  .card-autograph__role { color: light-dark(#5f626a, #a7abb2); font-size: 12px; }
  .card-autograph__sign { position: relative; height: 64px; border-bottom: 1px solid light-dark(#cbced3, #393c41); }
  .card-autograph__sign svg { position: absolute; left: 4px; bottom: -2px; width: 150px; height: 64px; overflow: visible; }
  .card-autograph__sign path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 0.3s, opacity 0s 0.3s; }
  .card-autograph__sign small { position: absolute; right: 0; bottom: 6px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; transition: opacity 0.3s; }
  /* Hover writes it: the name stroke first, then the flourish, at a pen's pace. */
  .card-autograph:is(:hover, :focus-visible) .card-autograph__sign path { stroke-dashoffset: 0; opacity: 1; transition: stroke-dashoffset 1.5s cubic-bezier(0.45, 0.05, 0.4, 1), opacity 0s; }
  .card-autograph:is(:hover, :focus-visible) .card-autograph__sign path + path { transition: stroke-dashoffset 0.45s ease-out 1.45s, opacity 0s 1.45s; }
  .card-autograph:is(:hover, :focus-visible) .card-autograph__sign small { opacity: 0; }
  @media (prefers-reduced-motion: reduce) {
    .card-autograph__sign path { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function AutographCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-autograph" tabIndex={0} role="group" aria-label="Maya Okafor, principal designer, signed">
        <div className="card-autograph__top" aria-hidden="true">
          <span className="card-autograph__avatar">MO</span>
          <span>
            <span className="card-autograph__name">Maya Okafor</span>
            <br />
            <span className="card-autograph__role">Principal designer</span>
          </span>
        </div>
        <div className="card-autograph__sign" aria-hidden="true">
          <svg viewBox="0 0 150 64">
            {SIGN.map((d, i) => (
              <path key={i} d={d} pathLength={1} />
            ))}
          </svg>
          <small>Signature</small>
        </div>
      </div>
    </>
  );
}
