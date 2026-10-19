"use client";

const css = `
  .toggle-pixel {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-family: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-pixel__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* Pixel corners: four flat shadows and no radius leave the corners notched. */
  .toggle-pixel__track {
    position: relative;
    display: block;
    width: 60px;
    height: 30px;
    margin: 3px;
    background: #202020;
    box-shadow: 0 -3px 0 #7c7c7c, 0 3px 0 #7c7c7c, -3px 0 0 #7c7c7c, 3px 0 0 #7c7c7c;
  }

  .toggle-pixel__input:focus-visible + .toggle-pixel__track {
    outline: 2px dashed #a7a7a7;
    outline-offset: 6px;
  }

  /* The fill and the thumb both move in whole steps. */
  .toggle-pixel__fill {
    position: absolute;
    inset: 0;
    background: repeating-conic-gradient(#4d4d4d 0 25%, #3a3a3a 0 50%) 0 0 / 6px 6px;
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.25s steps(5, end);
  }

  .toggle-pixel__thumb {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 18px;
    height: 18px;
    background: #ededed;
    box-shadow: inset -3px -3px 0 #a7a7a7, inset 3px 3px 0 #f6f6f6;
    transition: transform 0.25s steps(5, end);
  }

  .toggle-pixel__input:checked + .toggle-pixel__track .toggle-pixel__fill {
    transform: scaleX(1);
    transition-delay: 0.05s;
  }

  .toggle-pixel__input:checked + .toggle-pixel__track .toggle-pixel__thumb {
    transform: translateX(30px);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-pixel__fill,
    .toggle-pixel__thumb {
      transition: none !important;
    }
  }
`;
export function PixelToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-pixel">
        <input className="toggle-pixel__input" type="checkbox" role="switch" />
        <span className="toggle-pixel__track" aria-hidden="true">
          <span className="toggle-pixel__fill" />
          <span className="toggle-pixel__thumb" />
        </span>
        <span className="toggle-pixel__label">Retro mode</span>
      </label>
    </>
  );
}
