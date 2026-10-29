# Enhance card

A photo card that enhances on hover: the picture starts as a few big pixels and resolves step by step, 6, 12, 24, 48 columns and then full resolution, with the resolution shown beside the title.

Live preview: https://movin.design/components/cards/enhance/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-enhance
```

Or copy [`card-enhance.tsx`](./card-enhance.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-enhance.html`](./card-enhance.html) where it goes and include [`card-enhance.css`](./card-enhance.css). [`card-enhance.js`](./card-enhance.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
