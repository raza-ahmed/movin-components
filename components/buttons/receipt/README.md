# Receipt button

A pay button with a printer slot along its bottom edge: click it and a receipt prints out under it a line at a time, it reads Paid, then the receipt tears off and falls away.

Live preview: https://movin.design/components/buttons/receipt/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-receipt
```

Or copy [`button-receipt.tsx`](./button-receipt.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-receipt.html`](./button-receipt.html) where it goes and include [`button-receipt.css`](./button-receipt.css). [`button-receipt.js`](./button-receipt.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
