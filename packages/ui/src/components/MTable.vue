<script setup lang="ts">
// Semantic wrapper that applies MCTL table styles via a scoped class on a
// container div. The consumer writes plain <table>, <thead>, <tbody> etc.
// inside the default slot — they inherit styles through the deep selector.
</script>

<template>
  <div class="m-table-wrap">
    <table class="m-table">
      <slot />
    </table>
  </div>
</template>

<style scoped>
.m-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.m-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg);
}

.m-table :deep(th),
.m-table :deep(td) {
  text-align: left;
  padding: var(--mctl-space-3) var(--mctl-space-4);
  border-bottom: 1px solid var(--surface-line);
  vertical-align: top;
}

.m-table :deep(th) {
  font-weight: var(--mctl-typography-font-weight-medium);
  font-size: var(--mctl-typography-font-size-marker);
  letter-spacing: var(--mctl-typography-letter-spacing-marker);
  text-transform: uppercase;
  color: var(--surface-fg-muted);
  border-bottom-color: var(--surface-line-strong);
}

.m-table :deep(tbody tr:last-child td) {
  border-bottom: none;
}

.m-table :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: color-mix(in srgb, var(--surface-line) 40%, transparent);
  padding: 1px 4px;
  border-radius: var(--mctl-radius-sm);
  color: var(--syntax-key);
}
</style>
