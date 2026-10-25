"use client";

const css = `
  /* The moon is drawn in the sky's colour: set --loader-eclipse-sky to your
     page background. */
  .loader-eclipse {
    --loader-eclipse-t: 3.2s;
    --loader-eclipse-sky: light-dark(#fbfcfd, #121417);
    position: relative;
    display: inline-block;
    width: 76px;
    height: 76px;
    overflow: hidden;
    border-radius: 50%;
  }

  .loader-eclipse__sun,
  .loader-eclipse__moon {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
  }

  .loader-eclipse__sun {
    width: 32px;
    height: 32px;
    margin: -16px 0 0 -16px;
    background: radial-gradient(circle at 40% 35%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
    box-shadow: 0 0 12px 2px light-dark(rgba(66, 69, 76, 0.25), rgba(229, 230, 233, 0.25));
  }

  /* The corona: a soft halo that only flares while the sun is covered. */
  .loader-eclipse__sun::before {
    content: '';
    position: absolute;
    inset: -14px;
    border-radius: 50%;
    background: radial-gradient(circle, light-dark(rgba(55, 58, 64, 0.6), rgba(241, 242, 243, 0.6)) 45%, light-dark(rgba(55, 58, 64, 0.15), rgba(241, 242, 243, 0.15)) 60%, light-dark(rgba(55, 58, 64, 0), rgba(241, 242, 243, 0)) 72%);
    opacity: 0;
    animation: loader-eclipse-corona var(--loader-eclipse-t) ease-in-out infinite;
  }

  .loader-eclipse__moon {
    width: 33px;
    height: 33px;
    margin: -16.5px 0 0 -16.5px;
    background: var(--loader-eclipse-sky);
    animation: loader-eclipse-pass var(--loader-eclipse-t) linear infinite;
  }

  /* Fast at the edges, slow across the face. */
  @keyframes loader-eclipse-pass {
    0% {
      transform: translateX(-52px);
    }
    38% {
      transform: translateX(-7px);
    }
    62% {
      transform: translateX(7px);
    }
    100% {
      transform: translateX(52px);
    }
  }

  @keyframes loader-eclipse-corona {
    0%,
    38% {
      opacity: 0;
      transform: scale(0.85);
    }
    50% {
      opacity: 1;
      transform: scale(1.12);
    }
    62%,
    100% {
      opacity: 0;
      transform: scale(0.85);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-eclipse__moon,
    .loader-eclipse__sun::before {
      animation: none;
    }
    .loader-eclipse__moon {
      transform: translateX(-12px);
    }
  }
`;
export function EclipseLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-eclipse" role="status" aria-label="Loading">
        <span className="loader-eclipse__sun" aria-hidden="true" />
        <span className="loader-eclipse__moon" aria-hidden="true" />
      </div>
    </>
  );
}
