"use client";

import { useId } from 'react';

const css = `
  .radio-theme__panel {
    position: relative;
    width: 240px;
    height: 156px;
    overflow: hidden;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 14px;
  }

  /* One full layer per theme. The chosen one jumps to the top and grows as a
     circle from its own chip; the old one holds until it is covered, then
     closes instantly underneath. */
  .radio-theme__layer {
    --radio-theme-bg: light-dark(#fbfcfd, #121417);
    --radio-theme-ink: light-dark(#dbdde1, #2e3035);
    --radio-theme-accent: light-dark(#42454c, #e5e6e9);
    position: absolute;
    inset: 0;
    z-index: 0;
    background: var(--radio-theme-bg);
    clip-path: circle(0 at var(--radio-theme-x) 84%);
    transition: clip-path 0s 0.7s;
  }

  .radio-theme__layer--light {
    --radio-theme-x: 25%;
    --radio-theme-bg: light-dark(#373a40, #f1f2f3);
    --radio-theme-ink: light-dark(#50535b, #c6c8cd);
    --radio-theme-accent: light-dark(#fbfcfd, #121417);
  }

  .radio-theme__layer--dim {
    --radio-theme-x: 50%;
    --radio-theme-bg: light-dark(#cbced3, #393c41);
    --radio-theme-ink: light-dark(#6d7179, #7d8087);
    --radio-theme-accent: light-dark(#42454c, #e5e6e9);
  }

  .radio-theme__layer--dark {
    --radio-theme-x: 75%;
  }

  .radio-theme__panel:has(.radio-theme__option--light .radio-theme__input:checked) .radio-theme__layer--light,
  .radio-theme__panel:has(.radio-theme__option--dim .radio-theme__input:checked) .radio-theme__layer--dim,
  .radio-theme__panel:has(.radio-theme__option--dark .radio-theme__input:checked) .radio-theme__layer--dark {
    z-index: 1;
    clip-path: circle(150% at var(--radio-theme-x) 84%);
    transition: clip-path 0.7s cubic-bezier(0.5, 0, 0.2, 1);
  }

  /* The little page drawn on every layer. */
  .radio-theme__bar,
  .radio-theme__avatar,
  .radio-theme__line {
    position: absolute;
    border-radius: 4px;
    background: var(--radio-theme-ink);
  }

  .radio-theme__bar {
    top: 14px;
    left: 14px;
    width: 64px;
    height: 8px;
    background: var(--radio-theme-accent);
  }

  .radio-theme__avatar {
    top: 12px;
    right: 14px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }

  .radio-theme__line {
    top: 44px;
    left: 14px;
    right: 14px;
    height: 7px;
  }

  .radio-theme__line--short {
    top: 58px;
    right: 70px;
  }

  /* Chips float above every layer and take the chosen theme's colours. */
  .radio-theme__chips {
    position: absolute;
    z-index: 2;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    padding: 0 12px;
  }

  .radio-theme__option {
    position: relative;
    cursor: pointer;
  }

  .radio-theme__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-theme__chip {
    display: block;
    padding: 5px 12px;
    border: 1px solid light-dark(#6d7179, #7d8087);
    border-radius: 9999px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  }

  .radio-theme__panel:has(.radio-theme__option--light .radio-theme__input:checked) .radio-theme__chip {
    color: light-dark(#cbced3, #393c41);
    transition-delay: 0.25s;
  }

  .radio-theme__input:checked + .radio-theme__chip {
    border-color: light-dark(#42454c, #e5e6e9);
    background: light-dark(#42454c, #e5e6e9);
    color: light-dark(#fbfcfd, #121417);
  }

  .radio-theme__panel:has(.radio-theme__option--light .radio-theme__input:checked) .radio-theme__input:checked + .radio-theme__chip {
    border-color: light-dark(#fbfcfd, #121417);
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
  }

  .radio-theme__input:focus-visible + .radio-theme__chip {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-theme__layer,
    .radio-theme__panel .radio-theme__layer {
      transition: none !important;
    }
  }
`;

export function ThemeRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-theme">
        <div className="radio-theme__panel">
          <span className="radio-theme__layer radio-theme__layer--light" aria-hidden="true"><span className="radio-theme__bar" /><span className="radio-theme__avatar" /><span className="radio-theme__line" /><span className="radio-theme__line radio-theme__line--short" /></span>
          <span className="radio-theme__layer radio-theme__layer--dim" aria-hidden="true"><span className="radio-theme__bar" /><span className="radio-theme__avatar" /><span className="radio-theme__line" /><span className="radio-theme__line radio-theme__line--short" /></span>
          <span className="radio-theme__layer radio-theme__layer--dark" aria-hidden="true"><span className="radio-theme__bar" /><span className="radio-theme__avatar" /><span className="radio-theme__line" /><span className="radio-theme__line radio-theme__line--short" /></span>
          <div className="radio-theme__chips" role="radiogroup" aria-label="Theme">
          <label className="radio-theme__option radio-theme__option--light">
            <input className="radio-theme__input" type="radio" name={name} value="light" />
            <span className="radio-theme__chip">Light</span>
          </label>
          <label className="radio-theme__option radio-theme__option--dim">
            <input className="radio-theme__input" type="radio" name={name} value="dim" />
            <span className="radio-theme__chip">Dim</span>
          </label>
          <label className="radio-theme__option radio-theme__option--dark">
            <input className="radio-theme__input" type="radio" name={name} value="dark" defaultChecked />
            <span className="radio-theme__chip">Dark</span>
          </label>
          </div>
        </div>
      </div>
    </>
  );
}
