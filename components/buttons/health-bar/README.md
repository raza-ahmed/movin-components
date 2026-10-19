# Health Bar button

A game-style HP bar embedded in the button body. On hover, the bar drains from 100% to 28% over 800ms with a CSS width transition; the bar dims from bright to light gray to dark gray as HP drops. HP values and a status label update accordingly.

Live preview: https://movin.design/components/buttons/health-bar/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add https://movin.design/r/button-health-bar.json
```

Or copy [`button-health-bar.tsx`](./button-health-bar.tsx) into your project. Dependencies: none.

## Plain HTML + CSS

No framework and no dependencies. Paste [`button-health-bar.html`](./button-health-bar.html) where it goes and include [`button-health-bar.css`](./button-health-bar.css). It is pure CSS, so there is no script.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
