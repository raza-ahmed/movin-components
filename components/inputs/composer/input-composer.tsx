"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-composer {
    --field-composer-max: 132px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    color: #ededed;
    font-size: 14px;
  }

  .field-composer__thread {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 6px;
    height: 120px;
    margin: 0;
    /* The thread's clip edge meets the box, so a sent message rises out of it. */
    padding: 0 2px 10px;
    overflow: hidden;
    list-style: none;
    mask-image: linear-gradient(transparent, rgba(0, 0, 0, 1) 30%);
  }

  .field-composer__msg {
    align-self: flex-start;
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 14px 14px 14px 4px;
    background: #282828;
    line-height: 1.35;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .field-composer__msg--mine {
    align-self: flex-end;
    border-radius: 14px 14px 4px 14px;
    background: #ededed;
    color: #111111;
  }

  /* The button sits on the box's bottom edge, so it rides down as the box grows. */
  .field-composer__box {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    padding: 6px 6px 6px 14px;
    border: 1px solid #3a3a3a;
    border-radius: 22px;
    background: #202020;
    transition: border-color 0.2s;
  }

  .field-composer__box:focus-within {
    border-color: #a7a7a7;
  }

  .field-composer__input {
    flex: 1;
    box-sizing: border-box;
    height: 32px;
    max-height: var(--field-composer-max);
    margin: 0;
    padding: 6px 0;
    overflow-y: hidden;
    border: 0;
    outline: none;
    background: transparent;
    color: #f6f6f6;
    font: inherit;
    line-height: 20px;
    resize: none;
    transition: height 0.32s cubic-bezier(0.3, 1.35, 0.5, 1);
  }

  .field-composer__input::placeholder {
    color: #7c7c7c;
  }

  .field-composer--scroll .field-composer__input {
    overflow-y: auto;
  }

  .field-composer__send {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 32px;
    height: 32px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #3a3a3a;
    color: #7c7c7c;
    cursor: default;
    transform: rotate(90deg) scale(0.85);
    transition: background-color 0.2s, color 0.2s, transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
  }

  .field-composer__send:focus-visible {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  /* Awake: it fills and turns to point up, ready to send. */
  .field-composer__send[aria-disabled='false'] {
    background: #ededed;
    color: #111111;
    cursor: pointer;
    transform: none;
  }

  .field-composer__send[aria-disabled='false']:active {
    transform: scale(0.88);
  }

  .field-composer__send svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-composer__input,
    .field-composer__send {
      transition: none;
    }
  }
`;

export function ComposerInput() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initComposer(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="field-composer">
        <ol className="field-composer__thread" role="log" aria-label="Messages">
          <li className="field-composer__msg">Did the build pass?</li>
          <li className="field-composer__msg field-composer__msg--mine">All green. Shipping now</li>
        </ol>
        <div className="field-composer__box">
          <textarea className="field-composer__input" rows={1} placeholder="Write a message" aria-label="Message" />
          <button className="field-composer__send" type="button" aria-label="Send" aria-disabled="true">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 13V3.5M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// The textarea springs to its content height (measured at height auto
// without that frame showing); sending FLIPs the thread so the message
// rises out of the box while the older ones step up.
function initComposer(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLTextAreaElement>('.field-composer__input');
  const send = root.querySelector<HTMLButtonElement>('.field-composer__send');
  const thread = root.querySelector<HTMLElement>('.field-composer__thread');
  if (!input || !send || !thread) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spring = 'cubic-bezier(0.3, 1.25, 0.5, 1)';
  const sent: HTMLElement[] = [];

  const fit = () => {
    const was = input.style.height;
    input.style.transition = 'none';
    input.style.height = 'auto';
    const want = input.scrollHeight;
    const max = parseFloat(getComputedStyle(input).maxHeight) || Infinity;
    input.style.height = was;
    void input.offsetHeight;
    input.style.transition = '';
    input.style.height = `${Math.min(want, max)}px`;
    root.classList.toggle('field-composer--scroll', want > max);
    send.setAttribute('aria-disabled', String(!input.value.trim()));
  };
  const post = () => {
    const text = input.value.trim();
    if (!text) return;
    const olds = Array.from(thread.children).slice(-5) as HTMLElement[];
    const before = olds.map((m) => m.getBoundingClientRect().top);
    const from = input.getBoundingClientRect();
    const li = document.createElement('li');
    li.className = 'field-composer__msg field-composer__msg--mine';
    li.textContent = text;
    thread.appendChild(li);
    sent.push(li);
    // Messages scrolled out of sight are not kept. React never re-renders the
    // thread, so removing its first messages here is safe.
    while (thread.children.length > 6) thread.firstElementChild?.remove();
    input.value = '';
    fit();
    if (reduce) return;
    olds.forEach((m, i) => {
      const dy = before[i] - m.getBoundingClientRect().top;
      if (dy) m.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 380, easing: spring });
    });
    const to = li.getBoundingClientRect();
    li.animate(
      [
        { opacity: 0.3, transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(0.92)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 460, easing: spring },
    );
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      post();
    }
  };
  const click = () => {
    post();
    input.focus();
  };

  input.addEventListener('input', fit);
  input.addEventListener('keydown', key);
  send.addEventListener('click', click);
  fit();
  return () => {
    input.removeEventListener('input', fit);
    input.removeEventListener('keydown', key);
    send.removeEventListener('click', click);
    sent.forEach((li) => li.remove());
  };
}
