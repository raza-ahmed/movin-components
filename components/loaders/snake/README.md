# Snake loader

A five-segment snake slithers over a 4x4 grid of dots, cell by cell, weaving through every square on a closed path with its head brightest and its tail fading. Each segment rides the same offset-path with steps() timing, one cell behind the next. Pure CSS.

Live preview: https://movin.design/components/loaders/snake/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/loader-snake
```

Or copy [`loader-snake.tsx`](./loader-snake.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`loader-snake.html`](./loader-snake.html) where it goes and include [`loader-snake.css`](./loader-snake.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
