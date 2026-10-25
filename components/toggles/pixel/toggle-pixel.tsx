"use client";

const css = `
  .toggle-pixel {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: light-dark(#42454c, #e5e6e9);
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
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: 0 -3px 0 light-dark(#6d7179, #7d8087), 0 3px 0 light-dark(#6d7179, #7d8087), -3px 0 0 light-dark(#6d7179, #7d8087), 3px 0 0 light-dark(#6d7179, #7d8087);
  }

  .toggle-pixel__input:focus-visible + .toggle-pixel__track {
    outline: 2px dashed light-dark(#5f626a, #a7abb2);
    outline-offset: 6px;
  }

  /* The fill and the thumb both move in whole steps. */
  .toggle-pixel__fill {
    position: absolute;
    inset: 0;
    background: repeating-conic-gradient(light-dark(#cbced3, #393c41) 0 25%, light-dark(#dbdde1, #2e3035) 0 50%) 0 0 / 6px 6px;
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
    background: light-dark(#42454c, #e5e6e9);
    box-shadow: inset -3px -3px 0 light-dark(#5f626a, #a7abb2), inset 3px 3px 0 light-dark(#373a40, #f1f2f3);
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
