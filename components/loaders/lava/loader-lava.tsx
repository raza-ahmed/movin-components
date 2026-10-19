"use client";

const css = `
  .loader-lava {
    --loader-lava-t: 5s;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 40px;
    height: 72px;
    overflow: hidden;
    border: 2px solid #4d4d4d;
    border-radius: 20px;
    isolation: isolate;
  }

  /* Blur the wax, then crank the contrast: soft overlaps snap back into hard
     edges, so blobs that touch melt into one. The layer overhangs the glass so
     its blurred rim is clipped away. */
  .loader-lava__wax {
    position: absolute;
    inset: -8px;
    background: #111111;
    filter: blur(4px) contrast(14);
  }

  /* The filter turns the wax pure white; this tints it from light to grey. */
  .loader-lava::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(#c9c9c9, #7c7c7c);
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .loader-lava__pool,
  .loader-lava__blob {
    position: absolute;
    border-radius: 50%;
    background: #ededed;
  }

  .loader-lava__pool {
    bottom: 0;
    left: 0;
    right: 0;
    height: 22px;
    border-radius: 40% 40% 0 0;
  }

  .loader-lava__blob {
    bottom: 14px;
    width: 16px;
    height: 16px;
    animation: loader-lava-rise var(--loader-lava-t) ease-in-out infinite;
  }

  .loader-lava__blob:nth-child(2) {
    left: 14px;
  }

  .loader-lava__blob:nth-child(3) {
    left: 26px;
    width: 12px;
    height: 12px;
    animation-duration: calc(var(--loader-lava-t) * 1.3);
    animation-delay: calc(var(--loader-lava-t) * -0.4);
  }

  .loader-lava__blob:nth-child(4) {
    left: 10px;
    width: 11px;
    height: 11px;
    animation-duration: calc(var(--loader-lava-t) * 0.85);
    animation-delay: calc(var(--loader-lava-t) * -0.7);
  }

  .loader-lava__blob:nth-child(5) {
    left: 20px;
    width: 14px;
    height: 14px;
    animation-duration: calc(var(--loader-lava-t) * 1.15);
    animation-delay: calc(var(--loader-lava-t) * -0.2);
  }

  /* Up out of the pool, stretching as it lifts off, rounding out at the top,
     then sinking back in. */
  @keyframes loader-lava-rise {
    0%,
    100% {
      transform: translateY(0) scale(1, 1);
    }
    15% {
      transform: translateY(-8px) scale(0.85, 1.3);
    }
    50% {
      transform: translateY(-50px) scale(1.1, 0.95);
    }
    80% {
      transform: translateY(-14px) scale(0.9, 1.15);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-lava__blob {
      animation: none;
    }
    .loader-lava__blob:nth-child(3) {
      transform: translateY(-40px);
    }
  }
`;
export function LavaLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-lava" role="status" aria-label="Loading">
        <div className="loader-lava__wax" aria-hidden="true">
          <span className="loader-lava__pool" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="loader-lava__blob" />
          ))}
        </div>
      </div>
    </>
  );
}
