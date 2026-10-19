# Die radio button

Pick a number and a 3D die rolls to it: it hops up, tumbles a full extra turn on its way to the chosen face and lands with a squash while its shadow shrinks and grows underneath. Each roll adds another turn (a tiny script), so it never just rotates back.

Live preview: https://movin.design/components/radios/die/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/radio-die.json
```

Or copy [`radio-die.tsx`](./radio-die.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`radio-die.html`](./radio-die.html) where it goes and include [`radio-die.css`](./radio-die.css). [`radio-die.js`](./radio-die.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
