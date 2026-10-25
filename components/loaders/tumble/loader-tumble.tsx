"use client";

const css = `
  .loader-tumble {
    --loader-tumble-t: 0.9s;
    position: relative;
    display: inline-block;
    width: 72px;
    height: 48px;
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 75%, transparent);
  }

  /* The floor: dashes one block-width apart, one dash wider than the box so it
     can slide back a whole block per roll and never show its end. */
  .loader-tumble::after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 0;
    right: -18px;
    height: 2px;
    background: repeating-linear-gradient(90deg, light-dark(#cbced3, #393c41) 0 10px, transparent 10px 18px);
    animation: loader-tumble-floor var(--loader-tumble-t) infinite;
  }

  /* The block pivots on its bottom-right corner while that corner moves back
     with the floor, so after a quarter turn it sits exactly where it began. */
  .loader-tumble__block {
    position: absolute;
    bottom: 12px;
    left: 27px;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: light-dark(#42454c, #e5e6e9);
    transform-origin: 100% 100%;
    animation: loader-tumble-roll var(--loader-tumble-t) infinite;
  }

  @keyframes loader-tumble-roll {
    0% {
      transform: translateX(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.55, 0, 0.45, 1);
    }
    72% {
      transform: translateX(-18px) rotate(90deg);
    }
    /* Landing squash; after the quarter turn the block's own x is the screen's y. */
    82% {
      transform: translateX(-18px) rotate(90deg) scale(0.92, 1.06);
    }
    100% {
      transform: translateX(-18px) rotate(90deg);
    }
  }

  @keyframes loader-tumble-floor {
    0% {
      transform: translateX(0);
      animation-timing-function: cubic-bezier(0.55, 0, 0.45, 1);
    }
    72%,
    100% {
      transform: translateX(-18px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-tumble__block,
    .loader-tumble::after {
      animation: none;
    }
  }
`;
export function TumbleLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-tumble" role="status" aria-label="Loading">
        <span className="loader-tumble__block" aria-hidden="true" />
      </div>
    </>
  );
}
