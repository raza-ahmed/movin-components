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
      repeating-linear-gradient(90deg, transparent 0 4px, light-dark(rgba(251, 252, 253, 0.35), rgba(18, 20, 23, 0.35)) 4px 5px) 4px 0 / 24px 100% no-repeat,
      linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#42454c, #e5e6e9) 35%, light-dark(#5f626a, #a7abb2) 60%, light-dark(#cbced3, #393c41));
  }

  .toggle-beam__hilt::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 18px;
    border-radius: 2px;
    background: linear-gradient(light-dark(#cbced3, #393c41), light-dark(#50535b, #c6c8cd) 40%, light-dark(#dbdde1, #2e3035));
  }

  .toggle-beam__button {
    position: absolute;
    top: -3px;
    left: 34px;
    width: 6px;
    height: 4px;
    border-radius: 2px 2px 0 0;
    background: light-dark(#cbced3, #393c41);
    transition: background-color 0.2s, box-shadow 0.3s;
  }

  .toggle-beam__input:focus-visible + .toggle-beam__hilt {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 4px;
  }

  /* The blade grows from the emitter; it retracts faster than it extends. */
  .toggle-beam__blade {
    width: 104px;
    height: 7px;
    margin-left: 1px;
    border-radius: 1px 4px 4px 1px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 4px 1px light-dark(rgba(55, 58, 64, 0.9), rgba(241, 242, 243, 0.9)), 0 0 14px 4px light-dark(rgba(80, 83, 91, 0.45), rgba(198, 200, 205, 0.45)), 0 0 28px 8px light-dark(rgba(80, 83, 91, 0.15), rgba(198, 200, 205, 0.15));
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
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 6px 1px light-dark(rgba(55, 58, 64, 0.7), rgba(241, 242, 243, 0.7));
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
