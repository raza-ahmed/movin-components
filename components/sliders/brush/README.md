# Brush slider

A flow slider whose fill is a single brush stroke: it lands at half pressure, runs solid at the start and dry and streaky by the end, with a wet edge at the thumb.

Live preview: https://movin.design/components/sliders/brush/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/slider-brush
```

Or copy [`slider-brush.tsx`](./slider-brush.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`slider-brush.html`](./slider-brush.html) where it goes and include [`slider-brush.css`](./slider-brush.css). [`slider-brush.js`](./slider-brush.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
