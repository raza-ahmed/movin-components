# Smooth Caret input

The text caret glides instead of jumping. Every move (typing, arrow keys, clicking, Home and End) slides a custom caret to its new place and leaves a short comet streak behind it that fades; it blinks only once it is resting. Selections fall back to the native highlight.

Live preview: https://movin.design/components/inputs/caret/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-caret
```

Or copy [`input-caret.tsx`](./input-caret.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-caret.html`](./input-caret.html) where it goes and include [`input-caret.css`](./input-caret.css). [`input-caret.js`](./input-caret.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
