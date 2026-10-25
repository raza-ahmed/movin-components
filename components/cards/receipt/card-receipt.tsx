"use client";

const css = `
  .card-receipt {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    outline: none;
  }

  .card-receipt__terminal {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    width: 184px;
    height: 84px;
    padding: 14px 16px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 14px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
  }

  .card-receipt:focus-visible .card-receipt__terminal {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }

  .card-receipt__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-receipt__title {
    color: light-dark(#5f626a, #a7abb2);
    font-size: 11px;
  }

  .card-receipt__led {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: light-dark(#cbced3, #393c41);
  }

  .card-receipt__total {
    margin-top: 4px;
    color: light-dark(#42454c, #e5e6e9);
    font-size: 22px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .card-receipt__slot {
    position: absolute;
    right: 18px;
    bottom: 8px;
    left: 18px;
    height: 3px;
    border-radius: 2px;
    background: light-dark(#fbfcfd, #121417);
  }

  /* The paper lives in a window under the slot and feeds down out of it. */
  .card-receipt__feed {
    width: 148px;
    height: 132px;
    margin-top: -12px;
    overflow: hidden;
  }

  .card-receipt__paper {
    box-sizing: border-box;
    padding: 18px 12px 18px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#dbdde1, #2e3035);
    font: 10px/1.7 ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.5, 0, 0.75, 0);
    -webkit-mask: conic-gradient(from -45deg at bottom, transparent, #000 1deg 89deg, transparent 90deg) 50% / 8px 100%;
    mask: conic-gradient(from -45deg at bottom, transparent, #000 1deg 89deg, transparent 90deg) 50% / 8px 100%;
  }

  .card-receipt__line {
    display: flex;
    justify-content: space-between;
  }

  .card-receipt__line--total {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px dashed light-dark(#5f626a, #a7abb2);
    color: light-dark(#fbfcfd, #121417);
    font-weight: 600;
  }

  .card-receipt__barcode {
    height: 16px;
    margin-top: 8px;
    background: repeating-linear-gradient(90deg, light-dark(#dbdde1, #2e3035) 0 1px, transparent 1px 3px, light-dark(#dbdde1, #2e3035) 3px 5px, transparent 5px 6px, light-dark(#dbdde1, #2e3035) 6px 7px, transparent 7px 10px);
  }

  /* Printing: the paper feeds in mechanical steps, the light blinks. */
  .card-receipt:hover .card-receipt__paper,
  .card-receipt:focus-visible .card-receipt__paper {
    transform: translateY(0);
    transition: transform 1.5s steps(16, end) 0.15s;
  }

  .card-receipt:hover .card-receipt__led,
  .card-receipt:focus-visible .card-receipt__led {
    animation: card-receipt-blink 0.25s steps(1) 7;
  }

  @keyframes card-receipt-blink {
    50% {
      background: light-dark(#42454c, #e5e6e9);
      box-shadow: 0 0 6px light-dark(#42454c, #e5e6e9);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card-receipt__paper,
    .card-receipt:hover .card-receipt__paper,
    .card-receipt:focus-visible .card-receipt__paper {
      transition: none;
    }
    .card-receipt:hover .card-receipt__led,
    .card-receipt:focus-visible .card-receipt__led {
      animation: none;
    }
  }
`;
const ITEMS: [string, string][] = [
  ['Espresso x2', '7.00'],
  ['Croissant', '4.50'],
  ['Sketchbook', '30.50'],
];

// Pure CSS: on hover the paper feeds out of the slot in steps() jerks while
// the light blinks; leaving pulls it back in one smooth motion.
export function ReceiptCard() {
  return (
    <>
      <style>{css}</style>
      <div className="card-receipt" tabIndex={0}>
        <div className="card-receipt__terminal">
          <div className="card-receipt__row">
            <span className="card-receipt__title">Order #2481</span>
            <span className="card-receipt__led" aria-hidden="true" />
          </div>
          <div className="card-receipt__total">42.00</div>
          <div className="card-receipt__slot" aria-hidden="true" />
        </div>
        <div className="card-receipt__feed">
          <div className="card-receipt__paper">
            {ITEMS.map(([name, price]) => (
              <div key={name} className="card-receipt__line">
                <span>{name}</span>
                <span>{price}</span>
              </div>
            ))}
            <div className="card-receipt__line card-receipt__line--total">
              <span>Total</span>
              <span>42.00</span>
            </div>
            <div className="card-receipt__barcode" aria-hidden="true" />
          </div>
        </div>
      </div>
    </>
  );
}
