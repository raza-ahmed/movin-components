# Composer input

A chat composer. The box springs taller line by line as you write (up to a limit, then it scrolls) with the send button riding its bottom edge; the button wakes up as soon as there is text, and sending lifts the message out of the box into the thread above as the box springs back to one line.

Live preview: https://movin.design/components/inputs/composer/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/input-composer.json
```

Or copy [`input-composer.tsx`](./input-composer.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-composer.html`](./input-composer.html) where it goes and include [`input-composer.css`](./input-composer.css). [`input-composer.js`](./input-composer.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
