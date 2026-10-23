# Stagger Letters button

On hover, each letter of the button label jumps upward with a spring-overshoot cubic-bezier transition, staggered by 38ms per character. All letters return to baseline on mouse leave.

Live preview: https://movin.design/components/buttons/stagger-letters/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-stagger-letters
```

Or copy [`button-stagger-letters.tsx`](./button-stagger-letters.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-stagger-letters.html`](./button-stagger-letters.html) where it goes and include [`button-stagger-letters.css`](./button-stagger-letters.css). [`button-stagger-letters.js`](./button-stagger-letters.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
