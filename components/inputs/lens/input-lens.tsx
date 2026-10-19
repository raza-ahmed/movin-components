"use client";

const css = `
  /* The ring of the glass IS the field: one bordered box that is a circle at
     rest and stretches into a pill while focused or filled. */
  .field-lens {
    position: relative;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    border: 2px solid #a7a7a7;
    border-radius: 22px;
    background: transparent;
    transition: width 0.5s cubic-bezier(0.6, 0, 0.2, 1), height 0.5s cubic-bezier(0.6, 0, 0.2, 1), border-width 0.3s, border-color 0.3s, background-color 0.3s;
  }

  /* The handle sticks out of the ring at 45 degrees. */
  .field-lens::after {
    content: '';
    position: absolute;
    top: calc(100% - 6px);
    left: calc(100% - 5px);
    width: 13px;
    height: 3px;
    border-radius: 2px;
    background: #a7a7a7;
    transform: rotate(45deg);
    transform-origin: 0 50%;
    transition: transform 0.3s cubic-bezier(0.3, 1.4, 0.5, 1) 0.25s, opacity 0.2s 0.25s;
  }

  .field-lens:hover:not(:focus-within) {
    border-color: #ededed;
  }

  .field-lens:hover:not(:focus-within)::after {
    background: #ededed;
  }

  .field-lens__input {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 14px 0 38px;
    border: 0;
    border-radius: inherit;
    outline: none;
    background: transparent;
    color: #f6f6f6;
    font: inherit;
    font-size: 14px;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.15s;
    appearance: none;
  }

  .field-lens__input::-webkit-search-cancel-button,
  .field-lens__input::-webkit-search-decoration {
    appearance: none;
  }

  .field-lens__input::placeholder {
    color: #7c7c7c;
  }

  .field-lens__icon {
    position: absolute;
    top: 50%;
    left: 13px;
    width: 16px;
    height: 16px;
    margin-top: -8px;
    fill: none;
    stroke: #a7a7a7;
    stroke-width: 1.6;
    stroke-linecap: round;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.15s, transform 0.15s;
  }

  /* Open: focused, or holding a query. */
  .field-lens:focus-within,
  .field-lens:has(.field-lens__input:not(:placeholder-shown)) {
    width: 280px;
    height: 44px;
    border-width: 1px;
    border-color: #4d4d4d;
    background: #202020;
  }

  .field-lens:focus-within {
    border-color: #a7a7a7;
  }

  .field-lens:focus-within::after,
  .field-lens:has(.field-lens__input:not(:placeholder-shown))::after {
    opacity: 0;
    transform: rotate(0deg) scaleX(0);
    transition: transform 0.2s ease-in, opacity 0.15s 0.05s;
  }

  .field-lens:focus-within .field-lens__input,
  .field-lens__input:not(:placeholder-shown) {
    opacity: 1;
    cursor: text;
    transition: opacity 0.25s 0.3s;
  }

  .field-lens:focus-within .field-lens__icon,
  .field-lens__input:not(:placeholder-shown) + .field-lens__icon {
    opacity: 1;
    transform: none;
    transition: opacity 0.2s 0.25s, transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1) 0.25s;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-lens,
    .field-lens::after,
    .field-lens * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  }
`;
export function LensSearchInput() {
  return (
    <>
      <style>{css}</style>
      <div className="field-lens" role="search">
        <input className="field-lens__input" type="search" placeholder="Search components" aria-label="Search components" spellCheck={false} />
        <svg className="field-lens__icon" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" />
        </svg>
      </div>
    </>
  );
}
