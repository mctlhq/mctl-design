<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'info' | 'warn' | 'bad';
  }>(),
  { tone: 'info' },
);
</script>

<template>
  <div class="m-alert" :class="`m-alert--${tone}`" role="alert">
    <slot />
  </div>
</template>

<style scoped>
.m-alert {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  line-height: var(--mctl-typography-line-height-body);
  border-radius: var(--mctl-radius-md);
  border: 1px solid var(--surface-line);
  border-left-width: 3px;
  padding: var(--mctl-space-4) var(--mctl-space-5);
  background: color-mix(in srgb, var(--surface-line) 30%, transparent);
  color: var(--surface-fg);
}

.m-alert--info {
  border-left-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 6%, transparent);
}

.m-alert--warn {
  border-left-color: var(--status-warn);
  background: color-mix(in srgb, var(--status-warn) 6%, transparent);
}

.m-alert--bad {
  border-left-color: var(--status-bad);
  background: color-mix(in srgb, var(--status-bad) 6%, transparent);
}
</style>
