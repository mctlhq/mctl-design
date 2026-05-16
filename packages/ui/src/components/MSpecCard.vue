<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Spec counter, e.g. "01". */
    index: string;
    /** Total count, e.g. "06". */
    total?: string;
    name: string;
    /** Code-tagged subtitle. */
    tag?: string;
  }>(),
  { total: '', tag: '' },
);
</script>

<template>
  <article class="m-spec-card">
    <header class="m-spec-card__head">
      <span class="m-spec-card__counter">
        {{ index }}<template v-if="total"> / {{ total }}</template>
      </span>
      <span v-if="$slots.glyph" class="m-spec-card__glyph"><slot name="glyph" /></span>
    </header>
    <h3 class="m-spec-card__name">{{ name }}</h3>
    <code v-if="tag" class="m-spec-card__tag">{{ tag }}</code>
    <p class="m-spec-card__body"><slot /></p>
    <footer v-if="$slots.chips" class="m-spec-card__chips">
      <slot name="chips" />
    </footer>
  </article>
</template>

<style scoped>
.m-spec-card {
  display: flex;
  flex-direction: column;
  gap: var(--mctl-space-3);
  padding: var(--mctl-space-5);
  background: var(--surface-card);
  border: 1px solid var(--surface-line);
}

.m-spec-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.m-spec-card__counter {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  letter-spacing: var(--mctl-typography-letter-spacing-marker);
  color: var(--surface-fg-subtle);
}

.m-spec-card__glyph {
  color: var(--accent);
}

.m-spec-card__name {
  margin: 0;
  font-size: var(--mctl-typography-font-size-lede);
  font-weight: var(--mctl-typography-font-weight-semibold);
  color: var(--surface-fg);
}

.m-spec-card__tag {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--syntax-key);
}

.m-spec-card__body {
  margin: 0;
  font-size: var(--mctl-typography-font-size-body);
  line-height: var(--mctl-typography-line-height-body);
  color: var(--surface-fg-muted);
}

.m-spec-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--mctl-space-2);
  margin-top: var(--mctl-space-2);
}
</style>
