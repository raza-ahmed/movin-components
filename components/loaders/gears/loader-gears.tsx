"use client";

const css = `
  /* Drawn at 1:1, so each gear can turn about its centre in SVG units. */
  .loader-gears {
    --loader-gears-t: 4s;
    display: inline-block;
    width: 64px;
    height: 44px;
  }

  .loader-gears svg {
    display: block;
    width: 64px;
    height: 44px;
    overflow: visible;
  }

  .loader-gears__big,
  .loader-gears__small {
    transform-box: view-box;
  }

  .loader-gears__big {
    fill: light-dark(#6d7179, #7d8087);
    transform-origin: 22px 22px;
    animation: loader-gears-cw var(--loader-gears-t) linear infinite;
  }

  /* Seven teeth to ten: a full turn takes 7/10 as long, the other way. */
  .loader-gears__small {
    fill: light-dark(#42454c, #e5e6e9);
    transform-origin: 47.5px 22px;
    animation: loader-gears-ccw calc(var(--loader-gears-t) * 0.7) linear infinite;
  }

  @keyframes loader-gears-cw {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes loader-gears-ccw {
    to {
      transform: rotate(-360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-gears__big,
    .loader-gears__small {
      animation: none;
    }
  }
`;
// Ten and seven teeth on a common module, centres 25.5 apart; both have a
// tooth at 0deg, which leaves the small gear a gap facing the big one.
const BIG =
  'M34.12 19.92L39.32 20.36A17.40 17.40 0 0 1 39.32 23.64L34.12 24.08A12.30 12.30 0 0 1 33.03 27.45L36.98 30.86A17.40 17.40 0 0 1 35.05 33.51L30.59 30.81A12.30 12.30 0 0 1 27.72 32.89L28.91 37.97A17.40 17.40 0 0 1 25.80 38.98L23.77 34.17A12.30 12.30 0 0 1 20.23 34.17L18.20 38.98A17.40 17.40 0 0 1 15.09 37.97L16.28 32.89A12.30 12.30 0 0 1 13.41 30.81L8.95 33.51A17.40 17.40 0 0 1 7.02 30.86L10.97 27.45A12.30 12.30 0 0 1 9.88 24.08L4.68 23.64A17.40 17.40 0 0 1 4.68 20.36L9.88 19.92A12.30 12.30 0 0 1 10.97 16.55L7.02 13.14A17.40 17.40 0 0 1 8.95 10.49L13.41 13.19A12.30 12.30 0 0 1 16.28 11.11L15.09 6.03A17.40 17.40 0 0 1 18.20 5.02L20.23 9.83A12.30 12.30 0 0 1 23.77 9.83L25.80 5.02A17.40 17.40 0 0 1 28.91 6.03L27.72 11.11A12.30 12.30 0 0 1 30.59 13.19L35.05 10.49A17.40 17.40 0 0 1 36.98 13.14L33.03 16.55A12.30 12.30 0 0 1 34.12 19.92ZM26.20 22.00A4.20 4.20 0 1 0 17.80 22.00A4.20 4.20 0 1 0 26.20 22.00Z';
const SMALL =
  'M55.07 20.13L60.28 20.27A12.90 12.90 0 0 1 60.28 23.73L55.07 23.87A7.80 7.80 0 0 1 53.68 26.75L56.82 30.91A12.90 12.90 0 0 1 54.12 33.07L50.76 29.09A7.80 7.80 0 0 1 47.64 29.80L46.34 34.85A12.90 12.90 0 0 1 42.97 34.08L43.99 28.97A7.80 7.80 0 0 1 41.49 26.97L36.73 29.11A12.90 12.90 0 0 1 35.23 25.99L39.87 23.60A7.80 7.80 0 0 1 39.87 20.40L35.23 18.01A12.90 12.90 0 0 1 36.73 14.89L41.49 17.03A7.80 7.80 0 0 1 43.99 15.03L42.97 9.92A12.90 12.90 0 0 1 46.34 9.15L47.64 14.20A7.80 7.80 0 0 1 50.76 14.91L54.12 10.93A12.90 12.90 0 0 1 56.82 13.09L53.68 17.25A7.80 7.80 0 0 1 55.07 20.13ZM51.70 22.00A4.20 4.20 0 1 0 43.30 22.00A4.20 4.20 0 1 0 51.70 22.00Z';

export function GearsLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-gears" role="status" aria-label="Loading">
        <svg viewBox="0 0 64 44" aria-hidden="true">
          <path className="loader-gears__big" fillRule="evenodd" d={BIG} />
          <path className="loader-gears__small" fillRule="evenodd" d={SMALL} />
        </svg>
      </div>
    </>
  );
}
