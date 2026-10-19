"use client";

const css = `
  .loader-atom {
    --loader-atom-t: 1.4s;
    position: relative;
    display: inline-block;
    width: 72px;
    height: 72px;
  }

  /* Nucleus. */
  .loader-atom::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 9px;
    height: 9px;
    margin: -4.5px 0 0 -4.5px;
    border-radius: 50%;
    background: #f6f6f6;
    box-shadow: 0 0 10px 2px rgba(246, 246, 246, 0.35);
  }

  /* Each orbit is a 72px box turned to its tilt; the ring is its ::before and
     the electron follows the same ellipse (centre 36,36, radii 32 x 11). */
  .loader-atom__orbit {
    position: absolute;
    inset: 0;
  }

  .loader-atom__orbit:nth-child(2) {
    transform: rotate(60deg);
  }

  .loader-atom__orbit:nth-child(3) {
    transform: rotate(120deg);
  }

  .loader-atom__orbit::before {
    content: '';
    position: absolute;
    top: 25px;
    left: 4px;
    width: 64px;
    height: 22px;
    box-sizing: border-box;
    border: 1px solid #3a3a3a;
    border-radius: 50%;
  }

  .loader-atom__electron {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ededed;
    offset-path: path('M4 36A32 11 0 1 1 68 36A32 11 0 1 1 4 36');
    offset-anchor: 50% 50%;
    offset-rotate: 0deg;
    animation: loader-atom-orbit var(--loader-atom-t) linear infinite;
  }

  .loader-atom__orbit:nth-child(2) .loader-atom__electron {
    animation-duration: calc(var(--loader-atom-t) * 1.3);
    animation-delay: calc(var(--loader-atom-t) * -0.4);
  }

  .loader-atom__orbit:nth-child(3) .loader-atom__electron {
    animation-duration: calc(var(--loader-atom-t) * 1.6);
    animation-delay: calc(var(--loader-atom-t) * -0.9);
  }

  @keyframes loader-atom-orbit {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-atom__electron {
      animation: none;
    }
    .loader-atom__orbit:nth-child(2) .loader-atom__electron {
      offset-distance: 33%;
    }
    .loader-atom__orbit:nth-child(3) .loader-atom__electron {
      offset-distance: 66%;
    }
  }
`;
export function AtomLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-atom" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span key={i} className="loader-atom__orbit" aria-hidden="true">
            <span className="loader-atom__electron" />
          </span>
        ))}
      </div>
    </>
  );
}
