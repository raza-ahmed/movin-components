"use client";

import { useId, type CSSProperties } from 'react';

const css = `
  .radio-stars {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .radio-stars__row {
    display: flex;
    gap: 2px;
  }

  .radio-stars__option {
    position: relative;
    display: block;
    padding: 3px;
    border-radius: 8px;
    cursor: pointer;
  }

  .radio-stars__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-stars__option:has(.radio-stars__input:focus-visible) {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
  }

  .radio-stars__star {
    display: block;
    width: 30px;
    height: 30px;
    fill: transparent;
    stroke: light-dark(#cbced3, #393c41);
    stroke-width: 1.5;
    stroke-linejoin: round;
    transition: fill 0.2s, stroke 0.2s;
    transition-delay: calc(var(--radio-stars-i) * 45ms);
  }

  /* Filled: the checked star and every star before it. */
  .radio-stars__option:has(.radio-stars__input:checked) .radio-stars__star,
  .radio-stars__option:has(~ .radio-stars__option .radio-stars__input:checked) .radio-stars__star {
    fill: light-dark(#42454c, #e5e6e9);
    stroke: light-dark(#42454c, #e5e6e9);
  }

  /* Plays only when a star becomes the checked one. */
  .radio-stars__option:has(.radio-stars__input:checked) .radio-stars__star {
    animation: radio-stars-pop 0.45s cubic-bezier(0.3, 1.8, 0.5, 1);
  }

  @keyframes radio-stars-pop {
    0% {
      transform: scale(0.6) rotate(-20deg);
    }
    100% {
      transform: none;
    }
  }

  /* Hover previews a rating up to the pointer, instantly. */
  .radio-stars__row:hover .radio-stars__option .radio-stars__star {
    fill: transparent;
    stroke: light-dark(#cbced3, #393c41);
    transition-delay: 0s;
  }

  .radio-stars__row:hover .radio-stars__option:hover .radio-stars__star,
  .radio-stars__row:hover .radio-stars__option:has(~ .radio-stars__option:hover) .radio-stars__star {
    fill: light-dark(#5f626a, #a7abb2);
    stroke: light-dark(#5f626a, #a7abb2);
  }

  .radio-stars__caption {
    min-height: 1.4em;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 13px;
  }

  .radio-stars:has(.radio-stars__option:nth-child(1) .radio-stars__input:checked) .radio-stars__caption::after {
    content: 'Poor';
  }

  .radio-stars:has(.radio-stars__option:nth-child(2) .radio-stars__input:checked) .radio-stars__caption::after {
    content: 'Fair';
  }

  .radio-stars:has(.radio-stars__option:nth-child(3) .radio-stars__input:checked) .radio-stars__caption::after {
    content: 'Good';
  }

  .radio-stars:has(.radio-stars__option:nth-child(4) .radio-stars__input:checked) .radio-stars__caption::after {
    content: 'Great';
  }

  .radio-stars:has(.radio-stars__option:nth-child(5) .radio-stars__input:checked) .radio-stars__caption::after {
    content: 'Loved it';
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-stars__star {
      transition: none;
    }
    .radio-stars__option:has(.radio-stars__input:checked) .radio-stars__star {
      animation: none;
    }
  }
`;

export function StarsRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-stars">
        <div className="radio-stars__row" role="radiogroup" aria-label="Rating">
        <label className="radio-stars__option" style={{ '--radio-stars-i': 0 } as CSSProperties}>
          <input className="radio-stars__input" type="radio" name={name} value="1" aria-label="1 star" />
          <svg className="radio-stars__star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.86 6.4.78-4.72 4.4 1.22 6.33L12 17.06l-5.65 3.11 1.22-6.33-4.72-4.4 6.4-.78Z" /></svg>
        </label>
        <label className="radio-stars__option" style={{ '--radio-stars-i': 1 } as CSSProperties}>
          <input className="radio-stars__input" type="radio" name={name} value="2" aria-label="2 stars" />
          <svg className="radio-stars__star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.86 6.4.78-4.72 4.4 1.22 6.33L12 17.06l-5.65 3.11 1.22-6.33-4.72-4.4 6.4-.78Z" /></svg>
        </label>
        <label className="radio-stars__option" style={{ '--radio-stars-i': 2 } as CSSProperties}>
          <input className="radio-stars__input" type="radio" name={name} value="3" aria-label="3 stars" defaultChecked />
          <svg className="radio-stars__star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.86 6.4.78-4.72 4.4 1.22 6.33L12 17.06l-5.65 3.11 1.22-6.33-4.72-4.4 6.4-.78Z" /></svg>
        </label>
        <label className="radio-stars__option" style={{ '--radio-stars-i': 3 } as CSSProperties}>
          <input className="radio-stars__input" type="radio" name={name} value="4" aria-label="4 stars" />
          <svg className="radio-stars__star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.86 6.4.78-4.72 4.4 1.22 6.33L12 17.06l-5.65 3.11 1.22-6.33-4.72-4.4 6.4-.78Z" /></svg>
        </label>
        <label className="radio-stars__option" style={{ '--radio-stars-i': 4 } as CSSProperties}>
          <input className="radio-stars__input" type="radio" name={name} value="5" aria-label="5 stars" />
          <svg className="radio-stars__star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.86 6.4.78-4.72 4.4 1.22 6.33L12 17.06l-5.65 3.11 1.22-6.33-4.72-4.4 6.4-.78Z" /></svg>
        </label>
        </div>
        <span className="radio-stars__caption" aria-hidden="true" />
      </div>
    </>
  );
}
