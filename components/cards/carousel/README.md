# Carousel card

A card with a swipeable gallery that snaps to each slide; the dots below stretch and shrink with the scroll position itself, so they move mid-swipe rather than only when a slide lands.

Live preview: https://movin.design/components/cards/carousel/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-carousel
```

Or copy [`card-carousel.tsx`](./card-carousel.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-carousel.html`](./card-carousel.html) where it goes and include [`card-carousel.css`](./card-carousel.css). [`card-carousel.js`](./card-carousel.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
