# Grow input

A code-snippet field that grows line by line: the box springs taller as you add lines (up to seven, then scrolls), line numbers slide into the gutter, the current line's number lights and the footer tracks line and character counts.

Live preview: https://movin.design/components/inputs/grow/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-grow
```

Or copy [`input-grow.tsx`](./input-grow.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-grow.html`](./input-grow.html) where it goes and include [`input-grow.css`](./input-grow.css). [`input-grow.js`](./input-grow.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
