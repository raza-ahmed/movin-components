"use client";

const css = `
  .loader-cradle {
    --loader-cradle-t: 1.2s;
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    width: 84px;
    height: 56px;
    padding-top: 4px;
    box-sizing: border-box;
  }

  .loader-cradle__bar {
    position: absolute;
    top: 2px;
    left: 6px;
    right: 6px;
    height: 2px;
    border-radius: 1px;
    background: light-dark(#cbced3, #393c41);
  }

  /* Each ball hangs from a string drawn by ::before; it pivots at the bar. */
  .loader-cradle__ball {
    position: relative;
    width: 14px;
    height: 46px;
    transform-origin: 50% 0;
  }

  .loader-cradle__ball::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 33px;
    background: light-dark(#cbced3, #393c41);
  }

  .loader-cradle__ball::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2) 70%);
  }

  /* The first swings out for the first half, the last for the second. Ease-out
     on the way up and ease-in on the way down, like gravity. */
  .loader-cradle__ball:nth-child(2) {
    animation: loader-cradle-left var(--loader-cradle-t) infinite;
  }

  .loader-cradle__ball:last-child {
    animation: loader-cradle-right var(--loader-cradle-t) infinite;
  }

  @keyframes loader-cradle-left {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1);
    }
    25% {
      transform: rotate(38deg);
      animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4);
    }
    50%,
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes loader-cradle-right {
    0%,
    50% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1);
    }
    75% {
      transform: rotate(-38deg);
      animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-cradle__ball:nth-child(2),
    .loader-cradle__ball:last-child {
      animation: none;
    }
  }
`;
export function NewtonsCradleLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-cradle" role="status" aria-label="Loading">
        <span className="loader-cradle__bar" aria-hidden="true" />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="loader-cradle__ball" aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
