# Gauge card

A speedometer dial for CPU load: on hover the needle sweeps up from zero with a springy overshoot, the arc fills behind it and the readout counts up to match; leave and it all falls back to zero.

Live preview: https://movin.design/components/cards/gauge/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-gauge
```

Or copy [`card-gauge.tsx`](./card-gauge.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-gauge.html`](./card-gauge.html) where it goes and include [`card-gauge.css`](./card-gauge.css). [`card-gauge.js`](./card-gauge.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
