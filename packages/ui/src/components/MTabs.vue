<script lang="ts">
export interface MTabsItem {
  label: string;
  /** Unique within `tabs`: it is the v-model value. */
  value: string;
}

export interface MTabsProps {
  /** v-model: the active tab's `value`. Defaults to the first tab. */
  modelValue?: string;
  tabs: MTabsItem[];
}

export interface MTabsSlots {
  /** The active panel's content. */
  default?(props: {
    /** The active tab's `value`. */
    active: string;
  }): unknown;
}
</script>

<script setup lang="ts">
import { computed, nextTick, useId } from 'vue';

const props = defineProps<Omit<MTabsProps, 'modelValue'>>();
defineSlots<MTabsSlots>();

// v-model: the active tab value. Defaults to the first tab. Without a v-model
// binding defineModel keeps the value locally, so the component also works
// uncontrolled -- a derived-from-prop `active` would emit on click and never
// move, leaving the arrow-key focus on a tabindex="-1" tab.
const model = defineModel<string>({ default: '' });

// Per-instance prefix so tab/panel ids stay unique when several MTabs render
// on one page (avoids ambiguous aria-labelledby across instances). Ids use the
// tab index, not its value: a value is free text and may hold spaces.
// useId is stable between server and client render, unlike the instance uid.
const idBase = useId();
const tabId = (index: number) => `m-tab-${idBase}-${index}`;
const panelId = `m-tabpanel-${idBase}`;

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
// tabindex="-1"). Focus goes to `next` even before the model catches up, so a
// parent that applies v-model asynchronously (a router push) still roves.
// Only when `next` carries the model's current value is select() a no-op; focus
// then goes to the selected tab, which with a repeated value is not `next`.
// Compared against the model, not the focused tab: Home on the first tab or
// End on the last makes `next` the focused tab itself.
function onKeydown(event: KeyboardEvent, index: number) {
  const last = props.tabs.length - 1;
  let next = -1;
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
  else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = last;
  if (next !== -1) {
    event.preventDefault();
    const target = props.tabs[next].value === model.value ? activeIndex.value : next;
    select(props.tabs[next].value);
    nextTick(() => document.getElementById(tabId(target))?.focus());
  }
}
</script>

<template>
  <div class="m-tabs">
    <div v-if="tabs.length" class="m-tabs__list" role="tablist">
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
  border-bottom: var(--mctl-border-width-hairline) solid var(--surface-line);
}

.m-tabs__tab {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg-muted);
  background: transparent;
  border: none;
  border-bottom: var(--mctl-border-width-thick) solid transparent;
  margin-bottom: calc(-1 * var(--mctl-border-width-hairline));
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
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: calc(-1 * var(--focus-ring-offset));
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
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}
</style>
