# Elastic input

A volume slider with rubber-band ends: pull past either end and the track stretches and thins with growing resistance, then snaps back with a wobble. The thumb squashes with your speed and the value bubble leans with it.

Live preview: https://movin.design/components/inputs/elastic/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-elastic
```

Or copy [`input-elastic.tsx`](./input-elastic.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-elastic.html`](./input-elastic.html) where it goes and include [`input-elastic.css`](./input-elastic.css). [`input-elastic.js`](./input-elastic.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
