# Theme radio button

A theme picker inside a preview panel. Choosing Light, Dim or Dark floods the panel with the new theme as a circle spreading out from the chip you picked, over the old theme, which stays put underneath until it is covered. Pure CSS: one layer per theme, stacked by z-index.

Live preview: https://movin.design/components/radios/theme/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/radio-theme
```

Or copy [`radio-theme.tsx`](./radio-theme.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`radio-theme.html`](./radio-theme.html) where it goes and include [`radio-theme.css`](./radio-theme.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
