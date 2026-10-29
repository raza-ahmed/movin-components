"use client";

const css = `
  .card-pop-out {
    position: relative;
    width: 180px;
    height: 196px;
    perspective: 700px;
    cursor: pointer;
  }
  .card-pop-out:focus-visible { outline: none; }
  .card-pop-out__frame {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 168px;
    border-radius: 16px;
    background: radial-gradient(circle at 50% 30%, light-dark(#dbdde1, #2e3035), light-dark(#f3f4f7, #1a1c1f) 70%);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transform-origin: 50% 100%;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  /* Stars on the frame's backdrop. */
  .card-pop-out__frame::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(1px 1px at 20% 25%, light-dark(#50535b, #c6c8cd), transparent),
      radial-gradient(1px 1px at 75% 18%, light-dark(#50535b, #c6c8cd), transparent),
      radial-gradient(1.5px 1.5px at 60% 40%, light-dark(#42454c, #e5e6e9), transparent),
      radial-gradient(1px 1px at 32% 52%, light-dark(#5f626a, #a7abb2), transparent);
  }
  /* The subject: a ringed planet sitting in the frame. It is NOT clipped by it, so it can leave. */
  .card-pop-out__planet {
    position: absolute;
    left: 50%;
    top: 58px;
    width: 76px;
    height: 76px;
    margin-left: -38px;
    border-radius: 50%;
    background: radial-gradient(circle at 34% 30%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2) 55%, light-dark(#dbdde1, #2e3035));
    box-shadow: inset -10px -8px 18px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45));
    transition: transform 0.6s cubic-bezier(0.34, 1.45, 0.64, 1), filter 0.6s ease;
  }
  .card-pop-out__planet::before {
    content: '';
    position: absolute;
    left: -26px;
    right: -26px;
    top: 30px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid light-dark(#50535b, #c6c8cd);
    border-top-color: transparent;
    transform: rotate(-14deg);
  }
  .card-pop-out__info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 14px;
    border-radius: 0 0 16px 16px;
    background: linear-gradient(transparent, light-dark(#f3f4f7, #1a1c1f) 40%);
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .card-pop-out__info b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-pop-out__info span { color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .card-pop-out:hover .card-pop-out__frame,
  .card-pop-out:focus-visible .card-pop-out__frame { transform: rotateX(16deg) scale(0.96); }
  .card-pop-out:hover .card-pop-out__planet,
  .card-pop-out:focus-visible .card-pop-out__planet {
    transform: translateY(-58px) scale(1.18);
    filter: drop-shadow(0 18px 18px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)));
  }
  .card-pop-out:hover .card-pop-out__info { transform: translateY(2px); }
  @media (prefers-reduced-motion: reduce) {
    .card-pop-out__frame, .card-pop-out__planet, .card-pop-out__info { transition-duration: 0.01s; }
  }
`;

export function PopOutCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-pop-out" tabIndex={0} role="group" aria-label="Saturn, 1.4 billion km">
        <div className="card-pop-out__frame" aria-hidden="true" />
        <div className="card-pop-out__planet" aria-hidden="true" />
        <div className="card-pop-out__info">
          <b>Saturn</b>
          <span>1.4 billion km away</span>
        </div>
      </div>
    </>
  );
}
