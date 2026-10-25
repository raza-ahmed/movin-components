"use client";

import { useId } from 'react';

const css = `
  .radio-tab-bar {
    display: inline-flex;
    gap: 4px;
    padding: 6px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 9999px;
    background: light-dark(#f3f4f7, #1a1c1f);
  }

  .radio-tab-bar__option {
    position: relative;
    cursor: pointer;
  }

  .radio-tab-bar__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* Icon plus a label column that grows from 0fr to 1fr when chosen. */
  .radio-tab-bar__tab {
    display: grid;
    grid-template-columns: auto 0fr;
    align-items: center;
    height: 40px;
    padding: 0 11px;
    border-radius: 9999px;
    color: light-dark(#6d7179, #7d8087);
    transition: grid-template-columns 0.4s cubic-bezier(0.3, 1.2, 0.5, 1), background-color 0.3s, color 0.3s;
  }

  .radio-tab-bar__option:hover .radio-tab-bar__tab {
    color: light-dark(#50535b, #c6c8cd);
  }

  .radio-tab-bar__icon {
    width: 20px;
    height: 20px;
    fill: transparent;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: fill 0.25s;
  }

  .radio-tab-bar__label {
    overflow: hidden;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  .radio-tab-bar__label span {
    display: block;
    padding-left: 8px;
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.2s, transform 0.3s;
  }

  .radio-tab-bar__input:checked + .radio-tab-bar__tab {
    grid-template-columns: auto 1fr;
    background: light-dark(#42454c, #e5e6e9);
    color: light-dark(#fbfcfd, #121417);
  }

  .radio-tab-bar__input:checked + .radio-tab-bar__tab .radio-tab-bar__icon {
    fill: currentColor;
    animation: radio-tab-bar-bounce 0.45s cubic-bezier(0.3, 1.8, 0.5, 1);
  }

  .radio-tab-bar__input:checked + .radio-tab-bar__tab .radio-tab-bar__label span {
    opacity: 1;
    transform: none;
    transition: opacity 0.25s 0.1s, transform 0.35s 0.1s;
  }

  @keyframes radio-tab-bar-bounce {
    0% {
      transform: scale(0.7);
    }
    100% {
      transform: none;
    }
  }

  .radio-tab-bar__input:focus-visible + .radio-tab-bar__tab {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-tab-bar__tab,
    .radio-tab-bar__label span,
    .radio-tab-bar__icon {
      transition: none !important;
    }
    .radio-tab-bar__input:checked + .radio-tab-bar__tab .radio-tab-bar__icon {
      animation: none;
    }
  }
`;

export function TabBarRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-tab-bar" role="radiogroup" aria-label="Section">
        <label className="radio-tab-bar__option">
          <input className="radio-tab-bar__input" type="radio" name={name} value="home" defaultChecked />
          <span className="radio-tab-bar__tab">
            <svg className="radio-tab-bar__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4Z" /></svg>
            <span className="radio-tab-bar__label"><span>Home</span></span>
          </span>
        </label>
        <label className="radio-tab-bar__option">
          <input className="radio-tab-bar__input" type="radio" name={name} value="search" />
          <span className="radio-tab-bar__tab">
            <svg className="radio-tab-bar__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
            <span className="radio-tab-bar__label"><span>Search</span></span>
          </span>
        </label>
        <label className="radio-tab-bar__option">
          <input className="radio-tab-bar__input" type="radio" name={name} value="saved" />
          <span className="radio-tab-bar__tab">
            <svg className="radio-tab-bar__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
            <span className="radio-tab-bar__label"><span>Saved</span></span>
          </span>
        </label>
        <label className="radio-tab-bar__option">
          <input className="radio-tab-bar__input" type="radio" name={name} value="profile" />
          <span className="radio-tab-bar__tab">
            <svg className="radio-tab-bar__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5Z" /></svg>
            <span className="radio-tab-bar__label"><span>Profile</span></span>
          </span>
        </label>
      </div>
    </>
  );
}
