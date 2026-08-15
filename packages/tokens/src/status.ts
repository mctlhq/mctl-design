import { color } from './color';

// Status colors for run-log dots, badges and alerts. Dark is neon on ink;
// light is the AA-on-paper pair.
export const status = {
  dark: {
    ok: color.ok,
    warn: color.warn,
    bad: color.bad,
  },
  light: {
    ok: color.okDeep,
    warn: color.warnDeep,
    bad: color.badDeep,
  },
} as const;

export type Status = typeof status;
export type StatusName = keyof (typeof status)['dark'];
