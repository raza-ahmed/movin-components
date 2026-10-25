# Charge button

A fighting-game style button: hover to charge a light gray power bar from left to right over 1.5 seconds via requestAnimationFrame. When the bar reaches 100%, the button fires, turning bright white with a pulsing box-shadow glow and "FIRED!" text for 800ms. Mousing away before full charge resets the bar. No dependencies.

Live preview: https://movin.design/components/buttons/charge/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-charge
```

Or copy [`button-charge.tsx`](./button-charge.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-charge.html`](./button-charge.html) where it goes and include [`button-charge.css`](./button-charge.css). [`button-charge.js`](./button-charge.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
