"use client";

const css = `
  .loader-stack {
    --loader-stack-t: 2.4s;
    position: relative;
    display: inline-block;
    width: 64px;
    height: 64px;
    overflow: hidden;
  }

  /* The shelf. */
  .loader-stack::after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 8px;
    right: 8px;
    height: 2px;
    border-radius: 1px;
    background: #4d4d4d;
  }

  .loader-stack__block {
    position: absolute;
    left: 50%;
    height: 11px;
    border-radius: 3px;
    transform-origin: 50% 100%;
    opacity: 0;
  }

  .loader-stack__block:nth-child(1) {
    bottom: 12px;
    width: 32px;
    margin-left: -16px;
    background: #ededed;
    animation: loader-stack-1 var(--loader-stack-t) infinite;
  }

  .loader-stack__block:nth-child(2) {
    bottom: 24px;
    width: 24px;
    margin-left: -12px;
    background: #c9c9c9;
    animation: loader-stack-2 var(--loader-stack-t) infinite;
  }

  .loader-stack__block:nth-child(3) {
    bottom: 36px;
    width: 16px;
    margin-left: -8px;
    background: #a7a7a7;
    animation: loader-stack-3 var(--loader-stack-t) infinite;
  }

  /* Drop (ease-in, like a fall), squash on landing, recoil, hold; everything
     leaves together at 78%. */
  @keyframes loader-stack-1 {
    0% {
      opacity: 0;
      transform: translateY(-48px);
      animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.5);
    }
    2% {
      opacity: 1;
    }
    12% {
      transform: translateY(0) scale(1.18, 0.7);
    }
    18% {
      transform: translateY(0) scale(0.95, 1.06);
    }
    23%,
    78% {
      opacity: 1;
      transform: none;
      animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.4);
    }
    92%,
    100% {
      opacity: 0;
      transform: translateX(40px);
    }
  }

  @keyframes loader-stack-2 {
    0%,
    20% {
      opacity: 0;
      transform: translateY(-48px);
      animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.5);
    }
    22% {
      opacity: 1;
    }
    32% {
      transform: translateY(0) scale(1.18, 0.7);
    }
    38% {
      transform: translateY(0) scale(0.95, 1.06);
    }
    43%,
    78% {
      opacity: 1;
      transform: none;
      animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.4);
    }
    92%,
    100% {
      opacity: 0;
      transform: translateX(40px);
    }
  }

  @keyframes loader-stack-3 {
    0%,
    40% {
      opacity: 0;
      transform: translateY(-48px);
      animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.5);
    }
    42% {
      opacity: 1;
    }
    52% {
      transform: translateY(0) scale(1.18, 0.7);
    }
    58% {
      transform: translateY(0) scale(0.95, 1.06);
    }
    63%,
    78% {
      opacity: 1;
      transform: none;
      animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.4);
    }
    92%,
    100% {
      opacity: 0;
      transform: translateX(40px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-stack__block:nth-child(n) {
      animation: none;
      opacity: 1;
    }
  }
`;
export function StackLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-stack" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span key={i} className="loader-stack__block" aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
