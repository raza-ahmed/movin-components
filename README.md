# movin.design components

693 animated UI components: buttons, cards, checkboxes, inputs, loaders, radio buttons, sliders, tabs and toggles. Every one comes in two formats:

- **React + Tailwind** (TypeScript), installable with the shadcn CLI. 686 have no dependencies; 7 use Framer Motion.
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

### Buttons (98)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Bell button](components/buttons/bell/) | `button-bell` | None | [Preview](https://movin.design/components/buttons/bell/) |
| [Breathe button](components/buttons/breathe/) | `button-breathe` | None | [Preview](https://movin.design/components/buttons/breathe/) |
| [Brushstroke button](components/buttons/brushstroke/) | `button-brushstroke` | None | [Preview](https://movin.design/components/buttons/brushstroke/) |
| [Dispatch button](components/buttons/dispatch/) | `button-dispatch` | None | [Preview](https://movin.design/components/buttons/dispatch/) |
| [Dissolve button](components/buttons/dissolve/) | `button-dissolve` | None | [Preview](https://movin.design/components/buttons/dissolve/) |
| [Foil button](components/buttons/foil/) | `button-foil` | None | [Preview](https://movin.design/components/buttons/foil/) |
| [Marquee button](components/buttons/marquee/) | `button-marquee` | None | [Preview](https://movin.design/components/buttons/marquee/) |
| [Rewind button](components/buttons/rewind/) | `button-rewind` | None | [Preview](https://movin.design/components/buttons/rewind/) |
| [Spool button](components/buttons/spool/) | `button-spool` | None | [Preview](https://movin.design/components/buttons/spool/) |
| [Topple button](components/buttons/topple/) | `button-topple` | None | [Preview](https://movin.design/components/buttons/topple/) |
| [Airlock button](components/buttons/airlock/) | `button-airlock` | None | [Preview](https://movin.design/components/buttons/airlock/) |
| [Black Hole button](components/buttons/black-hole/) | `button-black-hole` | None | [Preview](https://movin.design/components/buttons/black-hole/) |
| [Blueprint button](components/buttons/blueprint/) | `button-blueprint` | None | [Preview](https://movin.design/components/buttons/blueprint/) |
| [Circuit button](components/buttons/circuit/) | `button-circuit` | None | [Preview](https://movin.design/components/buttons/circuit/) |
| [Constellation button](components/buttons/constellation/) | `button-constellation` | None | [Preview](https://movin.design/components/buttons/constellation/) |
| [CRT Power button](components/buttons/crt-power/) | `button-crt-power` | None | [Preview](https://movin.design/components/buttons/crt-power/) |
| [Data Rain button](components/buttons/data-rain/) | `button-data-rain` | None | [Preview](https://movin.design/components/buttons/data-rain/) |
| [Dot Matrix button](components/buttons/dot-matrix/) | `button-dot-matrix` | None | [Preview](https://movin.design/components/buttons/dot-matrix/) |
| [Echo Stack button](components/buttons/echo-stack/) | `button-echo-stack` | None | [Preview](https://movin.design/components/buttons/echo-stack/) |
| [Fingerprint button](components/buttons/fingerprint/) | `button-fingerprint` | None | [Preview](https://movin.design/components/buttons/fingerprint/) |
| [Force Field button](components/buttons/force-field/) | `button-force-field` | None | [Preview](https://movin.design/components/buttons/force-field/) |
| [Glass button](components/buttons/glass/) | `button-glass` | None | [Preview](https://movin.design/components/buttons/glass/) |
| [Gyroscope button](components/buttons/gyroscope/) | `button-gyroscope` | None | [Preview](https://movin.design/components/buttons/gyroscope/) |
| [Hologram button](components/buttons/hologram/) | `button-hologram` | None | [Preview](https://movin.design/components/buttons/hologram/) |
| [Horizon Grid button](components/buttons/horizon-grid/) | `button-horizon-grid` | None | [Preview](https://movin.design/components/buttons/horizon-grid/) |
| [Iris button](components/buttons/iris/) | `button-iris` | None | [Preview](https://movin.design/components/buttons/iris/) |
| [Laser Etch button](components/buttons/laser-etch/) | `button-laser-etch` | None | [Preview](https://movin.design/components/buttons/laser-etch/) |
| [Launch button](components/buttons/launch/) | `button-launch` | None | [Preview](https://movin.design/components/buttons/launch/) |
| [Liquid Chrome button](components/buttons/liquid-chrome/) | `button-liquid-chrome` | None | [Preview](https://movin.design/components/buttons/liquid-chrome/) |
| [Moire button](components/buttons/moire/) | `button-moire` | None | [Preview](https://movin.design/components/buttons/moire/) |
| [Morse button](components/buttons/morse/) | `button-morse` | None | [Preview](https://movin.design/components/buttons/morse/) |
| [Oscilloscope button](components/buttons/oscilloscope/) | `button-oscilloscope` | None | [Preview](https://movin.design/components/buttons/oscilloscope/) |
| [Pattern Lock button](components/buttons/pattern-lock/) | `button-pattern-lock` | None | [Preview](https://movin.design/components/buttons/pattern-lock/) |
| [Plasma button](components/buttons/plasma/) | `button-plasma` | None | [Preview](https://movin.design/components/buttons/plasma/) |
| [Quantum button](components/buttons/quantum/) | `button-quantum` | None | [Preview](https://movin.design/components/buttons/quantum/) |
| [Radar button](components/buttons/radar/) | `button-radar` | None | [Preview](https://movin.design/components/buttons/radar/) |
| [Reactor button](components/buttons/reactor/) | `button-reactor` | None | [Preview](https://movin.design/components/buttons/reactor/) |
| [Target Lock button](components/buttons/target-lock/) | `button-target-lock` | None | [Preview](https://movin.design/components/buttons/target-lock/) |
| [Teleport button](components/buttons/teleport/) | `button-teleport` | None | [Preview](https://movin.design/components/buttons/teleport/) |
| [Terminal button](components/buttons/terminal/) | `button-terminal` | None | [Preview](https://movin.design/components/buttons/terminal/) |
| [Tesla button](components/buttons/tesla/) | `button-tesla` | None | [Preview](https://movin.design/components/buttons/tesla/) |
| [Thermal button](components/buttons/thermal/) | `button-thermal` | None | [Preview](https://movin.design/components/buttons/thermal/) |
| [Warp button](components/buttons/warp/) | `button-warp` | None | [Preview](https://movin.design/components/buttons/warp/) |
| [Waveform button](components/buttons/waveform/) | `button-waveform` | None | [Preview](https://movin.design/components/buttons/waveform/) |
| [Wireframe button](components/buttons/wireframe/) | `button-wireframe` | None | [Preview](https://movin.design/components/buttons/wireframe/) |
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

### Cards (70)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Almanac card](components/cards/almanac/) | `card-almanac` | None | [Preview](https://movin.design/components/cards/almanac/) |
| [Autograph card](components/cards/autograph/) | `card-autograph` | None | [Preview](https://movin.design/components/cards/autograph/) |
| [Book card](components/cards/book/) | `card-book` | None | [Preview](https://movin.design/components/cards/book/) |
| [Fortune card](components/cards/fortune/) | `card-fortune` | None | [Preview](https://movin.design/components/cards/fortune/) |
| [Matchbox card](components/cards/matchbox/) | `card-matchbox` | None | [Preview](https://movin.design/components/cards/matchbox/) |
| [Notebook card](components/cards/notebook/) | `card-notebook` | None | [Preview](https://movin.design/components/cards/notebook/) |
| [Rings card](components/cards/rings/) | `card-rings` | None | [Preview](https://movin.design/components/cards/rings/) |
| [Sparkline card](components/cards/sparkline/) | `card-sparkline` | None | [Preview](https://movin.design/components/cards/sparkline/) |
| [Wallet card](components/cards/wallet/) | `card-wallet` | None | [Preview](https://movin.design/components/cards/wallet/) |
| [Window seat card](components/cards/window-seat/) | `card-window-seat` | None | [Preview](https://movin.design/components/cards/window-seat/) |
| [Achievement card](components/cards/achievement/) | `card-achievement` | None | [Preview](https://movin.design/components/cards/achievement/) |
| [Bank Card card](components/cards/bank-card/) | `card-bank-card` | None | [Preview](https://movin.design/components/cards/bank-card/) |
| [Bento card](components/cards/bento/) | `card-bento` | None | [Preview](https://movin.design/components/cards/bento/) |
| [Boarding Pass card](components/cards/boarding-pass/) | `card-boarding-pass` | None | [Preview](https://movin.design/components/cards/boarding-pass/) |
| [Chat card](components/cards/chat/) | `card-chat` | None | [Preview](https://movin.design/components/cards/chat/) |
| [Compass card](components/cards/compass/) | `card-compass` | None | [Preview](https://movin.design/components/cards/compass/) |
| [Countdown card](components/cards/countdown/) | `card-countdown` | None | [Preview](https://movin.design/components/cards/countdown/) |
| [Cube card](components/cards/cube/) | `card-cube` | None | [Preview](https://movin.design/components/cards/cube/) |
| [Dimmer card](components/cards/dimmer/) | `card-dimmer` | None | [Preview](https://movin.design/components/cards/dimmer/) |
| [Enhance card](components/cards/enhance/) | `card-enhance` | None | [Preview](https://movin.design/components/cards/enhance/) |
| [Focus card](components/cards/focus/) | `card-focus` | None | [Preview](https://movin.design/components/cards/focus/) |
| [Folder card](components/cards/folder/) | `card-folder` | None | [Preview](https://movin.design/components/cards/folder/) |
| [Gauge card](components/cards/gauge/) | `card-gauge` | None | [Preview](https://movin.design/components/cards/gauge/) |
| [ID Badge card](components/cards/id-badge/) | `card-id-badge` | None | [Preview](https://movin.design/components/cards/id-badge/) |
| [Island card](components/cards/island/) | `card-island` | None | [Preview](https://movin.design/components/cards/island/) |
| [Layers card](components/cards/layers/) | `card-layers` | None | [Preview](https://movin.design/components/cards/layers/) |
| [Orbit Profile card](components/cards/orbit-profile/) | `card-orbit-profile` | None | [Preview](https://movin.design/components/cards/orbit-profile/) |
| [Pipeline card](components/cards/pipeline/) | `card-pipeline` | None | [Preview](https://movin.design/components/cards/pipeline/) |
| [Planet card](components/cards/planet/) | `card-planet` | None | [Preview](https://movin.design/components/cards/planet/) |
| [Polaroid card](components/cards/polaroid/) | `card-polaroid` | None | [Preview](https://movin.design/components/cards/polaroid/) |
| [Pop-out card](components/cards/pop-out/) | `card-pop-out` | None | [Preview](https://movin.design/components/cards/pop-out/) |
| [Poster card](components/cards/poster/) | `card-poster` | None | [Preview](https://movin.design/components/cards/poster/) |
| [QR Assemble card](components/cards/qr-assemble/) | `card-qr-assemble` | None | [Preview](https://movin.design/components/cards/qr-assemble/) |
| [Route card](components/cards/route/) | `card-route` | None | [Preview](https://movin.design/components/cards/route/) |
| [Scrubber card](components/cards/scrubber/) | `card-scrubber` | None | [Preview](https://movin.design/components/cards/scrubber/) |
| [Shatter card](components/cards/shatter/) | `card-shatter` | None | [Preview](https://movin.design/components/cards/shatter/) |
| [Showcase card](components/cards/showcase/) | `card-showcase` | None | [Preview](https://movin.design/components/cards/showcase/) |
| [Skyline card](components/cards/skyline/) | `card-skyline` | None | [Preview](https://movin.design/components/cards/skyline/) |
| [Synth card](components/cards/synth/) | `card-synth` | None | [Preview](https://movin.design/components/cards/synth/) |
| [Tank card](components/cards/tank/) | `card-tank` | None | [Preview](https://movin.design/components/cards/tank/) |
| [Unfold card](components/cards/unfold/) | `card-unfold` | None | [Preview](https://movin.design/components/cards/unfold/) |
| [Vinyl card](components/cards/vinyl/) | `card-vinyl` | None | [Preview](https://movin.design/components/cards/vinyl/) |
| [Voice Note card](components/cards/voice-note/) | `card-voice-note` | None | [Preview](https://movin.design/components/cards/voice-note/) |
| [Weather card](components/cards/weather/) | `card-weather` | None | [Preview](https://movin.design/components/cards/weather/) |
| [X-Ray card](components/cards/x-ray/) | `card-x-ray` | None | [Preview](https://movin.design/components/cards/x-ray/) |
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

### Checkboxes (90)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Ballot checkbox](components/checkboxes/ballot/) | `checkbox-ballot` | None | [Preview](https://movin.design/components/checkboxes/ballot/) |
| [Bow checkbox](components/checkboxes/bow/) | `checkbox-bow` | None | [Preview](https://movin.design/components/checkboxes/bow/) |
| [Bubble checkbox](components/checkboxes/bubble/) | `checkbox-bubble` | None | [Preview](https://movin.design/components/checkboxes/bubble/) |
| [Chalk checkbox](components/checkboxes/chalk/) | `checkbox-chalk` | None | [Preview](https://movin.design/components/checkboxes/chalk/) |
| [Paperclip checkbox](components/checkboxes/paperclip/) | `checkbox-paperclip` | None | [Preview](https://movin.design/components/checkboxes/paperclip/) |
| [Pushpin checkbox](components/checkboxes/pushpin/) | `checkbox-pushpin` | None | [Preview](https://movin.design/components/checkboxes/pushpin/) |
| [Sticker checkbox](components/checkboxes/sticker/) | `checkbox-sticker` | None | [Preview](https://movin.design/components/checkboxes/sticker/) |
| [Toaster checkbox](components/checkboxes/toaster/) | `checkbox-toaster` | None | [Preview](https://movin.design/components/checkboxes/toaster/) |
| [Wax checkbox](components/checkboxes/wax/) | `checkbox-wax` | None | [Preview](https://movin.design/components/checkboxes/wax/) |
| [Wick checkbox](components/checkboxes/wick/) | `checkbox-wick` | None | [Preview](https://movin.design/components/checkboxes/wick/) |
| [Blocks checkbox](components/checkboxes/blocks/) | `checkbox-blocks` | None | [Preview](https://movin.design/components/checkboxes/blocks/) |
| [Calendar checkbox](components/checkboxes/calendar/) | `checkbox-calendar` | None | [Preview](https://movin.design/components/checkboxes/calendar/) |
| [Catapult checkbox](components/checkboxes/catapult/) | `checkbox-catapult` | None | [Preview](https://movin.design/components/checkboxes/catapult/) |
| [Claw checkbox](components/checkboxes/claw/) | `checkbox-claw` | None | [Preview](https://movin.design/components/checkboxes/claw/) |
| [Coin checkbox](components/checkboxes/coin/) | `checkbox-coin` | None | [Preview](https://movin.design/components/checkboxes/coin/) |
| [CRT checkbox](components/checkboxes/crt/) | `checkbox-crt` | None | [Preview](https://movin.design/components/checkboxes/crt/) |
| [Dart checkbox](components/checkboxes/dart/) | `checkbox-dart` | None | [Preview](https://movin.design/components/checkboxes/dart/) |
| [Deboss checkbox](components/checkboxes/deboss/) | `checkbox-deboss` | None | [Preview](https://movin.design/components/checkboxes/deboss/) |
| [Dovetail checkbox](components/checkboxes/dovetail/) | `checkbox-dovetail` | None | [Preview](https://movin.design/components/checkboxes/dovetail/) |
| [Etch checkbox](components/checkboxes/etch/) | `checkbox-etch` | None | [Preview](https://movin.design/components/checkboxes/etch/) |
| [Filament checkbox](components/checkboxes/filament/) | `checkbox-filament` | None | [Preview](https://movin.design/components/checkboxes/filament/) |
| [Gears checkbox](components/checkboxes/gears/) | `checkbox-gears` | None | [Preview](https://movin.design/components/checkboxes/gears/) |
| [Gift checkbox](components/checkboxes/gift/) | `checkbox-gift` | None | [Preview](https://movin.design/components/checkboxes/gift/) |
| [Highlighter checkbox](components/checkboxes/highlighter/) | `checkbox-highlighter` | None | [Preview](https://movin.design/components/checkboxes/highlighter/) |
| [Hoop checkbox](components/checkboxes/hoop/) | `checkbox-hoop` | None | [Preview](https://movin.design/components/checkboxes/hoop/) |
| [Invisible Ink checkbox](components/checkboxes/invisible-ink/) | `checkbox-invisible-ink` | None | [Preview](https://movin.design/components/checkboxes/invisible-ink/) |
| [Jelly checkbox](components/checkboxes/jelly/) | `checkbox-jelly` | None | [Preview](https://movin.design/components/checkboxes/jelly/) |
| [Mailbox checkbox](components/checkboxes/mailbox/) | `checkbox-mailbox` | None | [Preview](https://movin.design/components/checkboxes/mailbox/) |
| [Marble checkbox](components/checkboxes/marble/) | `checkbox-marble` | None | [Preview](https://movin.design/components/checkboxes/marble/) |
| [Markdown checkbox](components/checkboxes/markdown/) | `checkbox-markdown` | None | [Preview](https://movin.design/components/checkboxes/markdown/) |
| [Merge checkbox](components/checkboxes/merge/) | `checkbox-merge` | None | [Preview](https://movin.design/components/checkboxes/merge/) |
| [Pencil checkbox](components/checkboxes/pencil/) | `checkbox-pencil` | None | [Preview](https://movin.design/components/checkboxes/pencil/) |
| [Pluck checkbox](components/checkboxes/pluck/) | `checkbox-pluck` | None | [Preview](https://movin.design/components/checkboxes/pluck/) |
| [Polaroid checkbox](components/checkboxes/polaroid/) | `checkbox-polaroid` | None | [Preview](https://movin.design/components/checkboxes/polaroid/) |
| [Pop-up checkbox](components/checkboxes/popup/) | `checkbox-popup` | None | [Preview](https://movin.design/components/checkboxes/popup/) |
| [Punch checkbox](components/checkboxes/punch/) | `checkbox-punch` | None | [Preview](https://movin.design/components/checkboxes/punch/) |
| [Receipt checkbox](components/checkboxes/receipt/) | `checkbox-receipt` | None | [Preview](https://movin.design/components/checkboxes/receipt/) |
| [Scan checkbox](components/checkboxes/scan/) | `checkbox-scan` | None | [Preview](https://movin.design/components/checkboxes/scan/) |
| [Spotlight checkbox](components/checkboxes/spotlight/) | `checkbox-spotlight` | None | [Preview](https://movin.design/components/checkboxes/spotlight/) |
| [Stencil checkbox](components/checkboxes/stencil/) | `checkbox-stencil` | None | [Preview](https://movin.design/components/checkboxes/stencil/) |
| [Swipe checkbox](components/checkboxes/swipe/) | `checkbox-swipe` | None | [Preview](https://movin.design/components/checkboxes/swipe/) |
| [Sync checkbox](components/checkboxes/sync/) | `checkbox-sync` | None | [Preview](https://movin.design/components/checkboxes/sync/) |
| [Tape checkbox](components/checkboxes/tape/) | `checkbox-tape` | None | [Preview](https://movin.design/components/checkboxes/tape/) |
| [Tiles checkbox](components/checkboxes/tiles/) | `checkbox-tiles` | None | [Preview](https://movin.design/components/checkboxes/tiles/) |
| [Zip checkbox](components/checkboxes/zip/) | `checkbox-zip` | None | [Preview](https://movin.design/components/checkboxes/zip/) |
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

### Inputs (90)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Card number input](components/inputs/card-number/) | `input-card-number` | None | [Preview](https://movin.design/components/inputs/card-number/) |
| [Dial time input](components/inputs/dial-time/) | `input-dial-time` | None | [Preview](https://movin.design/components/inputs/dial-time/) |
| [Haiku input](components/inputs/haiku/) | `input-haiku` | None | [Preview](https://movin.design/components/inputs/haiku/) |
| [Match input](components/inputs/match/) | `input-match` | None | [Preview](https://movin.design/components/inputs/match/) |
| [Monogram input](components/inputs/monogram/) | `input-monogram` | None | [Preview](https://movin.design/components/inputs/monogram/) |
| [Overflow input](components/inputs/overflow/) | `input-overflow` | None | [Preview](https://movin.design/components/inputs/overflow/) |
| [Pin drop input](components/inputs/pin-drop/) | `input-pin-drop` | None | [Preview](https://movin.design/components/inputs/pin-drop/) |
| [Postal input](components/inputs/postal/) | `input-postal` | None | [Preview](https://movin.design/components/inputs/postal/) |
| [Quill input](components/inputs/quill/) | `input-quill` | None | [Preview](https://movin.design/components/inputs/quill/) |
| [Scrub input](components/inputs/scrub/) | `input-scrub` | None | [Preview](https://movin.design/components/inputs/scrub/) |
| [Angle input](components/inputs/angle/) | `input-angle` | None | [Preview](https://movin.design/components/inputs/angle/) |
| [Calc input](components/inputs/calc/) | `input-calc` | None | [Preview](https://movin.design/components/inputs/calc/) |
| [Cipher input](components/inputs/cipher/) | `input-cipher` | None | [Preview](https://movin.design/components/inputs/cipher/) |
| [Combination input](components/inputs/combination/) | `input-combination` | None | [Preview](https://movin.design/components/inputs/combination/) |
| [Constellation input](components/inputs/constellation/) | `input-constellation` | None | [Preview](https://movin.design/components/inputs/constellation/) |
| [Convert input](components/inputs/convert/) | `input-convert` | None | [Preview](https://movin.design/components/inputs/convert/) |
| [Date Range input](components/inputs/date-range/) | `input-date-range` | None | [Preview](https://movin.design/components/inputs/date-range/) |
| [Detent input](components/inputs/detent/) | `input-detent` | None | [Preview](https://movin.design/components/inputs/detent/) |
| [Domain input](components/inputs/domain/) | `input-domain` | None | [Preview](https://movin.design/components/inputs/domain/) |
| [Drum input](components/inputs/drum/) | `input-drum` | None | [Preview](https://movin.design/components/inputs/drum/) |
| [Elastic input](components/inputs/elastic/) | `input-elastic` | None | [Preview](https://movin.design/components/inputs/elastic/) |
| [Extrude input](components/inputs/extrude/) | `input-extrude` | None | [Preview](https://movin.design/components/inputs/extrude/) |
| [Flapboard input](components/inputs/flapboard/) | `input-flapboard` | None | [Preview](https://movin.design/components/inputs/flapboard/) |
| [Gravity input](components/inputs/gravity/) | `input-gravity` | None | [Preview](https://movin.design/components/inputs/gravity/) |
| [Grow input](components/inputs/grow/) | `input-grow` | None | [Preview](https://movin.design/components/inputs/grow/) |
| [Heat input](components/inputs/heat/) | `input-heat` | None | [Preview](https://movin.design/components/inputs/heat/) |
| [Histogram input](components/inputs/histogram/) | `input-histogram` | None | [Preview](https://movin.design/components/inputs/histogram/) |
| [Ink input](components/inputs/ink/) | `input-ink` | None | [Preview](https://movin.design/components/inputs/ink/) |
| [Mask input](components/inputs/mask/) | `input-mask` | None | [Preview](https://movin.design/components/inputs/mask/) |
| [Measure input](components/inputs/measure/) | `input-measure` | None | [Preview](https://movin.design/components/inputs/measure/) |
| [Mood input](components/inputs/mood/) | `input-mood` | None | [Preview](https://movin.design/components/inputs/mood/) |
| [Natural Date input](components/inputs/natural-date/) | `input-natural-date` | None | [Preview](https://movin.design/components/inputs/natural-date/) |
| [Query input](components/inputs/query/) | `input-query` | None | [Preview](https://movin.design/components/inputs/query/) |
| [Redact input](components/inputs/redact/) | `input-redact` | None | [Preview](https://movin.design/components/inputs/redact/) |
| [Rotary input](components/inputs/rotary/) | `input-rotary` | None | [Preview](https://movin.design/components/inputs/rotary/) |
| [Scramble input](components/inputs/scramble/) | `input-scramble` | None | [Preview](https://movin.design/components/inputs/scramble/) |
| [Shell input](components/inputs/shell/) | `input-shell` | None | [Preview](https://movin.design/components/inputs/shell/) |
| [Signature input](components/inputs/signature/) | `input-signature` | None | [Preview](https://movin.design/components/inputs/signature/) |
| [Slug input](components/inputs/slug/) | `input-slug` | None | [Preview](https://movin.design/components/inputs/slug/) |
| [Tally input](components/inputs/tally/) | `input-tally` | None | [Preview](https://movin.design/components/inputs/tally/) |
| [Telegraph input](components/inputs/telegraph/) | `input-telegraph` | None | [Preview](https://movin.design/components/inputs/telegraph/) |
| [Typewriter input](components/inputs/typewriter/) | `input-typewriter` | None | [Preview](https://movin.design/components/inputs/typewriter/) |
| [URL input](components/inputs/url/) | `input-url` | None | [Preview](https://movin.design/components/inputs/url/) |
| [Wave input](components/inputs/wave/) | `input-wave` | None | [Preview](https://movin.design/components/inputs/wave/) |
| [XY Pad input](components/inputs/xy-pad/) | `input-xy-pad` | None | [Preview](https://movin.design/components/inputs/xy-pad/) |
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

### Loaders (84)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Ampersand loader](components/loaders/ampersand/) | `loader-ampersand` | None | [Preview](https://movin.design/components/loaders/ampersand/) |
| [Beacon loader](components/loaders/beacon/) | `loader-beacon` | None | [Preview](https://movin.design/components/loaders/beacon/) |
| [Brew loader](components/loaders/brew/) | `loader-brew` | None | [Preview](https://movin.design/components/loaders/brew/) |
| [Fireflies loader](components/loaders/fireflies/) | `loader-fireflies` | None | [Preview](https://movin.design/components/loaders/fireflies/) |
| [Grid wave loader](components/loaders/grid-wave/) | `loader-grid-wave` | None | [Preview](https://movin.design/components/loaders/grid-wave/) |
| [Loom loader](components/loaders/loom/) | `loader-loom` | None | [Preview](https://movin.design/components/loaders/loom/) |
| [Lunar loader](components/loaders/lunar/) | `loader-lunar` | None | [Preview](https://movin.design/components/loaders/lunar/) |
| [Pages loader](components/loaders/pages/) | `loader-pages` | None | [Preview](https://movin.design/components/loaders/pages/) |
| [Seam loader](components/loaders/seam/) | `loader-seam` | None | [Preview](https://movin.design/components/loaders/seam/) |
| [Sundial loader](components/loaders/sundial/) | `loader-sundial` | None | [Preview](https://movin.design/components/loaders/sundial/) |
| [Assemble loader](components/loaders/assemble/) | `loader-assemble` | None | [Preview](https://movin.design/components/loaders/assemble/) |
| [Binary loader](components/loaders/binary/) | `loader-binary` | None | [Preview](https://movin.design/components/loaders/binary/) |
| [Binary Star loader](components/loaders/binary-star/) | `loader-binary-star` | None | [Preview](https://movin.design/components/loaders/binary-star/) |
| [Coil loader](components/loaders/coil/) | `loader-coil` | None | [Preview](https://movin.design/components/loaders/coil/) |
| [Conveyor loader](components/loaders/conveyor/) | `loader-conveyor` | None | [Preview](https://movin.design/components/loaders/conveyor/) |
| [Droplet loader](components/loaders/droplet/) | `loader-droplet` | None | [Preview](https://movin.design/components/loaders/droplet/) |
| [Event Horizon loader](components/loaders/event-horizon/) | `loader-event-horizon` | None | [Preview](https://movin.design/components/loaders/event-horizon/) |
| [Flask loader](components/loaders/flask/) | `loader-flask` | None | [Preview](https://movin.design/components/loaders/flask/) |
| [Fold loader](components/loaders/fold/) | `loader-fold` | None | [Preview](https://movin.design/components/loaders/fold/) |
| [Fractal loader](components/loaders/fractal/) | `loader-fractal` | None | [Preview](https://movin.design/components/loaders/fractal/) |
| [Galaxy loader](components/loaders/galaxy/) | `loader-galaxy` | None | [Preview](https://movin.design/components/loaders/galaxy/) |
| [Globe loader](components/loaders/globe/) | `loader-globe` | None | [Preview](https://movin.design/components/loaders/globe/) |
| [Hive loader](components/loaders/hive/) | `loader-hive` | None | [Preview](https://movin.design/components/loaders/hive/) |
| [Kaleidoscope loader](components/loaders/kaleidoscope/) | `loader-kaleidoscope` | None | [Preview](https://movin.design/components/loaders/kaleidoscope/) |
| [Line Clear loader](components/loaders/line-clear/) | `loader-line-clear` | None | [Preview](https://movin.design/components/loaders/line-clear/) |
| [Maze loader](components/loaders/maze/) | `loader-maze` | None | [Preview](https://movin.design/components/loaders/maze/) |
| [Metronome loader](components/loaders/metronome/) | `loader-metronome` | None | [Preview](https://movin.design/components/loaders/metronome/) |
| [Mobius loader](components/loaders/mobius/) | `loader-mobius` | None | [Preview](https://movin.design/components/loaders/mobius/) |
| [Odometer loader](components/loaders/odometer/) | `loader-odometer` | None | [Preview](https://movin.design/components/loaders/odometer/) |
| [Paper Plane loader](components/loaders/paper-plane/) | `loader-paper-plane` | None | [Preview](https://movin.design/components/loaders/paper-plane/) |
| [Pendulum Wave loader](components/loaders/pendulum-wave/) | `loader-pendulum-wave` | None | [Preview](https://movin.design/components/loaders/pendulum-wave/) |
| [Percent loader](components/loaders/percent/) | `loader-percent` | None | [Preview](https://movin.design/components/loaders/percent/) |
| [Pixel Spinner loader](components/loaders/pixel-spinner/) | `loader-pixel-spinner` | None | [Preview](https://movin.design/components/loaders/pixel-spinner/) |
| [Plasma Globe loader](components/loaders/plasma-globe/) | `loader-plasma-globe` | None | [Preview](https://movin.design/components/loaders/plasma-globe/) |
| [Rally loader](components/loaders/rally/) | `loader-rally` | None | [Preview](https://movin.design/components/loaders/rally/) |
| [Ripple Field loader](components/loaders/ripple-field/) | `loader-ripple-field` | None | [Preview](https://movin.design/components/loaders/ripple-field/) |
| [Scanner loader](components/loaders/scanner/) | `loader-scanner` | None | [Preview](https://movin.design/components/loaders/scanner/) |
| [Signal loader](components/loaders/signal/) | `loader-signal` | None | [Preview](https://movin.design/components/loaders/signal/) |
| [Slide Puzzle loader](components/loaders/slide-puzzle/) | `loader-slide-puzzle` | None | [Preview](https://movin.design/components/loaders/slide-puzzle/) |
| [Sound Ring loader](components/loaders/sound-ring/) | `loader-sound-ring` | None | [Preview](https://movin.design/components/loaders/sound-ring/) |
| [Terrain loader](components/loaders/terrain/) | `loader-terrain` | None | [Preview](https://movin.design/components/loaders/terrain/) |
| [Tesseract loader](components/loaders/tesseract/) | `loader-tesseract` | None | [Preview](https://movin.design/components/loaders/tesseract/) |
| [Torus loader](components/loaders/torus/) | `loader-torus` | None | [Preview](https://movin.design/components/loaders/torus/) |
| [Tunnel loader](components/loaders/tunnel/) | `loader-tunnel` | None | [Preview](https://movin.design/components/loaders/tunnel/) |
| [Vortex loader](components/loaders/vortex/) | `loader-vortex` | None | [Preview](https://movin.design/components/loaders/vortex/) |
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

### Radio buttons (93)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Capture radio button](components/radios/capture/) | `radio-capture` | None | [Preview](https://movin.design/components/radios/capture/) |
| [Crop radio button](components/radios/crop/) | `radio-crop` | None | [Preview](https://movin.design/components/radios/crop/) |
| [EQ radio button](components/radios/eq/) | `radio-eq` | None | [Preview](https://movin.design/components/radios/eq/) |
| [Focal radio button](components/radios/focal/) | `radio-focal` | None | [Preview](https://movin.design/components/radios/focal/) |
| [Lux radio button](components/radios/lux/) | `radio-lux` | None | [Preview](https://movin.design/components/radios/lux/) |
| [Nib radio button](components/radios/nib/) | `radio-nib` | None | [Preview](https://movin.design/components/radios/nib/) |
| [Pace radio button](components/radios/pace/) | `radio-pace` | None | [Preview](https://movin.design/components/radios/pace/) |
| [Paper radio button](components/radios/paper/) | `radio-paper` | None | [Preview](https://movin.design/components/radios/paper/) |
| [Roast radio button](components/radios/roast/) | `radio-roast` | None | [Preview](https://movin.design/components/radios/roast/) |
| [Specimen radio button](components/radios/specimen/) | `radio-specimen` | None | [Preview](https://movin.design/components/radios/specimen/) |
| [Altitude radio button](components/radios/altitude/) | `radio-altitude` | None | [Preview](https://movin.design/components/radios/altitude/) |
| [Aperture radio button](components/radios/aperture/) | `radio-aperture` | None | [Preview](https://movin.design/components/radios/aperture/) |
| [Bloom radio button](components/radios/bloom/) | `radio-bloom` | None | [Preview](https://movin.design/components/radios/bloom/) |
| [Brush radio button](components/radios/brush/) | `radio-brush` | None | [Preview](https://movin.design/components/radios/brush/) |
| [Burner radio button](components/radios/burner/) | `radio-burner` | None | [Preview](https://movin.design/components/radios/burner/) |
| [Chart radio button](components/radios/chart/) | `radio-chart` | None | [Preview](https://movin.design/components/radios/chart/) |
| [Chess radio button](components/radios/chess/) | `radio-chess` | None | [Preview](https://movin.design/components/radios/chess/) |
| [Finish radio button](components/radios/finish/) | `radio-finish` | None | [Preview](https://movin.design/components/radios/finish/) |
| [Flock radio button](components/radios/flock/) | `radio-flock` | None | [Preview](https://movin.design/components/radios/flock/) |
| [Floor radio button](components/radios/floor/) | `radio-floor` | None | [Preview](https://movin.design/components/radios/floor/) |
| [Forecast radio button](components/radios/forecast/) | `radio-forecast` | None | [Preview](https://movin.design/components/radios/forecast/) |
| [Gear radio button](components/radios/gear/) | `radio-gear` | None | [Preview](https://movin.design/components/radios/gear/) |
| [Grind radio button](components/radios/grind/) | `radio-grind` | None | [Preview](https://movin.design/components/radios/grind/) |
| [Hop radio button](components/radios/hop/) | `radio-hop` | None | [Preview](https://movin.design/components/radios/hop/) |
| [Layers radio button](components/radios/layers/) | `radio-layers` | None | [Preview](https://movin.design/components/radios/layers/) |
| [Level radio button](components/radios/level/) | `radio-level` | None | [Preview](https://movin.design/components/radios/level/) |
| [Metronome radio button](components/radios/metronome/) | `radio-metronome` | None | [Preview](https://movin.design/components/radios/metronome/) |
| [Order radio button](components/radios/order/) | `radio-order` | None | [Preview](https://movin.design/components/radios/order/) |
| [Phase radio button](components/radios/phase/) | `radio-phase` | None | [Preview](https://movin.design/components/radios/phase/) |
| [Plane radio button](components/radios/plane/) | `radio-plane` | None | [Preview](https://movin.design/components/radios/plane/) |
| [Recline radio button](components/radios/recline/) | `radio-recline` | None | [Preview](https://movin.design/components/radios/recline/) |
| [Resolution radio button](components/radios/resolution/) | `radio-resolution` | None | [Preview](https://movin.design/components/radios/resolution/) |
| [Rock Paper Scissors radio button](components/radios/rock-paper/) | `radio-rock-paper` | None | [Preview](https://movin.design/components/radios/rock-paper/) |
| [Route radio button](components/radios/route/) | `radio-route` | None | [Preview](https://movin.design/components/radios/route/) |
| [Seasons radio button](components/radios/seasons/) | `radio-seasons` | None | [Preview](https://movin.design/components/radios/seasons/) |
| [Slices radio button](components/radios/slices/) | `radio-slices` | None | [Preview](https://movin.design/components/radios/slices/) |
| [Spice radio button](components/radios/spice/) | `radio-spice` | None | [Preview](https://movin.design/components/radios/spice/) |
| [Tickets radio button](components/radios/tickets/) | `radio-tickets` | None | [Preview](https://movin.design/components/radios/tickets/) |
| [Tide radio button](components/radios/tide/) | `radio-tide` | None | [Preview](https://movin.design/components/radios/tide/) |
| [Tone radio button](components/radios/tone/) | `radio-tone` | None | [Preview](https://movin.design/components/radios/tone/) |
| [Traffic radio button](components/radios/traffic/) | `radio-traffic` | None | [Preview](https://movin.design/components/radios/traffic/) |
| [Tuner radio button](components/radios/tuner/) | `radio-tuner` | None | [Preview](https://movin.design/components/radios/tuner/) |
| [Wheel radio button](components/radios/wheel/) | `radio-wheel` | None | [Preview](https://movin.design/components/radios/wheel/) |
| [Wind radio button](components/radios/wind/) | `radio-wind` | None | [Preview](https://movin.design/components/radios/wind/) |
| [Zoom radio button](components/radios/zoom/) | `radio-zoom` | None | [Preview](https://movin.design/components/radios/zoom/) |
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

### Sliders (45)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Balance slider](components/sliders/balance/) | `slider-balance` | None | [Preview](https://movin.design/components/sliders/balance/) |
| [Bass slider](components/sliders/bass/) | `slider-bass` | None | [Preview](https://movin.design/components/sliders/bass/) |
| [Bow slider](components/sliders/bow/) | `slider-bow` | None | [Preview](https://movin.design/components/sliders/bow/) |
| [Bubble slider](components/sliders/bubble/) | `slider-bubble` | None | [Preview](https://movin.design/components/sliders/bubble/) |
| [Candle slider](components/sliders/candle/) | `slider-candle` | None | [Preview](https://movin.design/components/sliders/candle/) |
| [Coins slider](components/sliders/coins/) | `slider-coins` | None | [Preview](https://movin.design/components/sliders/coins/) |
| [Compare slider](components/sliders/compare/) | `slider-compare` | None | [Preview](https://movin.design/components/sliders/compare/) |
| [Crowd slider](components/sliders/crowd/) | `slider-crowd` | None | [Preview](https://movin.design/components/sliders/crowd/) |
| [Curl slider](components/sliders/curl/) | `slider-curl` | None | [Preview](https://movin.design/components/sliders/curl/) |
| [Daylight slider](components/sliders/daylight/) | `slider-daylight` | None | [Preview](https://movin.design/components/sliders/daylight/) |
| [Dial slider](components/sliders/dial/) | `slider-dial` | None | [Preview](https://movin.design/components/sliders/dial/) |
| [Drawbridge slider](components/sliders/drawbridge/) | `slider-drawbridge` | None | [Preview](https://movin.design/components/sliders/drawbridge/) |
| [Fader slider](components/sliders/fader/) | `slider-fader` | None | [Preview](https://movin.design/components/sliders/fader/) |
| [Fan slider](components/sliders/fan/) | `slider-fan` | None | [Preview](https://movin.design/components/sliders/fan/) |
| [Focus slider](components/sliders/focus/) | `slider-focus` | None | [Preview](https://movin.design/components/sliders/focus/) |
| [Goo slider](components/sliders/goo/) | `slider-goo` | None | [Preview](https://movin.design/components/sliders/goo/) |
| [Grow slider](components/sliders/grow/) | `slider-grow` | None | [Preview](https://movin.design/components/sliders/grow/) |
| [Hourglass slider](components/sliders/hourglass/) | `slider-hourglass` | None | [Preview](https://movin.design/components/sliders/hourglass/) |
| [Iris slider](components/sliders/iris/) | `slider-iris` | None | [Preview](https://movin.design/components/sliders/iris/) |
| [Mood slider](components/sliders/mood/) | `slider-mood` | None | [Preview](https://movin.design/components/sliders/mood/) |
| [Notch slider](components/sliders/notch/) | `slider-notch` | None | [Preview](https://movin.design/components/sliders/notch/) |
| [Odometer slider](components/sliders/odometer/) | `slider-odometer` | None | [Preview](https://movin.design/components/sliders/odometer/) |
| [Overcast slider](components/sliders/overcast/) | `slider-overcast` | None | [Preview](https://movin.design/components/sliders/overcast/) |
| [Pitch slider](components/sliders/pitch/) | `slider-pitch` | None | [Preview](https://movin.design/components/sliders/pitch/) |
| [Pour slider](components/sliders/pour/) | `slider-pour` | None | [Preview](https://movin.design/components/sliders/pour/) |
| [Radius slider](components/sliders/radius/) | `slider-radius` | None | [Preview](https://movin.design/components/sliders/radius/) |
| [Rain slider](components/sliders/rain/) | `slider-rain` | None | [Preview](https://movin.design/components/sliders/rain/) |
| [Rings slider](components/sliders/rings/) | `slider-rings` | None | [Preview](https://movin.design/components/sliders/rings/) |
| [Ruler slider](components/sliders/ruler/) | `slider-ruler` | None | [Preview](https://movin.design/components/sliders/ruler/) |
| [Shade slider](components/sliders/shade/) | `slider-shade` | None | [Preview](https://movin.design/components/sliders/shade/) |
| [Signal slider](components/sliders/signal/) | `slider-signal` | None | [Preview](https://movin.design/components/sliders/signal/) |
| [Speedo slider](components/sliders/speedo/) | `slider-speedo` | None | [Preview](https://movin.design/components/sliders/speedo/) |
| [Spring slider](components/sliders/spring/) | `slider-spring` | None | [Preview](https://movin.design/components/sliders/spring/) |
| [Steep slider](components/sliders/steep/) | `slider-steep` | None | [Preview](https://movin.design/components/sliders/steep/) |
| [Stretch slider](components/sliders/stretch/) | `slider-stretch` | None | [Preview](https://movin.design/components/sliders/stretch/) |
| [Telescope slider](components/sliders/telescope/) | `slider-telescope` | None | [Preview](https://movin.design/components/sliders/telescope/) |
| [Thermometer slider](components/sliders/thermometer/) | `slider-thermometer` | None | [Preview](https://movin.design/components/sliders/thermometer/) |
| [Throttle slider](components/sliders/throttle/) | `slider-throttle` | None | [Preview](https://movin.design/components/sliders/throttle/) |
| [Tide slider](components/sliders/tide/) | `slider-tide` | None | [Preview](https://movin.design/components/sliders/tide/) |
| [Tracking slider](components/sliders/tracking/) | `slider-tracking` | None | [Preview](https://movin.design/components/sliders/tracking/) |
| [Trail slider](components/sliders/trail/) | `slider-trail` | None | [Preview](https://movin.design/components/sliders/trail/) |
| [Weight slider](components/sliders/weight/) | `slider-weight` | None | [Preview](https://movin.design/components/sliders/weight/) |
| [Window slider](components/sliders/window/) | `slider-window` | None | [Preview](https://movin.design/components/sliders/window/) |
| [Windsock slider](components/sliders/windsock/) | `slider-windsock` | None | [Preview](https://movin.design/components/sliders/windsock/) |
| [Zipper slider](components/sliders/zipper/) | `slider-zipper` | None | [Preview](https://movin.design/components/sliders/zipper/) |

### Tabs (45)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Binder tab set](components/tabs/binder/) | `tab-binder` | None | [Preview](https://movin.design/components/tabs/binder/) |
| [Blinds tab set](components/tabs/blinds/) | `tab-blinds` | None | [Preview](https://movin.design/components/tabs/blinds/) |
| [Brackets tab set](components/tabs/brackets/) | `tab-brackets` | None | [Preview](https://movin.design/components/tabs/brackets/) |
| [Browser tab set](components/tabs/browser/) | `tab-browser` | None | [Preview](https://movin.design/components/tabs/browser/) |
| [Cabinet tab set](components/tabs/cabinet/) | `tab-cabinet` | None | [Preview](https://movin.design/components/tabs/cabinet/) |
| [Clock tab set](components/tabs/clock/) | `tab-clock` | None | [Preview](https://movin.design/components/tabs/clock/) |
| [Constellation tab set](components/tabs/constellation/) | `tab-constellation` | None | [Preview](https://movin.design/components/tabs/constellation/) |
| [Cube tab set](components/tabs/cube/) | `tab-cube` | None | [Preview](https://movin.design/components/tabs/cube/) |
| [Curtain tab set](components/tabs/curtain/) | `tab-curtain` | None | [Preview](https://movin.design/components/tabs/curtain/) |
| [Decode tab set](components/tabs/decode/) | `tab-decode` | None | [Preview](https://movin.design/components/tabs/decode/) |
| [Departures tab set](components/tabs/departures/) | `tab-departures` | None | [Preview](https://movin.design/components/tabs/departures/) |
| [Develop tab set](components/tabs/develop/) | `tab-develop` | None | [Preview](https://movin.design/components/tabs/develop/) |
| [Dock tab set](components/tabs/dock/) | `tab-dock` | None | [Preview](https://movin.design/components/tabs/dock/) |
| [Editor tab set](components/tabs/editor/) | `tab-editor` | None | [Preview](https://movin.design/components/tabs/editor/) |
| [Envelope tab set](components/tabs/envelope/) | `tab-envelope` | None | [Preview](https://movin.design/components/tabs/envelope/) |
| [Fill tab set](components/tabs/fill/) | `tab-fill` | None | [Preview](https://movin.design/components/tabs/fill/) |
| [Flip tab set](components/tabs/flip/) | `tab-flip` | None | [Preview](https://movin.design/components/tabs/flip/) |
| [Fold tab set](components/tabs/fold/) | `tab-fold` | None | [Preview](https://movin.design/components/tabs/fold/) |
| [Folder tab set](components/tabs/folder/) | `tab-folder` | None | [Preview](https://movin.design/components/tabs/folder/) |
| [Headline tab set](components/tabs/headline/) | `tab-headline` | None | [Preview](https://movin.design/components/tabs/headline/) |
| [Hop tab set](components/tabs/hop/) | `tab-hop` | None | [Preview](https://movin.design/components/tabs/hop/) |
| [Ink tab set](components/tabs/ink/) | `tab-ink` | None | [Preview](https://movin.design/components/tabs/ink/) |
| [Jukebox tab set](components/tabs/jukebox/) | `tab-jukebox` | None | [Preview](https://movin.design/components/tabs/jukebox/) |
| [Keys tab set](components/tabs/keys/) | `tab-keys` | None | [Preview](https://movin.design/components/tabs/keys/) |
| [Lamp tab set](components/tabs/lamp/) | `tab-lamp` | None | [Preview](https://movin.design/components/tabs/lamp/) |
| [Lens tab set](components/tabs/lens/) | `tab-lens` | None | [Preview](https://movin.design/components/tabs/lens/) |
| [Loupe tab set](components/tabs/loupe/) | `tab-loupe` | None | [Preview](https://movin.design/components/tabs/loupe/) |
| [Metro tab set](components/tabs/metro/) | `tab-metro` | None | [Preview](https://movin.design/components/tabs/metro/) |
| [Passport tab set](components/tabs/passport/) | `tab-passport` | None | [Preview](https://movin.design/components/tabs/passport/) |
| [Piano tab set](components/tabs/piano/) | `tab-piano` | None | [Preview](https://movin.design/components/tabs/piano/) |
| [Pixels tab set](components/tabs/pixels/) | `tab-pixels` | None | [Preview](https://movin.design/components/tabs/pixels/) |
| [Reels tab set](components/tabs/reels/) | `tab-reels` | None | [Preview](https://movin.design/components/tabs/reels/) |
| [Reveal tab set](components/tabs/reveal/) | `tab-reveal` | None | [Preview](https://movin.design/components/tabs/reveal/) |
| [Ribbon tab set](components/tabs/ribbon/) | `tab-ribbon` | None | [Preview](https://movin.design/components/tabs/ribbon/) |
| [Scroll tab set](components/tabs/scroll/) | `tab-scroll` | None | [Preview](https://movin.design/components/tabs/scroll/) |
| [Selector tab set](components/tabs/selector/) | `tab-selector` | None | [Preview](https://movin.design/components/tabs/selector/) |
| [Shelf tab set](components/tabs/shelf/) | `tab-shelf` | None | [Preview](https://movin.design/components/tabs/shelf/) |
| [Squiggle tab set](components/tabs/squiggle/) | `tab-squiggle` | None | [Preview](https://movin.design/components/tabs/squiggle/) |
| [Stack tab set](components/tabs/stack/) | `tab-stack` | None | [Preview](https://movin.design/components/tabs/stack/) |
| [Sticky tab set](components/tabs/sticky/) | `tab-sticky` | None | [Preview](https://movin.design/components/tabs/sticky/) |
| [Stories tab set](components/tabs/stories/) | `tab-stories` | None | [Preview](https://movin.design/components/tabs/stories/) |
| [Torch tab set](components/tabs/torch/) | `tab-torch` | None | [Preview](https://movin.design/components/tabs/torch/) |
| [Trace tab set](components/tabs/trace/) | `tab-trace` | None | [Preview](https://movin.design/components/tabs/trace/) |
| [Typewriter tab set](components/tabs/typewriter/) | `tab-typewriter` | None | [Preview](https://movin.design/components/tabs/typewriter/) |
| [Wash tab set](components/tabs/wash/) | `tab-wash` | None | [Preview](https://movin.design/components/tabs/wash/) |

### Toggles (78)

| Component | Install name | Dependencies | Live |
| --- | --- | --- | --- |
| [Broadcast toggle](components/toggles/broadcast/) | `toggle-broadcast` | None | [Preview](https://movin.design/components/toggles/broadcast/) |
| [Door toggle](components/toggles/door/) | `toggle-door` | None | [Preview](https://movin.design/components/toggles/door/) |
| [Earbuds toggle](components/toggles/earbuds/) | `toggle-earbuds` | None | [Preview](https://movin.design/components/toggles/earbuds/) |
| [Flag toggle](components/toggles/flag/) | `toggle-flag` | None | [Preview](https://movin.design/components/toggles/flag/) |
| [Lid toggle](components/toggles/lid/) | `toggle-lid` | None | [Preview](https://movin.design/components/toggles/lid/) |
| [Match toggle](components/toggles/match/) | `toggle-match` | None | [Preview](https://movin.design/components/toggles/match/) |
| [Mute toggle](components/toggles/mute/) | `toggle-mute` | None | [Preview](https://movin.design/components/toggles/mute/) |
| [Pen toggle](components/toggles/pen/) | `toggle-pen` | None | [Preview](https://movin.design/components/toggles/pen/) |
| [Umbrella toggle](components/toggles/umbrella/) | `toggle-umbrella` | None | [Preview](https://movin.design/components/toggles/umbrella/) |
| [Webcam toggle](components/toggles/webcam/) | `toggle-webcam` | None | [Preview](https://movin.design/components/toggles/webcam/) |
| [Arc toggle](components/toggles/arc/) | `toggle-arc` | None | [Preview](https://movin.design/components/toggles/arc/) |
| [Binary toggle](components/toggles/binary/) | `toggle-binary` | None | [Preview](https://movin.design/components/toggles/binary/) |
| [Bloom toggle](components/toggles/bloom/) | `toggle-bloom` | None | [Preview](https://movin.design/components/toggles/bloom/) |
| [Cassette toggle](components/toggles/cassette/) | `toggle-cassette` | None | [Preview](https://movin.design/components/toggles/cassette/) |
| [Charge toggle](components/toggles/charge/) | `toggle-charge` | None | [Preview](https://movin.design/components/toggles/charge/) |
| [Circuit toggle](components/toggles/circuit/) | `toggle-circuit` | None | [Preview](https://movin.design/components/toggles/circuit/) |
| [Cradle toggle](components/toggles/cradle/) | `toggle-cradle` | None | [Preview](https://movin.design/components/toggles/cradle/) |
| [Domino toggle](components/toggles/domino/) | `toggle-domino` | None | [Preview](https://movin.design/components/toggles/domino/) |
| [Eclipse toggle](components/toggles/eclipse/) | `toggle-eclipse` | None | [Preview](https://movin.design/components/toggles/eclipse/) |
| [Fuse toggle](components/toggles/fuse/) | `toggle-fuse` | None | [Preview](https://movin.design/components/toggles/fuse/) |
| [Glitch toggle](components/toggles/glitch/) | `toggle-glitch` | None | [Preview](https://movin.design/components/toggles/glitch/) |
| [Helix toggle](components/toggles/helix/) | `toggle-helix` | None | [Preview](https://movin.design/components/toggles/helix/) |
| [Hourglass toggle](components/toggles/hourglass/) | `toggle-hourglass` | None | [Preview](https://movin.design/components/toggles/hourglass/) |
| [Hyperdrive toggle](components/toggles/hyperdrive/) | `toggle-hyperdrive` | None | [Preview](https://movin.design/components/toggles/hyperdrive/) |
| [Ignition toggle](components/toggles/ignition/) | `toggle-ignition` | None | [Preview](https://movin.design/components/toggles/ignition/) |
| [Keycard toggle](components/toggles/keycard/) | `toggle-keycard` | None | [Preview](https://movin.design/components/toggles/keycard/) |
| [Knife Switch toggle](components/toggles/knife/) | `toggle-knife` | None | [Preview](https://movin.design/components/toggles/knife/) |
| [Lighthouse toggle](components/toggles/lighthouse/) | `toggle-lighthouse` | None | [Preview](https://movin.design/components/toggles/lighthouse/) |
| [Magnet toggle](components/toggles/magnet/) | `toggle-magnet` | None | [Preview](https://movin.design/components/toggles/magnet/) |
| [Mitosis toggle](components/toggles/mitosis/) | `toggle-mitosis` | None | [Preview](https://movin.design/components/toggles/mitosis/) |
| [Morse toggle](components/toggles/morse/) | `toggle-morse` | None | [Preview](https://movin.design/components/toggles/morse/) |
| [Orbit toggle](components/toggles/orbit/) | `toggle-orbit` | None | [Preview](https://movin.design/components/toggles/orbit/) |
| [Pinball toggle](components/toggles/pinball/) | `toggle-pinball` | None | [Preview](https://movin.design/components/toggles/pinball/) |
| [Portal toggle](components/toggles/portal/) | `toggle-portal` | None | [Preview](https://movin.design/components/toggles/portal/) |
| [Prism toggle](components/toggles/prism/) | `toggle-prism` | None | [Preview](https://movin.design/components/toggles/prism/) |
| [Projector toggle](components/toggles/projector/) | `toggle-projector` | None | [Preview](https://movin.design/components/toggles/projector/) |
| [Rack & Pinion toggle](components/toggles/rack/) | `toggle-rack` | None | [Preview](https://movin.design/components/toggles/rack/) |
| [Reactor toggle](components/toggles/reactor/) | `toggle-reactor` | None | [Preview](https://movin.design/components/toggles/reactor/) |
| [Slingshot toggle](components/toggles/slingshot/) | `toggle-slingshot` | None | [Preview](https://movin.design/components/toggles/slingshot/) |
| [Solar toggle](components/toggles/solar/) | `toggle-solar` | None | [Preview](https://movin.design/components/toggles/solar/) |
| [Sprout toggle](components/toggles/sprout/) | `toggle-sprout` | None | [Preview](https://movin.design/components/toggles/sprout/) |
| [Swarm toggle](components/toggles/swarm/) | `toggle-swarm` | None | [Preview](https://movin.design/components/toggles/swarm/) |
| [Terminal toggle](components/toggles/terminal/) | `toggle-terminal` | None | [Preview](https://movin.design/components/toggles/terminal/) |
| [Tumble toggle](components/toggles/tumble/) | `toggle-tumble` | None | [Preview](https://movin.design/components/toggles/tumble/) |
| [Waveform toggle](components/toggles/waveform/) | `toggle-waveform` | None | [Preview](https://movin.design/components/toggles/waveform/) |
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
