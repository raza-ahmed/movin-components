"use client";

const css = `
  .toggle-sleep {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-sleep__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-sleep__track {
    position: relative;
    display: block;
    width: 64px;
    height: 34px;
    border-radius: 9999px;
    background: #4d4d4d;
    transition: background-color 0.4s;
  }

  /* Two stars that come out at night. */
  .toggle-sleep__track::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at 14px 11px, #ededed 0 1px, transparent 1.5px), radial-gradient(circle at 24px 22px, #a7a7a7 0 1px, transparent 1.5px);
    opacity: 0;
    transition: opacity 0.4s;
  }

  .toggle-sleep__input:focus-visible + .toggle-sleep__track {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .toggle-sleep__thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #ededed;
    transition: transform 0.4s cubic-bezier(0.3, 1.3, 0.5, 1);
  }

  .toggle-sleep__thumb svg {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 16px;
    height: 16px;
    transition: transform 0.4s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.2s;
  }

  .toggle-sleep__bell {
    fill: none;
    stroke: #4d4d4d;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform-origin: 50% 20%;
  }

  .toggle-sleep__moon {
    fill: #111111;
    opacity: 0;
    transform: rotate(-90deg) scale(0.4);
  }

  .toggle-sleep__input:checked + .toggle-sleep__track {
    background: #111111;
    box-shadow: inset 0 0 0 1px #3a3a3a;
  }

  .toggle-sleep__input:checked + .toggle-sleep__track::before {
    opacity: 1;
  }

  .toggle-sleep__input:checked + .toggle-sleep__track .toggle-sleep__thumb {
    transform: translateX(30px);
  }

  .toggle-sleep__input:checked + .toggle-sleep__track .toggle-sleep__bell {
    opacity: 0;
    transform: rotate(70deg) scale(0.4);
  }

  .toggle-sleep__input:checked + .toggle-sleep__track .toggle-sleep__moon {
    opacity: 1;
    transform: none;
  }

  /* z's drift up and away from the moon, one after another, while it sleeps. */
  .toggle-sleep__z {
    position: absolute;
    top: 2px;
    right: 10px;
    color: #a7a7a7;
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
    opacity: 0;
  }

  .toggle-sleep__input:checked + .toggle-sleep__track .toggle-sleep__z {
    animation: toggle-sleep-z 2.4s ease-out 0.4s infinite;
  }

  .toggle-sleep__input:checked + .toggle-sleep__track .toggle-sleep__z:nth-child(2) {
    animation-delay: 1.2s;
  }

  .toggle-sleep__input:checked + .toggle-sleep__track .toggle-sleep__z:nth-child(3) {
    animation-delay: 2s;
  }

  @keyframes toggle-sleep-z {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0.6);
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(10px, -22px) scale(1.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-sleep__thumb,
    .toggle-sleep__thumb svg {
      transition: none;
    }
    .toggle-sleep__input:checked + .toggle-sleep__track .toggle-sleep__z {
      animation: none;
    }
  }
`;
export function SleepToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-sleep">
        <input className="toggle-sleep__input" type="checkbox" role="switch" />
        <span className="toggle-sleep__track" aria-hidden="true">
          <span className="toggle-sleep__z">z</span>
          <span className="toggle-sleep__z">z</span>
          <span className="toggle-sleep__z">z</span>
          <span className="toggle-sleep__thumb">
            <svg className="toggle-sleep__bell" viewBox="0 0 24 24"><path d="M12 4.5A5 5 0 0 0 7 9.5v3L5.5 15.5h13L17 12.5v-3a5 5 0 0 0-5-5ZM10 18a2 2 0 0 0 4 0" /></svg>
            <svg className="toggle-sleep__moon" viewBox="0 0 24 24"><path d="M15 4.5a7.5 7.5 0 1 0 4.5 13.5A6 6 0 0 1 15 4.5Z" /></svg>
          </span>
        </span>
        <span className="toggle-sleep__label">Do not disturb</span>
      </label>
    </>
  );
}
