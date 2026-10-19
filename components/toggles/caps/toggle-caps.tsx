"use client";

const css = `
  .toggle-caps {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-caps__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* The well is the keyboard under the cap: the more of it shows, the higher
     the key sits. */
  .toggle-caps__well {
    position: relative;
    display: block;
    width: 84px;
    height: 64px;
    border-radius: 10px;
    background: #111111;
    box-shadow: 0 0 0 4px #202020;
  }

  .toggle-caps__input:focus-visible + .toggle-caps__well {
    outline: 2px solid #a7a7a7;
    outline-offset: 6px;
  }

  .toggle-caps__key {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 84px;
    height: 57px;
    padding: 9px 10px;
    border-radius: 10px;
    background: linear-gradient(#4d4d4d, #3a3a3a);
    box-shadow: inset 0 1px 0 rgba(246, 246, 246, 0.14), inset 0 -3px 0 #282828;
    transition: transform 0.28s cubic-bezier(0.3, 2, 0.5, 1);
  }

  .toggle-caps__led {
    display: block;
    width: 10px;
    height: 4px;
    border-radius: 2px;
    background: #282828;
    transition: background-color 0.15s, box-shadow 0.25s;
  }

  .toggle-caps__legend {
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: #c9c9c9;
    font-size: 11px;
    letter-spacing: 0.02em;
  }

  .toggle-caps:active .toggle-caps__input + .toggle-caps__well .toggle-caps__key {
    transform: translateY(6px);
    transition-duration: 0.08s;
  }

  .toggle-caps__input:checked + .toggle-caps__well .toggle-caps__key {
    transform: translateY(3px);
  }

  .toggle-caps__input:checked + .toggle-caps__well .toggle-caps__led {
    background: #f6f6f6;
    box-shadow: 0 0 8px 2px rgba(246, 246, 246, 0.55);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-caps__key,
    .toggle-caps__led {
      transition: none;
    }
  }
`;
export function CapsToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-caps">
        <input className="toggle-caps__input" type="checkbox" role="switch" />
        <span className="toggle-caps__well" aria-hidden="true">
          <span className="toggle-caps__key">
            <span className="toggle-caps__led" />
            <span className="toggle-caps__legend">caps lock</span>
          </span>
        </span>
        <span className="toggle-caps__label">Caps lock</span>
      </label>
    </>
  );
}
