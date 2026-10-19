# Liquid toggle

A pill toggle where the knob stretches to fill the entire track mid-transit like a blob of mercury, then snaps back to a circle at the other end. Keyframe animates left + width + border-radius simultaneously for the liquid effect.

Live preview: https://movin.design/components/toggles/liquid/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/toggle-liquid.json
```

Or copy [`toggle-liquid.tsx`](./toggle-liquid.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`toggle-liquid.html`](./toggle-liquid.html) where it goes and include [`toggle-liquid.css`](./toggle-liquid.css). [`toggle-liquid.js`](./toggle-liquid.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
