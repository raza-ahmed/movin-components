"use client";

const css = `
  .cb-bookmark {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .cb-bookmark__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .cb-bookmark__icon {
    display: grid;
    place-items: start center;
    width: 28px;
    height: 34px;
  }

  .cb-bookmark__input:focus-visible + .cb-bookmark__icon {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* The outline is the ribbon shape in grey with an inset dark copy over it. */
  .cb-bookmark__ribbon {
    position: relative;
    width: 22px;
    height: 30px;
    background: #7c7c7c;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 74%, 0 100%);
    transform-origin: 50% 0;
  }

  .cb-bookmark__ribbon::before {
    content: '';
    position: absolute;
    inset: 2px 2px 0;
    background: #111111;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 3px), 50% calc(74% - 1px), 0 calc(100% - 3px));
  }

  .cb-bookmark__fill {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, #f6f6f6, #c9c9c9);
    transform: scaleY(0);
    transform-origin: 50% 0;
    transition: transform 0.2s ease-in;
  }

  .cb-bookmark__input:checked + .cb-bookmark__icon .cb-bookmark__fill {
    transform: scaleY(1);
    transition: transform 0.35s cubic-bezier(0.3, 0, 0.3, 1);
  }

  /* Plays only when it becomes checked (the rule starts applying), never on load. */
  .cb-bookmark__input:checked + .cb-bookmark__icon .cb-bookmark__ribbon {
    animation: cb-bookmark-swing 1.1s cubic-bezier(0.4, 0, 0.6, 1) 0.25s;
  }

  @keyframes cb-bookmark-swing {
    0% {
      transform: rotate(0deg);
    }
    18% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-9deg);
    }
    60% {
      transform: rotate(5deg);
    }
    80% {
      transform: rotate(-2deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-bookmark__fill,
    .cb-bookmark__input:checked + .cb-bookmark__icon .cb-bookmark__fill {
      transition: none;
    }
    .cb-bookmark__input:checked + .cb-bookmark__icon .cb-bookmark__ribbon {
      animation: none;
    }
  }
`;
export function BookmarkCheckbox() {
  return (
    <>
      <style>{css}</style>
      <label className="cb-bookmark">
        <input className="cb-bookmark__input" type="checkbox" />
        <span className="cb-bookmark__icon" aria-hidden="true">
          <span className="cb-bookmark__ribbon">
            <span className="cb-bookmark__fill" />
          </span>
        </span>
        <span className="cb-bookmark__label">Save for later</span>
      </label>
    </>
  );
}
