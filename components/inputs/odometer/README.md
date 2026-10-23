# Odometer input

A number stepper whose digits are mechanical wheels: each one rolls to its new figure (the tens wheel slides in and out as it is needed), and you can step with the buttons, the arrow keys, or by dragging the number sideways to scrub. Pushing past a limit bumps against it.

Live preview: https://movin.design/components/inputs/odometer/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/input-odometer
```

Or copy [`input-odometer.tsx`](./input-odometer.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`input-odometer.html`](./input-odometer.html) where it goes and include [`input-odometer.css`](./input-odometer.css). [`input-odometer.js`](./input-odometer.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
