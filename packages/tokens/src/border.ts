export const border = {
  width: {
    none: '0',
    hairline: '1px',
    thick: '2px',
  },
} as const;

export type Border = typeof border;
