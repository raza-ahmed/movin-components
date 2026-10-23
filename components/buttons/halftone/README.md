# Halftone button

Three dot screens on one 7px grid: a faint base, a brighter screen whose dots swell under the cursor through a radial mask, and a ring of bright dots that rolls across the surface from the pointer on enter and click, its radius animated through a registered custom property.

Live preview: https://movin.design/components/buttons/halftone/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-halftone
```

Or copy [`button-halftone.tsx`](./button-halftone.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-halftone.html`](./button-halftone.html) where it goes and include [`button-halftone.css`](./button-halftone.css). [`button-halftone.js`](./button-halftone.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
