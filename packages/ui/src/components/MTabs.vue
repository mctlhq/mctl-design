<script setup lang="ts">
import { computed, getCurrentInstance, nextTick } from 'vue';

interface Tab {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    tabs: Tab[];
    /** v-model: the active tab value. Defaults to the first tab. */
    modelValue?: string;
  }>(),
  { modelValue: '' },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

// Per-instance prefix so tab/panel ids stay unique when several MTabs render
// on one page (avoids ambiguous aria-labelledby across instances).
const uid = getCurrentInstance()?.uid ?? 0;
const tabId = (value: string) => `m-tab-${uid}-${value}`;
const panelId = `m-tabpanel-${uid}`;

const active = computed(() => props.modelValue || props.tabs[0]?.value || '');

function select(value: string) {
  emit('update:modelValue', value);
}

// Roving arrow-key navigation across the tab list. Move DOM focus to the newly
// selected tab so subsequent arrow presses keep working (the prior tab becomes
// tabindex="-1").
function onKeydown(event: KeyboardEvent, index: number) {
  const last = props.tabs.length - 1;
  let next = -1;
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
  else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = last;
  if (next !== -1) {
    event.preventDefault();
    const value = props.tabs[next].value;
    select(value);
    nextTick(() => document.getElementById(tabId(value))?.focus());
  }
}
</script>

<template>
  <div class="m-tabs">
    <div class="m-tabs__list" role="tablist">
      <button
        v-for="(tab, i) in tabs"
        :id="tabId(tab.value)"
        :key="tab.value"
        class="m-tabs__tab"
        :class="{ 'm-tabs__tab--active': tab.value === active }"
        type="button"
        role="tab"
        :aria-selected="tab.value === active"
        :aria-controls="panelId"
        :tabindex="tab.value === active ? 0 : -1"
        @click="select(tab.value)"
        @keydown="onKeydown($event, i)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      :id="panelId"
      class="m-tabs__panel"
      role="tabpanel"
      :aria-labelledby="tabId(active)"
      tabindex="0"
    >
      <slot :active="active" />
    </div>
  </div>
</template>

<style scoped>
.m-tabs__list {
  display: flex;
  align-items: stretch;
  gap: var(--mctl-space-1);
  border-bottom: 1px solid var(--surface-line);
}

.m-tabs__tab {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg-muted);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: var(--mctl-space-3) var(--mctl-space-4);
  cursor: pointer;
  transition:
    color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    border-color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-tabs__tab:hover {
  color: var(--surface-fg);
}

.m-tabs__tab:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.m-tabs__tab--active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.m-tabs__panel {
  padding: var(--mctl-space-5) 0;
  font-family: var(--font-display);
  color: var(--surface-fg);
}

.m-tabs__panel:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
