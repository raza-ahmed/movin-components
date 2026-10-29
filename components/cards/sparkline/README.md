# Sparkline card

A stock card: on hover the day's price line draws itself across the chart with the area filling under it, and the price counts up from the open to the close as the line arrives.

Live preview: https://movin.design/components/cards/sparkline/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-sparkline
```

Or copy [`card-sparkline.tsx`](./card-sparkline.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-sparkline.html`](./card-sparkline.html) where it goes and include [`card-sparkline.css`](./card-sparkline.css). [`card-sparkline.js`](./card-sparkline.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
