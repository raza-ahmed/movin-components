# Spotlight button

A soft circle of light fades in under the cursor and follows it across the button, written to CSS custom properties on mousemove so nothing re-renders. The rest of the button stays dark. No dependencies.

Live preview: https://movin.design/components/buttons/spotlight/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-spotlight.json
```

Or copy [`button-spotlight.tsx`](./button-spotlight.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-spotlight.html`](./button-spotlight.html) where it goes and include [`button-spotlight.css`](./button-spotlight.css). [`button-spotlight.js`](./button-spotlight.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
