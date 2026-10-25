# Fill input

On focus, a tinted background layer scales from scaleX(0) to scaleX(1) with transformOrigin left, flooding the input with color from left to right. Border color transitions simultaneously. Pure transform, no opacity flash.

Live preview: https://movin.design/components/inputs/fill/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-fill
```

Or copy [`input-fill.tsx`](./input-fill.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`input-fill.html`](./input-fill.html) where it goes and include [`input-fill.css`](./input-fill.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
