// Direction C palette — MCTL Telegram Mini App color system.
// Used by @mctlhq/css/telegram.css and the MTg* component library.
// These are NOT part of the main @mctlhq/tokens aggregate (they target
// Mini App runtime, not the Engineering/Editorial desktop surface).
export const telegramPalette = {
  light: {
    bg: '#fafaf7',
    surface: '#ffffff',
    surfaceSub: '#f3f2ec',
    ink: '#15171b',
    muted: '#6a6e76',
    faint: '#9a9da3',
    accent: '#2d7df6',
    accentSoft: '#eaf1fe',
    success: '#1f9d57',
    danger: '#d64545',
    warn: '#d97706',
    line: '#e7e6e1',
  },
  dark: {
    bg: '#17212b',
    surface: '#232e3c',
    surfaceSub: '#1a2432',
    ink: '#f5f5f5',
    muted: '#8a8f99',
    faint: '#5a5f69',
    accent: '#4c92f8',
    accentSoft: '#1a2e4a',
    success: '#3db86a',
    danger: '#e05555',
    warn: '#e08b30',
    line: '#2a3744',
  },
} as const;

export type TelegramPalette = typeof telegramPalette;

// Telegram themeParams → CSS variable mapping reference.
// At runtime, call applyTheme() to read window.Telegram.WebApp.themeParams
// and set --tg-* vars from the live theme dict.
export const telegramThemeParamsMap = {
  bg_color: '--tg-bg',
  secondary_bg_color: '--tg-surface-sub',
  section_bg_color: '--tg-surface',
  text_color: '--tg-ink',
  hint_color: '--tg-muted',
  accent_text_color: '--tg-accent',
  link_color: '--tg-accent',
  button_color: '--tg-accent',
  button_text_color: '--tg-ink',
  destructive_text_color: '--tg-danger',
  section_separator_color: '--tg-line',
} as const;

export type TelegramThemeParamsMap = typeof telegramThemeParamsMap;
