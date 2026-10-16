<script setup lang="ts">
import { computed, getCurrentInstance, nextTick } from 'vue';

interface Tab {
  label: string;
  value: string;
}

const props = defineProps<{
  tabs: Tab[];
}>();

// v-model: the active tab value. Defaults to the first tab. Without a v-model
// binding defineModel keeps the value locally, so the component also works
// uncontrolled -- a derived-from-prop `active` would emit on click and never
// move, leaving the arrow-key focus on a tabindex="-1" tab.
const model = defineModel<string>({ default: '' });

// Per-instance prefix so tab/panel ids stay unique when several MTabs render
// on one page (avoids ambiguous aria-labelledby across instances). Ids use the
// tab index, not its value: a value is free text and may hold spaces.
const uid = getCurrentInstance()?.uid ?? 0;
const tabId = (index: number) => `m-tab-${uid}-${index}`;
const panelId = `m-tabpanel-${uid}`;

// Resolved through the index, so a value that matches no tab (a stale
// persisted key, a tab removed after navigation) falls back to the first tab
// instead of leaving every tab at tabindex="-1" and the list unreachable.
const activeIndex = computed(() => {
  const i = props.tabs.findIndex((tab) => tab.value === model.value);
  return i === -1 ? 0 : i;
});
const active = computed(() => props.tabs[activeIndex.value]?.value ?? '');

function select(value: string) {
  model.value = value;
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
    select(props.tabs[next].value);
    nextTick(() => document.getElementById(tabId(next))?.focus());
  }
}
</script>

<template>
  <div class="m-tabs">
    <div class="m-tabs__list" role="tablist">
      <button
        v-for="(tab, i) in tabs"
        :id="tabId(i)"
        :key="i"
        class="m-tabs__tab"
        :class="{ 'm-tabs__tab--active': i === activeIndex }"
        type="button"
        role="tab"
        :aria-selected="i === activeIndex"
        :aria-controls="panelId"
        :tabindex="i === activeIndex ? 0 : -1"
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
      :aria-labelledby="tabs.length ? tabId(activeIndex) : undefined"
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
