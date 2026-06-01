<script setup lang="ts">
export interface MTgTab {
  key: string;
  label: string;
  icon?: string;
}

withDefaults(
  defineProps<{
    tabs: MTgTab[];
    /** Currently active tab key — use with v-model. */
    modelValue?: string;
    /** Apply safe-area-inset-bottom padding below the bar. */
    safeArea?: boolean;
  }>(),
  { modelValue: '', safeArea: true },
);

defineEmits<{ 'update:modelValue': [key: string] }>();
</script>

<template>
  <nav class="m-tg-tabbar" :class="{ 'm-tg-tabbar--safe': safeArea }" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      role="tab"
      class="m-tg-tabbar__tab"
      :class="{ 'm-tg-tabbar__tab--active': tab.key === modelValue }"
      :aria-selected="tab.key === modelValue"
      @click="$emit('update:modelValue', tab.key)"
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
  border-top: 1px solid var(--tg-line, #e7e6e1);
  z-index: 100;
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
  transition: color 0.15s ease;
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
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
</style>
