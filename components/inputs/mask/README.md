# Mask input

A phone field with its format printed in place: digits drop into the slots of +1 (___) ___-____ as you type, the remaining slots stay faint, and a tick draws in once it is complete.

Live preview: https://movin.design/components/inputs/mask/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-mask
```

Or copy [`input-mask.tsx`](./input-mask.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-mask.html`](./input-mask.html) where it goes and include [`input-mask.css`](./input-mask.css). [`input-mask.js`](./input-mask.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
