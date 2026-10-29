# Torus loader

A torus made of 300 points tumbling in 3D: it spins round its own axis so the points flow round the ring, rocks and sways, and the near side glows larger and brighter while the far side falls away.

Live preview: https://movin.design/components/loaders/torus/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/loader-torus
```

Or copy [`loader-torus.tsx`](./loader-torus.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`loader-torus.html`](./loader-torus.html) where it goes and include [`loader-torus.css`](./loader-torus.css). [`loader-torus.js`](./loader-torus.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
