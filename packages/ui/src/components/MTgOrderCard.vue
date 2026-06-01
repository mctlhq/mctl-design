<script setup lang="ts">
import MTgStatusBadge from './MTgStatusBadge.vue';
import MTgDeltaTag from './MTgDeltaTag.vue';

withDefaults(
  defineProps<{
    /** BUY or SELL. */
    direction: 'BUY' | 'SELL';
    /** e.g. "EUR / RUB" */
    pair: string;
    /** Human-readable rate, e.g. "93.50 RUB" */
    rate: string;
    /** Rate deviation from market, e.g. 2.1 for +2.1%. */
    delta?: number;
    /** Payment methods, e.g. ["SWIFT", "SEPA"] */
    methods?: string[];
    /** Volume, e.g. "500–5000 EUR" */
    volume?: string;
    /** Order status. */
    status?: 'active' | 'reserved' | 'accepted' | 'pending' | 'completed' | 'cancelled' | 'rejected' | 'expired';
    /** Display name of the order creator. */
    author?: string;
  }>(),
  { delta: 0, methods: () => [], volume: '', status: 'active', author: '' },
);

defineEmits<{ click: [] }>();
</script>

<template>
  <div class="m-tg-order-card" role="button" tabindex="0" @click="$emit('click')" @keydown.enter.prevent="$emit('click')" @keydown.space.prevent="$emit('click')">
    <div class="m-tg-order-card__header">
      <span class="m-tg-order-card__direction" :class="`m-tg-order-card__direction--${direction.toLowerCase()}`">
        {{ direction }}
      </span>
      <span class="m-tg-order-card__pair">{{ pair }}</span>
      <MTgStatusBadge v-if="status !== 'active'" :status="status" />
    </div>

    <div class="m-tg-order-card__rate-row">
      <span class="m-tg-order-card__rate">{{ rate }}</span>
      <MTgDeltaTag v-if="delta !== 0" :delta="delta" />
    </div>

    <div v-if="volume || methods.length" class="m-tg-order-card__meta">
      <span v-if="volume" class="m-tg-order-card__meta-item">{{ volume }}</span>
      <span
        v-for="m in methods"
        :key="m"
        class="m-tg-order-card__method"
      >{{ m }}</span>
    </div>

    <div v-if="author" class="m-tg-order-card__footer">
      <span class="m-tg-order-card__author">{{ author }}</span>
      <span class="m-tg-order-card__arrow" aria-hidden="true">›</span>
    </div>
  </div>
</template>

<style scoped>
.m-tg-order-card {
  background: var(--tg-surface, #ffffff);
  border: 1px solid var(--tg-line, #e7e6e1);
  border-radius: var(--tg-radius-card, 18px);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: opacity 0.12s ease;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.m-tg-order-card:active {
  opacity: 0.75;
}

.m-tg-order-card:focus-visible {
  opacity: 0.75;
  outline-color: var(--tg-accent, #2d7df6);
}

.m-tg-order-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m-tg-order-card__direction {
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 8px;
  letter-spacing: 0.04em;
}

.m-tg-order-card__direction--buy {
  color: var(--tg-success, #1f9d57);
  background: color-mix(in srgb, var(--tg-success, #1f9d57) 12%, transparent);
}

.m-tg-order-card__direction--sell {
  color: var(--tg-danger, #d64545);
  background: color-mix(in srgb, var(--tg-danger, #d64545) 10%, transparent);
}

.m-tg-order-card__pair {
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--tg-ink, #15171b);
}

.m-tg-order-card__rate-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.m-tg-order-card__rate {
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--tg-ink, #15171b);
  line-height: 1;
}

.m-tg-order-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.m-tg-order-card__meta-item {
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 13px;
  color: var(--tg-muted, #6a6e76);
}

.m-tg-order-card__method {
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 12px;
  color: var(--tg-muted, #6a6e76);
  background: var(--tg-surface-sub, #f3f2ec);
  border-radius: 6px;
  padding: 2px 8px;
}

.m-tg-order-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  border-top: 1px solid var(--tg-line, #e7e6e1);
}

.m-tg-order-card__author {
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 13px;
  color: var(--tg-muted, #6a6e76);
}

.m-tg-order-card__arrow {
  font-size: 18px;
  color: var(--tg-faint, #9a9da3);
}
</style>
