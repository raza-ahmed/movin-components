# Seat radio button

A tiny cinema seat map. Taken seats are crossed out and skipped by the arrow keys; picking a free seat lifts it with a pop and lights it, and the ticket below rolls its seat code over to the new one, like a departures board.

Live preview: https://movin.design/components/radios/seat/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/radio-seat.json
```

Or copy [`radio-seat.tsx`](./radio-seat.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`radio-seat.html`](./radio-seat.html) where it goes and include [`radio-seat.css`](./radio-seat.css). [`radio-seat.js`](./radio-seat.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
