"use client";

const css = `
  .toggle-rotary {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-rotary__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-rotary__dial {
    position: relative;
    display: block;
    width: 84px;
    height: 84px;
    border-radius: 50%;
  }

  .toggle-rotary__input:focus-visible + .toggle-rotary__dial {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  /* A quarter of the ring, from up-left (OFF) round the top to up-right (ON). */
  .toggle-rotary__arc {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-135deg);
  }

  .toggle-rotary__track,
  .toggle-rotary__fill {
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 58.1 232.5;
  }

  .toggle-rotary__track {
    stroke: #3a3a3a;
  }

  .toggle-rotary__fill {
    stroke: #ededed;
    stroke-dashoffset: 58.1;
    transition: stroke-dashoffset 0.4s cubic-bezier(0.5, 0, 0.3, 1);
  }

  .toggle-rotary__mark {
    position: absolute;
    top: 0;
    color: #7c7c7c;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    transition: color 0.3s;
  }

  .toggle-rotary__mark--off {
    left: -6px;
    color: #c9c9c9;
  }

  .toggle-rotary__mark--on {
    right: -2px;
  }

  /* Knurled rim, a cap and a pointer; the whole knob turns. */
  .toggle-rotary__knob {
    position: absolute;
    inset: 16px;
    border-radius: 50%;
    background: repeating-conic-gradient(#3a3a3a 0 5deg, #7c7c7c 5deg 10deg);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.55);
    transform: rotate(-45deg);
    transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
  }

  .toggle-rotary__knob::before {
    content: '';
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 30%, #4d4d4d, #202020 75%);
    box-shadow: inset 0 1px 0 rgba(246, 246, 246, 0.12);
  }

  .toggle-rotary__knob::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 4px;
    height: 14px;
    margin-left: -2px;
    border-radius: 2px;
    background: #ededed;
  }

  .toggle-rotary__input:checked + .toggle-rotary__dial .toggle-rotary__knob {
    transform: rotate(45deg);
  }

  .toggle-rotary__input:checked + .toggle-rotary__dial .toggle-rotary__fill {
    stroke-dashoffset: 0;
  }

  .toggle-rotary__input:checked + .toggle-rotary__dial .toggle-rotary__mark--off {
    color: #7c7c7c;
  }

  .toggle-rotary__input:checked + .toggle-rotary__dial .toggle-rotary__mark--on {
    color: #f6f6f6;
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-rotary__knob,
    .toggle-rotary__fill,
    .toggle-rotary__mark {
      transition: none;
    }
  }
`;
export function RotaryToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-rotary">
        <input className="toggle-rotary__input" type="checkbox" role="switch" />
        <span className="toggle-rotary__dial" aria-hidden="true">
          <svg className="toggle-rotary__arc" viewBox="0 0 84 84" fill="none">
            <circle className="toggle-rotary__track" cx="42" cy="42" r="37" />
            <circle className="toggle-rotary__fill" cx="42" cy="42" r="37" />
          </svg>
          <span className="toggle-rotary__mark toggle-rotary__mark--off">OFF</span>
          <span className="toggle-rotary__mark toggle-rotary__mark--on">ON</span>
          <span className="toggle-rotary__knob" />
        </span>
        <span className="toggle-rotary__label">Heat</span>
      </label>
    </>
  );
}
