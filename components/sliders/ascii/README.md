# ASCII slider

A volume slider drawn entirely in monospace characters, [=====> ] style: the bar redraws one character at a time and the head spins while you drag.

Live preview: https://movin.design/components/sliders/ascii/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/slider-ascii
```

Or copy [`slider-ascii.tsx`](./slider-ascii.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`slider-ascii.html`](./slider-ascii.html) where it goes and include [`slider-ascii.css`](./slider-ascii.css). [`slider-ascii.js`](./slider-ascii.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
