<script setup lang="ts">
import { getCurrentInstance } from 'vue';

interface Item {
  /** Stable id, also used as the slot name for rich content. */
  id: string;
  title: string;
  /** Plain-text body; omit and pass a #<id> slot for rich content. */
  body?: string;
}

withDefaults(
  defineProps<{
    items: Item[];
    /** Allow several panels open at once. Single-open (exclusive) by default. */
    multiple?: boolean;
  }>(),
  { multiple: false },
);

// Per-instance <details name> so exclusivity is scoped to this accordion —
// otherwise two accordions on a page would form one shared exclusive group.
const groupName = `m-accordion-${getCurrentInstance()?.uid ?? 0}`;
</script>

<template>
  <div class="m-accordion">
    <details
      v-for="item in items"
      :key="item.id"
      class="m-accordion__item"
      :name="multiple ? undefined : groupName"
    >
      <summary class="m-accordion__summary">
        <span>{{ item.title }}</span>
        <span class="m-accordion__icon" aria-hidden="true">+</span>
      </summary>
      <div class="m-accordion__body">
        <slot :name="item.id">{{ item.body }}</slot>
      </div>
    </details>
  </div>
</template>

<style scoped>
.m-accordion {
  border-top: 1px solid var(--surface-line);
}

.m-accordion__item {
  border-bottom: 1px solid var(--surface-line);
}

.m-accordion__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mctl-space-3);
  padding: var(--mctl-space-4) 0;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg);
  cursor: pointer;
  list-style: none;
  transition: color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-accordion__summary::-webkit-details-marker {
  display: none;
}

.m-accordion__summary:hover {
  color: var(--accent);
}

.m-accordion__summary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.m-accordion__icon {
  color: var(--surface-fg-subtle);
  font-size: 1.1em;
  transition: transform var(--mctl-motion-duration-base) var(--mctl-motion-easing-standard);
}

.m-accordion__item[open] .m-accordion__icon {
  transform: rotate(45deg);
  color: var(--accent);
}

.m-accordion__body {
  padding: 0 0 var(--mctl-space-4);
  font-family: var(--font-display);
  font-size: var(--mctl-typography-font-size-body);
  line-height: var(--mctl-typography-line-height-lede);
  color: var(--surface-fg-muted);
}
</style>
