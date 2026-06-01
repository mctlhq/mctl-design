<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Percentage delta, e.g. 3.2 for +3.2%, -1.1 for -1.1%. */
    delta: number;
    /** Threshold below which the delta is shown as neutral. Default 0.1. */
    threshold?: number;
  }>(),
  { threshold: 0.1 },
);

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
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--tg-radius-chip, 10px);
  white-space: nowrap;
}

.m-tg-delta-tag--positive {
  color: var(--tg-success, #1f9d57);
  background: color-mix(in srgb, var(--tg-success, #1f9d57) 12%, transparent);
}

.m-tg-delta-tag--negative {
  color: var(--tg-danger, #d64545);
  background: color-mix(in srgb, var(--tg-danger, #d64545) 10%, transparent);
}

.m-tg-delta-tag--neutral {
  color: var(--tg-muted, #6a6e76);
  background: color-mix(in srgb, var(--tg-muted, #6a6e76) 10%, transparent);
}
</style>
