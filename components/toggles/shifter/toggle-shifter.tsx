"use client";

const css = `
  .toggle-shifter {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-shifter__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-shifter__plate {
    position: relative;
    display: block;
    width: 84px;
    height: 100px;
    border-radius: 16px;
    background: linear-gradient(#282828, #202020);
    box-shadow: inset 0 0 0 1px #3a3a3a, 0 8px 16px rgba(0, 0, 0, 0.45);
  }

  .toggle-shifter__input:focus-visible + .toggle-shifter__plate {
    outline: 2px solid #a7a7a7;
    outline-offset: 3px;
  }

  .toggle-shifter__gate {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .toggle-shifter__gate path {
    stroke: #111111;
    stroke-width: 12;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .toggle-shifter__gear {
    position: absolute;
    color: #7c7c7c;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    transition: color 0.3s, text-shadow 0.3s;
  }

  .toggle-shifter__gear--p {
    top: 16px;
    left: 40px;
    color: #ededed;
  }

  .toggle-shifter__gear--d {
    top: 72px;
    left: 34px;
  }

  /* The knob rides the same path the groove is drawn from. */
  .toggle-shifter__knob {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle at 36% 30%, #ededed, #7c7c7c 45%, #282828 90%);
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.6);
    offset-path: path('M24 22V50H60V78');
    offset-rotate: 0deg;
    offset-distance: 0%;
    transition: offset-distance 0.75s cubic-bezier(0.6, 0, 0.25, 1);
  }

  .toggle-shifter__input:checked + .toggle-shifter__plate .toggle-shifter__knob {
    offset-distance: 100%;
  }

  .toggle-shifter__input:checked + .toggle-shifter__plate .toggle-shifter__gear--p {
    color: #7c7c7c;
  }

  .toggle-shifter__input:checked + .toggle-shifter__plate .toggle-shifter__gear--d {
    color: #f6f6f6;
    text-shadow: 0 0 8px rgba(246, 246, 246, 0.7);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-shifter__knob,
    .toggle-shifter__gear {
      transition: none;
    }
  }
`;
export function ShifterToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-shifter">
        <input className="toggle-shifter__input" type="checkbox" role="switch" />
        <span className="toggle-shifter__plate" aria-hidden="true">
          <svg className="toggle-shifter__gate" viewBox="0 0 84 100" fill="none">
            <path d="M24 22V50H60V78" />
          </svg>
          <span className="toggle-shifter__gear toggle-shifter__gear--p">P</span>
          <span className="toggle-shifter__gear toggle-shifter__gear--d">D</span>
          <span className="toggle-shifter__knob" />
        </span>
        <span className="toggle-shifter__label">Drive</span>
      </label>
    </>
  );
}
