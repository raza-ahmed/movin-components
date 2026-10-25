"use client";

const css = `
  .card-envelope {
    display: inline-block;
    padding-top: 74px;
    outline: none;
    cursor: pointer;
  }

  .card-envelope__body {
    position: relative;
    width: 180px;
    height: 112px;
  }

  .card-envelope__back {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: light-dark(#dbdde1, #2e3035);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  }

  .card-envelope__letter {
    position: absolute;
    top: 8px;
    right: 10px;
    left: 10px;
    z-index: 1;
    box-sizing: border-box;
    height: 96px;
    padding: 12px 12px 0;
    border-radius: 4px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-envelope__title {
    color: light-dark(#fbfcfd, #121417);
    font-size: 14px;
    font-weight: 600;
  }

  .card-envelope__text {
    margin-top: 3px;
    color: light-dark(#cbced3, #393c41);
    font-size: 11px;
  }

  /* The pocket: a V cut out of its top edge shows the letter inside. */
  .card-envelope__front {
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: 6px;
    background: linear-gradient(to top, light-dark(#5f626a, #a7abb2), light-dark(#50535b, #c6c8cd));
    clip-path: polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%);
  }

  /* Closed it sits over the letter; once past edge-on it drops behind it. */
  .card-envelope__flap {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 3;
    height: 64px;
    transform: perspective(600px) rotateX(0deg);
    transform-origin: 50% 0;
    transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1) 0.3s, z-index 0s 0.52s;
  }

  .card-envelope__flap::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, light-dark(#42454c, #e5e6e9), light-dark(#50535b, #c6c8cd));
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }

  .card-envelope__seal {
    position: absolute;
    bottom: 4px;
    left: 50%;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, light-dark(#cbced3, #393c41), light-dark(#fbfcfd, #121417));
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    transition: opacity 0.2s 0.4s;
  }

  .card-envelope:hover .card-envelope__flap,
  .card-envelope:focus-visible .card-envelope__flap {
    z-index: 0;
    transform: perspective(600px) rotateX(180deg);
    transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s 0.22s;
  }

  .card-envelope:hover .card-envelope__seal,
  .card-envelope:focus-visible .card-envelope__seal {
    opacity: 0;
    transition-delay: 0.1s;
  }

  .card-envelope:hover .card-envelope__letter,
  .card-envelope:focus-visible .card-envelope__letter {
    transform: translateY(-66px);
    transition: transform 0.6s cubic-bezier(0.3, 1.3, 0.5, 1) 0.35s;
  }

  .card-envelope:focus-visible .card-envelope__back {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    .card-envelope *,
    .card-envelope *::before {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  }
`;
// Pure CSS: the flap swings open (and drops behind the letter once past
// edge-on, via a delayed z-index), then the letter rises out of the pocket.
export function EnvelopeCard() {
  return (
    <>
      <style>{css}</style>
      <div className="card-envelope" tabIndex={0}>
        <div className="card-envelope__body">
          <div className="card-envelope__back" aria-hidden="true" />
          <div className="card-envelope__letter">
            <div className="card-envelope__title">You're invited</div>
            <div className="card-envelope__text">Friday, 8 pm at the Loft</div>
          </div>
          <div className="card-envelope__front" aria-hidden="true" />
          <div className="card-envelope__flap" aria-hidden="true">
            <span className="card-envelope__seal" />
          </div>
        </div>
      </div>
    </>
  );
}
