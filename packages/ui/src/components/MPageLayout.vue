<script lang="ts">
export interface MPageLayoutProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}
</script>

<script setup lang="ts">
withDefaults(defineProps<MPageLayoutProps>(), { maxWidth: 'md' });

const widthMap = {
  sm: 'var(--mctl-layout-container-sm)',
  md: 'var(--mctl-layout-container-md)',
  lg: 'var(--mctl-layout-container-lg)',
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
