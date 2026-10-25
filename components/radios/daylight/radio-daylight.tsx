"use client";

import { useId, type CSSProperties } from 'react';

const css = `
  .radio-daylight {
    --radio-daylight-sky: light-dark(#dbdde1, #2e3035);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .radio-daylight:has(.radio-daylight__input[value='noon']:checked) {
    --radio-daylight-sky: light-dark(#6d7179, #7d8087);
  }

  .radio-daylight:has(.radio-daylight__input[value='evening']:checked) {
    --radio-daylight-sky: light-dark(#ebedf0, #232529);
  }

  .radio-daylight:has(.radio-daylight__input[value='night']:checked) {
    --radio-daylight-sky: light-dark(#fbfcfd, #121417);
  }

  .radio-daylight__sky {
    position: relative;
    width: 200px;
    height: 116px;
    overflow: hidden;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 12px;
    background: var(--radio-daylight-sky);
    transition: background-color 0.7s;
  }

  /* The sun rides an arc from the left horizon to the right one. */
  .radio-daylight__sun {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 14px 3px light-dark(rgba(55, 58, 64, 0.45), rgba(241, 242, 243, 0.45));
    offset-path: path('M14 100A86 74 0 0 1 186 100');
    offset-anchor: 50% 50%;
    offset-rotate: 0deg;
    offset-distance: 14%;
    overflow: hidden;
    transition: offset-distance 0.8s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s;
  }

  /* At night a shadow in the sky's colour slides over it: a crescent moon. */
  .radio-daylight__sun::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--radio-daylight-sky);
    transform: translate(140%, -60%);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.7s;
  }

  .radio-daylight:has(.radio-daylight__input[value='night']:checked) .radio-daylight__sun {
    box-shadow: 0 0 10px 1px light-dark(rgba(55, 58, 64, 0.2), rgba(241, 242, 243, 0.2));
  }

  .radio-daylight:has(.radio-daylight__input[value='night']:checked) .radio-daylight__sun::after {
    transform: translate(30%, -18%);
    transition-delay: 0.3s, 0s;
  }

  .radio-daylight__star {
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: light-dark(#42454c, #e5e6e9);
    opacity: 0;
    transition: opacity 0.4s;
  }

  .radio-daylight:has(.radio-daylight__input[value='night']:checked) .radio-daylight__star {
    opacity: 0.8;
    transition-delay: 0.5s;
  }

  .radio-daylight__ground {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 18px;
    border-radius: 60% 60% 0 0 / 10px 10px 0 0;
    background: light-dark(#f3f4f7, #1a1c1f);
  }

  .radio-daylight__row {
    display: flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
  }

  .radio-daylight__option {
    position: relative;
    cursor: pointer;
  }

  .radio-daylight__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-daylight__chip {
    display: block;
    padding: 6px 9px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    transition: background-color 0.2s, color 0.2s;
  }

  .radio-daylight__option:hover .radio-daylight__chip {
    color: light-dark(#50535b, #c6c8cd);
  }

  .radio-daylight__input:checked + .radio-daylight__chip {
    background: light-dark(#42454c, #e5e6e9);
    color: light-dark(#fbfcfd, #121417);
  }

  .radio-daylight__input:focus-visible + .radio-daylight__chip {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  /* Where the sun stands at each time (night puts the moon high). */
  .radio-daylight:has(.radio-daylight__input[value='morning']:checked) .radio-daylight__sun {
    offset-distance: 14%;
  }

  .radio-daylight:has(.radio-daylight__input[value='noon']:checked) .radio-daylight__sun {
    offset-distance: 50%;
  }

  .radio-daylight:has(.radio-daylight__input[value='evening']:checked) .radio-daylight__sun {
    offset-distance: 86%;
  }

  .radio-daylight:has(.radio-daylight__input[value='night']:checked) .radio-daylight__sun {
    offset-distance: 50%;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-daylight__sky,
    .radio-daylight__sun,
    .radio-daylight__sun::after,
    .radio-daylight__star {
      transition: none !important;
    }
  }
`;

export function DaylightRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-daylight">
        <div className="radio-daylight__sky" aria-hidden="true">
          <span className="radio-daylight__star" style={{ top: 18, left: 30 } as CSSProperties} />
          <span className="radio-daylight__star" style={{ top: 34, left: 64 } as CSSProperties} />
          <span className="radio-daylight__star" style={{ top: 16, left: 150 } as CSSProperties} />
          <span className="radio-daylight__star" style={{ top: 40, left: 176 } as CSSProperties} />
          <span className="radio-daylight__star" style={{ top: 28, left: 118 } as CSSProperties} />
          <span className="radio-daylight__star" style={{ top: 12, left: 92 } as CSSProperties} />
          <span className="radio-daylight__sun" />
          <span className="radio-daylight__ground" />
        </div>
        <div className="radio-daylight__row" role="radiogroup" aria-label="Time of day">
          <label className="radio-daylight__option">
            <input className="radio-daylight__input" type="radio" name={name} value="morning" defaultChecked />
            <span className="radio-daylight__chip">Morning</span>
          </label>
          <label className="radio-daylight__option">
            <input className="radio-daylight__input" type="radio" name={name} value="noon" />
            <span className="radio-daylight__chip">Noon</span>
          </label>
          <label className="radio-daylight__option">
            <input className="radio-daylight__input" type="radio" name={name} value="evening" />
            <span className="radio-daylight__chip">Evening</span>
          </label>
          <label className="radio-daylight__option">
            <input className="radio-daylight__input" type="radio" name={name} value="night" />
            <span className="radio-daylight__chip">Night</span>
          </label>
        </div>
      </div>
    </>
  );
}
