# Terminal button

A button that is a tiny terminal window. A click types out the deploy command, runs an ASCII progress bar to 100% in uneven steps, prints a success line, then resets to the prompt.

Live preview: https://movin.design/components/buttons/terminal/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-terminal
```

Or copy [`button-terminal.tsx`](./button-terminal.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-terminal.html`](./button-terminal.html) where it goes and include [`button-terminal.css`](./button-terminal.css). [`button-terminal.js`](./button-terminal.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
