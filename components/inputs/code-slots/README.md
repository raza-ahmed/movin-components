# Code Slots input

A one-time code field drawn as six cells. Digits roll up into their cell and a caret blinks in the next one; when the sixth lands, the cells slide together into one pill and a tick pops beside it. One real input underneath, so paste and SMS autofill just work.

Live preview: https://movin.design/components/inputs/code-slots/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-code-slots
```

Or copy [`input-code-slots.tsx`](./input-code-slots.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-code-slots.html`](./input-code-slots.html) where it goes and include [`input-code-slots.css`](./input-code-slots.css). [`input-code-slots.js`](./input-code-slots.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
