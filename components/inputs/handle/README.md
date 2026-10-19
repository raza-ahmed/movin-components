# Handle Check input

A username field that checks availability as you type. Characters a handle cannot use are refused with a nudge; three dots bounce while it looks (debounced, so only the name you stop on is checked); then a tick draws for a free name, or a cross pops for a taken one and free alternatives slide in underneath, ready to tap.

Live preview: https://movin.design/components/inputs/handle/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/input-handle.json
```

Or copy [`input-handle.tsx`](./input-handle.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-handle.html`](./input-handle.html) where it goes and include [`input-handle.css`](./input-handle.css). [`input-handle.js`](./input-handle.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
