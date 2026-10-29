# Binary loader

A byte counting up in lit bits, nibble by nibble, with its hex and decimal value counting beside it. It wraps from 255 back to zero and keeps going.

Live preview: https://movin.design/components/loaders/binary/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/loader-binary
```

Or copy [`loader-binary.tsx`](./loader-binary.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`loader-binary.html`](./loader-binary.html) where it goes and include [`loader-binary.css`](./loader-binary.css). [`loader-binary.js`](./loader-binary.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
