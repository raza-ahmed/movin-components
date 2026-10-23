# Typeout input

A custom placeholder types itself out character-by-character on mount at 60ms per character. When focused, it instantly clears so the user can type freely.

Live preview: https://movin.design/components/inputs/typeout/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-typeout
```

Or copy [`input-typeout.tsx`](./input-typeout.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-typeout.html`](./input-typeout.html) where it goes and include [`input-typeout.css`](./input-typeout.css). [`input-typeout.js`](./input-typeout.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
