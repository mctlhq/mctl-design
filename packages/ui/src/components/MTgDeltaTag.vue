<script lang="ts">
export interface MTgDeltaTagProps {
  /** Percentage delta, e.g. 3.2 for +3.2%, -1.1 for -1.1%. */
  delta: number;
  /** Threshold below which the delta is shown as neutral. Default 0.1. */
  threshold?: number;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<MTgDeltaTagProps>(), { threshold: 0.1 });

const abs = computed(() => Math.abs(props.delta));
const isNeutral = computed(() => abs.value < props.threshold);
const isPositive = computed(() => !isNeutral.value && props.delta > 0);
const isNegative = computed(() => !isNeutral.value && props.delta < 0);
const label = computed(() =>
  isNeutral.value
    ? `~${abs.value.toFixed(1)}%`
    : `${isPositive.value ? '+' : ''}${props.delta.toFixed(1)}%`,
);
</script>

<template>
  <span
    class="m-tg-delta-tag"
    :class="{
      'm-tg-delta-tag--positive': isPositive,
      'm-tg-delta-tag--negative': isNegative,
      'm-tg-delta-tag--neutral': isNeutral,
    }"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.m-tg-delta-tag {
  display: inline-flex;
  align-items: center;
  font-family: var(--tg-font, 'Onest', system-ui, -apple-system, sans-serif);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--tg-radius-chip, 10px);
  white-space: nowrap;
}

.m-tg-delta-tag--positive {
  color: var(--tg-success-text, #1c6e42);
  background: color-mix(in srgb, var(--tg-success, #1f9d57) 12%, transparent);
}

.m-tg-delta-tag--negative {
  color: var(--tg-danger-text, #af3c3d);
  background: color-mix(in srgb, var(--tg-danger, #d64545) 10%, transparent);
}

.m-tg-delta-tag--neutral {
  color: var(--tg-muted, #60646c);
  background: color-mix(in srgb, var(--tg-muted, #60646c) 10%, transparent);
}
</style>
