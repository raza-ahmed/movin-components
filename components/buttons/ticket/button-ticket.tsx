"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-ticket {
    position: relative;
    display: inline-flex;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: none;
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    cursor: pointer;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
    -webkit-tap-highlight-color: transparent;
  }

  .btn-ticket:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }

  /* Two half-circle notches bitten out of each side of the perforation. */
  .btn-ticket__main {
    display: grid;
    place-items: center;
    width: 140px;
    height: 58px;
    border-radius: 10px 0 0 10px;
    background: light-dark(#42454c, #e5e6e9);
    font-size: 15px;
    font-weight: 600;
    -webkit-mask: radial-gradient(circle 7px at 100% 0, transparent 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 7px at 100% 100%, transparent 98%, #000) bottom / 100% 51% no-repeat;
    mask: radial-gradient(circle 7px at 100% 0, transparent 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 7px at 100% 100%, transparent 98%, #000) bottom / 100% 51% no-repeat;
  }

  .btn-ticket__stub {
    display: grid;
    place-items: center;
    width: 46px;
    height: 58px;
    border-radius: 0 10px 10px 0;
    background: linear-gradient(to bottom, light-dark(rgba(251, 252, 253, 0.4), rgba(18, 20, 23, 0.4)) 50%, transparent 0) 0 0 / 1.5px 6px repeat-y, light-dark(#50535b, #c6c8cd);
    color: light-dark(#cbced3, #393c41);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    writing-mode: vertical-rl;
    transform-origin: 0 0;
    transition: rotate 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
    -webkit-mask: radial-gradient(circle 7px at 0 0, transparent 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 7px at 0 100%, transparent 98%, #000) bottom / 100% 51% no-repeat;
    mask: radial-gradient(circle 7px at 0 0, transparent 98%, #000) top / 100% 51% no-repeat, radial-gradient(circle 7px at 0 100%, transparent 98%, #000) bottom / 100% 51% no-repeat;
  }

  .btn-ticket:hover .btn-ticket__stub {
    rotate: 4deg;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-ticket__stub {
      transition: none;
    }
    .btn-ticket:hover .btn-ticket__stub {
      rotate: none;
    }
  }
`;

export function TicketButton({ label = 'Get tickets', alt = 'Admitted' }: { label?: string; alt?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initTicket(ref.current, label, alt) : undefined), [label, alt]);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-ticket" type="button">
        <span className="btn-ticket__main">{label}</span>
        <span className="btn-ticket__stub" aria-hidden="true">
          Admit one
        </span>
      </button>
    </>
  );
}

// Tug, rip along the perforation, tumble; then a fresh stub slides back in.
function initTicket(root: HTMLElement, label: string, alt: string): (() => void) | undefined {
  const main = root.querySelector<HTMLElement>('.btn-ticket__main');
  const stub = root.querySelector<HTMLElement>('.btn-ticket__stub');
  if (!main || !stub) return;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;
  let timer = 0;

  const restore = () => {
    main.textContent = label;
    stub.style.visibility = '';
    if (!reduced()) {
      stub.animate([{ transform: 'translateX(18px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.3, 1.4, 0.5, 1)' });
    }
    busy = false;
  };

  const tear = () => {
    if (busy) return;
    busy = true;
    main.textContent = alt;
    if (reduced()) {
      stub.style.visibility = 'hidden';
      timer = window.setTimeout(restore, 1600);
      return;
    }
    const fall = stub.animate(
      [
        { transform: 'none', offset: 0 },
        { transform: 'translate(2px, 0) rotate(5deg)', offset: 0.12 },
        { transform: 'translate(8px, 4px) rotate(16deg)', offset: 0.28, easing: 'cubic-bezier(0.45, 0, 1, 1)' },
        { transform: 'translate(46px, 170px) rotate(78deg)', opacity: 0, offset: 1 },
      ],
      { duration: 950, fill: 'forwards' },
    );
    main.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 220, easing: 'ease-out' });
    fall.onfinish = () => {
      timer = window.setTimeout(() => {
        fall.cancel();
        restore();
      }, 700);
    };
  };

  root.addEventListener('click', tear);
  return () => {
    root.removeEventListener('click', tear);
    clearTimeout(timer);
    stub.getAnimations().forEach((a) => a.cancel());
    stub.style.visibility = '';
    main.textContent = label;
  };
}
