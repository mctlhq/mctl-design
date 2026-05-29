<script setup lang="ts">
withDefaults(
  defineProps<{
    /** The headline figure, e.g. "99.95%" or "39". */
    value: string;
    /** Marker label above the figure. */
    label?: string;
    /** Optional caption below the figure. */
    caption?: string;
    /** Optional trend indicator. */
    trend?: 'up' | 'down' | 'flat';
  }>(),
  { label: '', caption: '', trend: undefined },
);
</script>

<template>
  <div class="m-stat">
    <span v-if="label" class="m-stat__label">{{ label }}</span>
    <span class="m-stat__value">
      {{ value }}
      <span
        v-if="trend"
        class="m-stat__trend"
        :class="`m-stat__trend--${trend}`"
        aria-hidden="true"
      >{{ trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—' }}</span>
      <span v-if="trend" class="m-stat__sr">trending {{ trend }}</span>
    </span>
    <span v-if="caption" class="m-stat__caption">{{ caption }}</span>
  </div>
</template>

<style scoped>
.m-stat {
  display: flex;
  flex-direction: column;
  gap: var(--mctl-space-2);
}

.m-stat__label {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  letter-spacing: var(--mctl-typography-letter-spacing-marker);
  text-transform: uppercase;
  color: var(--surface-fg-subtle);
}

.m-stat__value {
  display: inline-flex;
  align-items: baseline;
  gap: var(--mctl-space-2);
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-stat);
  font-weight: var(--mctl-typography-font-weight-light);
  line-height: 1;
  color: var(--surface-fg);
}

.m-stat__trend {
  font-size: 0.4em;
}

.m-stat__trend--up { color: var(--status-ok); }
.m-stat__trend--down { color: var(--status-bad); }
.m-stat__trend--flat { color: var(--surface-fg-subtle); }

/* Visually hidden, still announced — gives the trend glyph a text equivalent. */
.m-stat__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.m-stat__caption {
  font-family: var(--font-display);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg-muted);
}
</style>
