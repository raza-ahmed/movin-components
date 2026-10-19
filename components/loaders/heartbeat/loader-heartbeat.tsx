"use client";

const css = `
  /* Drawn at 1:1 so the dot's offset-path and the SVG share coordinates. */
  .loader-heartbeat {
    --loader-heartbeat-t: 1.8s;
    position: relative;
    display: inline-block;
    width: 100px;
    height: 40px;
    mask-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 1) 18%, rgba(0, 0, 0, 1) 82%, transparent);
  }

  .loader-heartbeat svg {
    display: block;
    width: 100px;
    height: 40px;
    overflow: visible;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .loader-heartbeat__track {
    stroke: #282828;
    stroke-width: 1.5;
  }

  /* The tail is 34 long and the head 10, both ending at the same point. */
  .loader-heartbeat__tail {
    stroke: #7c7c7c;
    stroke-width: 2;
    stroke-dasharray: 34 66;
    animation: loader-heartbeat-tail var(--loader-heartbeat-t) linear infinite;
  }

  .loader-heartbeat__head {
    stroke: #f6f6f6;
    stroke-width: 2.2;
    stroke-dasharray: 10 90;
    stroke-dashoffset: -24;
    animation: loader-heartbeat-head var(--loader-heartbeat-t) linear infinite;
  }

  .loader-heartbeat__dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #f6f6f6;
    box-shadow: 0 0 8px 1px rgba(246, 246, 246, 0.7);
    offset-path: path('M0 22H32L35 15L39 30L44 5L49 34L53 22H100');
    offset-anchor: 50% 50%;
    offset-rotate: 0deg;
    offset-distance: 34%;
    animation: loader-heartbeat-dot var(--loader-heartbeat-t) linear infinite;
  }

  @keyframes loader-heartbeat-tail {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -100;
    }
  }

  @keyframes loader-heartbeat-head {
    from {
      stroke-dashoffset: -24;
    }
    to {
      stroke-dashoffset: -124;
    }
  }

  /* The dot leads the trace: it starts 34% in, reaches the end at 66% of the
     loop, wraps to the start (under the faded edge) and carries on. */
  @keyframes loader-heartbeat-dot {
    0% {
      offset-distance: 34%;
    }
    66% {
      offset-distance: 100%;
    }
    66.01% {
      offset-distance: 0%;
    }
    100% {
      offset-distance: 34%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-heartbeat__tail,
    .loader-heartbeat__head,
    .loader-heartbeat__dot {
      animation: none;
    }
  }
`;
// Also the dot's offset-path in the CSS; keep the two in step.
const TRACE = 'M0 22H32L35 15L39 30L44 5L49 34L53 22H100';

export function HeartbeatLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-heartbeat" role="status" aria-label="Loading">
        <svg viewBox="0 0 100 40" aria-hidden="true">
          <path className="loader-heartbeat__track" d={TRACE} />
          <path className="loader-heartbeat__tail" pathLength={100} d={TRACE} />
          <path className="loader-heartbeat__head" pathLength={100} d={TRACE} />
        </svg>
        <span className="loader-heartbeat__dot" aria-hidden="true" />
      </div>
    </>
  );
}
