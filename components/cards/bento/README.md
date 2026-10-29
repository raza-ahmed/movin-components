# Bento card

A bento-box dashboard whose four tiles reshuffle into a new layout every couple of seconds, each gliding and resizing to its new place without overlapping the others for long.

Live preview: https://movin.design/components/cards/bento/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-bento
```

Or copy [`card-bento.tsx`](./card-bento.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-bento.html`](./card-bento.html) where it goes and include [`card-bento.css`](./card-bento.css). [`card-bento.js`](./card-bento.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
