# Receipt card

A payment terminal card. On hover its light blinks and a receipt prints out of the slot in steps() jerks like a thermal printer, line items, total and barcode, with a torn zigzag edge from a conic-gradient mask; leaving pulls it back in smoothly. Pure CSS.

Live preview: https://movin.design/components/cards/receipt/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-receipt
```

Or copy [`card-receipt.tsx`](./card-receipt.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`card-receipt.html`](./card-receipt.html) where it goes and include [`card-receipt.css`](./card-receipt.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
