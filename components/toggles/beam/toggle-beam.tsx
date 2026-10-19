"use client";

const css = `
  .toggle-beam {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .toggle-beam__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* Machined hilt: a metal gradient with grip ridges and a wider emitter. */
  .toggle-beam__hilt {
    position: relative;
    width: 54px;
    height: 14px;
    border-radius: 3px 2px 2px 3px;
    background:
      repeating-linear-gradient(90deg, transparent 0 4px, rgba(17, 17, 17, 0.35) 4px 5px) 4px 0 / 24px 100% no-repeat,
      linear-gradient(#7c7c7c, #ededed 35%, #a7a7a7 60%, #4d4d4d);
  }

  .toggle-beam__hilt::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 18px;
    border-radius: 2px;
    background: linear-gradient(#4d4d4d, #c9c9c9 40%, #3a3a3a);
  }

  .toggle-beam__button {
    position: absolute;
    top: -3px;
    left: 34px;
    width: 6px;
    height: 4px;
    border-radius: 2px 2px 0 0;
    background: #4d4d4d;
    transition: background-color 0.2s, box-shadow 0.3s;
  }

  .toggle-beam__input:focus-visible + .toggle-beam__hilt {
    outline: 2px solid #a7a7a7;
    outline-offset: 4px;
  }

  /* The blade grows from the emitter; it retracts faster than it extends. */
  .toggle-beam__blade {
    width: 104px;
    height: 7px;
    margin-left: 1px;
    border-radius: 1px 4px 4px 1px;
    background: #f6f6f6;
    box-shadow: 0 0 4px 1px rgba(246, 246, 246, 0.9), 0 0 14px 4px rgba(201, 201, 201, 0.45), 0 0 28px 8px rgba(201, 201, 201, 0.15);
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.22s cubic-bezier(0.6, 0, 1, 0.6);
  }

  .toggle-beam__input:checked ~ .toggle-beam__blade {
    transform: scaleX(1);
    transition: transform 0.38s cubic-bezier(0.15, 0.85, 0.3, 1.05);
    animation: toggle-beam-hum 0.12s steps(2) 0.4s infinite;
  }

  .toggle-beam__input:checked + .toggle-beam__hilt .toggle-beam__button {
    background: #f6f6f6;
    box-shadow: 0 0 6px 1px rgba(246, 246, 246, 0.7);
  }

  @keyframes toggle-beam-hum {
    50% {
      opacity: 0.92;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-beam__blade,
    .toggle-beam__input:checked ~ .toggle-beam__blade {
      transition: none;
      animation: none;
    }
  }
`;
export function BeamToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-beam">
        <input className="toggle-beam__input" type="checkbox" role="switch" aria-label="Beam" />
        <span className="toggle-beam__hilt" aria-hidden="true"><span className="toggle-beam__button" /></span>
        <span className="toggle-beam__blade" aria-hidden="true" />
      </label>
    </>
  );
}
