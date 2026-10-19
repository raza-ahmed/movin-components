"use client";

const css = `
  .cb-strike-task {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .cb-strike-task__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .cb-strike-task__box {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    box-sizing: border-box;
    width: 22px;
    height: 22px;
    border: 2px solid #4d4d4d;
    border-radius: 6px;
    transition: background-color 0.25s, border-color 0.25s;
  }

  .cb-strike-task__input:focus-visible + .cb-strike-task__box {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .cb-strike-task__box svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: #111111;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cb-strike-task__tick,
  .cb-strike-task__pass {
    stroke-dasharray: 100 102;
    stroke-dashoffset: 101;
  }

  .cb-strike-task__tick {
    transition: stroke-dashoffset 0.2s ease-in;
  }

  .cb-strike-task__text {
    position: relative;
    transition: color 0.4s 0.15s;
  }

  .cb-strike-task__scribble {
    position: absolute;
    top: 50%;
    left: -4px;
    width: calc(100% + 8px);
    height: 12px;
    margin-top: -6px;
    overflow: visible;
    fill: none;
    stroke: #a7a7a7;
    stroke-width: 1.8;
    stroke-linecap: round;
    pointer-events: none;
  }

  /* Rubbing out: both passes retract together, fast. */
  .cb-strike-task__pass {
    vector-effect: non-scaling-stroke;
    transition: stroke-dashoffset 0.2s ease-in;
  }

  .cb-strike-task__input:checked + .cb-strike-task__box {
    border-color: #ededed;
    background: #ededed;
  }

  .cb-strike-task__input:checked + .cb-strike-task__box .cb-strike-task__tick {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.25s cubic-bezier(0.5, 0, 0.3, 1) 0.05s;
  }

  .cb-strike-task__input:checked ~ .cb-strike-task__text {
    color: #7c7c7c;
  }

  /* The pen goes out, then comes back. */
  .cb-strike-task__input:checked ~ .cb-strike-task__text .cb-strike-task__pass--out {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.35s cubic-bezier(0.5, 0, 0.3, 1) 0.2s;
  }

  .cb-strike-task__input:checked ~ .cb-strike-task__text .cb-strike-task__pass--back {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.3s cubic-bezier(0.5, 0, 0.3, 1) 0.5s;
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-strike-task *,
    .cb-strike-task__input:checked ~ * * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  }
`;
export function StrikeTaskCheckbox() {
  return (
    <>
      <style>{css}</style>
      <label className="cb-strike-task">
        <input className="cb-strike-task__input" type="checkbox" />
        <span className="cb-strike-task__box" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path className="cb-strike-task__tick" pathLength={100} d="M4.5 10.5l4 4 7-9" />
          </svg>
        </span>
        <span className="cb-strike-task__text">
          Water the plants
          <svg className="cb-strike-task__scribble" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true">
            <path className="cb-strike-task__pass cb-strike-task__pass--out" pathLength={100} d="M2 8C16 4 28 11 42 7S66 4 80 8 104 10 118 6" />
            <path className="cb-strike-task__pass cb-strike-task__pass--back" pathLength={100} d="M116 9C96 7 82 11 64 8S34 6 22 10 8 9 3 7" />
          </svg>
        </span>
      </label>
    </>
  );
}
