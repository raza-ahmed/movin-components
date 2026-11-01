"use client";

import { useState } from 'react';

const STEPS = [
  { title: 'Collect', text: 'Save anything you like into a collection as you browse.' },
  { title: 'Arrange', text: 'Drag things into order and group them by project.' },
  { title: 'Share', text: 'Send one link and everyone sees the same set.' },
];
const GAP = 14;
const DOT = 6;

const css = `
  .card-onboarding { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); overflow: hidden; }
  .card-onboarding__art { position: relative; display: grid; place-items: center; height: 72px; border-radius: 10px; background: light-dark(#ebedf0, #232529); overflow: hidden; }
  .card-onboarding__step { animation: card-onboarding-in 0.4s cubic-bezier(0.3, 1.2, 0.5, 1) both; }
  .card-onboarding__step--back { animation-name: card-onboarding-back; }
  @keyframes card-onboarding-in { from { opacity: 0; transform: translateX(28px); } }
  @keyframes card-onboarding-back { from { opacity: 0; transform: translateX(-28px); } }
  .card-onboarding__shape { display: flex; gap: 6px; }
  .card-onboarding__shape span { width: 22px; height: 22px; border-radius: 6px; background: light-dark(#6d7179, #7d8087); }
  .card-onboarding__shape--0 span:nth-child(2) { background: light-dark(#50535b, #c6c8cd); border-radius: 50%; }
  .card-onboarding__shape--1 span:nth-child(1) { transform: translateY(6px); }
  .card-onboarding__shape--1 span:nth-child(3) { transform: translateY(-6px); background: light-dark(#50535b, #c6c8cd); }
  .card-onboarding__shape--2 span { border-radius: 50%; }
  .card-onboarding__shape--2 span:nth-child(2) { background: light-dark(#373a40, #f1f2f3); }
  .card-onboarding__title { margin: 12px 0 2px; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-onboarding__text { height: 32px; margin: 0; font-size: 11.5px; line-height: 1.4; color: light-dark(#50535b, #c6c8cd); }
  .card-onboarding__foot { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
  .card-onboarding__dots { position: relative; width: ${GAP * 2 + DOT}px; height: ${DOT}px; }
  .card-onboarding__dot { position: absolute; top: 0; width: ${DOT}px; height: ${DOT}px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); }
  /* One pill that stretches to the new dot with its leading edge, then pulls its trailing edge after it. */
  .card-onboarding__pill { position: absolute; top: 0; height: ${DOT}px; border-radius: ${DOT / 2}px; background: light-dark(#373a40, #f1f2f3); }
  .card-onboarding__btns { display: flex; gap: 6px; }
  .card-onboarding__btn { height: 28px; padding: 0 12px; border: 0; border-radius: 8px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer; }
  .card-onboarding__btn--ghost { background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); }
  .card-onboarding__btn:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .card-onboarding__step { animation: none; }
    .card-onboarding__pill { transition: none !important; }
  }
`;

export function OnboardingCard() {
  const [s, setS] = useState({ i: 0, back: false });
  const go = (i: number) => setS((o) => ({ i, back: i < o.i }));
  const last = s.i === STEPS.length - 1;
  const lead = '0.25s cubic-bezier(0.3, 1.2, 0.5, 1)';
  const trail = '0.3s cubic-bezier(0.3, 1.2, 0.5, 1) 0.12s';
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-onboarding" aria-roledescription="carousel" aria-label="Getting started">
        <div className="card-onboarding__art" aria-hidden="true">
          <div key={s.i} className={`card-onboarding__step${s.back ? ' card-onboarding__step--back' : ''}`}>
            <div className={`card-onboarding__shape card-onboarding__shape--${s.i}`}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
        <div key={s.i} className={`card-onboarding__step${s.back ? ' card-onboarding__step--back' : ''}`} aria-live="polite">
          <p className="card-onboarding__title">
            {s.i + 1}. {STEPS[s.i].title}
          </p>
          <p className="card-onboarding__text">{STEPS[s.i].text}</p>
        </div>
        <div className="card-onboarding__foot">
          <div className="card-onboarding__dots" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span key={i} className="card-onboarding__dot" style={{ left: i * GAP }} />
            ))}
            <span
              className="card-onboarding__pill"
              style={{
                left: s.i * GAP,
                right: (STEPS.length - 1 - s.i) * GAP,
                transition: s.back ? `left ${lead}, right ${trail}` : `right ${lead}, left ${trail}`,
              }}
            />
          </div>
          <div className="card-onboarding__btns">
            {s.i > 0 && (
              <button type="button" className="card-onboarding__btn card-onboarding__btn--ghost" onClick={() => go(s.i - 1)}>
                Back
              </button>
            )}
            <button type="button" className="card-onboarding__btn" onClick={() => go(last ? 0 : s.i + 1)}>
              {last ? 'Get started' : 'Next'}
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
