# Stretch slider

An opacity slider with an elastic thumb: drag fast and it stretches out behind itself, longer the faster it moves, then snaps back to a circle when you stop.

Live preview: https://movin.design/components/sliders/stretch/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/slider-stretch
```

Or copy [`slider-stretch.tsx`](./slider-stretch.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`slider-stretch.html`](./slider-stretch.html) where it goes and include [`slider-stretch.css`](./slider-stretch.css). [`slider-stretch.js`](./slider-stretch.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
