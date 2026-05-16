import { color } from './color';

// Status colors for run-log dots, badges and alerts.
export const status = {
  ok: color.ok,
  warn: color.warn,
  bad: color.bad,
} as const;

export type Status = typeof status;
export type StatusName = keyof Status;
