"use client";

const css = `
  .cb-sprout {
    display: inline-flex;
    align-items: flex-end;
    gap: 12px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .cb-sprout__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* Room above the box for the plant to grow into. */
  .cb-sprout__pot {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 28px;
    padding-top: 26px;
  }

  .cb-sprout__label {
    padding-bottom: 4px;
  }

  .cb-sprout__box {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    border: 2px solid light-dark(#cbced3, #393c41);
    border-radius: 7px;
    background: light-dark(#fbfcfd, #121417);
    transition: background-color 0.25s, border-color 0.25s;
  }

  .cb-sprout__input:focus-visible + .cb-sprout__pot .cb-sprout__box {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  .cb-sprout__box svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: light-dark(#fbfcfd, #121417);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cb-sprout__plant {
    position: absolute;
    top: 2px;
    left: 0;
    width: 28px;
    height: 26px;
    overflow: visible;
  }

  .cb-sprout__tick,
  .cb-sprout__stem {
    stroke-dasharray: 100 102;
    stroke-dashoffset: 101;
  }

  .cb-sprout__tick {
    transition: stroke-dashoffset 0.15s;
  }

  .cb-sprout__stem {
    fill: none;
    stroke: light-dark(#5f626a, #a7abb2);
    stroke-width: 2;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.2s ease-in 0.1s;
  }

  .cb-sprout__leaf {
    fill: light-dark(#42454c, #e5e6e9);
    transform: scale(0);
    transition: transform 0.2s ease-in;
  }

  .cb-sprout__leaf--left {
    transform-origin: 14px 15px;
  }

  .cb-sprout__leaf--right {
    transform-origin: 14px 10px;
  }

  .cb-sprout__input:checked + .cb-sprout__pot .cb-sprout__box {
    border-color: light-dark(#42454c, #e5e6e9);
    background: light-dark(#42454c, #e5e6e9);
  }

  .cb-sprout__input:checked + .cb-sprout__pot .cb-sprout__tick {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.25s ease-out 0.05s;
  }

  .cb-sprout__input:checked + .cb-sprout__pot .cb-sprout__stem {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.45s cubic-bezier(0.3, 0, 0.3, 1) 0.2s;
  }

  .cb-sprout__input:checked + .cb-sprout__pot .cb-sprout__leaf {
    transform: scale(1);
  }

  .cb-sprout__input:checked + .cb-sprout__pot .cb-sprout__leaf--left {
    transition: transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) 0.5s;
  }

  .cb-sprout__input:checked + .cb-sprout__pot .cb-sprout__leaf--right {
    transition: transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) 0.68s;
  }

  /* Once grown, it sways a little, pivoting at the soil. */
  .cb-sprout__input:checked + .cb-sprout__pot .cb-sprout__plant {
    transform-origin: 50% 100%;
    animation: cb-sprout-sway 2.6s ease-in-out 1.1s infinite alternate;
  }

  @keyframes cb-sprout-sway {
    from {
      transform: rotate(-4deg);
    }
    to {
      transform: rotate(4deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-sprout *,
    .cb-sprout__input:checked + .cb-sprout__pot * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      animation: none !important;
    }
  }
`;
export function SproutCheckbox() {
  return (
    <>
      <style>{css}</style>
      <label className="cb-sprout">
        <input className="cb-sprout__input" type="checkbox" />
        <span className="cb-sprout__pot" aria-hidden="true">
          <svg className="cb-sprout__plant" viewBox="0 0 28 26">
            <path className="cb-sprout__stem" pathLength={100} d="M14 26C14 20 13 15 14 9" />
            <path className="cb-sprout__leaf cb-sprout__leaf--left" d="M14 15C10 15 6 13 5 9 9 9 12 11 14 15Z" />
            <path className="cb-sprout__leaf cb-sprout__leaf--right" d="M14 10C16 6 20 4 24 4 23 8 19 10 14 10Z" />
          </svg>
          <span className="cb-sprout__box">
            <svg viewBox="0 0 20 20">
              <path className="cb-sprout__tick" pathLength={100} d="M5 10.5l3.5 3.5 6.5-8" />
            </svg>
          </span>
        </span>
        <span className="cb-sprout__label">Plant a tree</span>
      </label>
    </>
  );
}
