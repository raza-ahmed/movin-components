"use client";

import { useEffect, useRef, useState } from 'react';

type Stage = 'idle' | 'printing' | 'paid' | 'tear';

const css = `
  .btn-receipt { position: relative; width: 176px; height: 184px; }
  .btn-receipt__button {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 176px;
    height: 48px;
    border: none;
    border-radius: 14px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .btn-receipt__button:active { transform: scale(0.97); }
  .btn-receipt__button[aria-disabled='true'] { cursor: default; }
  .btn-receipt__button:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  /* The printer slot along the bottom edge. */
  .btn-receipt__button::after { content: ''; position: absolute; left: 30px; right: 30px; bottom: 6px; height: 3px; border-radius: 2px; background: light-dark(#fbfcfd, #121417); opacity: 0.3; }
  .btn-receipt__check { width: 16px; height: 16px; }
  .btn-receipt__mouth { position: absolute; z-index: 1; left: 34px; right: 34px; top: 42px; height: 142px; overflow: hidden; }
  .btn-receipt__paper {
    margin: 0;
    padding: 12px 10px 16px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-top: 0;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#50535b, #c6c8cd);
    font: 10px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    clip-path: inset(0 0 100% 0);
    -webkit-mask: linear-gradient(#000 0 0) top / 100% calc(100% - 5px) no-repeat, conic-gradient(from -45deg at 50% 100%, #000 90deg, transparent 0) bottom / 8px 5px repeat-x;
    mask: linear-gradient(#000 0 0) top / 100% calc(100% - 5px) no-repeat, conic-gradient(from -45deg at 50% 100%, #000 90deg, transparent 0) bottom / 8px 5px repeat-x;
  }
  .btn-receipt__row { display: flex; justify-content: space-between; }
  .btn-receipt__row--total { color: light-dark(#373a40, #f1f2f3); font-weight: 700; }
  .btn-receipt__rule { border-top: 1px dashed light-dark(#cbced3, #393c41); margin: 4px 0; }
  /* The paper comes out in jerks, a line at a time, the way a receipt printer advances it. */
  .btn-receipt--printing .btn-receipt__paper { animation: btn-receipt-feed 1.3s steps(7, end) forwards; }
  .btn-receipt--paid .btn-receipt__paper { clip-path: inset(0); }
  .btn-receipt--tear .btn-receipt__paper { clip-path: inset(0); animation: btn-receipt-tear 0.6s cubic-bezier(0.5, 0, 0.8, 0.6) forwards; }
  @keyframes btn-receipt-feed {
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0); }
  }
  @keyframes btn-receipt-tear {
    from { transform: none; opacity: 1; }
    to { transform: translate(12px, 70px) rotate(9deg); opacity: 0; }
  }
  .btn-receipt__status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) {
    .btn-receipt--printing .btn-receipt__paper { animation: none; clip-path: inset(0); }
    .btn-receipt--tear .btn-receipt__paper { animation: btn-receipt-fade 0.3s forwards; }
    @keyframes btn-receipt-fade {
      to { opacity: 0; }
    }
  }
`;

export function ReceiptButton() {
  const [stage, setStage] = useState<Stage>('idle');
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const pay = () => {
    if (stage !== 'idle') return;
    setStage('printing');
    const at = (ms: number, s: Stage) => timers.current.push(window.setTimeout(() => setStage(s), ms));
    at(1400, 'paid');
    at(2600, 'tear');
    at(3250, 'idle');
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className={`btn-receipt btn-receipt--${stage}`}>
        <button type="button" className="btn-receipt__button" aria-disabled={stage !== 'idle'} onClick={pay}>
          {stage === 'idle' ? (
            'Pay $24.00'
          ) : stage === 'printing' ? (
            'Printing…'
          ) : (
            <>
              <svg
                className="btn-receipt__check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              Paid
            </>
          )}
        </button>
        <div className="btn-receipt__mouth" aria-hidden="true">
          <div className="btn-receipt__paper">
            <div className="btn-receipt__row">
              <span>ORDER</span>
              <span>#1042</span>
            </div>
            <div className="btn-receipt__rule" />
            <div className="btn-receipt__row">
              <span>Tote bag</span>
              <span>20.00</span>
            </div>
            <div className="btn-receipt__row">
              <span>Shipping</span>
              <span>4.00</span>
            </div>
            <div className="btn-receipt__rule" />
            <div className="btn-receipt__row btn-receipt__row--total">
              <span>TOTAL</span>
              <span>$24.00</span>
            </div>
            <div className="btn-receipt__row">
              <span>PAID</span>
              <span>CARD 4242</span>
            </div>
          </div>
        </div>
        <span className="btn-receipt__status" role="status">
          {stage === 'paid' ? 'Paid $24.00. Receipt printed.' : ''}
        </span>
      </div>
    </>
  );
}
