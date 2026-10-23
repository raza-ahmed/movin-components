# Layout radio button

A view switcher (grid, list, feature) whose preview actually rearranges: the four tiles glide and resize into the new layout one after another with a springy settle, so you see what you are choosing. Pure CSS (each layout is a set of positions picked with :has()).

Live preview: https://movin.design/components/radios/layout/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/radio-layout
```

Or copy [`radio-layout.tsx`](./radio-layout.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`radio-layout.html`](./radio-layout.html) where it goes and include [`radio-layout.css`](./radio-layout.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
