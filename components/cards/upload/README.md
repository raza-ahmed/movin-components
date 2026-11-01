# Upload card

A drop zone card: its dashed border marches while you hover or drag a file over it, and a dropped or chosen file gets a row that fills with progress, then ticks.

Live preview: https://movin.design/components/cards/upload/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-upload
```

Or copy [`card-upload.tsx`](./card-upload.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-upload.html`](./card-upload.html) where it goes and include [`card-upload.css`](./card-upload.css). [`card-upload.js`](./card-upload.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
