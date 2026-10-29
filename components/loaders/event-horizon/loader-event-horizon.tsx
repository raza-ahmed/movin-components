"use client";

const css = `
  @keyframes loader-event-horizon-spin { to { transform: rotate(360deg); } }
  @keyframes loader-event-horizon-flicker {
    0%, 100% { opacity: 0.85; }
    50% { opacity: 1; }
  }
  .loader-event-horizon {
    position: relative;
    width: 140px;
    height: 96px;
  }
  /* The disk: a spinning ring of light squashed flat by a scaleY wrapper (so it spins in its own plane). */
  .loader-event-horizon__disk {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 136px;
    height: 136px;
    margin: -68px 0 0 -68px;
    transform: scaleY(0.2);
  }
  .loader-event-horizon__disk::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg, light-dark(#373a40, #f1f2f3), color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent) 25%, light-dark(#42454c, #e5e6e9) 50%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 25%, transparent) 75%, light-dark(#373a40, #f1f2f3));
    mask-image: radial-gradient(circle, transparent 0 30%, #000 34% 48%, transparent 70%);
    animation: loader-event-horizon-spin 1.4s linear infinite;
  }
  /* Only the near half of the disk passes in front of the hole. */
  .loader-event-horizon__disk--front { z-index: 3; clip-path: inset(50% 0 0 0); }
  .loader-event-horizon__disk--back { z-index: 1; clip-path: inset(0 0 50% 0); }
  /* Light from the far side of the disk, bent up and over the hole by its gravity. */
  .loader-event-horizon__lens {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    width: 62px;
    height: 54px;
    margin: -29px 0 0 -31px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 70%, transparent), 0 0 14px 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent);
    animation: loader-event-horizon-flicker 2.2s ease-in-out infinite;
  }
  .loader-event-horizon__hole {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    width: 46px;
    height: 46px;
    margin: -23px 0 0 -23px;
    border-radius: 50%;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: 0 0 0 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 85%, transparent), 0 0 8px 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-event-horizon__disk::before { animation-duration: 8s; }
    .loader-event-horizon__lens { animation: none; }
  }
`;

export function EventHorizonLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-event-horizon" role="status" aria-label="Loading">
        <span className="loader-event-horizon__disk loader-event-horizon__disk--back" aria-hidden="true" />
        <span className="loader-event-horizon__lens" aria-hidden="true" />
        <span className="loader-event-horizon__hole" aria-hidden="true" />
        <span className="loader-event-horizon__disk loader-event-horizon__disk--front" aria-hidden="true" />
      </div>
    </>
  );
}
