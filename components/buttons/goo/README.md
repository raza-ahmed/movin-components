# Goo button

Liquid metaballs from one SVG filter: everything inside is blurred and its alpha thresholded back to a hard edge, so shapes that come close melt together. On hover, droplets ooze out of the edges and bob; a click fires a drop that stretches off the side and breaks free.

Live preview: https://movin.design/components/buttons/goo/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-goo.json
```

Or copy [`button-goo.tsx`](./button-goo.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-goo.html`](./button-goo.html) where it goes and include [`button-goo.css`](./button-goo.css). [`button-goo.js`](./button-goo.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
