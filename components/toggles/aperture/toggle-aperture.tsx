"use client";

import type { CSSProperties } from 'react';

const css = `
  .toggle-aperture {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-aperture__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* The lens: glass with a highlight, seen through whatever the blades leave. */
  .toggle-aperture__lens {
    position: relative;
    display: block;
    overflow: hidden;
    width: 60px;
    height: 60px;
    border: 4px solid #4d4d4d;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 36%, #f6f6f6 0 3px, #a7a7a7 5px, #3a3a3a 55%, #111111 75%);
    box-shadow: 0 0 0 1px #7c7c7c, 0 6px 14px rgba(0, 0, 0, 0.5);
  }

  .toggle-aperture__input:focus-visible + .toggle-aperture__lens {
    outline: 2px solid #a7a7a7;
    outline-offset: 4px;
  }

  /* Each blade is a plane whose top edge runs through the centre. Shut, the
     six of them cover everything; turned and pushed out, their edges leave a
     hexagon in the middle. */
  .toggle-aperture__blade {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 56px;
    margin-left: -40px;
    background: linear-gradient(#4d4d4d, #282828 70%);
    box-shadow: inset 0 1px 0 #a7a7a7;
    transform-origin: 50% 0;
    transform: rotate(calc(var(--i) * 60deg)) translateY(-2px);
    transition: transform 0.55s cubic-bezier(0.5, 0, 0.2, 1);
  }

  .toggle-aperture__input:checked + .toggle-aperture__lens .toggle-aperture__blade {
    transform: rotate(calc(var(--i) * 60deg + 50deg)) translateY(17px);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-aperture__blade {
      transition: none;
    }
  }
`;

export function ApertureToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-aperture">
        <input className="toggle-aperture__input" type="checkbox" role="switch" />
        <span className="toggle-aperture__lens" aria-hidden="true">
          <span className="toggle-aperture__blade" style={{ '--i': 0 } as CSSProperties} />
          <span className="toggle-aperture__blade" style={{ '--i': 1 } as CSSProperties} />
          <span className="toggle-aperture__blade" style={{ '--i': 2 } as CSSProperties} />
          <span className="toggle-aperture__blade" style={{ '--i': 3 } as CSSProperties} />
          <span className="toggle-aperture__blade" style={{ '--i': 4 } as CSSProperties} />
          <span className="toggle-aperture__blade" style={{ '--i': 5 } as CSSProperties} />
        </span>
        <span className="toggle-aperture__label">Camera</span>
      </label>
    </>
  );
}
