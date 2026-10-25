"use client";

const css = `
  .loader-battery {
    --loader-battery-t: 2.8s;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 46px;
    height: 24px;
    margin-right: 4px;
    border: 2px solid light-dark(#6d7179, #7d8087);
    border-radius: 6px;
    background: light-dark(#fbfcfd, #121417);
  }

  /* The terminal nub. */
  .loader-battery::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -6px;
    width: 3px;
    height: 9px;
    margin-top: -4.5px;
    border-radius: 0 2px 2px 0;
    background: light-dark(#6d7179, #7d8087);
  }

  /* One bar masked into four cells; its width steps a whole cell at a time. */
  .loader-battery__fill {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: 0;
    border-radius: 2px;
    background: light-dark(#42454c, #e5e6e9);
    mask-image: repeating-linear-gradient(90deg, rgba(0, 0, 0, 1) 0 8px, transparent 8px 9.333px);
    animation: loader-battery-charge var(--loader-battery-t) infinite;
  }

  /* Dark on a lit cell, invisible on an empty one. */
  .loader-battery__bolt {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 11px;
    height: 15px;
    margin: -7.5px 0 0 -5.5px;
    fill: light-dark(#fbfcfd, #121417);
  }

  @keyframes loader-battery-charge {
    0%,
    12% {
      width: 0;
    }
    14%,
    26% {
      width: 9.333px;
    }
    28%,
    40% {
      width: 18.667px;
    }
    42%,
    54% {
      width: 28px;
    }
    56%,
    64% {
      width: 36px;
      opacity: 1;
    }
    70% {
      opacity: 0.35;
    }
    76% {
      opacity: 1;
    }
    82% {
      opacity: 0.35;
    }
    88% {
      width: 36px;
      opacity: 1;
    }
    98%,
    100% {
      width: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-battery__fill {
      width: 18.667px;
      animation: none;
    }
  }
`;
export function BatteryLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-battery" role="status" aria-label="Loading">
        <span className="loader-battery__fill" aria-hidden="true" />
        <svg className="loader-battery__bolt" viewBox="0 0 12 16" aria-hidden="true">
          <path d="M7.5 1 2 9h4l-1.5 6L10 7H6l1.5-6Z" />
        </svg>
      </div>
    </>
  );
}
