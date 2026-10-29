"use client";

import { useId } from 'react';

const css = `
  .radio-layers { display: flex; align-items: center; gap: 18px; }
  .radio-layers__stack { position: relative; width: 130px; height: 120px; }
  .radio-layers__sheet {
    --radio-layers-y: 0px;
    position: absolute;
    left: 15px;
    top: 30px;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087), 0 10px 14px -8px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent);
    opacity: 0.55;
    transform: translateY(var(--radio-layers-y)) scaleY(0.5) rotate(45deg);
    transition: transform 0.55s cubic-bezier(0.35, 1.25, 0.5, 1), opacity 0.35s, box-shadow 0.35s;
  }
  .radio-layers__sheet--map {
    background:
      linear-gradient(90deg, transparent 46%, light-dark(#5f626a, #a7abb2) 46% 54%, transparent 54%),
      linear-gradient(transparent 30%, light-dark(#6d7179, #7d8087) 30% 36%, transparent 36%),
      linear-gradient(transparent 70%, light-dark(#6d7179, #7d8087) 70% 74%, transparent 74%),
      light-dark(#dbdde1, #2e3035);
  }
  .radio-layers__sheet--satellite {
    background:
      conic-gradient(light-dark(#cbced3, #393c41) 25%, light-dark(#dbdde1, #2e3035) 0 50%, light-dark(#ebedf0, #232529) 0 75%, light-dark(#cbced3, #393c41) 0) 0 0 / 22px 22px,
      light-dark(#dbdde1, #2e3035);
  }
  .radio-layers__sheet--terrain { background: repeating-radial-gradient(circle at 40% 45%, light-dark(#dbdde1, #2e3035) 0 6px, light-dark(#6d7179, #7d8087) 6px 7px), light-dark(#dbdde1, #2e3035); }
  /* Slots from the top of the stack: 0 is lifted clear of the others. */
  .radio-layers__sheet--map { --radio-layers-y: -22px; z-index: 3; }
  .radio-layers__sheet--satellite { --radio-layers-y: 0px; z-index: 2; }
  .radio-layers__sheet--terrain { --radio-layers-y: 12px; z-index: 1; }
  .radio-layers:has(.radio-layers__input[value='satellite']:checked) .radio-layers__sheet--satellite { --radio-layers-y: -22px; z-index: 3; }
  .radio-layers:has(.radio-layers__input[value='satellite']:checked) .radio-layers__sheet--map { --radio-layers-y: 0px; z-index: 2; }
  .radio-layers:has(.radio-layers__input[value='terrain']:checked) .radio-layers__sheet--terrain { --radio-layers-y: -22px; z-index: 3; }
  .radio-layers:has(.radio-layers__input[value='terrain']:checked) .radio-layers__sheet--map { --radio-layers-y: 0px; z-index: 2; }
  .radio-layers:has(.radio-layers__input[value='terrain']:checked) .radio-layers__sheet--satellite { --radio-layers-y: 12px; z-index: 1; }
  .radio-layers:has(.radio-layers__input[value='map']:checked) .radio-layers__sheet--map,
  .radio-layers:has(.radio-layers__input[value='satellite']:checked) .radio-layers__sheet--satellite,
  .radio-layers:has(.radio-layers__input[value='terrain']:checked) .radio-layers__sheet--terrain {
    opacity: 1;
    box-shadow: inset 0 0 0 1.5px light-dark(#42454c, #e5e6e9), 0 16px 18px -8px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent);
  }
  .radio-layers__opts { display: grid; gap: 2px; }
  .radio-layers__opt {
    position: relative;
    padding: 4px 10px;
    border-radius: 6px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-layers__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-layers__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-layers__opt:has(.radio-layers__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .radio-layers__opt:has(.radio-layers__input:checked) { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .radio-layers * { transition-duration: 0.01s !important; }
  }
`;

const LAYERS = [
  { value: 'map', label: 'Map' },
  { value: 'satellite', label: 'Satellite' },
  { value: 'terrain', label: 'Terrain' },
];

export function LayersRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-layers">
        <span className="radio-layers__stack" aria-hidden="true">
          {LAYERS.map((l) => (
            <span key={l.value} className={`radio-layers__sheet radio-layers__sheet--${l.value}`} />
          ))}
        </span>
        <div className="radio-layers__opts" role="radiogroup" aria-label="Map layer">
          {LAYERS.map((l, i) => (
            <label key={l.value} className="radio-layers__opt">
              <input className="radio-layers__input" type="radio" name={name} value={l.value} defaultChecked={i === 0} />
              {l.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
