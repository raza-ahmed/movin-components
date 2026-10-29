# Query input

A search field that understands filters: tag:, by:, is: and type: tokens become pills as you type them, -words are struck through, quoted phrases are marked, and a dropdown suggests keys and then their values.

Live preview: https://movin.design/components/inputs/query/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-query
```

Or copy [`input-query.tsx`](./input-query.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-query.html`](./input-query.html) where it goes and include [`input-query.css`](./input-query.css). [`input-query.js`](./input-query.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
