<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'neutral' | 'accent' | 'ok' | 'warn' | 'bad';
    /** Show a leading status dot. */
    dot?: boolean;
  }>(),
  { tone: 'neutral', dot: false },
);
</script>

<template>
  <span class="m-badge" :class="`m-badge--${tone}`">
    <span v-if="dot" class="m-badge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.m-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--mctl-space-2);
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  letter-spacing: var(--mctl-typography-letter-spacing-marker);
  text-transform: uppercase;
  padding: var(--mctl-space-1) var(--mctl-space-2);
  border: 1px solid var(--surface-line);
  border-radius: var(--mctl-radius-sm);
  color: var(--surface-fg-muted);
  white-space: nowrap;
}

.m-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--mctl-radius-pill);
  background: currentColor;
}

.m-badge--accent {
  color: var(--accent);
  border-color: var(--accent);
}

.m-badge--ok {
  color: var(--status-ok);
  border-color: color-mix(in srgb, var(--status-ok) 40%, transparent);
}

.m-badge--warn {
  color: var(--status-warn);
  border-color: color-mix(in srgb, var(--status-warn) 40%, transparent);
}

.m-badge--bad {
  color: var(--status-bad);
  border-color: color-mix(in srgb, var(--status-bad) 40%, transparent);
}
</style>
