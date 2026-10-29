# Pipeline card

A deploy pipeline that runs itself: build, test and deploy each spin while they run, tick and hand off along a filling connector to the next, with a log line under the stages narrating every step until it reads Deployed.

Live preview: https://movin.design/components/cards/pipeline/

## React + Tailwind

Install with the shadcn CLI:

```sh
npx shadcn@latest add @movin/card-pipeline
```

Or copy [`card-pipeline.tsx`](./card-pipeline.tsx) into your project. Dependencies: none.

## Plain HTML + CSS + JS

No framework and no dependencies. Paste [`card-pipeline.html`](./card-pipeline.html) where it goes and include [`card-pipeline.css`](./card-pipeline.css). [`card-pipeline.js`](./card-pipeline.js) sets up every copy on the page; in a framework, call its init function on your element once it is mounted.

## Licence

MIT-0: free for any project, commercial included, no attribution required.
