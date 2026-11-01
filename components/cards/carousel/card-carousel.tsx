"use client";

import { useRef, useState } from 'react';

const SW = 212;
const SLIDES = [
  { title: 'Dunes', note: 'Sand ridges at first light' },
  { title: 'Harbour', note: 'Boats on a still morning' },
  { title: 'Orchard', note: 'Rows of pear trees in May' },
  { title: 'Quarry', note: 'Cut stone and green water' },
];

const css = `
  .card-carousel { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-carousel__view { position: relative; }
  .card-carousel__track { display: flex; width: ${SW}px; height: 112px; border-radius: 10px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-x: contain; }
  .card-carousel__track::-webkit-scrollbar { display: none; }
  .card-carousel__track:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-carousel__slide { flex: 0 0 ${SW}px; height: 100%; scroll-snap-align: start; }
  .card-carousel__slide svg { display: block; width: 100%; height: 100%; }
  .card-carousel__bg { fill: light-dark(#ebedf0, #232529); }
  .card-carousel__a { fill: light-dark(#cbced3, #393c41); }
  .card-carousel__b { fill: light-dark(#5f626a, #a7abb2); }
  .card-carousel__c { fill: light-dark(#50535b, #c6c8cd); }
  .card-carousel__nav { position: absolute; top: 50%; display: grid; place-items: center; width: 24px; height: 24px; margin-top: -12px; padding: 0; border: 0; border-radius: 50%; background: light-dark(#fbfcfd, #121417); color: light-dark(#373a40, #f1f2f3); cursor: pointer; opacity: 0.9; transition: opacity 0.2s; }
  .card-carousel__nav:disabled { opacity: 0; pointer-events: none; }
  .card-carousel__nav:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-carousel__nav svg { width: 12px; height: 12px; }
  .card-carousel__nav--prev { left: 6px; }
  .card-carousel__nav--next { right: 6px; }
  .card-carousel__foot { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .card-carousel__title { margin: 0; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-carousel__note { margin: 1px 0 0; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-carousel__dots { display: flex; gap: 4px; }
  .card-carousel__dot { height: 6px; border-radius: 3px; background: light-dark(#373a40, #f1f2f3); }
`;

// Four simple scenes, one per slide.
function Scene({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 212 112" aria-hidden="true">
      <rect className="card-carousel__bg" width={212} height={112} />
      {i === 0 && (
        <>
          <path className="card-carousel__a" d="M0 80 Q60 50 120 76 T212 70 V112 H0 Z" />
          <path className="card-carousel__b" d="M0 96 Q80 74 150 92 T212 90 V112 H0 Z" />
        </>
      )}
      {i === 1 && (
        <>
          <rect className="card-carousel__a" y={78} width={212} height={34} />
          <path className="card-carousel__c" d="M60 74 h40 l-6 10 h-28 z M78 74 V46 l16 22 z" />
          <path className="card-carousel__b" d="M130 76 h30 l-5 8 h-20 z M144 76 V56 l12 16 z" />
        </>
      )}
      {i === 2 && [30, 70, 110, 150, 190].map((x) => <circle key={x} className={x % 80 ? 'card-carousel__b' : 'card-carousel__c'} cx={x} cy={70} r={14} />)}
      {i === 3 && (
        <>
          <path className="card-carousel__a" d="M0 40 H70 V60 H130 V40 H212 V112 H0 Z" />
          <rect className="card-carousel__b" x={76} y={70} width={48} height={26} rx={3} />
        </>
      )}
    </svg>
  );
}

export function CarouselCard() {
  const [p, setP] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const at = Math.round(p);
  const go = (d: number) => track.current!.scrollBy({ left: d * SW, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-carousel" aria-roledescription="carousel" aria-label="Places">
        <div className="card-carousel__view">
          <div ref={track} className="card-carousel__track" tabIndex={0} aria-label="Slides" onScroll={(e) => setP(e.currentTarget.scrollLeft / SW)}>
            {SLIDES.map((s, i) => (
              <div key={s.title} className="card-carousel__slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${SLIDES.length}: ${s.title}`}>
                <Scene i={i} />
              </div>
            ))}
          </div>
          <button type="button" className="card-carousel__nav card-carousel__nav--prev" aria-label="Previous slide" disabled={at === 0} onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="card-carousel__nav card-carousel__nav--next" aria-label="Next slide" disabled={at === SLIDES.length - 1} onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="card-carousel__foot">
          <div>
            <p className="card-carousel__title">{SLIDES[at].title}</p>
            <p className="card-carousel__note">{SLIDES[at].note}</p>
          </div>
          {/* Each dot's width and strength follow the scroll position itself, so they stretch mid-swipe. */}
          <div className="card-carousel__dots" aria-hidden="true">
            {SLIDES.map((s, i) => {
              const k = Math.max(0, 1 - Math.abs(i - p));
              return <span key={s.title} className="card-carousel__dot" style={{ width: 6 + 12 * k, opacity: 0.3 + 0.7 * k }} />;
            })}
          </div>
        </div>
      </article>
    </>
  );
}
