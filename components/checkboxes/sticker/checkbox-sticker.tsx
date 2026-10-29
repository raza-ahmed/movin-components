"use client";

import { useId, useState } from 'react';

const STAR = 'M15 2.5l3.6 7.4 8.1 1.1-5.9 5.7 1.4 8.1L15 21l-7.2 3.8 1.4-8.1-5.9-5.7 8.1-1.1Z';

const css = `
  /* Slapped down at an angle, it flattens out and settles. */
  @keyframes cb-sticker-slap { 0% { transform: rotate(-38deg) scale(1.6); opacity: 0; } 45% { transform: rotate(6deg) scale(0.92); opacity: 1; } 70% { transform: rotate(-3deg) scale(1.04); } 100% { transform: rotate(-8deg) scale(1); opacity: 1; } }
  @keyframes cb-sticker-sheen { from { transform: translateX(-24px) skewX(-20deg); } to { transform: translateX(34px) skewX(-20deg); } }
  .cb-sticker { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-sticker__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-sticker__box { position: relative; width: 30px; height: 30px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41); }
  .cb-sticker__input:focus-visible + .cb-sticker__box { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .cb-sticker__star { position: absolute; inset: -5px; width: 40px; height: 40px; overflow: visible; opacity: 0; transform: rotate(-8deg); filter: drop-shadow(0 2px 2px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4))); }
  .cb-sticker__face { fill: light-dark(#373a40, #f1f2f3); stroke: light-dark(#fbfcfd, #121417); stroke-width: 2.4; stroke-linejoin: round; paint-order: stroke; }
  .cb-sticker__shine { fill: color-mix(in oklab, light-dark(#fbfcfd, #121417) 65%, transparent); transform: translateX(-24px); }
  .cb-sticker__input:checked + .cb-sticker__box .cb-sticker__star { opacity: 1; }
  .cb-sticker[data-armed] .cb-sticker__input:checked + .cb-sticker__box .cb-sticker__star { animation: cb-sticker-slap 0.5s cubic-bezier(0.3, 0.9, 0.4, 1) both; }
  .cb-sticker[data-armed] .cb-sticker__input:checked + .cb-sticker__box .cb-sticker__shine { animation: cb-sticker-sheen 0.6s ease-in-out 0.45s both; }
  .cb-sticker[data-armed] .cb-sticker__input:not(:checked) + .cb-sticker__box .cb-sticker__star { transition: opacity 0.2s, transform 0.25s; transform: rotate(-20deg) scale(0.6); }
  @media (prefers-reduced-motion: reduce) {
    .cb-sticker * { animation: none !important; transition: none !important; }
  }
`;

export function StickerCheckbox() {
  const [armed, setArmed] = useState(false);
  const clip = `cb-sticker-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-sticker" data-armed={armed || undefined}>
        <input className="cb-sticker__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-sticker__box" aria-hidden="true">
          <svg className="cb-sticker__star" viewBox="-5 -5 40 40">
            <defs>
              <clipPath id={clip}>
                <path d={STAR} />
              </clipPath>
            </defs>
            <path className="cb-sticker__face" d={STAR} />
            {/* The sheen: a pale band clipped to the star, swept across once it lands. */}
            <g clipPath={`url(#${clip})`}>
              <rect className="cb-sticker__shine" x="0" y="-2" width="9" height="34" />
            </g>
          </svg>
        </span>
        Favourite
      </label>
    </>
  );
}
