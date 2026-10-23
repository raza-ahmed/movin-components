# Hexagon button

A flat-top hexagonal button using clip-path: polygon(). On hover, a circular silver fill expands from the center with a spring overshoot (cubic-bezier(0.34, 1.56, 0.64, 1)), inverting the text color from silver to near-black. The hex clip-path is applied to the button element itself. No dependencies.

Live preview: https://movin.design/components/buttons/hexagon/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/button-hexagon
```

Or copy [`button-hexagon.tsx`](./button-hexagon.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`button-hexagon.html`](./button-hexagon.html) where it goes and include [`button-hexagon.css`](./button-hexagon.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
