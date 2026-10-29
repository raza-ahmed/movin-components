"use client";

import { useId, useState } from 'react';

const groups = (digits: string) => Array.from({ length: 4 }, (_, g) => digits.slice(g * 4, g * 4 + 4).padEnd(4, '•'));

const css = `
  @keyframes field-card-number-in { from { transform: translateY(-8px); opacity: 0; } to { transform: none; opacity: 1; } }
  .field-card-number { display: grid; gap: 12px; width: 250px; }
  .field-card-number__card { position: relative; width: 200px; height: 118px; margin: 0 auto; perspective: 700px; }
  .field-card-number__flip { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(0.3, 1.2, 0.4, 1); }
  .field-card-number[data-back] .field-card-number__flip { transform: rotateY(180deg); }
  .field-card-number__side { position: absolute; inset: 0; padding: 14px 16px; border-radius: 12px; backface-visibility: hidden; background: linear-gradient(135deg, light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529) 60%, light-dark(#f3f4f7, #1a1c1f)); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 14px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); color: light-dark(#373a40, #f1f2f3); }
  .field-card-number__chip { width: 26px; height: 19px; border-radius: 4px; background: linear-gradient(135deg, light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087)); box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-card-number__num { display: flex; gap: 7px; margin-top: 22px; font: 500 13px/1 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; }
  .field-card-number__d { display: inline-block; }
  .field-card-number__d[data-typed] { animation: field-card-number-in 0.25s cubic-bezier(0.3, 1.5, 0.5, 1); }
  .field-card-number__d:not([data-typed]) { color: light-dark(#6d7179, #7d8087); }
  .field-card-number__meta { position: absolute; left: 16px; right: 16px; bottom: 12px; display: flex; justify-content: space-between; color: light-dark(#50535b, #c6c8cd); font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; }
  .field-card-number__side--back { transform: rotateY(180deg); padding: 18px 0 0; }
  .field-card-number__stripe { height: 26px; background: light-dark(#fbfcfd, #121417); }
  .field-card-number__strip { display: flex; justify-content: flex-end; align-items: center; height: 24px; margin: 14px 16px 0; padding-right: 8px; border-radius: 3px; background: repeating-linear-gradient(-45deg, light-dark(#cbced3, #393c41) 0 4px, light-dark(#6d7179, #7d8087) 4px 8px); }
  .field-card-number__cvc { padding: 2px 6px; border-radius: 2px; background: light-dark(#fbfcfd, #121417); color: light-dark(#373a40, #f1f2f3); font: 500 12px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.12em; }
  .field-card-number__row { display: grid; grid-template-columns: 1fr 72px; gap: 8px; }
  .field-card-number__input { width: 100%; height: 40px; padding: 0 11px; border: 0; border-radius: 10px; outline: 0; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font: 500 13.5px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.04em; transition: box-shadow 0.2s; }
  .field-card-number__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .field-card-number__input::placeholder { color: light-dark(#6d7179, #7d8087); }
  @media (prefers-reduced-motion: reduce) {
    .field-card-number__flip { transition: none; }
    .field-card-number__d { animation: none !important; }
  }
`;

export function CardNumberInput() {
  const id = useId();
  const [num, setNum] = useState('');
  const [cvc, setCvc] = useState('');
  const [back, setBack] = useState(false);
  const shown = groups(num);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-card-number" data-back={back || undefined}>
        <div className="field-card-number__card" aria-hidden="true">
          <div className="field-card-number__flip">
            <div className="field-card-number__side">
              <div className="field-card-number__chip" />
              <div className="field-card-number__num">
                {shown.map((g, gi) => (
                  <span key={gi}>
                    {[...g].map((c, k) => {
                      const typed = gi * 4 + k < num.length;
                      return (
                        <span key={typed ? `t${k}` : `p${k}`} className="field-card-number__d" data-typed={typed || undefined}>
                          {c}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </div>
              <div className="field-card-number__meta">
                <span>A. Lovelace</span>
                <span>09/29</span>
              </div>
            </div>
            <div className="field-card-number__side field-card-number__side--back">
              <div className="field-card-number__stripe" />
              <div className="field-card-number__strip">
                <span className="field-card-number__cvc">{cvc.padEnd(3, '•')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="field-card-number__row">
          <input
            className="field-card-number__input"
            aria-label="Card number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={num.replace(/(\d{4})(?=\d)/g, '$1 ')}
            onFocus={() => setBack(false)}
            onChange={(e) => setNum(e.target.value.replace(/\D/g, '').slice(0, 16))}
          />
          <input
            id={id}
            className="field-card-number__input"
            aria-label="Security code"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="CVC"
            value={cvc}
            onFocus={() => setBack(true)}
            onBlur={() => setBack(false)}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
          />
        </div>
      </div>
    </>
  );
}
