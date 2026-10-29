"use client";

const css = `
  @keyframes loader-paper-plane-fly { to { offset-distance: 100%; } }
  .loader-paper-plane { position: relative; width: 140px; height: 96px; }
  /* An absolutely positioned svg doesn't stretch to inset: 0; size it, or it draws at 300px wide. */
  .loader-paper-plane__track { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; }
  /* The flight path as a faint dotted line (zero-length dashes with round caps are dots). */
  .loader-paper-plane__trail {
    fill: none;
    stroke: light-dark(#cbced3, #393c41);
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-dasharray: 0 0.022;
  }
  .loader-paper-plane__plane {
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;
    /* offset-path puts the box's centre on the path: no margins needed. */
    offset-path: path('M14 62C40 62 52 20 76 20C100 20 104 58 82 62C60 66 60 34 90 34C112 34 120 62 128 62');
    offset-rotate: auto;
    animation: loader-paper-plane-fly 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-paper-plane__plane { animation-duration: 9s; }
  }
`;

const PATH = 'M14 62C40 62 52 20 76 20C100 20 104 58 82 62C60 66 60 34 90 34C112 34 120 62 128 62';

export function PaperPlaneLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-paper-plane" role="status" aria-label="Loading">
        <svg className="loader-paper-plane__track" viewBox="0 0 140 96" aria-hidden="true">
          <path className="loader-paper-plane__trail" d={PATH} pathLength={1} />
        </svg>
        <span className="loader-paper-plane__plane" aria-hidden="true">
          {/* Pointing along +x, which is what offset-rotate: auto lines up with the path. */}
          <svg viewBox="0 0 20 20" width="20" height="20">
            <path d="M2 10L18 3L13 17L10 11Z" fill="light-dark(#373a40, #f1f2f3)" />
            <path d="M10 11L18 3" stroke="light-dark(#6d7179, #7d8087)" strokeWidth="1" />
            <path d="M2 10L10 11L9 14Z" fill="light-dark(#50535b, #c6c8cd)" />
          </svg>
        </span>
      </div>
    </>
  );
}
