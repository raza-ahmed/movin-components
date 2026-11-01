"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .card-highlight { box-sizing: border-box; margin: 0; width: 240px; padding: 16px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-highlight__mark-q { display: block; height: 22px; font: 700 40px/1 Georgia, serif; color: light-dark(#6d7179, #7d8087); }
  .card-highlight__quote { margin: 4px 0 14px; font-size: 13px; line-height: 1.55; color: light-dark(#373a40, #f1f2f3); }
  /* The marker is a background that grows from 0 to full width; clone keeps it going across line breaks. */
  .card-highlight__hl {
    padding: 0 1px;
    background: linear-gradient(light-dark(#cbced3, #393c41), light-dark(#cbced3, #393c41)) no-repeat 0 60% / 0% 80%;
    color: inherit;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    transition: background-size 0.6s cubic-bezier(0.5, 0, 0.2, 1);
  }
  .card-highlight--on .card-highlight__hl { background-size: 100% 80%; }
  .card-highlight--on .card-highlight__hl--2 { transition-delay: 0.6s; }
  .card-highlight:not(.card-highlight--on) .card-highlight__hl { transition: none; }
  .card-highlight__who { display: flex; align-items: center; gap: 10px; }
  .card-highlight__avatar { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font-size: 11px; font-weight: 700; }
  .card-highlight__name { display: block; font-size: 12px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-highlight__role { display: block; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .card-highlight__hl { transition: none; }
  }
`;

export function HighlightCard() {
  const [on, setOn] = useState(false);
  const box = useRef<HTMLElement>(null);

  // Sweep once the card is mostly in view; hovering sweeps again.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.6 });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);
  const replay = () => {
    setOn(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
  };

  return (
    <>
      <style>
        {css}
      </style>
      <figure ref={box} className={`card-highlight${on ? ' card-highlight--on' : ''}`} onPointerEnter={replay}>
        <span className="card-highlight__mark-q" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="card-highlight__quote">
          We shipped the redesign <mark className="card-highlight__hl">two weeks early</mark>, and the motion finally feels like{' '}
          <mark className="card-highlight__hl card-highlight__hl--2">one product instead of five</mark>.
        </blockquote>
        <figcaption className="card-highlight__who">
          <span className="card-highlight__avatar" aria-hidden="true">
            DK
          </span>
          <span>
            <span className="card-highlight__name">Dana Kole</span>
            <span className="card-highlight__role">Product designer</span>
          </span>
        </figcaption>
      </figure>
    </>
  );
}
