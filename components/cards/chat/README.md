# Chat card

A conversation that plays itself out: typing dots appear, then each message springs in from its own side, until the thread is full and starts again.

Live preview: https://movin.design/components/cards/chat/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-chat
```

Or copy [`card-chat.tsx`](./card-chat.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-chat.html`](./card-chat.html) where it goes and include [`card-chat.css`](./card-chat.css). [`card-chat.js`](./card-chat.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
