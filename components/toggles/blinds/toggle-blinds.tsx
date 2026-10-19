"use client";

import type { CSSProperties } from 'react';

const css = `
  .toggle-blinds {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-blinds__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-blinds__room {
    position: relative;
    display: block;
    width: 72px;
    padding-bottom: 26px;
    border-radius: 6px;
  }

  .toggle-blinds__input:focus-visible + .toggle-blinds__room {
    outline: 2px solid #a7a7a7;
    outline-offset: 4px;
  }

  /* Daylight outside, a sun low in the corner. */
  .toggle-blinds__window {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    height: 84px;
    padding-top: 4px;
    border: 3px solid #4d4d4d;
    border-radius: 4px;
    background:
      radial-gradient(circle at 72% 30%, #f6f6f6 0 7px, rgba(246, 246, 246, 0) 18px),
      linear-gradient(#ededed, #a7a7a7);
    box-shadow: inset 0 4px 0 #c9c9c9;
    perspective: 240px;
  }

  .toggle-blinds__slat {
    display: block;
    flex: none;
    height: 10px;
    margin-bottom: -1px;
    background: linear-gradient(#7c7c7c, #4d4d4d);
    box-shadow: 0 1px 0 #3a3a3a;
    transform: rotateX(0deg);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--i) * 30ms);
  }

  /* The stripes of light the open slats throw on the sill. */
  .toggle-blinds__spill {
    position: absolute;
    bottom: 0;
    left: 6px;
    width: 60px;
    height: 22px;
    background: repeating-linear-gradient(rgba(237, 237, 237, 0.32) 0 3px, rgba(237, 237, 237, 0) 3px 6px);
    -webkit-mask-image: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    mask-image: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    transform: skewX(-28deg);
    transform-origin: 50% 0;
    opacity: 0;
    transition: opacity 0.4s 0.15s;
  }

  .toggle-blinds__input:checked + .toggle-blinds__room .toggle-blinds__slat {
    transform: rotateX(72deg);
  }

  .toggle-blinds__input:checked + .toggle-blinds__room .toggle-blinds__spill {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-blinds__slat,
    .toggle-blinds__spill {
      transition: none;
    }
  }
`;

export function BlindsToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-blinds">
        <input className="toggle-blinds__input" type="checkbox" role="switch" />
        <span className="toggle-blinds__room" aria-hidden="true">
          <span className="toggle-blinds__window">
            <span className="toggle-blinds__slat" style={{ '--i': 0 } as CSSProperties} />
            <span className="toggle-blinds__slat" style={{ '--i': 1 } as CSSProperties} />
            <span className="toggle-blinds__slat" style={{ '--i': 2 } as CSSProperties} />
            <span className="toggle-blinds__slat" style={{ '--i': 3 } as CSSProperties} />
            <span className="toggle-blinds__slat" style={{ '--i': 4 } as CSSProperties} />
            <span className="toggle-blinds__slat" style={{ '--i': 5 } as CSSProperties} />
            <span className="toggle-blinds__slat" style={{ '--i': 6 } as CSSProperties} />
            <span className="toggle-blinds__slat" style={{ '--i': 7 } as CSSProperties} />
          </span>
          <span className="toggle-blinds__spill" />
        </span>
        <span className="toggle-blinds__label">Blinds</span>
      </label>
    </>
  );
}
