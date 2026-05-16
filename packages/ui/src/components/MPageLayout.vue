<script setup lang="ts">
withDefaults(
  defineProps<{
    maxWidth?: 'sm' | 'md' | 'lg' | 'full';
  }>(),
  { maxWidth: 'md' },
);

const widthMap = {
  sm: '640px',
  md: '960px',
  lg: '1280px',
  full: '100%',
} as const;
</script>

<template>
  <div class="m-page-layout" :style="{ '--m-page-max-width': widthMap[maxWidth] }">
    <slot />
  </div>
</template>

<style scoped>
.m-page-layout {
  width: 100%;
  max-width: var(--m-page-max-width);
  margin-inline: auto;
  padding-inline: var(--mctl-layout-page-padding);
  box-sizing: border-box;
}
</style>
