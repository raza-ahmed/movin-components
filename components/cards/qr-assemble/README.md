# QR Assemble card

A ticket card whose QR code assembles itself: at rest it shows random noise, and on hover the modules sort themselves into a code with staggered pops, then the three finder squares spin in and lock into the corners.

Live preview: https://movin.design/components/cards/qr-assemble/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-qr-assemble
```

Or copy [`card-qr-assemble.tsx`](./card-qr-assemble.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-qr-assemble.html`](./card-qr-assemble.html) where it goes and include [`card-qr-assemble.css`](./card-qr-assemble.css). [`card-qr-assemble.js`](./card-qr-assemble.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
