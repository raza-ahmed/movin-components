"use client";

const css = `
  .toggle-airplane {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-airplane__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-airplane__track {
    position: relative;
    width: 64px;
    height: 32px;
    overflow: hidden;
    border-radius: 9999px;
    background: light-dark(#ebedf0, #232529);
    transition: background-color 0.4s;
  }

  .toggle-airplane__input:focus-visible + .toggle-airplane__track {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  /* The contrail draws out from the start of the track behind the plane. */
  .toggle-airplane__trail {
    position: absolute;
    top: 50%;
    left: 10px;
    right: 26px;
    height: 2px;
    margin-top: -1px;
    background: repeating-linear-gradient(90deg, light-dark(#fbfcfd, #121417) 0 4px, transparent 4px 7px);
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.3s ease-in, opacity 0.3s;
  }

  .toggle-airplane__thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: light-dark(#42454c, #e5e6e9);
    transition: transform 0.55s cubic-bezier(0.55, 0, 0.3, 1), background-color 0.3s;
  }

  .toggle-airplane__thumb svg {
    width: 15px;
    height: 15px;
    fill: light-dark(#fbfcfd, #121417);
    transform: rotate(90deg);
    transition: transform 0.45s cubic-bezier(0.4, 0, 0.3, 1);
  }

  /* On: it runs to the end and noses up into a climb. */
  .toggle-airplane__input:checked + .toggle-airplane__track {
    background: light-dark(#50535b, #c6c8cd);
  }

  .toggle-airplane__input:checked + .toggle-airplane__track .toggle-airplane__thumb {
    background: light-dark(#373a40, #f1f2f3);
    transform: translate(32px, -1px);
  }

  .toggle-airplane__input:checked + .toggle-airplane__track .toggle-airplane__thumb svg {
    transform: rotate(68deg);
    transition-delay: 0.2s;
  }

  .toggle-airplane__input:checked + .toggle-airplane__track .toggle-airplane__trail {
    transform: scaleX(1);
    transition: transform 0.45s cubic-bezier(0.55, 0, 0.3, 1) 0.1s;
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-airplane__track *,
    .toggle-airplane__input:checked + .toggle-airplane__track * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  }
`;
export function AirplaneToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-airplane">
        <input className="toggle-airplane__input" type="checkbox" role="switch" />
        <span className="toggle-airplane__track" aria-hidden="true">
          <span className="toggle-airplane__trail" />
          <span className="toggle-airplane__thumb">
            <svg viewBox="0 0 24 24"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5Z" /></svg>
          </span>
        </span>
        <span className="toggle-airplane__label">Airplane mode</span>
      </label>
    </>
  );
}
