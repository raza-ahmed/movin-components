# Battery loader

A battery charging: its four cells light one at a time with a hard step, then the full battery blinks twice and drains to start again. A bolt is cut into the fill, so it only shows through where the cells are lit. Pure CSS.

Live preview: https://movin.design/components/loaders/battery/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/loader-battery
```

Or copy [`loader-battery.tsx`](./loader-battery.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`loader-battery.html`](./loader-battery.html) where it goes and include [`loader-battery.css`](./loader-battery.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
