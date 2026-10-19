# Count input

A character counter and progress bar slide in below the input on first focus or keystroke. The counter and bar color shift from dim → light gray → white as the character limit approaches. Both slide away again when the field is empty and blurred.

Live preview: https://movin.design/components/inputs/count/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/input-count.json
```

Or copy [`input-count.tsx`](./input-count.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-count.html`](./input-count.html) where it goes and include [`input-count.css`](./input-count.css). [`input-count.js`](./input-count.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
