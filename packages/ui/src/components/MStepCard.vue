<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Large step numeral, e.g. "01". */
    step: string;
    title: string;
    /** Optional command line shown under the prose. */
    code?: string;
  }>(),
  { code: '' },
);
</script>

<template>
  <article class="m-step-card">
    <span class="m-step-card__numeral" aria-hidden="true">{{ step }}</span>
    <h3 class="m-step-card__title">{{ title }}</h3>
    <p class="m-step-card__body"><slot /></p>
    <code v-if="code" class="m-step-card__code">{{ code }}</code>
  </article>
</template>

<style scoped>
.m-step-card {
  display: flex;
  flex-direction: column;
  gap: var(--mctl-space-3);
  padding: var(--mctl-space-5) 0;
  border-top: 1px solid var(--surface-line);
}

.m-step-card__numeral {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-stat);
  font-weight: var(--mctl-typography-font-weight-light);
  line-height: 1;
  color: var(--accent);
}

.m-step-card__title {
  margin: 0;
  font-size: var(--mctl-typography-font-size-lede);
  font-weight: var(--mctl-typography-font-weight-semibold);
  color: var(--surface-fg);
}

.m-step-card__body {
  margin: 0;
  font-size: var(--mctl-typography-font-size-body);
  line-height: var(--mctl-typography-line-height-body);
  color: var(--surface-fg-muted);
}

.m-step-card__code {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--syntax-string);
  padding: var(--mctl-space-2) var(--mctl-space-3);
  background: var(--surface-card);
  border: 1px solid var(--surface-line);
  border-radius: var(--mctl-radius-sm);
  align-self: flex-start;
}
</style>
