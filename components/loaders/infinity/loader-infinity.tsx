"use client";

const css = `
  .loader-infinity {
    --loader-infinity-t: 1.6s;
    display: inline-block;
    width: 72px;
    height: 36px;
  }

  .loader-infinity svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    fill: none;
    stroke-linecap: round;
    stroke-width: 3;
  }

  .loader-infinity__track {
    stroke: #282828;
  }

  /* The head starts 20 units further along than the 34-unit tail, so it
     always sits at the tail's leading end. */
  .loader-infinity__tail {
    stroke: #7c7c7c;
    stroke-dasharray: 34 66;
    opacity: 0.6;
    animation: loader-infinity-tail var(--loader-infinity-t) linear infinite;
  }

  .loader-infinity__head {
    stroke: #f6f6f6;
    stroke-dasharray: 14 86;
    stroke-dashoffset: -20;
    animation: loader-infinity-head var(--loader-infinity-t) linear infinite;
  }

  @keyframes loader-infinity-tail {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -100;
    }
  }

  @keyframes loader-infinity-head {
    from {
      stroke-dashoffset: -20;
    }
    to {
      stroke-dashoffset: -120;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-infinity__tail,
    .loader-infinity__head {
      animation: none;
    }
  }
`;
const PATH = 'M32 16C26 8 20 4 14 4 7.4 4 2 9.4 2 16s5.4 12 12 12c6 0 12-4 18-12s12-12 18-12c6.6 0 12 5.4 12 12s-5.4 12-12 12c-6 0-12-4-18-12Z';

export function InfinityLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-infinity" role="status" aria-label="Loading">
        <svg viewBox="0 0 64 32" aria-hidden="true">
          <path className="loader-infinity__track" d={PATH} />
          <path className="loader-infinity__tail" pathLength={100} d={PATH} />
          <path className="loader-infinity__head" pathLength={100} d={PATH} />
        </svg>
      </div>
    </>
  );
}
