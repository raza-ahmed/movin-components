# Peek card

Press and hold a file tile to peek at it: a ring fills round the tile while you hold, the rest of the card blurs, and a larger preview grows out of the tile until you let go.

Live preview: https://movin.design/components/cards/peek/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-peek
```

Or copy [`card-peek.tsx`](./card-peek.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-peek.html`](./card-peek.html) where it goes and include [`card-peek.css`](./card-peek.css). [`card-peek.js`](./card-peek.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
