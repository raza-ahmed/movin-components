# Peel card

A sticker on a card. Hovering curls its corner; drag the corner and it peels back along a true fold line (the perpendicular bisector of corner and pointer), the sticker clipped on one side and its paper underside mirrored on the other, revealing what is beneath. Pull far enough and it comes off; click the corner to stick it back.

Live preview: https://movin.design/components/cards/peel/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/card-peel.json
```

Or copy [`card-peel.tsx`](./card-peel.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-peel.html`](./card-peel.html) where it goes and include [`card-peel.css`](./card-peel.css). [`card-peel.js`](./card-peel.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
