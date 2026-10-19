# Loading Lock button

On click, the button transitions through three states: idle (padlock icon) → loading (spinning SVG arc, 1.6s) → done (checkmark, bright white). Auto-resets to idle after 2 seconds. Each state has distinct icon, label, and colour scheme.

Live preview: https://movin.design/components/buttons/loading-lock/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-loading-lock.json
```

Or copy [`button-loading-lock.tsx`](./button-loading-lock.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`button-loading-lock.html`](./button-loading-lock.html) where it goes and include [`button-loading-lock.css`](./button-loading-lock.css). [`button-loading-lock.js`](./button-loading-lock.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
