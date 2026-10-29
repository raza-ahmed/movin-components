"use client";

const css = `
  @keyframes card-boarding-pass-fly { from { offset-distance: 0%; } to { offset-distance: 100%; } }
  .card-boarding-pass {
    display: flex;
    width: 262px;
    height: 132px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    /* Punched notches where the stub tears off. */
    mask-image: radial-gradient(circle at 190px 0, transparent 8px, #000 8.5px), radial-gradient(circle at 190px 100%, transparent 8px, #000 8.5px);
    mask-composite: intersect;
    cursor: pointer;
  }
  .card-boarding-pass:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-boarding-pass__main { position: relative; width: 190px; padding: 12px 14px; border-right: 1.5px dashed light-dark(#dbdde1, #2e3035); }
  .card-boarding-pass__airline { color: light-dark(#5f626a, #a7abb2); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }
  .card-boarding-pass__route { position: relative; display: flex; justify-content: space-between; align-items: end; margin-top: 8px; height: 48px; }
  .card-boarding-pass__city b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1; }
  .card-boarding-pass__city span { color: light-dark(#5f626a, #a7abb2); font-size: 10px; }
  .card-boarding-pass__city:last-child { text-align: right; }
  /* Arc and plane share the route's own pixel space (162 x 30), so the plane rides the dashes. */
  .card-boarding-pass__arc { position: absolute; left: 0; top: 0; width: 162px; height: 30px; overflow: visible; }
  .card-boarding-pass__arc path { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 1.4; stroke-dasharray: 3 4; }
  .card-boarding-pass__plane {
    position: absolute;
    left: 0;
    top: 0;
    width: 14px;
    height: 14px;
    color: light-dark(#373a40, #f1f2f3);
    offset-path: path('M46 26 Q 81 -12 116 26');
    offset-rotate: auto;
    offset-distance: 0%;
    transition: offset-distance 1.4s cubic-bezier(0.45, 0, 0.25, 1);
  }
  .card-boarding-pass:hover .card-boarding-pass__plane,
  .card-boarding-pass:focus-visible .card-boarding-pass__plane { offset-distance: 100%; }
  .card-boarding-pass__meta { display: flex; gap: 16px; margin-top: 8px; }
  .card-boarding-pass__meta div { color: light-dark(#5f626a, #a7abb2); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
  .card-boarding-pass__meta b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 12px; letter-spacing: 0; text-transform: none; }
  .card-boarding-pass__stub { flex: 1; display: grid; place-items: center; padding: 10px 0; }
  .card-boarding-pass__bars { width: 44px; height: 92px; background: repeating-linear-gradient(light-dark(#42454c, #e5e6e9) 0 2px, transparent 2px 4px, light-dark(#42454c, #e5e6e9) 4px 5px, transparent 5px 8px, light-dark(#42454c, #e5e6e9) 8px 11px, transparent 11px 13px); }
  @media (prefers-reduced-motion: reduce) { .card-boarding-pass__plane { transition: none; } }
`;

export function BoardingPassCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-boarding-pass" tabIndex={0} role="group" aria-label="Boarding pass, San Francisco to New York, gate B12, seat 14A">
        <div className="card-boarding-pass__main">
          <div className="card-boarding-pass__airline">Movin Air · MV 214</div>
          <div className="card-boarding-pass__route">
            <svg className="card-boarding-pass__arc" viewBox="0 0 162 30" aria-hidden="true">
              <path d="M46 26 Q 81 -12 116 26" />
            </svg>
            <svg className="card-boarding-pass__plane" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M21 12 3 5l3 7-3 7Z" />
            </svg>
            <div className="card-boarding-pass__city">
              <b>SFO</b>
              <span>08:40</span>
            </div>
            <div className="card-boarding-pass__city">
              <b>JFK</b>
              <span>17:05</span>
            </div>
          </div>
          <div className="card-boarding-pass__meta">
            <div>
              Gate<b>B12</b>
            </div>
            <div>
              Seat<b>14A</b>
            </div>
            <div>
              Board<b>08:10</b>
            </div>
          </div>
        </div>
        <div className="card-boarding-pass__stub" aria-hidden="true">
          <span className="card-boarding-pass__bars" />
        </div>
      </div>
    </>
  );
}
