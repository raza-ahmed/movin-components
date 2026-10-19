"use client";

const css = `
  .toggle-eye {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-eye__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .toggle-eye__eye {
    position: relative;
    display: block;
    width: 64px;
    height: 40px;
    border-radius: 8px;
  }

  .toggle-eye__input:focus-visible + .toggle-eye__eye {
    outline: 2px solid #a7a7a7;
    outline-offset: 4px;
  }

  .toggle-eye__ball {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #ededed;
    clip-path: path('M3 20C15 5 49 5 61 20C49 35 15 35 3 20Z');
  }

  .toggle-eye__iris {
    position: absolute;
    top: 9px;
    left: 21px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 36% 32%, #f6f6f6 0 2px, transparent 2.5px),
      radial-gradient(circle, #111111 0 4px, #4d4d4d 5px, #7c7c7c 70%, #3a3a3a 72%);
  }

  /* The lids meet in the middle when shut and fold away when open. */
  .toggle-eye__lid {
    position: absolute;
    left: 0;
    width: 100%;
    height: 51%;
    background: #3a3a3a;
    transition: transform 0.35s cubic-bezier(0.5, 0, 0.3, 1.2);
  }

  .toggle-eye__lid--top {
    top: 0;
    transform-origin: 50% 0;
  }

  .toggle-eye__lid--bottom {
    bottom: 0;
    transform-origin: 50% 100%;
  }

  .toggle-eye__lines {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    stroke-width: 2;
  }

  .toggle-eye__outline {
    stroke: #a7a7a7;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .toggle-eye__lashes {
    stroke: #c9c9c9;
    transition: opacity 0.15s 0.1s;
  }

  .toggle-eye__input:checked + .toggle-eye__eye .toggle-eye__lid {
    transform: scaleY(0);
    animation: toggle-eye-blink 4.5s ease-in-out 2.2s infinite;
  }

  .toggle-eye__input:checked + .toggle-eye__eye .toggle-eye__iris {
    animation: toggle-eye-glance 1.5s ease-in-out 0.3s;
  }

  .toggle-eye__input:checked + .toggle-eye__eye .toggle-eye__outline {
    opacity: 1;
  }

  .toggle-eye__input:checked + .toggle-eye__eye .toggle-eye__lashes {
    opacity: 0;
    transition-delay: 0s;
  }

  @keyframes toggle-eye-glance {
    0%,
    100% {
      transform: translateX(0);
    }
    22%,
    38% {
      transform: translateX(-9px);
    }
    58%,
    76% {
      transform: translateX(8px);
    }
  }

  @keyframes toggle-eye-blink {
    0%,
    93%,
    100% {
      transform: scaleY(0);
    }
    96.5% {
      transform: scaleY(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-eye__lid,
    .toggle-eye__outline,
    .toggle-eye__lashes {
      transition: none;
    }
    .toggle-eye__input:checked + .toggle-eye__eye .toggle-eye__lid,
    .toggle-eye__input:checked + .toggle-eye__eye .toggle-eye__iris {
      animation: none;
    }
  }
`;
export function EyeToggle() {
  return (
    <>
      <style>{css}</style>
      <label className="toggle-eye">
        <input className="toggle-eye__input" type="checkbox" role="switch" />
        <span className="toggle-eye__eye" aria-hidden="true">
          <span className="toggle-eye__ball">
            <span className="toggle-eye__iris" />
            <span className="toggle-eye__lid toggle-eye__lid--top" />
            <span className="toggle-eye__lid toggle-eye__lid--bottom" />
          </span>
          <svg className="toggle-eye__lines" viewBox="0 0 64 40" fill="none" strokeLinecap="round">
            <path className="toggle-eye__outline" d="M3 20C15 5 49 5 61 20C49 35 15 35 3 20Z" />
            <path className="toggle-eye__lashes" d="M3 20C15 31 49 31 61 20M16 26.5l-3 5M26 28.8l-1 5.5M38 28.8l1 5.5M48 26.5l3 5" />
          </svg>
        </span>
        <span className="toggle-eye__label">Visible</span>
      </label>
    </>
  );
}
