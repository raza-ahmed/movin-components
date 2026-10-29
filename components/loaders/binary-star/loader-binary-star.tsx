"use client";

const css = `
  @keyframes loader-binary-star-spin { to { transform: rotate(360deg); } }
  .loader-binary-star {
    position: relative;
    width: 108px;
    height: 108px;
  }
  .loader-binary-star__track {
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    border: 1px dashed light-dark(#dbdde1, #2e3035);
  }
  .loader-binary-star__pair,
  .loader-binary-star__planet-orbit {
    position: absolute;
    inset: 0;
    animation: loader-binary-star-spin 1.6s linear infinite;
  }
  .loader-binary-star__planet-orbit { inset: 4px; animation-duration: 6s; }
  /* Each star leads a trail: a quarter-ring conic gradient fading behind it. */
  .loader-binary-star__trail {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 44px;
    height: 44px;
    margin: -22px 0 0 -22px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, transparent 0deg 200deg, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 55%, transparent) 360deg);
    mask-image: radial-gradient(circle, transparent 0 55%, #000 57% 66%, transparent 68%);
  }
  .loader-binary-star__trail--b { transform: rotate(180deg); }
  .loader-binary-star__star {
    position: absolute;
    left: 50%;
    top: calc(50% - 22px);
    width: 9px;
    height: 9px;
    margin: -4.5px 0 0 -4.5px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 10px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 55%, transparent);
  }
  .loader-binary-star__star--b {
    top: calc(50% + 22px);
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    background: light-dark(#50535b, #c6c8cd);
  }
  .loader-binary-star__planet {
    position: absolute;
    left: 50%;
    top: -2px;
    width: 5px;
    height: 5px;
    margin-left: -2.5px;
    border-radius: 50%;
    background: light-dark(#5f626a, #a7abb2);
  }
  .loader-binary-star__barycentre {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 2px;
    height: 2px;
    margin: -1px;
    background: light-dark(#cbced3, #393c41);
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-binary-star__pair, .loader-binary-star__planet-orbit { animation-duration: 12s; }
  }
`;

export function BinaryStarLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-binary-star" role="status" aria-label="Loading">
        <span className="loader-binary-star__track" aria-hidden="true" />
        <span className="loader-binary-star__barycentre" aria-hidden="true" />
        <span className="loader-binary-star__pair" aria-hidden="true">
          <span className="loader-binary-star__trail" />
          <span className="loader-binary-star__trail loader-binary-star__trail--b" />
          <span className="loader-binary-star__star" />
          <span className="loader-binary-star__star loader-binary-star__star--b" />
        </span>
        <span className="loader-binary-star__planet-orbit" aria-hidden="true">
          <span className="loader-binary-star__planet" />
        </span>
      </div>
    </>
  );
}
