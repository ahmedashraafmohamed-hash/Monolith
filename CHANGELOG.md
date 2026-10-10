# Changelog

Earlier versions are listed on the [releases page](https://github.com/ahmedashraafmohamed-hash/Monolith/releases).

## 1.3.0

### Fixed

- **Colors on older Obsidian installers.** Tints and callout colors are now mixed in OKLab instead of OKLCH. On Chromium before 137, an OKLCH mix toward a grey took a made-up hue: the ice-blue accent tinted purple, green callouts turned olive and the cyan summary callout turned pink. At the default settings, current builds look the same as before. The Accent strength and Callout color sliders work as they did.
- **Code comments lean again.** `font-synthesis: none` was set on the whole app. Only the Regular weight of IBM Plex Mono is embedded, so it also stopped code comments from slanting, stopped bold and italic in Source mode, and stopped bold and italic in any font you pick that lacks them. It now applies to right-to-left text only, where it still keeps Arabic upright.
- **Faint text in dark mode.** The faint grey is `#808080`, up from `#7c7c7c`. On the raised grey (`#171717`) behind table headers, selected sidebar rows and search results it measured 4.3:1, under the 4.5:1 the design notes promise. It is now 4.5:1 or better on every surface the notes name. The step is 4 of 255 levels.
- A second `body` rule in `theme.css` is merged into the first.

### Changed

- The author in `manifest.json` is "Ahmed Ashraf", matching the Community listing.
- `docs/design-notes.md` is the only copy of the design notes. The old `design-notes.md` in the root still said callouts have no hue, and is now a pointer. The notes gain a Compatibility section, a corrected lightness-step figure, and a plain statement that the mono headings render in IBM Plex Mono Regular.
- `screenshots/screenshot.png` is 512 × 288, cropped from `Hero.png`.
- The README states what the theme needs: Obsidian 1.10.6 or newer, on an installer with Chromium 120 or newer.

### Added

- Development tooling: Stylelint (the recommended rules, plus a browser-feature check against Chromium 120), `npm run check`, a GitHub Actions workflow that runs it on every push and tag, and [docs/releasing.md](docs/releasing.md).

### Checked, not changed

- The slider math, `calc(60% * var(--mn-accent-k))`, works on every Chromium that has `color-mix()` (tested on 112 to 153). The sliders still take plain numbers from 0 to 1, so existing snippets such as `--mn-accent-k: 0.6` keep working.
