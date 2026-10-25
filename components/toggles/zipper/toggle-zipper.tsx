"use client";

const css = `
  .toggle-zipper {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-zipper__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-zipper__track {
    position: relative;
    display: block;
    width: 148px;
    height: 30px;
    border-radius: 6px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }

  .toggle-zipper__input:focus-visible + .toggle-zipper__track {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 3px;
  }

  /* Two layers of teeth: apart, and interlocked. The interlocked layer is
     revealed up to the slider's middle, so the zip closes behind it. */
  .toggle-zipper__open,
  .toggle-zipper__closed {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background-repeat: no-repeat;
  }

  .toggle-zipper__open {
    background-image:
      repeating-linear-gradient(90deg, light-dark(#5f626a, #a7abb2) 0 4px, transparent 4px 8px),
      repeating-linear-gradient(90deg, transparent 0 4px, light-dark(#5f626a, #a7abb2) 4px 8px),
      linear-gradient(light-dark(#fbfcfd, #121417), light-dark(#fbfcfd, #121417));
    background-size: 100% 6px, 100% 6px, 100% 8px;
    background-position: 0 4px, 0 20px, 0 11px;
  }

  .toggle-zipper__closed {
    background-color: light-dark(#ebedf0, #232529);
    background-image:
      repeating-linear-gradient(90deg, light-dark(#50535b, #c6c8cd) 0 4px, transparent 4px 8px),
      repeating-linear-gradient(90deg, transparent 0 4px, light-dark(#42454c, #e5e6e9) 4px 8px);
    background-size: 100% 7px, 100% 7px;
    background-position: 0 9px, 0 14px;
    clip-path: inset(0 135px 0 0);
    transition: clip-path 0.6s cubic-bezier(0.55, 0, 0.3, 1);
  }

  .toggle-zipper__slider {
    position: absolute;
    top: 6px;
    left: 0;
    width: 22px;
    height: 18px;
    border-radius: 4px 9px 9px 4px;
    background: linear-gradient(light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    transform: translateX(2px);
    transition: transform 0.6s cubic-bezier(0.55, 0, 0.3, 1);
  }

  /* The pull hangs from the slider, a hole punched through its foot. */
  .toggle-zipper__pull {
    position: absolute;
    top: 9px;
    left: 7px;
    width: 8px;
    height: 22px;
    border-radius: 3px 3px 4px 4px;
    background:
      radial-gradient(circle at 50% 16px, light-dark(#ebedf0, #232529) 0 2px, transparent 2.5px),
      linear-gradient(90deg, light-dark(#5f626a, #a7abb2), light-dark(#42454c, #e5e6e9) 50%, light-dark(#5f626a, #a7abb2));
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.45);
    transform-origin: 50% 0;
    transform: rotate(8deg);
    transition: transform 0.6s cubic-bezier(0.3, 1.8, 0.5, 1) 0.15s;
  }

  .toggle-zipper__input:checked + .toggle-zipper__track .toggle-zipper__closed {
    clip-path: inset(0 13px 0 0);
  }

  .toggle-zipper__input:checked + .toggle-zipper__track .toggle-zipper__slider {
    transform: translateX(124px);
  }

  .toggle-zipper__input:checked + .toggle-zipper__track .toggle-zipper__pull {
    transform: rotate(-8deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-zipper__closed,
    .toggle-zipper__slider,
    .toggle-zipper__pull {
      transition: none;
    }
  }
`;
export function ZipperToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-zipper">
        <input className="toggle-zipper__input" type="checkbox" role="switch" />
        <span className="toggle-zipper__track" aria-hidden="true">
          <span className="toggle-zipper__open" />
          <span className="toggle-zipper__closed" />
          <span className="toggle-zipper__slider"><span className="toggle-zipper__pull" /></span>
        </span>
        <span className="toggle-zipper__label">Private</span>
      </label>
    </>
  );
}
