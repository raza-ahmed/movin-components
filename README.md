# movin.design components

288 animated UI components: buttons, cards, checkboxes, inputs, loaders, radio buttons and toggles. Every one comes in two formats:

- **React + Tailwind** (TypeScript), installable with the shadcn CLI. 281 have no dependencies; 7 use Framer Motion.
- **Plain HTML + CSS** (plus a small script where needed), with no framework and no dependencies, for Vue, Svelte, Angular, Webflow or a plain page.

Live previews, code and an LLM prompt for each: https://movin.design/components/

## Install with shadcn

```sh
npx shadcn@latest add @movin/toggle-airplane
```

Replace `toggle-airplane` with any install name from the tables below. `@movin` is listed in the
shadcn directory, so there is nothing to configure; with an older CLI, use the full URL instead:
`npx shadcn@latest add https://movin.design/r/toggle-airplane.json`. The full index is at
https://movin.design/r/registry.json, and [`registry.json`](./registry.json) in this repo mirrors it.

## Use the plain HTML version

Each component folder holds `<name>.html`, `<name>.css` and, when it needs one, `<name>.js`. Paste the markup, include the CSS and the script. Class names are prefixed per component, so several can share a page.

## Components

### Buttons (53)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Filings button](components/buttons/filings/) | `button-filings` | None | [Preview](https://movin.design/components/buttons/filings/) |
| [Fold button](components/buttons/fold/) | `button-fold` | None | [Preview](https://movin.design/components/buttons/fold/) |
| [Goo button](components/buttons/goo/) | `button-goo` | None | [Preview](https://movin.design/components/buttons/goo/) |
| [Halftone button](components/buttons/halftone/) | `button-halftone` | None | [Preview](https://movin.design/components/buttons/halftone/) |
| [Loupe button](components/buttons/loupe/) | `button-loupe` | None | [Preview](https://movin.design/components/buttons/loupe/) |
| [Membrane button](components/buttons/membrane/) | `button-membrane` | None | [Preview](https://movin.design/components/buttons/membrane/) |
| [Morph Text button](components/buttons/morph-text/) | `button-morph-text` | None | [Preview](https://movin.design/components/buttons/morph-text/) |
| [Particle Text button](components/buttons/particle-text/) | `button-particle-text` | None | [Preview](https://movin.design/components/buttons/particle-text/) |
| [Pull Cord button](components/buttons/pull-cord/) | `button-pull-cord` | None | [Preview](https://movin.design/components/buttons/pull-cord/) |
| [Shatter button](components/buttons/shatter/) | `button-shatter` | None | [Preview](https://movin.design/components/buttons/shatter/) |
| [Split-Flap button](components/buttons/split-flap/) | `button-split-flap` | None | [Preview](https://movin.design/components/buttons/split-flap/) |
| [Swipe to Confirm button](components/buttons/swipe-confirm/) | `button-swipe-confirm` | None | [Preview](https://movin.design/components/buttons/swipe-confirm/) |
| [Ticket button](components/buttons/ticket/) | `button-ticket` | None | [Preview](https://movin.design/components/buttons/ticket/) |
| [Tide button](components/buttons/tide/) | `button-tide` | None | [Preview](https://movin.design/components/buttons/tide/) |
| [Tile Flip button](components/buttons/tile-flip/) | `button-tile-flip` | None | [Preview](https://movin.design/components/buttons/tile-flip/) |
| [Border Beam button](components/buttons/border-beam/) | `button-border-beam` | None | [Preview](https://movin.design/components/buttons/border-beam/) |
| [Burst Ring button](components/buttons/burst-ring/) | `button-burst-ring` | None | [Preview](https://movin.design/components/buttons/burst-ring/) |
| [Charge button](components/buttons/charge/) | `button-charge` | None | [Preview](https://movin.design/components/buttons/charge/) |
| [Confetti button](components/buttons/confetti/) | `button-confetti` | None | [Preview](https://movin.design/components/buttons/confetti/) |
| [Count Up button](components/buttons/count-up/) | `button-count-up` | None | [Preview](https://movin.design/components/buttons/count-up/) |
| [Cube Face button](components/buttons/cube-face/) | `button-cube-face` | None | [Preview](https://movin.design/components/buttons/cube-face/) |
| [Diamond button](components/buttons/diamond/) | `button-diamond` | None | [Preview](https://movin.design/components/buttons/diamond/) |
| [Elastic Press button](components/buttons/elastic-press/) | `button-elastic-press` | None | [Preview](https://movin.design/components/buttons/elastic-press/) |
| [Glitch button](components/buttons/glitch/) | `button-glitch` | None | [Preview](https://movin.design/components/buttons/glitch/) |
| [Gradient Border button](components/buttons/gradient-border/) | `button-gradient-border` | None | [Preview](https://movin.design/components/buttons/gradient-border/) |
| [Health Bar button](components/buttons/health-bar/) | `button-health-bar` | None | [Preview](https://movin.design/components/buttons/health-bar/) |
| [Hexagon button](components/buttons/hexagon/) | `button-hexagon` | None | [Preview](https://movin.design/components/buttons/hexagon/) |
| [Hold to Confirm button](components/buttons/hold-confirm/) | `button-hold-confirm` | None | [Preview](https://movin.design/components/buttons/hold-confirm/) |
| [Ink Stamp button](components/buttons/ink-stamp/) | `button-ink-stamp` | None | [Preview](https://movin.design/components/buttons/ink-stamp/) |
| [Jello Wobble button](components/buttons/jello-wobble/) | `button-jello-wobble` | None | [Preview](https://movin.design/components/buttons/jello-wobble/) |
| [Loading Lock button](components/buttons/loading-lock/) | `button-loading-lock` | None | [Preview](https://movin.design/components/buttons/loading-lock/) |
| [Magnetic button](components/buttons/magnetic/) | `button-magnetic` | framer-motion | [Preview](https://movin.design/components/buttons/magnetic/) |
| [Morph Shape button](components/buttons/morph-shape/) | `button-morph-shape` | None | [Preview](https://movin.design/components/buttons/morph-shape/) |
| [Neon Pulse button](components/buttons/neon-pulse/) | `button-neon-pulse` | None | [Preview](https://movin.design/components/buttons/neon-pulse/) |
| [Octagon button](components/buttons/octagon/) | `button-octagon` | None | [Preview](https://movin.design/components/buttons/octagon/) |
| [Orbit Particles button](components/buttons/orbit-particles/) | `button-orbit-particles` | None | [Preview](https://movin.design/components/buttons/orbit-particles/) |
| [Pop Forward button](components/buttons/pop-forward/) | `button-pop-forward` | None | [Preview](https://movin.design/components/buttons/pop-forward/) |
| [Press 3D button](components/buttons/press-3d/) | `button-press-3d` | None | [Preview](https://movin.design/components/buttons/press-3d/) |
| [Retro Pixel button](components/buttons/retro-pixel/) | `button-retro-pixel` | None | [Preview](https://movin.design/components/buttons/retro-pixel/) |
| [Ripple button](components/buttons/ripple/) | `button-ripple` | None | [Preview](https://movin.design/components/buttons/ripple/) |
| [Rotating Gradient button](components/buttons/rotating-gradient/) | `button-rotating-gradient` | None | [Preview](https://movin.design/components/buttons/rotating-gradient/) |
| [Scramble button](components/buttons/scramble/) | `button-scramble` | None | [Preview](https://movin.design/components/buttons/scramble/) |
| [Shimmer Sweep button](components/buttons/shimmer-sweep/) | `button-shimmer-sweep` | None | [Preview](https://movin.design/components/buttons/shimmer-sweep/) |
| [Shockwave button](components/buttons/shockwave/) | `button-shockwave` | None | [Preview](https://movin.design/components/buttons/shockwave/) |
| [Skewed button](components/buttons/skewed/) | `button-skewed` | None | [Preview](https://movin.design/components/buttons/skewed/) |
| [Slide Fill button](components/buttons/slide-fill/) | `button-slide-fill` | None | [Preview](https://movin.design/components/buttons/slide-fill/) |
| [Spotlight button](components/buttons/spotlight/) | `button-spotlight` | None | [Preview](https://movin.design/components/buttons/spotlight/) |
| [Stagger Letters button](components/buttons/stagger-letters/) | `button-stagger-letters` | None | [Preview](https://movin.design/components/buttons/stagger-letters/) |
| [Swap Text button](components/buttons/swap-text/) | `button-swap-text` | None | [Preview](https://movin.design/components/buttons/swap-text/) |
| [Tilt 3D button](components/buttons/tilt-3d/) | `button-tilt-3d` | framer-motion | [Preview](https://movin.design/components/buttons/tilt-3d/) |
| [Typewriter button](components/buttons/typewriter/) | `button-typewriter` | None | [Preview](https://movin.design/components/buttons/typewriter/) |
| [Wipe Swap button](components/buttons/wipe-swap/) | `button-wipe-swap` | None | [Preview](https://movin.design/components/buttons/wipe-swap/) |
| [XP Gain button](components/buttons/xp-gain/) | `button-xp-gain` | None | [Preview](https://movin.design/components/buttons/xp-gain/) |

### Cards (25)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Diorama card](components/cards/diorama/) | `card-diorama` | None | [Preview](https://movin.design/components/cards/diorama/) |
| [Envelope card](components/cards/envelope/) | `card-envelope` | None | [Preview](https://movin.design/components/cards/envelope/) |
| [Holo Foil card](components/cards/holo/) | `card-holo` | None | [Preview](https://movin.design/components/cards/holo/) |
| [Ink Reveal card](components/cards/ink-reveal/) | `card-ink-reveal` | None | [Preview](https://movin.design/components/cards/ink-reveal/) |
| [Lenticular card](components/cards/lenticular/) | `card-lenticular` | None | [Preview](https://movin.design/components/cards/lenticular/) |
| [Peel card](components/cards/peel/) | `card-peel` | None | [Preview](https://movin.design/components/cards/peel/) |
| [Receipt card](components/cards/receipt/) | `card-receipt` | None | [Preview](https://movin.design/components/cards/receipt/) |
| [Scratch-off card](components/cards/scratch/) | `card-scratch` | None | [Preview](https://movin.design/components/cards/scratch/) |
| [Swipe Deck card](components/cards/swipe-deck/) | `card-swipe-deck` | None | [Preview](https://movin.design/components/cards/swipe-deck/) |
| [Tri-fold card](components/cards/trifold/) | `card-trifold` | None | [Preview](https://movin.design/components/cards/trifold/) |
| [Aurora card](components/cards/aurora/) | `card-aurora` | None | [Preview](https://movin.design/components/cards/aurora/) |
| [Border Glow card](components/cards/border-glow/) | `card-border-glow` | None | [Preview](https://movin.design/components/cards/border-glow/) |
| [Color Reveal card](components/cards/color-reveal/) | `card-color-reveal` | None | [Preview](https://movin.design/components/cards/color-reveal/) |
| [Flip card](components/cards/flip/) | `card-flip` | None | [Preview](https://movin.design/components/cards/flip/) |
| [Glitch card](components/cards/glitch/) | `card-glitch` | None | [Preview](https://movin.design/components/cards/glitch/) |
| [Gradient Drift card](components/cards/gradient-drift/) | `card-gradient-drift` | None | [Preview](https://movin.design/components/cards/gradient-drift/) |
| [Hover Lift card](components/cards/hover-lift/) | `card-hover-lift` | None | [Preview](https://movin.design/components/cards/hover-lift/) |
| [Magnetic card](components/cards/magnetic/) | `card-magnetic` | None | [Preview](https://movin.design/components/cards/magnetic/) |
| [Neon Glow card](components/cards/neon-glow/) | `card-neon-glow` | None | [Preview](https://movin.design/components/cards/neon-glow/) |
| [Shimmer card](components/cards/shimmer/) | `card-shimmer` | None | [Preview](https://movin.design/components/cards/shimmer/) |
| [Spotlight card](components/cards/spotlight/) | `card-spotlight` | None | [Preview](https://movin.design/components/cards/spotlight/) |
| [Stack card](components/cards/stack/) | `card-stack` | None | [Preview](https://movin.design/components/cards/stack/) |
| [Tilt card](components/cards/tilt/) | `card-tilt` | None | [Preview](https://movin.design/components/cards/tilt/) |
| [Typewriter card](components/cards/typewriter/) | `card-typewriter` | None | [Preview](https://movin.design/components/cards/typewriter/) |
| [Wipe Reveal card](components/cards/wipe-reveal/) | `card-wipe-reveal` | None | [Preview](https://movin.design/components/cards/wipe-reveal/) |

### Checkboxes (45)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Bookmark checkbox](components/checkboxes/bookmark/) | `checkbox-bookmark` | None | [Preview](https://movin.design/components/checkboxes/bookmark/) |
| [Dog-ear checkbox](components/checkboxes/dog-ear/) | `checkbox-dog-ear` | None | [Preview](https://movin.design/components/checkboxes/dog-ear/) |
| [Fingerprint checkbox](components/checkboxes/fingerprint/) | `checkbox-fingerprint` | None | [Preview](https://movin.design/components/checkboxes/fingerprint/) |
| [Keycap checkbox](components/checkboxes/keycap/) | `checkbox-keycap` | None | [Preview](https://movin.design/components/checkboxes/keycap/) |
| [Select All checkbox](components/checkboxes/select-all/) | `checkbox-select-all` | None | [Preview](https://movin.design/components/checkboxes/select-all/) |
| [Smile checkbox](components/checkboxes/smile/) | `checkbox-smile` | None | [Preview](https://movin.design/components/checkboxes/smile/) |
| [Sorting List checkbox](components/checkboxes/sort-list/) | `checkbox-sort-list` | None | [Preview](https://movin.design/components/checkboxes/sort-list/) |
| [Sprout checkbox](components/checkboxes/sprout/) | `checkbox-sprout` | None | [Preview](https://movin.design/components/checkboxes/sprout/) |
| [Stitch checkbox](components/checkboxes/stitch/) | `checkbox-stitch` | None | [Preview](https://movin.design/components/checkboxes/stitch/) |
| [Strike Task checkbox](components/checkboxes/strike-task/) | `checkbox-strike-task` | None | [Preview](https://movin.design/components/checkboxes/strike-task/) |
| [Bounce checkbox](components/checkboxes/bounce/) | `checkbox-bounce` | None | [Preview](https://movin.design/components/checkboxes/bounce/) |
| [Charging checkbox](components/checkboxes/charging/) | `checkbox-charging` | None | [Preview](https://movin.design/components/checkboxes/charging/) |
| [Check Pop checkbox](components/checkboxes/check-pop/) | `checkbox-check-pop` | None | [Preview](https://movin.design/components/checkboxes/check-pop/) |
| [Circle checkbox](components/checkboxes/circle/) | `checkbox-circle` | None | [Preview](https://movin.design/components/checkboxes/circle/) |
| [Confetti checkbox](components/checkboxes/confetti/) | `checkbox-confetti` | None | [Preview](https://movin.design/components/checkboxes/confetti/) |
| [Crystal Break checkbox](components/checkboxes/crystal-break/) | `checkbox-crystal-break` | None | [Preview](https://movin.design/components/checkboxes/crystal-break/) |
| [Curtain checkbox](components/checkboxes/curtain/) | `checkbox-curtain` | None | [Preview](https://movin.design/components/checkboxes/curtain/) |
| [Draw Check checkbox](components/checkboxes/draw-check/) | `checkbox-draw-check` | None | [Preview](https://movin.design/components/checkboxes/draw-check/) |
| [Fire Fill checkbox](components/checkboxes/fire-fill/) | `checkbox-fire-fill` | None | [Preview](https://movin.design/components/checkboxes/fire-fill/) |
| [Flip checkbox](components/checkboxes/flip/) | `checkbox-flip` | None | [Preview](https://movin.design/components/checkboxes/flip/) |
| [Ghost Through checkbox](components/checkboxes/ghost-through/) | `checkbox-ghost-through` | None | [Preview](https://movin.design/components/checkboxes/ghost-through/) |
| [Glitch checkbox](components/checkboxes/glitch/) | `checkbox-glitch` | None | [Preview](https://movin.design/components/checkboxes/glitch/) |
| [Gravity Drop checkbox](components/checkboxes/gravity-drop/) | `checkbox-gravity-drop` | None | [Preview](https://movin.design/components/checkboxes/gravity-drop/) |
| [Heartbeat checkbox](components/checkboxes/heartbeat/) | `checkbox-heartbeat` | None | [Preview](https://movin.design/components/checkboxes/heartbeat/) |
| [Ink Blot checkbox](components/checkboxes/ink-blot/) | `checkbox-ink-blot` | None | [Preview](https://movin.design/components/checkboxes/ink-blot/) |
| [Laser Draw checkbox](components/checkboxes/laser-draw/) | `checkbox-laser-draw` | None | [Preview](https://movin.design/components/checkboxes/laser-draw/) |
| [Liquid checkbox](components/checkboxes/liquid/) | `checkbox-liquid` | None | [Preview](https://movin.design/components/checkboxes/liquid/) |
| [Morph Line checkbox](components/checkboxes/morph-line/) | `checkbox-morph-line` | None | [Preview](https://movin.design/components/checkboxes/morph-line/) |
| [Neon checkbox](components/checkboxes/neon/) | `checkbox-neon` | None | [Preview](https://movin.design/components/checkboxes/neon/) |
| [Orbit Snap checkbox](components/checkboxes/orbit-snap/) | `checkbox-orbit-snap` | None | [Preview](https://movin.design/components/checkboxes/orbit-snap/) |
| [Pixel Fill checkbox](components/checkboxes/pixel-fill/) | `checkbox-pixel-fill` | None | [Preview](https://movin.design/components/checkboxes/pixel-fill/) |
| [Pressure Dip checkbox](components/checkboxes/pressure-dip/) | `checkbox-pressure-dip` | None | [Preview](https://movin.design/components/checkboxes/pressure-dip/) |
| [Pulse Ring checkbox](components/checkboxes/pulse-ring/) | `checkbox-pulse-ring` | None | [Preview](https://movin.design/components/checkboxes/pulse-ring/) |
| [Radar Sweep checkbox](components/checkboxes/radar-sweep/) | `checkbox-radar-sweep` | None | [Preview](https://movin.design/components/checkboxes/radar-sweep/) |
| [Raised checkbox](components/checkboxes/raised/) | `checkbox-raised` | None | [Preview](https://movin.design/components/checkboxes/raised/) |
| [Retro LED checkbox](components/checkboxes/retro-led/) | `checkbox-retro-led` | None | [Preview](https://movin.design/components/checkboxes/retro-led/) |
| [Ripple Fill checkbox](components/checkboxes/ripple-fill/) | `checkbox-ripple-fill` | None | [Preview](https://movin.design/components/checkboxes/ripple-fill/) |
| [Round Morph checkbox](components/checkboxes/round-morph/) | `checkbox-round-morph` | None | [Preview](https://movin.design/components/checkboxes/round-morph/) |
| [Scratch checkbox](components/checkboxes/scratch/) | `checkbox-scratch` | None | [Preview](https://movin.design/components/checkboxes/scratch/) |
| [Shake Lock checkbox](components/checkboxes/shake-lock/) | `checkbox-shake-lock` | None | [Preview](https://movin.design/components/checkboxes/shake-lock/) |
| [Shutter checkbox](components/checkboxes/shutter/) | `checkbox-shutter` | None | [Preview](https://movin.design/components/checkboxes/shutter/) |
| [Spark Trail checkbox](components/checkboxes/spark-trail/) | `checkbox-spark-trail` | None | [Preview](https://movin.design/components/checkboxes/spark-trail/) |
| [Stamp checkbox](components/checkboxes/stamp/) | `checkbox-stamp` | None | [Preview](https://movin.design/components/checkboxes/stamp/) |
| [Tilt Hover checkbox](components/checkboxes/tilt-hover/) | `checkbox-tilt-hover` | None | [Preview](https://movin.design/components/checkboxes/tilt-hover/) |
| [X to Check checkbox](components/checkboxes/x-to-check/) | `checkbox-x-to-check` | None | [Preview](https://movin.design/components/checkboxes/x-to-check/) |

### Inputs (45)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Smooth Caret input](components/inputs/caret/) | `input-caret` | None | [Preview](https://movin.design/components/inputs/caret/) |
| [Tag Chips input](components/inputs/chips/) | `input-chips` | None | [Preview](https://movin.design/components/inputs/chips/) |
| [Code Slots input](components/inputs/code-slots/) | `input-code-slots` | None | [Preview](https://movin.design/components/inputs/code-slots/) |
| [Composer input](components/inputs/composer/) | `input-composer` | None | [Preview](https://movin.design/components/inputs/composer/) |
| [Drop Letters input](components/inputs/drop/) | `input-drop` | None | [Preview](https://movin.design/components/inputs/drop/) |
| [Ghost Complete input](components/inputs/ghost/) | `input-ghost` | None | [Preview](https://movin.design/components/inputs/ghost/) |
| [Handle Check input](components/inputs/handle/) | `input-handle` | None | [Preview](https://movin.design/components/inputs/handle/) |
| [Lens Search input](components/inputs/lens/) | `input-lens` | None | [Preview](https://movin.design/components/inputs/lens/) |
| [Odometer input](components/inputs/odometer/) | `input-odometer` | None | [Preview](https://movin.design/components/inputs/odometer/) |
| [Peek input](components/inputs/peek/) | `input-peek` | None | [Preview](https://movin.design/components/inputs/peek/) |
| [Aurora input](components/inputs/aurora/) | `input-aurora` | None | [Preview](https://movin.design/components/inputs/aurora/) |
| [Border Draw input](components/inputs/border-draw/) | `input-border-draw` | None | [Preview](https://movin.design/components/inputs/border-draw/) |
| [Brutalist input](components/inputs/brutalist/) | `input-brutalist` | None | [Preview](https://movin.design/components/inputs/brutalist/) |
| [Count input](components/inputs/count/) | `input-count` | None | [Preview](https://movin.design/components/inputs/count/) |
| [Count Ring input](components/inputs/count-ring/) | `input-count-ring` | None | [Preview](https://movin.design/components/inputs/count-ring/) |
| [Electric input](components/inputs/electric/) | `input-electric` | None | [Preview](https://movin.design/components/inputs/electric/) |
| [Fill input](components/inputs/fill/) | `input-fill` | None | [Preview](https://movin.design/components/inputs/fill/) |
| [Float Label input](components/inputs/float-label/) | `input-float-label` | None | [Preview](https://movin.design/components/inputs/float-label/) |
| [Frosted input](components/inputs/frosted/) | `input-frosted` | None | [Preview](https://movin.design/components/inputs/frosted/) |
| [Glitch Error input](components/inputs/glitch-error/) | `input-glitch-error` | None | [Preview](https://movin.design/components/inputs/glitch-error/) |
| [Glow input](components/inputs/glow/) | `input-glow` | None | [Preview](https://movin.design/components/inputs/glow/) |
| [Gradient Ring input](components/inputs/gradient-ring/) | `input-gradient-ring` | None | [Preview](https://movin.design/components/inputs/gradient-ring/) |
| [Gradient Spin input](components/inputs/gradient-spin/) | `input-gradient-spin` | None | [Preview](https://movin.design/components/inputs/gradient-spin/) |
| [HUD Brackets input](components/inputs/hud-brackets/) | `input-hud-brackets` | None | [Preview](https://movin.design/components/inputs/hud-brackets/) |
| [Icon Shift input](components/inputs/icon-shift/) | `input-icon-shift` | None | [Preview](https://movin.design/components/inputs/icon-shift/) |
| [Laser input](components/inputs/laser/) | `input-laser` | None | [Preview](https://movin.design/components/inputs/laser/) |
| [Liquid Fill input](components/inputs/liquid-fill/) | `input-liquid-fill` | None | [Preview](https://movin.design/components/inputs/liquid-fill/) |
| [Magnetic Label input](components/inputs/magnetic-label/) | `input-magnetic-label` | framer-motion | [Preview](https://movin.design/components/inputs/magnetic-label/) |
| [Morph Shape input](components/inputs/morph-shape/) | `input-morph-shape` | None | [Preview](https://movin.design/components/inputs/morph-shape/) |
| [Neon Pulse input](components/inputs/neon-pulse/) | `input-neon-pulse` | None | [Preview](https://movin.design/components/inputs/neon-pulse/) |
| [Neumorphic input](components/inputs/neumorphic/) | `input-neumorphic` | None | [Preview](https://movin.design/components/inputs/neumorphic/) |
| [Particle Burst input](components/inputs/particle-burst/) | `input-particle-burst` | None | [Preview](https://movin.design/components/inputs/particle-burst/) |
| [Progress Fill input](components/inputs/progress-fill/) | `input-progress-fill` | None | [Preview](https://movin.design/components/inputs/progress-fill/) |
| [Ripple Type input](components/inputs/ripple-type/) | `input-ripple-type` | None | [Preview](https://movin.design/components/inputs/ripple-type/) |
| [Scan Line input](components/inputs/scan-line/) | `input-scan-line` | None | [Preview](https://movin.design/components/inputs/scan-line/) |
| [Shake input](components/inputs/shake/) | `input-shake` | None | [Preview](https://movin.design/components/inputs/shake/) |
| [Split input](components/inputs/split/) | `input-split` | None | [Preview](https://movin.design/components/inputs/split/) |
| [Split Label input](components/inputs/split-label/) | `input-split-label` | None | [Preview](https://movin.design/components/inputs/split-label/) |
| [Spotlight input](components/inputs/spotlight/) | `input-spotlight` | None | [Preview](https://movin.design/components/inputs/spotlight/) |
| [Strength input](components/inputs/strength/) | `input-strength` | None | [Preview](https://movin.design/components/inputs/strength/) |
| [Tag Label input](components/inputs/tag-label/) | `input-tag-label` | None | [Preview](https://movin.design/components/inputs/tag-label/) |
| [Typeout input](components/inputs/typeout/) | `input-typeout` | None | [Preview](https://movin.design/components/inputs/typeout/) |
| [Underline input](components/inputs/underline/) | `input-underline` | None | [Preview](https://movin.design/components/inputs/underline/) |
| [Validate input](components/inputs/validate/) | `input-validate` | None | [Preview](https://movin.design/components/inputs/validate/) |
| [Wobble input](components/inputs/wobble/) | `input-wobble` | None | [Preview](https://movin.design/components/inputs/wobble/) |

### Loaders (39)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Atom loader](components/loaders/atom/) | `loader-atom` | None | [Preview](https://movin.design/components/loaders/atom/) |
| [Battery loader](components/loaders/battery/) | `loader-battery` | None | [Preview](https://movin.design/components/loaders/battery/) |
| [Clock loader](components/loaders/clock/) | `loader-clock` | None | [Preview](https://movin.design/components/loaders/clock/) |
| [Newton's Cradle loader](components/loaders/cradle/) | `loader-cradle` | None | [Preview](https://movin.design/components/loaders/cradle/) |
| [Dominoes loader](components/loaders/dominoes/) | `loader-dominoes` | None | [Preview](https://movin.design/components/loaders/dominoes/) |
| [Eclipse loader](components/loaders/eclipse/) | `loader-eclipse` | None | [Preview](https://movin.design/components/loaders/eclipse/) |
| [Gears loader](components/loaders/gears/) | `loader-gears` | None | [Preview](https://movin.design/components/loaders/gears/) |
| [Heartbeat loader](components/loaders/heartbeat/) | `loader-heartbeat` | None | [Preview](https://movin.design/components/loaders/heartbeat/) |
| [Hourglass loader](components/loaders/hourglass/) | `loader-hourglass` | None | [Preview](https://movin.design/components/loaders/hourglass/) |
| [Infinity loader](components/loaders/infinity/) | `loader-infinity` | None | [Preview](https://movin.design/components/loaders/infinity/) |
| [Lava loader](components/loaders/lava/) | `loader-lava` | None | [Preview](https://movin.design/components/loaders/lava/) |
| [Radar loader](components/loaders/radar/) | `loader-radar` | None | [Preview](https://movin.design/components/loaders/radar/) |
| [Ring Text loader](components/loaders/ring-text/) | `loader-ring-text` | None | [Preview](https://movin.design/components/loaders/ring-text/) |
| [Segment loader](components/loaders/segment/) | `loader-segment` | None | [Preview](https://movin.design/components/loaders/segment/) |
| [Snake loader](components/loaders/snake/) | `loader-snake` | None | [Preview](https://movin.design/components/loaders/snake/) |
| [Stack loader](components/loaders/stack/) | `loader-stack` | None | [Preview](https://movin.design/components/loaders/stack/) |
| [Sunflower loader](components/loaders/sunflower/) | `loader-sunflower` | None | [Preview](https://movin.design/components/loaders/sunflower/) |
| [Terminal loader](components/loaders/terminal/) | `loader-terminal` | None | [Preview](https://movin.design/components/loaders/terminal/) |
| [Tumble loader](components/loaders/tumble/) | `loader-tumble` | None | [Preview](https://movin.design/components/loaders/tumble/) |
| [Bounce Dots loader](components/loaders/bounce-dots/) | `loader-bounce-dots` | None | [Preview](https://movin.design/components/loaders/bounce-dots/) |
| [Bouncing Ball loader](components/loaders/bouncing-ball/) | `loader-bouncing-ball` | None | [Preview](https://movin.design/components/loaders/bouncing-ball/) |
| [Color Bounce loader](components/loaders/color-bounce/) | `loader-color-bounce` | None | [Preview](https://movin.design/components/loaders/color-bounce/) |
| [Comet loader](components/loaders/comet/) | `loader-comet` | None | [Preview](https://movin.design/components/loaders/comet/) |
| [Dots Circle loader](components/loaders/dots-circle/) | `loader-dots-circle` | None | [Preview](https://movin.design/components/loaders/dots-circle/) |
| [Dual Ring loader](components/loaders/dual-ring/) | `loader-dual-ring` | None | [Preview](https://movin.design/components/loaders/dual-ring/) |
| [Equalizer loader](components/loaders/equalizer/) | `loader-equalizer` | None | [Preview](https://movin.design/components/loaders/equalizer/) |
| [Flip Square loader](components/loaders/flip-square/) | `loader-flip-square` | None | [Preview](https://movin.design/components/loaders/flip-square/) |
| [Gradient Ring loader](components/loaders/gradient-ring/) | `loader-gradient-ring` | None | [Preview](https://movin.design/components/loaders/gradient-ring/) |
| [Helix loader](components/loaders/helix/) | `loader-helix` | None | [Preview](https://movin.design/components/loaders/helix/) |
| [Morph loader](components/loaders/morph/) | `loader-morph` | None | [Preview](https://movin.design/components/loaders/morph/) |
| [Mosaic loader](components/loaders/mosaic/) | `loader-mosaic` | None | [Preview](https://movin.design/components/loaders/mosaic/) |
| [Neon Ripple loader](components/loaders/neon-ripple/) | `loader-neon-ripple` | None | [Preview](https://movin.design/components/loaders/neon-ripple/) |
| [Orbit loader](components/loaders/orbit/) | `loader-orbit` | None | [Preview](https://movin.design/components/loaders/orbit/) |
| [Progress Bar loader](components/loaders/progress-bar/) | `loader-progress-bar` | None | [Preview](https://movin.design/components/loaders/progress-bar/) |
| [Pulse Dots loader](components/loaders/pulse-dots/) | `loader-pulse-dots` | None | [Preview](https://movin.design/components/loaders/pulse-dots/) |
| [Skeleton loader](components/loaders/skeleton/) | `loader-skeleton` | None | [Preview](https://movin.design/components/loaders/skeleton/) |
| [Spinning Ring loader](components/loaders/spinning-ring/) | `loader-spinning-ring` | None | [Preview](https://movin.design/components/loaders/spinning-ring/) |
| [Text Shimmer loader](components/loaders/text-shimmer/) | `loader-text-shimmer` | None | [Preview](https://movin.design/components/loaders/text-shimmer/) |
| [Wave Bars loader](components/loaders/wave-bars/) | `loader-wave-bars` | None | [Preview](https://movin.design/components/loaders/wave-bars/) |

### Radio buttons (48)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Align radio button](components/radios/align/) | `radio-align` | None | [Preview](https://movin.design/components/radios/align/) |
| [Daylight radio button](components/radios/daylight/) | `radio-daylight` | None | [Preview](https://movin.design/components/radios/daylight/) |
| [Delivery radio button](components/radios/delivery/) | `radio-delivery` | None | [Preview](https://movin.design/components/radios/delivery/) |
| [Dial radio button](components/radios/dial/) | `radio-dial` | None | [Preview](https://movin.design/components/radios/dial/) |
| [Die radio button](components/radios/die/) | `radio-die` | None | [Preview](https://movin.design/components/radios/die/) |
| [Drum radio button](components/radios/drum/) | `radio-drum` | None | [Preview](https://movin.design/components/radios/drum/) |
| [Fan radio button](components/radios/fan/) | `radio-fan` | None | [Preview](https://movin.design/components/radios/fan/) |
| [Flip Card radio button](components/radios/flip-card/) | `radio-flip-card` | None | [Preview](https://movin.design/components/radios/flip-card/) |
| [Folders radio button](components/radios/folders/) | `radio-folders` | None | [Preview](https://movin.design/components/radios/folders/) |
| [Layout radio button](components/radios/layout/) | `radio-layout` | None | [Preview](https://movin.design/components/radios/layout/) |
| [Mood radio button](components/radios/mood/) | `radio-mood` | None | [Preview](https://movin.design/components/radios/mood/) |
| [Seat radio button](components/radios/seat/) | `radio-seat` | None | [Preview](https://movin.design/components/radios/seat/) |
| [Shape radio button](components/radios/shape/) | `radio-shape` | None | [Preview](https://movin.design/components/radios/shape/) |
| [Sizes radio button](components/radios/sizes/) | `radio-sizes` | None | [Preview](https://movin.design/components/radios/sizes/) |
| [Stars radio button](components/radios/stars/) | `radio-stars` | None | [Preview](https://movin.design/components/radios/stars/) |
| [Tab Bar radio button](components/radios/tab-bar/) | `radio-tab-bar` | None | [Preview](https://movin.design/components/radios/tab-bar/) |
| [Theme radio button](components/radios/theme/) | `radio-theme` | None | [Preview](https://movin.design/components/radios/theme/) |
| [Tip Jar radio button](components/radios/tip-jar/) | `radio-tip-jar` | None | [Preview](https://movin.design/components/radios/tip-jar/) |
| [Turntable radio button](components/radios/turntable/) | `radio-turntable` | None | [Preview](https://movin.design/components/radios/turntable/) |
| [Blob radio button](components/radios/blob/) | `radio-blob` | framer-motion | [Preview](https://movin.design/components/radios/blob/) |
| [Bubble radio button](components/radios/bubble/) | `radio-bubble` | None | [Preview](https://movin.design/components/radios/bubble/) |
| [Card radio button](components/radios/card/) | `radio-card` | None | [Preview](https://movin.design/components/radios/card/) |
| [Clay radio button](components/radios/clay/) | `radio-clay` | None | [Preview](https://movin.design/components/radios/clay/) |
| [Constellation radio button](components/radios/constellation/) | `radio-constellation` | None | [Preview](https://movin.design/components/radios/constellation/) |
| [Cursor radio button](components/radios/cursor/) | `radio-cursor` | None | [Preview](https://movin.design/components/radios/cursor/) |
| [Elastic radio button](components/radios/elastic/) | `radio-elastic` | framer-motion | [Preview](https://movin.design/components/radios/elastic/) |
| [Frost radio button](components/radios/frost/) | `radio-frost` | framer-motion | [Preview](https://movin.design/components/radios/frost/) |
| [Gravity radio button](components/radios/gravity/) | `radio-gravity` | None | [Preview](https://movin.design/components/radios/gravity/) |
| [Hologram radio button](components/radios/hologram/) | `radio-hologram` | None | [Preview](https://movin.design/components/radios/hologram/) |
| [Ink Drop radio button](components/radios/ink-drop/) | `radio-ink-drop` | None | [Preview](https://movin.design/components/radios/ink-drop/) |
| [LED radio button](components/radios/led/) | `radio-led` | None | [Preview](https://movin.design/components/radios/led/) |
| [Magnetic radio button](components/radios/magnetic/) | `radio-magnetic` | None | [Preview](https://movin.design/components/radios/magnetic/) |
| [Matrix radio button](components/radios/matrix/) | `radio-matrix` | None | [Preview](https://movin.design/components/radios/matrix/) |
| [Neon Trace radio button](components/radios/neon-trace/) | `radio-neon-trace` | None | [Preview](https://movin.design/components/radios/neon-trace/) |
| [Neural radio button](components/radios/neural/) | `radio-neural` | None | [Preview](https://movin.design/components/radios/neural/) |
| [Offset Block radio button](components/radios/offset-block/) | `radio-offset-block` | None | [Preview](https://movin.design/components/radios/offset-block/) |
| [Pillow radio button](components/radios/pillow/) | `radio-pillow` | None | [Preview](https://movin.design/components/radios/pillow/) |
| [Pixel radio button](components/radios/pixel/) | `radio-pixel` | None | [Preview](https://movin.design/components/radios/pixel/) |
| [Prism radio button](components/radios/prism/) | `radio-prism` | None | [Preview](https://movin.design/components/radios/prism/) |
| [Radar radio button](components/radios/radar/) | `radio-radar` | None | [Preview](https://movin.design/components/radios/radar/) |
| [Ripple radio button](components/radios/ripple/) | `radio-ripple` | None | [Preview](https://movin.design/components/radios/ripple/) |
| [Scan Line radio button](components/radios/scan-line/) | `radio-scan-line` | None | [Preview](https://movin.design/components/radios/scan-line/) |
| [Signal radio button](components/radios/signal/) | `radio-signal` | None | [Preview](https://movin.design/components/radios/signal/) |
| [Spring radio button](components/radios/spring/) | `radio-spring` | None | [Preview](https://movin.design/components/radios/spring/) |
| [Stamp radio button](components/radios/stamp/) | `radio-stamp` | None | [Preview](https://movin.design/components/radios/stamp/) |
| [Targeting radio button](components/radios/targeting/) | `radio-targeting` | None | [Preview](https://movin.design/components/radios/targeting/) |
| [Typewriter radio button](components/radios/typewriter/) | `radio-typewriter` | None | [Preview](https://movin.design/components/radios/typewriter/) |
| [XP Bar radio button](components/radios/xp-bar/) | `radio-xp-bar` | None | [Preview](https://movin.design/components/radios/xp-bar/) |

### Toggles (33)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Airplane toggle](components/toggles/airplane/) | `toggle-airplane` | None | [Preview](https://movin.design/components/toggles/airplane/) |
| [Aperture toggle](components/toggles/aperture/) | `toggle-aperture` | None | [Preview](https://movin.design/components/toggles/aperture/) |
| [Beam toggle](components/toggles/beam/) | `toggle-beam` | None | [Preview](https://movin.design/components/toggles/beam/) |
| [Blinds toggle](components/toggles/blinds/) | `toggle-blinds` | None | [Preview](https://movin.design/components/toggles/blinds/) |
| [Candle toggle](components/toggles/candle/) | `toggle-candle` | None | [Preview](https://movin.design/components/toggles/candle/) |
| [Caps Lock toggle](components/toggles/caps/) | `toggle-caps` | None | [Preview](https://movin.design/components/toggles/caps/) |
| [Pull Cord toggle](components/toggles/cord/) | `toggle-cord` | None | [Preview](https://movin.design/components/toggles/cord/) |
| [Eye toggle](components/toggles/eye/) | `toggle-eye` | None | [Preview](https://movin.design/components/toggles/eye/) |
| [Fan toggle](components/toggles/fan/) | `toggle-fan` | None | [Preview](https://movin.design/components/toggles/fan/) |
| [Faucet toggle](components/toggles/faucet/) | `toggle-faucet` | None | [Preview](https://movin.design/components/toggles/faucet/) |
| [Split Flap toggle](components/toggles/flap/) | `toggle-flap` | None | [Preview](https://movin.design/components/toggles/flap/) |
| [Neon Sign toggle](components/toggles/neon-sign/) | `toggle-neon-sign` | None | [Preview](https://movin.design/components/toggles/neon-sign/) |
| [Padlock toggle](components/toggles/padlock/) | `toggle-padlock` | None | [Preview](https://movin.design/components/toggles/padlock/) |
| [Pixel toggle](components/toggles/pixel/) | `toggle-pixel` | None | [Preview](https://movin.design/components/toggles/pixel/) |
| [Rocker toggle](components/toggles/rocker/) | `toggle-rocker` | None | [Preview](https://movin.design/components/toggles/rocker/) |
| [Rotary toggle](components/toggles/rotary/) | `toggle-rotary` | None | [Preview](https://movin.design/components/toggles/rotary/) |
| [Seesaw toggle](components/toggles/seesaw/) | `toggle-seesaw` | None | [Preview](https://movin.design/components/toggles/seesaw/) |
| [Shifter toggle](components/toggles/shifter/) | `toggle-shifter` | None | [Preview](https://movin.design/components/toggles/shifter/) |
| [Sleep toggle](components/toggles/sleep/) | `toggle-sleep` | None | [Preview](https://movin.design/components/toggles/sleep/) |
| [Zipper toggle](components/toggles/zipper/) | `toggle-zipper` | None | [Preview](https://movin.design/components/toggles/zipper/) |
| [Checkbox toggle](components/toggles/checkbox/) | `toggle-checkbox` | None | [Preview](https://movin.design/components/toggles/checkbox/) |
| [Expand toggle](components/toggles/expand/) | `toggle-expand` | None | [Preview](https://movin.design/components/toggles/expand/) |
| [Flip toggle](components/toggles/flip/) | `toggle-flip` | None | [Preview](https://movin.design/components/toggles/flip/) |
| [Glow toggle](components/toggles/glow/) | `toggle-glow` | None | [Preview](https://movin.design/components/toggles/glow/) |
| [Gradient Track toggle](components/toggles/gradient-track/) | `toggle-gradient-track` | None | [Preview](https://movin.design/components/toggles/gradient-track/) |
| [Icon toggle](components/toggles/icon/) | `toggle-icon` | None | [Preview](https://movin.design/components/toggles/icon/) |
| [Liquid toggle](components/toggles/liquid/) | `toggle-liquid` | None | [Preview](https://movin.design/components/toggles/liquid/) |
| [Neumorphic toggle](components/toggles/neumorphic/) | `toggle-neumorphic` | None | [Preview](https://movin.design/components/toggles/neumorphic/) |
| [Power toggle](components/toggles/power/) | `toggle-power` | None | [Preview](https://movin.design/components/toggles/power/) |
| [Segmented toggle](components/toggles/segmented/) | `toggle-segmented` | None | [Preview](https://movin.design/components/toggles/segmented/) |
| [Slide toggle](components/toggles/slide/) | `toggle-slide` | None | [Preview](https://movin.design/components/toggles/slide/) |
| [Spring toggle](components/toggles/spring/) | `toggle-spring` | framer-motion | [Preview](https://movin.design/components/toggles/spring/) |
| [Squish toggle](components/toggles/squish/) | `toggle-squish` | None | [Preview](https://movin.design/components/toggles/squish/) |

## Licence

MIT-0 (MIT No Attribution): use, copy, modify and ship these in any project, commercial included, with no attribution required. See [LICENSE](./LICENSE).

## About

Made by the team behind [movin.design](https://movin.design), a curated home for UI motion with free components, shader backgrounds and easing tools. This repository is generated from the site, so fixes land on the site first; issues and suggestions are welcome here.
