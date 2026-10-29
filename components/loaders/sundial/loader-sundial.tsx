"use client";

const TICKS = Array.from({ length: 13 }, (_, i) => -90 + i * 15);
const R = 52;

const css = `
  /* Morning to evening: the shadow swings from one side to the other, shortest at noon. */
  @keyframes loader-sundial-shadow { 0% { transform: rotate(-80deg) scaleY(1.05); } 50% { transform: rotate(0deg) scaleY(0.42); } 100% { transform: rotate(80deg) scaleY(1.05); } }
  @keyframes loader-sundial-sun { 0% { offset-distance: 0%; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }
  @keyframes loader-sundial-fade { 0%, 4% { opacity: 0; } 12%, 88% { opacity: 1; } 96%, 100% { opacity: 0; } }
  .loader-sundial { position: relative; width: 140px; height: 96px; }
  .loader-sundial svg { position: absolute; left: 0; bottom: 0; width: 140px; height: 60px; overflow: visible; }
  .loader-sundial__plate { fill: light-dark(#cbced3, #393c41); stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.2; }
  .loader-sundial__tick { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.4; stroke-linecap: round; }
  .loader-sundial__shadow { stroke: light-dark(#fbfcfd, #121417); stroke-width: 7; stroke-linecap: round; transform-origin: 70px 30px; animation: loader-sundial-shadow 4s ease-in-out infinite, loader-sundial-fade 4s linear infinite; opacity: 0.9; }
  .loader-sundial__gnomon { fill: light-dark(#42454c, #e5e6e9); }
  .loader-sundial__sun { position: absolute; left: 0; top: 0; width: 12px; height: 12px; margin: -6px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 12px 4px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent); offset-path: path('M14 46C34 0 106 0 126 46'); offset-rotate: 0deg; animation: loader-sundial-sun 4s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .loader-sundial__shadow, .loader-sundial__sun { animation: none; }
    .loader-sundial__sun { offset-distance: 50%; }
    .loader-sundial__shadow { transform: scaleY(0.42); }
  }
`;

export function SundialLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-sundial" role="status" aria-label="Loading">
        <span className="loader-sundial__sun" aria-hidden="true" />
        <svg viewBox="0 0 140 60" aria-hidden="true">
          <ellipse className="loader-sundial__plate" cx="70" cy="30" rx="64" ry="24" />
          {/* The dial is a circle seen at a slant: draw it flat, then squash it to the plate's ellipse. */}
          <g transform="translate(70 30) scale(1 0.375) translate(-70 -30)">
            {TICKS.map((a) => {
              const t = (a * Math.PI) / 180;
              return (
                <line
                  key={a}
                  className="loader-sundial__tick"
                  x1={(70 + Math.sin(t) * (R - 8)).toFixed(1)}
                  y1={(30 + Math.cos(t) * (R - 8)).toFixed(1)}
                  x2={(70 + Math.sin(t) * R).toFixed(1)}
                  y2={(30 + Math.cos(t) * R).toFixed(1)}
                />
              );
            })}
            <line className="loader-sundial__shadow" x1="70" y1="30" x2="70" y2={30 + R - 12} />
          </g>
          <path className="loader-sundial__gnomon" d="M70 31L70 12L82 31Z" />
        </svg>
      </div>
    </>
  );
}
