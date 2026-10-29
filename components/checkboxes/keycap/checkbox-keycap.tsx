"use client";

const css = `
  .cb-keycap {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .cb-keycap__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* The side wall is a stack of hard shadows; pressing shrinks it as the cap drops. */
  .cb-keycap__key {
    --cb-keycap-travel: 0px;
    position: relative;
    box-sizing: border-box;
    width: 52px;
    height: 48px;
    padding: 6px 8px;
    border-radius: 9px;
    background: linear-gradient(180deg, light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529));
    box-shadow: inset 0 1px 0 light-dark(rgba(251, 252, 253, 0.12), rgba(241, 242, 243, 0.12)), inset 0 -2px 0 light-dark(rgba(0, 0, 0, 0.1), rgba(18, 20, 23, 0.5)), 0 calc(6px - var(--cb-keycap-travel)) 0 light-dark(#cbced3, #121417), 0 calc(8px - var(--cb-keycap-travel)) 10px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
    transform: translateY(var(--cb-keycap-travel));
    transition: transform 0.12s cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 0.12s cubic-bezier(0.3, 1.5, 0.5, 1);
  }

  .cb-keycap__input:focus-visible + .cb-keycap__key {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 4px;
  }

  .cb-keycap__led {
    position: absolute;
    top: 7px;
    left: 8px;
    width: 6px;
    height: 3px;
    border-radius: 2px;
    background: light-dark(#fbfcfd, #121417);
    transition: background-color 0.15s, box-shadow 0.25s;
  }

  .cb-keycap__legend {
    position: absolute;
    right: 8px;
    bottom: 6px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
  }

  .cb-keycap:active .cb-keycap__key {
    --cb-keycap-travel: 5px;
    transition-duration: 0.05s;
  }

  .cb-keycap__input:checked + .cb-keycap__key {
    --cb-keycap-travel: 3px;
  }

  .cb-keycap__input:checked + .cb-keycap__key .cb-keycap__led {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 6px 1px light-dark(rgba(55, 58, 64, 0.7), rgba(241, 242, 243, 0.7)), 0 0 14px light-dark(rgba(55, 58, 64, 0.35), rgba(241, 242, 243, 0.35));
  }

  .cb-keycap__input:checked + .cb-keycap__key .cb-keycap__legend {
    color: light-dark(#42454c, #e5e6e9);
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-keycap__key,
    .cb-keycap__led {
      transition: none;
    }
  }
`;
export function KeycapCheckbox() {
  return (
    <>
      <style>{css}</style>
      <label className="cb-keycap">
        <input className="cb-keycap__input" type="checkbox" />
        <span className="cb-keycap__key" aria-hidden="true">
          <span className="cb-keycap__led" />
          <span className="cb-keycap__legend">Aa</span>
        </span>
        <span className="cb-keycap__label">Caps lock</span>
      </label>
    </>
  );
}
