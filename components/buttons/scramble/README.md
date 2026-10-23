# Scramble button

On hover, characters randomize from a pool of alphanumeric and symbol characters at 40ms intervals. Characters resolve to the real label progressively left-to-right. On mouse leave the original text is restored immediately.

Live preview: https://movin.design/components/buttons/scramble/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-scramble
```

Or copy [`button-scramble.tsx`](./button-scramble.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-scramble.html`](./button-scramble.html) where it goes and include [`button-scramble.css`](./button-scramble.css). [`button-scramble.js`](./button-scramble.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
