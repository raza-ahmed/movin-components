"use client";

const css = `
  .loader-segment {
    --loader-segment-t: 1.6s;
    position: relative;
    display: inline-block;
    width: 28px;
    height: 48px;
    filter: drop-shadow(0 0 3px rgba(237, 237, 237, 0.35));
  }

  .loader-segment__seg {
    position: absolute;
    background: #282828;
    animation: loader-segment-lit var(--loader-segment-t) linear infinite;
  }

  /* Horizontal bars and vertical bars, with pointed ends like a real LED digit. */
  .loader-segment__seg--a,
  .loader-segment__seg--g,
  .loader-segment__seg--d {
    left: 5.5px;
    width: 17px;
    height: 5px;
    clip-path: polygon(2.5px 0, calc(100% - 2.5px) 0, 100% 50%, calc(100% - 2.5px) 100%, 2.5px 100%, 0 50%);
  }

  .loader-segment__seg--b,
  .loader-segment__seg--c,
  .loader-segment__seg--e,
  .loader-segment__seg--f {
    width: 5px;
    height: 15.5px;
    clip-path: polygon(50% 0, 100% 2.5px, 100% calc(100% - 2.5px), 50% 100%, 0 calc(100% - 2.5px), 0 2.5px);
  }

  .loader-segment__seg--a {
    top: 0;
  }

  .loader-segment__seg--g {
    top: 21.5px;
  }

  .loader-segment__seg--d {
    top: 43px;
  }

  .loader-segment__seg--f,
  .loader-segment__seg--b {
    top: 5.5px;
  }

  .loader-segment__seg--e,
  .loader-segment__seg--c {
    top: 27px;
  }

  .loader-segment__seg--f,
  .loader-segment__seg--e {
    left: 0;
  }

  .loader-segment__seg--b,
  .loader-segment__seg--c {
    left: 23px;
  }

  /* Eight steps per loop in the order a b g e d c g f; each segment lights at
     its step (its delay) and fades over the next two. */
  .loader-segment__seg--a {
    animation-delay: calc(var(--loader-segment-t) * -1);
  }

  .loader-segment__seg--b {
    animation-delay: calc(var(--loader-segment-t) * -7 / 8);
  }

  .loader-segment__seg--e {
    animation-delay: calc(var(--loader-segment-t) * -5 / 8);
  }

  .loader-segment__seg--d {
    animation-delay: calc(var(--loader-segment-t) * -4 / 8);
  }

  .loader-segment__seg--c {
    animation-delay: calc(var(--loader-segment-t) * -3 / 8);
  }

  .loader-segment__seg--f {
    animation-delay: calc(var(--loader-segment-t) * -1 / 8);
  }

  .loader-segment__seg--g {
    animation-name: loader-segment-lit-twice;
    animation-delay: calc(var(--loader-segment-t) * -6 / 8);
  }

  @keyframes loader-segment-lit {
    0%,
    12.5% {
      background: #f6f6f6;
    }
    37.5%,
    100% {
      background: #282828;
    }
  }

  @keyframes loader-segment-lit-twice {
    0%,
    12.5%,
    50%,
    62.5% {
      background: #f6f6f6;
    }
    37.5%,
    87.5%,
    100% {
      background: #282828;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-segment__seg {
      animation: none;
      background: #4d4d4d;
    }
  }
`;
export function SegmentLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-segment" role="status" aria-label="Loading">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((s) => (
          <span key={s} className={`loader-segment__seg loader-segment__seg--${s}`} aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
