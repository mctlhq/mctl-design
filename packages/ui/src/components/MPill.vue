<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'neutral' | 'accent' | 'ok' | 'warn' | 'bad';
    variant?: 'filled' | 'outline';
  }>(),
  { tone: 'neutral', variant: 'filled' },
);
</script>

<template>
  <span class="m-pill" :class="[`m-pill--${tone}`, `m-pill--${variant}`]">
    <slot />
  </span>
</template>

<style scoped>
.m-pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  font-weight: var(--mctl-typography-font-weight-medium);
  padding: 1px var(--mctl-space-2);
  border-radius: var(--mctl-radius-md);
  border: 1px solid transparent;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 1.6;
}

/* filled variants */
.m-pill--filled.m-pill--neutral {
  background: color-mix(in srgb, var(--surface-fg-subtle) 20%, transparent);
  color: var(--surface-fg-muted);
}

.m-pill--filled.m-pill--accent {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
}

.m-pill--filled.m-pill--ok {
  background: color-mix(in srgb, var(--status-ok) 15%, transparent);
  color: var(--status-ok);
}

.m-pill--filled.m-pill--warn {
  background: color-mix(in srgb, var(--status-warn) 15%, transparent);
  color: var(--status-warn);
}

.m-pill--filled.m-pill--bad {
  background: color-mix(in srgb, var(--status-bad) 15%, transparent);
  color: var(--status-bad);
}

/* outline variants */
.m-pill--outline.m-pill--neutral {
  border-color: var(--surface-line-strong);
  color: var(--surface-fg-muted);
}

.m-pill--outline.m-pill--accent {
  border-color: var(--accent);
  color: var(--accent);
}

.m-pill--outline.m-pill--ok {
  border-color: color-mix(in srgb, var(--status-ok) 50%, transparent);
  color: var(--status-ok);
}

.m-pill--outline.m-pill--warn {
  border-color: color-mix(in srgb, var(--status-warn) 50%, transparent);
  color: var(--status-warn);
}

.m-pill--outline.m-pill--bad {
  border-color: color-mix(in srgb, var(--status-bad) 50%, transparent);
  color: var(--status-bad);
}
</style>
