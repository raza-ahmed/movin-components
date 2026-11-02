# FPS radio button

A frame rate picker: a bouncing ball is only drawn on frame boundaries, with its last few frames left faintly behind, so 12, 24 and 60 fps look steppy, filmic or fluid.

Live preview: https://movin.design/components/radios/fps/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/radio-fps
```

Or copy [`radio-fps.tsx`](./radio-fps.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`radio-fps.html`](./radio-fps.html) where it goes and include [`radio-fps.css`](./radio-fps.css). [`radio-fps.js`](./radio-fps.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
