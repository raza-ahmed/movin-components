# Overflow input

A short bio field with a limit: letters past it sag off the end of the line, each a little lower than the last, struck through as if spilling over, and the count turns into how many too many.

Live preview: https://movin.design/components/inputs/overflow/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-overflow
```

Or copy [`input-overflow.tsx`](./input-overflow.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-overflow.html`](./input-overflow.html) where it goes and include [`input-overflow.css`](./input-overflow.css). [`input-overflow.js`](./input-overflow.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
