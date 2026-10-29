# URL input

Paste a link and it breaks down below into chips: a lock for secure, the host highlighted, every path segment, and each query parameter as a key and value, each chip popping in one after another.

Live preview: https://movin.design/components/inputs/url/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-url
```

Or copy [`input-url.tsx`](./input-url.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-url.html`](./input-url.html) where it goes and include [`input-url.css`](./input-url.css). [`input-url.js`](./input-url.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
