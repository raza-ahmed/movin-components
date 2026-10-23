# Terminal loader

A tiny terminal window running an install: a braille spinner cycles through its ten frames beside a status line that rolls up through resolving, fetching, linking and building, then loops. Both are strips moved with steps() or held keyframes. Pure CSS.

Live preview: https://movin.design/components/loaders/terminal/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/loader-terminal
```

Or copy [`loader-terminal.tsx`](./loader-terminal.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`loader-terminal.html`](./loader-terminal.html) where it goes and include [`loader-terminal.css`](./loader-terminal.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
