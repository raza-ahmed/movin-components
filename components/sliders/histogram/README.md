# Histogram slider

A price range drawn over its own histogram: bars inside the two handles rise to full ink, bars outside sink and fade, and the count of results updates as you drag.

Live preview: https://movin.design/components/sliders/histogram/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/slider-histogram
```

Or copy [`slider-histogram.tsx`](./slider-histogram.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`slider-histogram.html`](./slider-histogram.html) where it goes and include [`slider-histogram.css`](./slider-histogram.css). [`slider-histogram.js`](./slider-histogram.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
