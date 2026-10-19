# Count Up button

Each click increments a visible counter badge inside the button. The badge pops with a spring-overshoot scale keyframe animation on every increment, re-triggered via the removeAttribute/offsetWidth/setAttribute pattern.

Live preview: https://movin.design/components/buttons/count-up/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-count-up.json
```

Or copy [`button-count-up.tsx`](./button-count-up.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-count-up.html`](./button-count-up.html) where it goes and include [`button-count-up.css`](./button-count-up.css). [`button-count-up.js`](./button-count-up.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
