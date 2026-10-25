"use client";

const css = `
  .loader-hourglass {
    --loader-hourglass-t: 3s;
    display: inline-grid;
    place-items: center;
    width: 64px;
    height: 64px;
  }

  /* One 40x56 glass. Sand pours for 80% of the loop, then the whole glass
     flips; a turned glass with a full bottom looks exactly like an upright one
     with a full top, so the loop restarts without a jump. */
  .loader-hourglass__glass {
    position: relative;
    width: 40px;
    height: 56px;
    animation: loader-hourglass-flip var(--loader-hourglass-t) cubic-bezier(0.5, 0, 0.3, 1) infinite;
  }

  .loader-hourglass__glass svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    fill: none;
    stroke: light-dark(#5f626a, #a7abb2);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* Each bulb clips its sand to the funnel shape. */
  .loader-hourglass__bulb {
    position: absolute;
    left: 10px;
    width: 20px;
    height: 21px;
    overflow: hidden;
  }

  .loader-hourglass__bulb--top {
    top: 7px;
    clip-path: polygon(0 0, 100% 0, 98% 22%, 58% 100%, 42% 100%, 2% 22%);
  }

  .loader-hourglass__bulb--bottom {
    top: 28px;
    clip-path: polygon(42% 0, 58% 0, 98% 78%, 100% 100%, 0 100%, 2% 78%);
  }

  .loader-hourglass__sand {
    position: absolute;
    inset: 0;
    background: light-dark(#42454c, #e5e6e9);
    transform-origin: 50% 100%;
  }

  .loader-hourglass__bulb--top .loader-hourglass__sand {
    animation: loader-hourglass-drain var(--loader-hourglass-t) linear infinite;
  }

  .loader-hourglass__bulb--bottom .loader-hourglass__sand {
    border-radius: 50% 50% 0 0 / 30% 30% 0 0;
    animation: loader-hourglass-fill var(--loader-hourglass-t) linear infinite;
  }

  .loader-hourglass__stream {
    position: absolute;
    top: 27px;
    left: 19.25px;
    width: 1.5px;
    height: 22px;
    background: light-dark(#42454c, #e5e6e9);
    transform-origin: 50% 0;
    animation: loader-hourglass-stream var(--loader-hourglass-t) linear infinite;
  }

  @keyframes loader-hourglass-drain {
    0% {
      transform: scaleY(1);
    }
    78%,
    100% {
      transform: scaleY(0);
    }
  }

  @keyframes loader-hourglass-fill {
    0% {
      transform: scaleY(0);
    }
    80%,
    100% {
      transform: scaleY(1);
    }
  }

  @keyframes loader-hourglass-stream {
    0% {
      transform: scaleY(0);
    }
    4%,
    76% {
      transform: scaleY(1);
      opacity: 1;
    }
    80%,
    100% {
      transform: scaleY(1);
      opacity: 0;
    }
  }

  @keyframes loader-hourglass-flip {
    0%,
    80% {
      transform: rotate(0deg);
    }
    93% {
      transform: rotate(192deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  /* Reduced motion: a still glass, half poured. */
  @media (prefers-reduced-motion: reduce) {
    .loader-hourglass__glass,
    .loader-hourglass__sand,
    .loader-hourglass__bulb--top .loader-hourglass__sand,
    .loader-hourglass__bulb--bottom .loader-hourglass__sand,
    .loader-hourglass__stream {
      animation: none;
    }
    .loader-hourglass__sand {
      transform: scaleY(0.5);
    }
  }
`;
export function HourglassLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-hourglass" role="status" aria-label="Loading">
        <div className="loader-hourglass__glass" aria-hidden="true">
          <span className="loader-hourglass__bulb loader-hourglass__bulb--top">
            <span className="loader-hourglass__sand" />
          </span>
          <span className="loader-hourglass__stream" />
          <span className="loader-hourglass__bulb loader-hourglass__bulb--bottom">
            <span className="loader-hourglass__sand" />
          </span>
          <svg viewBox="0 0 40 56">
            <path d="M9 6h22c0 10-9 15-9 22 0 7 9 12 9 22H9c0-10 9-15 9-22 0-7-9-12-9-22Z" />
            <path d="M5 4.5h30M5 51.5h30" />
          </svg>
        </div>
      </div>
    </>
  );
}
