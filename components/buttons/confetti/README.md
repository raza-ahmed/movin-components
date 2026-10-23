# Confetti button

On click, 22 grayscale rectangular particles are spawned from the click point inside a relatively-positioned wrapper. Each particle flies outward in an evenly distributed radial spread with slight randomness, rotating and fading over 500–900ms via CSS custom properties (--tx, --ty, --rot, --dur) and a single @keyframes rule. Particles are removed from the DOM after animation. No dependencies.

Live preview: https://movin.design/components/buttons/confetti/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-confetti
```

Or copy [`button-confetti.tsx`](./button-confetti.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-confetti.html`](./button-confetti.html) where it goes and include [`button-confetti.css`](./button-confetti.css). [`button-confetti.js`](./button-confetti.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
