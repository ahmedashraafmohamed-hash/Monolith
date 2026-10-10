# Releasing Monolith

Obsidian installs a theme from the GitHub release whose tag matches `version` in `manifest.json`. It downloads `manifest.json` and `theme.css` from that release. A release is only done when the commit, the manifest, the tag and the two attached files all describe the same build. `npm run check` tests most of this for you.

## Steps

1. **Make and test the change.** Run `npm install` once, then `npm run lint`. For anything that touches colors, check the Accent strength and Callout color sliders at 0, 0.5 and 1 in both light and dark mode (see "Checking the engine" below).
2. **Pick the version**, as `x.y.z`. A fix bumps the last number. A visible change or a new option bumps the middle one.
3. **Update the files that carry the version.**
   - `manifest.json`: set `version`.
   - `versions.json`: add the same version, with the lowest Obsidian version that runs it, for example `"1.3.0": "1.10.6"`.
   - `CHANGELOG.md`: add a `## x.y.z` section.
4. **Run `npm run check`.** It runs Stylelint, then checks that the manifest, `versions.json`, the changelog, the Style Settings block, the README, the screenshot (512 × 288) and the docs agree. It prints a SHA-256 for `manifest.json` and `theme.css`.
5. **Commit everything together** and push to the default branch.
6. **Create the GitHub release.** The tag is exactly the version, with no `v` in front, for example `1.3.0`. Paste the changelog section into the description. Attach `manifest.json` and `theme.css` from that same commit as binary files. The workflow in `.github/workflows/lint.yml` runs on the tag and fails if it does not match `manifest.json`.
7. **Verify.** Download the two assets from the release page and compare their SHA-256 with the one `npm run check` printed. In Obsidian, open **Settings**, then **Appearance**, and confirm Monolith offers the new version.

If the Community listing still shows the old version after the release is published, first confirm that the commit with the new `manifest.json` is on the default branch. The Obsidian directory reads `manifest.json` from the HEAD of the default branch, while Obsidian itself downloads the theme from the release. Both have to carry the new version.

## Checking the engine

Monolith needs Chromium 120 or newer. In Obsidian, open the developer tools (`Ctrl+Shift+I` on Windows and Linux, `Cmd+Option+I` on macOS) and run this in the Console:

```js
navigator.userAgent.match(/Chrome\/(\d+)/)[1]
```

The number should be 120 or higher. To confirm that the color functions work, run:

```js
CSS.supports("color", "color-mix(in oklab, red calc(60% * 0.5), transparent)")
```

It should return `true`. `docs/design-notes.md` lists the engines the theme was tested on.

## Stylelint

`.stylelintrc.json` starts from `stylelint-config-recommended` and turns off the two rules that mostly create false alarms in Obsidian themes, `font-family-no-missing-generic-family-keyword` and `no-descending-specificity`. Two more checks report warnings instead of failing the run:

- `declaration-no-important`. Obsidian's theme guidelines say to avoid `!important`, because a snippet cannot override it. `theme.css` has two, on the equation color, and the comment above them says why.
- `plugin/no-unsupported-browser-features`, set to Chromium 120.

`npm run lint` allows those two known warnings and fails on any new one. Read warnings before you decide they are noise. Do not silence a rule only to make the run pass.
