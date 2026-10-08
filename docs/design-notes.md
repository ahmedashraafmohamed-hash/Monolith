# Design notes

Monolith takes its look from an instrument panel: hairline rules, square corners, corner brackets, a ruler along the tab strip and a ladder of greys. Dark is the main design. A paper-and-ink light mode comes with it.

## The grey ladder

Each heading level, bold, italic, link and equation has its own grey. Size, weight, typeface and a small marker back up the grey, so the roles stay distinct where two greys sit close together. Neighboring steps differ by 4.9 to 6.2 points of CIELAB lightness in dark mode and 5.9 to 8.2 in light mode.

| Role | Dark | Light | Size | Face | Extra cue |
|---|---|---|---|---|---|
| Note title | `#ffffff` (19.3:1) | `#000000` (19.1:1) | 1.9em | Jost 250 | Fading hairline with a tick at each end |
| Heading 1 | `#f6f6f6` (17.9:1) | `#0e0e0e` (17.6:1) | 1.6em | Jost 300 | Fading hairline with one tick |
| Heading 2 | `#e5e5e5` (15.3:1) | `#1d1d1d` (15.3:1) | 1.4em | Jost 400 | Hairline that fades out |
| Heading 3 | `#d4d4d4` (13.0:1) | `#2c2c2c` (12.7:1) | 1.22em | Jost 400 | Filled square marker |
| Heading 4 | `#c4c4c4` (11.1:1) | `#3e3e3e` (9.7:1) | 0.94em | IBM Plex Mono 500 | Outlined triangle marker |
| Heading 5 | `#b3b3b3` (9.2:1) | `#505050` (7.3:1) | 0.86em | IBM Plex Mono 500 | Outlined diamond marker |
| Heading 6 | `#a3a3a3` (7.7:1) | `#5e5e5e` (5.9:1) | 0.78em | IBM Plex Mono 400 | Outlined ring marker |
| Bold | `#ffffff` (19.3:1) | `#000000` (19.1:1) | body | Jost 600 | Brightest text in a paragraph |
| Link | `#f0f0f0` (16.9:1) | `#181818` (16.1:1) | body | Underline | Softly tinted underline (internal), dotted grey (external) |
| Link, unresolved | `#8c8c8c` (5.7:1) | `#666666` (5.2:1) | body | Underline | Dashed grey underline |
| Math | `#e2e2e2` (14.9:1) | `#050505` (18.5:1) | body | Math font | Display math sits in a recessed box with accent corner brackets |
| Italic | `#d2d2d2` (12.8:1) | `#353535` (11.2:1) | body | Jost italic | A true italic, not a slanted upright |
| Body | `#c2c2c2` (10.8:1) | `#474747` (8.4:1) | body | Jost 400 | Plain text |
| Quote | `#a8a8a8` (8.1:1) | `#565656` (6.7:1) | body | Jost 400 | Cool grey edge on the left |

Sizes use `em`, so headings follow the text size you set under Settings, Appearance. The numbers in brackets are contrast ratios against the page color (`#0e0e0e` in dark, `#f4f4f4` in light). WCAG success criterion 1.4.3 sets 4.5:1 as the minimum for normal text. Each grey in the table, the muted and faint text greys, the accent, the code colors and the callout title colors clear 4.5:1 on every surface they sit on: page, sidebar, frame, code well and callout title bar.

## The accent

Dark mode uses `#8fc1ee`. Light mode uses `#2e5fa0`. Both come from the faceted gem in the favicon of the page that inspired the theme. The accent works as a treat: small and quiet at rest, a little brighter when you reach for something.

At rest:

- the caret, the selection and `==highlights==`
- the open tab, the open file and checked tasks
- a faint tint in tags, link underlines, heading markers and the cool cast of heading rules
- the corner brackets around display math, and the tip callouts

On hover:

- a heading's rule warms and its marker lights up
- display math brackets brighten
- links and tags fill in

Never: bullets, plain borders, or a heading rule drawn as a bar or a solid accent line.

To turn the accent up or down, use the **Accent strength** slider in Style Settings. Without that plugin, add a snippet such as `body { --mn-accent-k: 0.6; }`. At 0 the tints go grey. To change the accent color itself, pick one under Settings, Appearance, Accent color. Obsidian documents that setting as an override for the theme's accent, and Monolith reads it everywhere.

## Callout colors

Callouts add a second, quieter cue: a hue on the 3px edge, the icon and the title, and a faint wash on the title bar. Body text stays grey. Every type shares one lightness and one chroma per mode, set in OKLCH, so only the hue angle changes and no type is louder than another.

| Type | Hue | Shape cue |
|---|---|---|
| note, info | slate, 255°, at 45% of the chroma | solid edge |
| todo | slate | dashed outline |
| summary, abstract, tldr | cyan, 205° | solid edge |
| tip, hint, important | the accent | accent edge and glow |
| success, check, done | green, 158° | glow |
| question, help, faq | violet, 290° | dashed outline |
| example | orchid, 335° | solid edge |
| warning, caution, attention | amber, 80° | hatched, dashed outline |
| failure, fail, missing | coral, 45° | hatched |
| danger, error | red, 25° | hatched |
| bug | rose, 355° | hatched |
| quote, cite | none | cool grey edge |

Custom callout types start from slate. Tip callouts follow the accent, so Settings, Appearance, Accent color and the Accent strength slider both reach them.

|  | Dark | Light |
|---|---|---|
| Title and icon | L 0.80, chroma 0.055 | L 0.40, chroma 0.065 |
| Edge | L 0.68, chroma 0.085 | L 0.56, chroma 0.09 |
| Title bar wash | 9% of the edge hue | 9% of the edge hue |
| Hatch lines | 6% of the edge hue | 6% of the edge hue |

Every title color clears 6:1 on its title bar, and every colored edge clears 4:1 against the page, in both modes. The quote edge is a plain grey and stays as it was.

To turn the hue up or down, use the **Callout color** slider in Style Settings. Without that plugin, add a snippet such as `body { --mn-callout-k: 0.6; }`. At 0 the callouts return to the grey ladder of version 1.1.1.

## Lines and shapes

Small details, kept faint:

- heading rules that fade out, with a tick at each end for the note title and one for H1
- a ruler along the bottom of the tab strip, with a tick every 16px and a longer one every 64px, fading to the right
- a dimension line for `---`, with square ends and a dashed middle
- corner brackets on code blocks, display math and the Properties panel
- square checkboxes and tags
- one shape per level for H3 to H6: filled square, outlined triangle, diamond and ring, all the same size

Plain headings and Flat surfaces in Style Settings turn these down. Flat surfaces also removes the glow on tips, links and the open tab.

## Easy on the eyes

- The page is `#0e0e0e`, not pure black. Body text is `#c2c2c2`, not pure white.
- Body text sits about 11:1 against the page. Pure white on pure black is 21:1. Material Design's convention for dark themes is softer than pure white as well, about `#e0e0e0`. Monolith goes a little softer still. If the body text feels dim, raise `--mn-body` in a snippet.
- Glows are rare and small: the open tab, hovered links and buttons, and the tip callout.
- Interface text uses Obsidian's own size scale, so tabs, the sidebar and the status bar match other themes. The theme sets no `rem` sizes, which follow the root font size and can run large.
- Transitions run for 0.15 seconds and switch off when the system asks for reduced motion.

## Other details

- **Callouts** carry a quiet hue on top of their shapes. The icon, the edge and the line style still carry the type, so color is never the only cue. A dashed outline marks open items. Hatching marks danger. See Callout colors above.
- **Code** uses the colors of the Houston theme for Visual Studio Code: blue for keywords and tags, cyan for functions, mint for properties, sand for strings and numbers, periwinkle for important tokens. Comments use the text color at 56% and lean. Dark mode takes Houston's values as published. Houston has no light mode, so light mode keeps each hue and chroma and lowers the lightness until the color clears 5.0:1 against the code background.
- **Tables** get hairlines and a mono header row.
- **Fonts**: Jost for text and IBM Plex Mono for labels and code. Both load from data URLs inside `theme.css`, so the theme works offline. If you pick your own fonts under Settings, Appearance, those win. Arabic script uses your system's Arabic font.
- **Links** in reading view use a border for the underline. Live Preview keeps Obsidian's own underline.
- **Arabic and right-to-left text**: Arabic has no italic, so emphasis there shows by shade, one step brighter than Latin italic. Tracking resets to zero on right-to-left lines, and rules mirror.

## Known gaps

Canvas, Bases, Obsidian Publish, mobile-only chrome, PDF export and third-party plugin interfaces are not tuned yet.

## Sources

- Obsidian developer docs, [CSS variables](https://github.com/obsidianmd/obsidian-developer-docs/tree/main/en/Reference/CSS%20variables) and [Theme guidelines](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Themes/App%20themes/Theme%20guidelines.md)
- [Material Design: dark theme](https://m2.material.io/design/color/dark-theme)
- [WCAG 2.1: Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
