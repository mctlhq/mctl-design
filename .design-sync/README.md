# MCTL design system (tokens, CSS, fonts)

This project ships the MCTL look only: tokens, stylesheets and self-hosted fonts.
There are no importable component bundles. Build UI with plain HTML/React, the CSS custom
properties below, and the reference cards under `components/`. Never hard-code a colour, radius or font that a token covers.

## Setup (required)

Link `styles.css`, then set both attributes on `<html>`. The semantic variables
(`--surface-*`, `--accent*`, `--status-*`) are defined only under `[data-theme]`
and `[data-accent]`, so without them the page is unstyled.

```html
<html data-theme="dark" data-accent="terracotta">
  <head>
    <link rel="stylesheet" href="styles.css" />
  </head>
</html>
```

- `data-theme`: `dark` (default look, "Engineering") or `light` (paper).
- `data-accent`: `terracotta` (brand, default), `vermilion`, `cyan`, `lime`, `lilac`.
- Either attribute may also be set on a wrapper element to scope a region.
- `tokens/telegram.css` (`--tg-*`, `.tg-shell`) is a separate Telegram mini-app
  theme and is not part of `styles.css`. Do not use it for general designs.

## Styling idiom: CSS variables, no utility classes

Use `var(--name)` in your own CSS or inline `style`. Semantic names:

- Surface: `--surface-bg`, `--surface-elevated`, `--surface-card`, `--surface-fg`,
  `--surface-fg-muted`, `--surface-fg-subtle`, `--surface-line`, `--surface-line-strong`
- Accent: `--accent`, `--accent-fg` (text on accent), `--accent-soft`, `--accent-tint`,
  `--accent-text`, `--accent-highlight`, `--accent-border`
- Status: `--status-ok|warn|bad` plus `-soft` and `-text`
- Control: `--control-bg`, `--control-border`, `--focus-ring`
- Shadow: `--shadow-sm`, `--shadow-md`, `--shadow-overlay`
- Fonts: `--font-display` (Onest, UI and headings), `--font-mono` (JetBrains Mono),
  `--font-editorial` (Instrument Serif, sparing accents)
- Type roles, each with `-size`, `-weight`, `-leading`, `-tracking`:
  `--text-hero`, `--text-section`, `--text-title`, `--text-subtitle`, `--text-body`,
  `--text-small`, `--text-caption`, `--text-label`, `--text-code`
- Spacing and shape (raw): `--mctl-space-1..10`, `--mctl-radius-sm|md|lg|xl|2xl|pill`

## Component reference cards

`components/<Group>/<Name>/<Name>.html` holds a static render of each MCTL component
(Vue source, so not importable): real markup, class names and variants in dark and light.
Open the card for a component before building something similar, and copy its structure and
`.m-*` class names; the styles come from `components/mctl-ui.css`, which each card links.
Groups: `Components` (buttons, inputs, cards, tables, modals), `Brand` (`MLogo`, assets in
`brand/`), `Telegram-Components` (`MTg*`, mini-app pieces).

## Where the truth lives

Read before styling: `tokens/theme.css` (semantic layer, themes, accents),
`tokens/tokens.css` (raw scale), `tokens/tokens.json` (same data as JSON).
`tokens/site.css` holds `.mctl-site-*` page-chrome classes (header, nav, hero,
container); `tokens/prose.css` styles long-form text. Prefer these over new chrome.

## Example

```html
<html data-theme="dark" data-accent="terracotta">
  <body>
    <section
      style="padding: var(--mctl-space-8); background: var(--surface-card);
                  border: 1px solid var(--surface-line); border-radius: var(--mctl-radius-lg);"
    >
      <h2
        style="font-size: var(--text-title-size); font-weight: var(--text-title-weight);
               line-height: var(--text-title-leading);"
      >
        Deploy status
      </h2>
      <p style="color: var(--surface-fg-muted);">All services healthy.</p>
      <button
        style="background: var(--accent); color: var(--accent-fg); border: 0;
                   padding: var(--mctl-space-3) var(--mctl-space-5);
                   border-radius: var(--mctl-radius-md); font: inherit;"
      >
        Redeploy
      </button>
    </section>
  </body>
</html>
```
