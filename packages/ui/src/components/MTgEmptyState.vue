<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Visual variant. */
    variant?: 'empty' | 'loading' | 'error';
    /** Primary message. */
    title?: string;
    /** Secondary message. */
    description?: string;
  }>(),
  { variant: 'empty', title: 'Nothing here yet', description: '' },
);

const iconMap = {
  empty: '📭',
  loading: '⏳',
  error: '⚠️',
};
</script>

<template>
  <div class="m-tg-empty" :class="`m-tg-empty--${variant}`">
    <span class="m-tg-empty__icon" aria-hidden="true">{{ iconMap[variant] }}</span>
    <p class="m-tg-empty__title">{{ title }}</p>
    <p v-if="description" class="m-tg-empty__description">{{ description }}</p>
    <div v-if="$slots.default" class="m-tg-empty__action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.m-tg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 24px;
  text-align: center;
}

.m-tg-empty__icon {
  font-size: 40px;
  line-height: 1;
  margin-bottom: 4px;
}

.m-tg-empty--loading .m-tg-empty__icon {
  animation: m-tg-pulse 1.4s ease-in-out infinite;
}

@keyframes m-tg-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.m-tg-empty__title {
  margin: 0;
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-ink, #15171b);
}

.m-tg-empty__description {
  margin: 0;
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 14px;
  color: var(--tg-muted, #6a6e76);
  max-width: 260px;
  line-height: 1.5;
}

.m-tg-empty__action {
  margin-top: 8px;
}
</style>
