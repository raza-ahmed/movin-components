"use client";

const css = `
  @keyframes loader-globe-spin { to { transform: rotateX(-18deg) rotateY(360deg); } }
  @keyframes loader-globe-orbit { to { transform: rotateZ(-20deg) rotateX(72deg) rotateZ(360deg); } }
  .loader-globe {
    position: relative;
    width: 112px;
    height: 112px;
    perspective: 400px;
  }
  .loader-globe__sphere,
  .loader-globe__orbit {
    position: absolute;
    inset: 16px;
    transform-style: preserve-3d;
  }
  .loader-globe__sphere {
    /* Same function list as the keyframe, or the 360deg turn interpolates as a no-op matrix. */
    transform: rotateX(-18deg) rotateY(0deg);
    animation: loader-globe-spin 7s linear infinite;
  }
  .loader-globe__ring {
    position: absolute;
    inset: 0;
    border: 1px solid light-dark(#6d7179, #7d8087);
    border-radius: 50%;
  }
  .loader-globe__ring--lat { border-color: light-dark(#cbced3, #393c41); }
  .loader-globe__ring--equator { border-color: light-dark(#50535b, #c6c8cd); }
  .loader-globe__orbit {
    inset: 2px;
    border-radius: 50%;
    border: 1px dashed light-dark(#dbdde1, #2e3035);
    animation: loader-globe-orbit 3.2s linear infinite;
    transform: rotateZ(-20deg) rotateX(72deg) rotateZ(0deg);
  }
  .loader-globe__sat {
    position: absolute;
    left: 50%;
    top: -3px;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 8px light-dark(#373a40, #f1f2f3);
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-globe__sphere, .loader-globe__orbit { animation-duration: 30s; }
  }
`;

const MERIDIANS = [0, 30, 60, 90, 120, 150];
const LATITUDES = [-55, -28, 28, 55];

export function GlobeLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-globe" role="status" aria-label="Loading">
        <span className="loader-globe__sphere" aria-hidden="true">
          {MERIDIANS.map((a) => (
            <span key={a} className="loader-globe__ring" style={{ transform: `rotateY(${a}deg)` }} />
          ))}
          <span className="loader-globe__ring loader-globe__ring--equator" style={{ transform: 'rotateX(90deg)' }} />
          {LATITUDES.map((lat) => {
            // A latitude circle: radius R·cos(lat), lifted R·sin(lat) along the axis.
            const k = Math.cos((lat * Math.PI) / 180);
            const lift = -40 * Math.sin((lat * Math.PI) / 180);
            return (
              <span
                key={lat}
                className="loader-globe__ring loader-globe__ring--lat"
                style={{ transform: `translateY(${lift.toFixed(2)}px) rotateX(90deg) scale(${k.toFixed(3)})` }}
              />
            );
          })}
        </span>
        <span className="loader-globe__orbit" aria-hidden="true">
          <span className="loader-globe__sat" />
        </span>
      </div>
    </>
  );
}
