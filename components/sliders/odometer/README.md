# Odometer slider

A budget slider with an odometer: each digit of the amount rolls on its own drum to the new value, a beat apart, and leading zeros fold away.

Live preview: https://movin.design/components/sliders/odometer/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/slider-odometer
```

Or copy [`slider-odometer.tsx`](./slider-odometer.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`slider-odometer.html`](./slider-odometer.html) where it goes and include [`slider-odometer.css`](./slider-odometer.css). [`slider-odometer.js`](./slider-odometer.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
