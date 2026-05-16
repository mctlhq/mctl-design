import type { Config } from 'tailwindcss';
import {
  accent,
  color,
  status,
  syntax,
  space,
  layout,
  radius,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  motion,
} from '@mctlhq/tokens';

const families = (stack: string): string[] => stack.split(',').map((s) => s.trim());

// Reusable Tailwind preset. Token values are inlined at build time; accent /
// surface entries point at the runtime CSS variables from theme.css so the
// data-theme / data-accent flip works without rebuilding consumers.
const preset = {
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: color.ink, 2: color.ink2, 3: color.ink3 },
        line: { DEFAULT: color.line, strong: color.line2 },
        fg: { DEFAULT: color.fg, muted: color.fg2, subtle: color.fg3 },
        paper: {
          DEFAULT: color.paper,
          ink: color.paperInk,
          fg: color.paperFg,
          line: color.paperLine,
        },
        surface: {
          bg: 'var(--surface-bg)',
          elevated: 'var(--surface-elevated)',
          card: 'var(--surface-card)',
          line: 'var(--surface-line)',
          'line-strong': 'var(--surface-line-strong)',
          fg: 'var(--surface-fg)',
          'fg-muted': 'var(--surface-fg-muted)',
          'fg-subtle': 'var(--surface-fg-subtle)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          highlight: 'var(--accent-highlight)',
          cyan: accent.cyan.primary,
          lime: accent.lime.primary,
          vermilion: accent.vermilion.primary,
          lilac: accent.lilac.primary,
        },
        ok: status.ok,
        warn: status.warn,
        bad: status.bad,
        syntax: {
          key: syntax.key,
          string: syntax.string,
          comment: syntax.comment,
        },
      },
      fontFamily: {
        display: families(fontFamily.display),
        mono: families(fontFamily.mono),
        editorial: families(fontFamily.editorial),
      },
      fontWeight: {
        light: String(fontWeight.light),
        normal: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        semibold: String(fontWeight.semibold),
        bold: String(fontWeight.bold),
      },
      fontSize: {
        marker: [fontSize.marker, { lineHeight: '1.2', letterSpacing: letterSpacing.marker }],
        body: [fontSize.body, { lineHeight: lineHeight.body }],
        lede: [fontSize.lede, { lineHeight: lineHeight.lede }],
        stat: [fontSize.stat, { lineHeight: '1' }],
        'section-title': [fontSize.sectionTitle, { lineHeight: lineHeight.sectionTitle }],
        hero: [fontSize.hero, { lineHeight: lineHeight.hero, letterSpacing: letterSpacing.hero }],
      },
      letterSpacing: {
        hero: letterSpacing.hero,
        marker: letterSpacing.marker,
      },
      spacing: {
        ...space,
        page: layout.pagePadding,
        section: layout.sectionPadding,
      },
      borderRadius: { ...radius },
      transitionDuration: { ...motion.duration },
      transitionTimingFunction: { ...motion.easing },
    },
  },
} satisfies Partial<Config>;

export default preset;
