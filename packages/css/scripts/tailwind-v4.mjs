// Builds dist/tailwind.css: the Tailwind v4 counterpart of tailwind-preset.ts.
// v4 is configured in CSS (@theme) instead of a JS preset, so the same token
// mapping is emitted as theme variables. Utility names match the v3 preset
// (bg-surface-card, text-accent, font-mono, shadow-md, text-hero, ...).
//
// Two blocks:
//   @theme                   static token values, emitted as variables.
//   @theme inline reference  entries that point at theme.css's runtime vars
//                            (--surface-*, --accent*, --syntax-*, --shadow-*,
//                            --font-*). `inline` makes the utility use the
//                            var() directly, so data-theme / data-accent still
//                            flip it; `reference` keeps Tailwind from emitting
//                            `--shadow-sm: var(--shadow-sm)`, which would be a
//                            self-reference and void the theme.css value.
//
// The numeric spacing scale is deliberately NOT mapped onto v4's numeric keys:
// the MCTL scale is non-linear (5 = 24px, 10 = 132px), and the v3 preset's
// overriding of p-5 / p-10 / p-20 is exactly the surprise to avoid here. It is
// available as p-mctl-5 etc.
//
// Families with no v4 theme namespace -- the preset's transitionDuration,
// opacity, borderWidth and outlineWidth/outlineOffset -- are emitted as
// @utility blocks, so duration-base, opacity-disabled, border-hairline and
// outline-focus keep their v3 names. The one exception is border-none:
// Tailwind's own border-none (border-style: none) already exists and already
// removes the border, so it is not redefined. scripts/check-generated.mjs
// compiles every preset key against this sheet and fails on one that neither
// works nor is a documented difference in the README.

const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

export function tailwindV4Css(t, version) {
  const { color, hue, space, layout, radius, breakpoint, icon, control, motion, opacity, border } =
    t;
  const { fontWeight, fontSize, lineHeight, letterSpacing } = t.typography;

  const stat = [];
  const runtime = [];
  const s = (name, value) => stat.push(`  --${name}: ${value};`);
  const r = (name, value) => runtime.push(`  --${name}: ${value};`);

  // Primitive colours.
  s('color-ink', color.ink);
  s('color-ink-2', color.ink2);
  s('color-ink-3', color.ink3);
  s('color-line', color.line);
  s('color-line-strong', color.line2);
  s('color-fg', color.fg);
  s('color-fg-muted', color.fg2);
  s('color-fg-subtle', color.fg3);
  s('color-paper', color.paper);
  s('color-paper-elevated', color.paperElevated);
  s('color-paper-card', color.paperCard);
  s('color-paper-ink', color.paperInk);
  s('color-paper-fg', color.paperFg);
  s('color-paper-fg-subtle', color.paperFgSubtle);
  s('color-paper-line', color.paperLine);
  s('color-paper-line-strong', color.paperLineStrong);
  for (const [name, ramp] of Object.entries(hue)) {
    for (const [step, value] of Object.entries(ramp)) s(`color-${name}-${step}`, value);
  }

  // Theme-aware colours, resolved by theme.css at runtime.
  for (const k of [
    'bg',
    'elevated',
    'card',
    'line',
    'line-strong',
    'fg',
    'fg-muted',
    'fg-subtle',
  ]) {
    r(`color-surface-${k}`, `var(--surface-${k})`);
  }
  r('color-accent', 'var(--accent)');
  for (const k of ['highlight', 'fg', 'soft', 'terracotta', 'cyan', 'lime', 'lilac']) {
    r(`color-accent-${k}`, `var(--accent-${k})`);
  }
  r('color-accent-vermilion', 'var(--accent-terracotta)');
  for (const k of ['ok', 'warn', 'bad']) r(`color-${k}`, `var(--status-${k})`);
  for (const k of ['key', 'string', 'number', 'keyword', 'punctuation', 'comment']) {
    r(`color-syntax-${k}`, `var(--syntax-${k})`);
  }
  for (const k of ['display', 'mono', 'editorial']) r(`font-${k}`, `var(--font-${k})`);
  for (const k of ['sm', 'md', 'overlay']) r(`shadow-${k}`, `var(--shadow-${k})`);
  // The shell's documented override point, so h-site-header follows it.
  r('spacing-site-header', 'var(--site-header-height)');

  // Type.
  s('font-weight-light', fontWeight.light);
  s('font-weight-normal', fontWeight.regular);
  s('font-weight-medium', fontWeight.medium);
  s('font-weight-semibold', fontWeight.semibold);
  s('font-weight-bold', fontWeight.bold);
  s('font-weight-extrabold', fontWeight.extrabold);
  const text = (name, size, lh, ls) => {
    s(`text-${name}`, size);
    s(`text-${name}--line-height`, lh);
    if (ls) s(`text-${name}--letter-spacing`, ls);
  };
  text('marker', fontSize.marker, lineHeight.tight, letterSpacing.marker);
  text('body', fontSize.body, lineHeight.body);
  text('lede', fontSize.lede, lineHeight.lede);
  text('stat', fontSize.stat, lineHeight.none);
  text('section-title', fontSize.sectionTitle, lineHeight.sectionTitle);
  text('hero', fontSize.hero, lineHeight.hero, letterSpacing.hero);
  text('xs', fontSize.xs, lineHeight.caption);
  text('sm', fontSize.sm, lineHeight.caption);
  text('base', fontSize.base, lineHeight.body);
  text('md', fontSize.md, lineHeight.body);
  text('lg', fontSize.lg, lineHeight.lede);
  text('xl', fontSize.xl, lineHeight.lede);
  text('2xl', fontSize['2xl'], lineHeight.sectionTitle);
  text('3xl', fontSize['3xl'], lineHeight.sectionTitle);
  s('tracking-hero', letterSpacing.hero);
  s('tracking-marker', letterSpacing.marker);

  // Spacing and sizing. Named keys only; see the note on the numeric scale.
  for (const [k, v] of Object.entries(space)) s(`spacing-mctl-${k}`, v);
  s('spacing-page', layout.pagePadding);
  s('spacing-section', layout.sectionPadding);
  s('spacing-gutter', layout.gutter);
  s('spacing-stack', layout.stack);
  for (const [k, v] of Object.entries(icon)) s(`spacing-icon-${k}`, v);
  for (const [k, v] of Object.entries(control.height)) s(`spacing-control-${k}`, v);
  // Widths. v4 resolves max-w-* from --spacing-* before --container-*, so
  // max-w-page here is the page *padding*, and max-w-prose is Tailwind's own
  // static 65ch. Use max-w-pagew (as the v3 preset's spacing already allowed)
  // and max-w-(--container-prose).
  s('spacing-pagew', layout.pageWidth);
  s('spacing-prose', layout.proseWidth);
  s('container-prose', layout.proseWidth);

  for (const [k, v] of Object.entries(radius)) s(`radius-${k}`, v);
  for (const [k, v] of Object.entries(breakpoint)) s(`breakpoint-${k}`, v);
  for (const [k, v] of Object.entries(motion.easing)) s(`ease-${kebab(k)}`, v);

  const utilities = [];
  const u = (name, decl) => utilities.push(`@utility ${name} {\n  ${decl};\n}`);
  // Set --tw-duration like Tailwind's own duration-200: .transition reads
  // transition-duration from it, so `transition duration-base` holds no matter
  // which rule lands later in the sheet. Registered here because Tailwind
  // registers it (non-inheriting) only when one of its own duration-<n> is
  // used; unregistered, duration-base would leak into every descendant's
  // .transition. @property only: on engines without it (Safari < 16.4,
  // Firefox < 128) the value still inherits unless the build also uses a
  // Tailwind duration-<n>, whose `--tw-*: initial` reset then covers it. We
  // do not emit that reset ourselves: a `@layer properties` first declared
  // here would order after `utilities` and override duration-base itself.
  // The runtime var with the token as fallback, so the theme's
  // prefers-reduced-motion override reaches these utilities too.
  for (const [k, v] of Object.entries(motion.duration)) {
    const d = `var(--mctl-motion-duration-${k}, ${v})`;
    u(`duration-${k}`, `--tw-duration: ${d};\n  transition-duration: ${d}`);
  }
  for (const [k, v] of Object.entries(opacity)) u(`opacity-${kebab(k)}`, `opacity: ${v}`);
  // v3's borderWidth scale also yields the per-side utilities (border-b-hairline
  // as a divider is the common one), so each width gets all nine shapes.
  const SIDES = {
    '': 'border-width',
    x: 'border-inline-width',
    y: 'border-block-width',
    t: 'border-top-width',
    r: 'border-right-width',
    b: 'border-bottom-width',
    l: 'border-left-width',
    s: 'border-inline-start-width',
    e: 'border-inline-end-width',
  };
  for (const [k, v] of Object.entries(border.width)) {
    if (k === 'none') continue;
    // The matching side's style too, as Tailwind's border-<n> does, so
    // border-dashed still composes. With a fallback: Tailwind only registers
    // @property --tw-border-style when one of its own border utilities is
    // used, and an unset var() here would make the style `none` -- an
    // invisible border.
    for (const [side, prop] of Object.entries(SIDES)) {
      const style = prop.replace('-width', '-style');
      u(
        `border${side && `-${side}`}-${k}`,
        `${style}: var(--tw-border-style, solid);\n  ${prop}: ${v}`,
      );
    }
  }
  // outline-style starts at `none` and preflight does not reset it, so width
  // alone draws nothing. Same fallback as the borders, as Tailwind's
  // outline-<n> does, so outline-dashed still composes.
  u(
    'outline-focus',
    'outline-style: var(--tw-outline-style, solid);\n  outline-width: var(--focus-ring-width)',
  );
  u('outline-offset-focus', 'outline-offset: var(--focus-ring-offset)');

  return `/* @mctlhq/css ${version} — Tailwind v4 theme. Import after "tailwindcss" and theme.css. */
@theme {
${stat.join('\n')}
}

@theme inline reference {
${runtime.join('\n')}
}

@property --tw-duration {
  syntax: "*";
  inherits: false;
}

${utilities.join('\n\n')}
`;
}
