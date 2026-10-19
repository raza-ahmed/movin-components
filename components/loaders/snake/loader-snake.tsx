"use client";

const css = `
  /* A 4x4 grid at a 14px pitch, a dot centred in each cell. offset-path
     coordinates are the container's, so the path runs through those centres;
     it visits all 16 cells and closes, so steps(16) lands on a cell each time. */
  .loader-snake {
    --loader-snake-t: 2.4s;
    position: relative;
    display: inline-block;
    width: 56px;
    height: 56px;
    background: radial-gradient(circle, #3a3a3a 1.5px, transparent 2px) 0 0 / 14px 14px;
  }

  .loader-snake__seg {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: #ededed;
    offset-path: path('M7 7H49V21H21V35H49V49H7Z');
    offset-anchor: 50% 50%;
    offset-rotate: 0deg;
    animation: loader-snake-move var(--loader-snake-t) steps(16) infinite;
  }

  /* Later segments start further along the path: the last one is the head. */
  .loader-snake__seg:nth-child(1) {
    opacity: 0.2;
    transform: scale(0.6);
  }

  .loader-snake__seg:nth-child(2) {
    opacity: 0.35;
    transform: scale(0.7);
    animation-delay: calc(var(--loader-snake-t) / -16);
  }

  .loader-snake__seg:nth-child(3) {
    opacity: 0.55;
    transform: scale(0.8);
    animation-delay: calc(var(--loader-snake-t) / -8);
  }

  .loader-snake__seg:nth-child(4) {
    opacity: 0.75;
    transform: scale(0.9);
    animation-delay: calc(var(--loader-snake-t) * -3 / 16);
  }

  .loader-snake__seg:nth-child(5) {
    animation-delay: calc(var(--loader-snake-t) / -4);
  }

  @keyframes loader-snake-move {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-snake__seg {
      animation: none;
    }
    .loader-snake__seg:nth-child(2) {
      offset-distance: 6.25%;
    }
    .loader-snake__seg:nth-child(3) {
      offset-distance: 12.5%;
    }
    .loader-snake__seg:nth-child(4) {
      offset-distance: 18.75%;
    }
    .loader-snake__seg:nth-child(5) {
      offset-distance: 25%;
    }
  }
`;
export function SnakeLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-snake" role="status" aria-label="Loading">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="loader-snake__seg" aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
