# Orbit Particles button

On hover, 6 dots orbit the button in a continuous circle via CSS keyframes. Each dot shares a single rotate→translateX→counter-rotate keyframe; staggered negative animation-delay offsets each dot to an evenly-spaced starting position. The lead dot is slightly larger.

Live preview: https://movin.design/components/buttons/orbit-particles/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-orbit-particles.json
```

Or copy [`button-orbit-particles.tsx`](./button-orbit-particles.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`button-orbit-particles.html`](./button-orbit-particles.html) where it goes and include [`button-orbit-particles.css`](./button-orbit-particles.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
