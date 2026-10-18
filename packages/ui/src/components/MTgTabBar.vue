<script lang="ts">
// Exported here (not in <script setup>) so @vitejs/plugin-vue can bundle it
// as a named ES module export without conflicting with the SFC compiler.
export interface MTgTab {
  key: string;
  label: string;
  icon?: string;
}

export interface MTgTabBarProps {
  /** v-model: the active tab's `key`. */
  modelValue?: string;
  tabs: MTgTab[];
  /** Apply safe-area-inset-bottom padding below the bar. */
  safeArea?: boolean;
  /**
   * Accessible name for the navigation landmark. Screen readers append
   * "navigation", so name which one it is rather than repeating the role.
   */
  ariaLabel?: string;
}
</script>

<script setup lang="ts">
withDefaults(defineProps<Omit<MTgTabBarProps, 'modelValue'>>(), {
  safeArea: true,
  ariaLabel: 'Sections',
});

// v-model: the active tab key. Kept locally when no v-model is bound, so the
// bar also switches when used uncontrolled.
const model = defineModel<string>({ default: '' });

// A bottom tab bar switches app sections, not in-page panels: it renders a
// navigation landmark with aria-current, not an ARIA tablist (which would
// promise tabpanels and arrow-key roving that this bar does not have).
</script>

<template>
  <nav class="m-tg-tabbar" :class="{ 'm-tg-tabbar--safe': safeArea }" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="m-tg-tabbar__tab"
      :class="{ 'm-tg-tabbar__tab--active': tab.key === model }"
      :aria-current="tab.key === model ? 'page' : undefined"
      @click="model = tab.key"
    >
      <span v-if="tab.icon" class="m-tg-tabbar__icon" aria-hidden="true">{{ tab.icon }}</span>
      <span class="m-tg-tabbar__label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.m-tg-tabbar {
  display: flex;
  align-items: stretch;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--tg-surface, #ffffff);
  border-top: var(--mctl-border-width-hairline, 1px) solid var(--tg-line, #e7e6e1);
  z-index: var(--mctl-z-index-sticky, 100);
}

.m-tg-tabbar--safe {
  padding-bottom: max(8px, env(safe-area-inset-bottom, 0px));
}

.m-tg-tabbar__tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 10px 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--tg-muted, #6a6e76);
  transition: color var(--mctl-motion-duration-fast, 120ms) var(--mctl-motion-easing-standard, ease);
  -webkit-tap-highlight-color: transparent;
}

.m-tg-tabbar__tab:active {
  opacity: 0.65;
}

.m-tg-tabbar__tab--active {
  color: var(--tg-accent, #2d7df6);
}

.m-tg-tabbar__icon {
  font-size: 20px;
  line-height: 1;
}

.m-tg-tabbar__label {
  font-family: var(--tg-font, 'Onest', system-ui, -apple-system, sans-serif);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
</style>
