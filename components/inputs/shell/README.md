# Shell input

A tiny terminal: type commands like help, ls, date, whoami, echo or theme and the output slides up, Tab completes a command name shown as a ghost, the arrows recall history and clear wipes the screen.

Live preview: https://movin.design/components/inputs/shell/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-shell
```

Or copy [`input-shell.tsx`](./input-shell.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-shell.html`](./input-shell.html) where it goes and include [`input-shell.css`](./input-shell.css). [`input-shell.js`](./input-shell.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
