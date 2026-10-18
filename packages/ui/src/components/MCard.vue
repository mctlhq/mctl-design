<script lang="ts">
export interface MCardProps {
  /** Use the elevated surface token instead of card. */
  elevated?: boolean;
}
</script>

<script setup lang="ts">
withDefaults(defineProps<MCardProps>(), { elevated: false });
</script>

<template>
  <div class="m-card" :class="{ 'm-card--elevated': elevated }">
    <div v-if="$slots.header" class="m-card__header">
      <slot name="header" />
    </div>
    <div class="m-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="m-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.m-card {
  background: var(--surface-card);
  border: var(--mctl-border-width-hairline) solid var(--surface-line);
  border-radius: var(--mctl-radius-lg);
  font-family: var(--font-mono);
  color: var(--surface-fg);
  overflow: hidden;
}

.m-card--elevated {
  background: var(--surface-elevated);
}

.m-card__header {
  padding: var(--mctl-space-4) var(--mctl-space-5);
  border-bottom: var(--mctl-border-width-hairline) solid var(--surface-line);
  font-size: var(--mctl-typography-font-size-body);
  font-weight: var(--mctl-typography-font-weight-medium);
  color: var(--surface-fg-muted);
}

.m-card__body {
  padding: var(--mctl-space-4) var(--mctl-space-5);
}

.m-card__footer {
  padding: var(--mctl-space-3) var(--mctl-space-5);
  border-top: var(--mctl-border-width-hairline) solid var(--surface-line);
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--surface-fg-subtle);
}
</style>
