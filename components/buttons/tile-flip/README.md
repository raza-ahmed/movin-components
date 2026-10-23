# Tile Flip button

The surface is a 12x4 grid of tiles. Entering flips them over in a wave that spreads from the exact point the cursor came in, each tile turning about the axis facing away from it; leaving flips them back from where it left. The label turns dark as the wave passes.

Live preview: https://movin.design/components/buttons/tile-flip/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-tile-flip
```

Or copy [`button-tile-flip.tsx`](./button-tile-flip.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-tile-flip.html`](./button-tile-flip.html) where it goes and include [`button-tile-flip.css`](./button-tile-flip.css). [`button-tile-flip.js`](./button-tile-flip.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
