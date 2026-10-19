# Radar loader

A radar scope: a beam with a fading wake sweeps round the rings and crosshairs, and each blip flares exactly as the beam's leading edge passes over it, then fades until the next sweep. Each blip's delay is computed from its own angle. Pure CSS.

Live preview: https://movin.design/components/loaders/radar/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/loader-radar.json
```

Or copy [`loader-radar.tsx`](./loader-radar.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`loader-radar.html`](./loader-radar.html) where it goes and include [`loader-radar.css`](./loader-radar.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
