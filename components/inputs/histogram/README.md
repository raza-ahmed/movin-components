# Histogram input

A price-range slider over the distribution of prices: bars grow in on load, the bars inside the chosen range light up, the selection line follows the two thumbs and the product count rolls to the new total.

Live preview: https://movin.design/components/inputs/histogram/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-histogram
```

Or copy [`input-histogram.tsx`](./input-histogram.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-histogram.html`](./input-histogram.html) where it goes and include [`input-histogram.css`](./input-histogram.css). [`input-histogram.js`](./input-histogram.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
