<script setup lang="ts">
const props = withDefaults(
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

// Stroke icons rather than emoji: emoji render differently on every platform
// and screen readers may announce them; these are decorative and hidden.
const iconPaths = {
  empty: ['M5 5h14l2 8v6H3v-6z', 'M3 13h5l1.5 3h5L16 13h5'],
  loading: ['M7 3h10', 'M7 21h10', 'M8 3v3l4 6-4 6v3', 'M16 3v3l-4 6 4 6v3'],
  error: ['M12 3 2 21h20z', 'M12 10v5', 'M12 18v.01'],
};

// Loading and error states are announced when they appear: politely for
// loading, assertively for an error. An empty state is static content.
const roles = { empty: undefined, loading: 'status', error: 'alert' } as const;
</script>

<template>
  <div
    class="m-tg-empty"
    :class="`m-tg-empty--${variant}`"
    :role="roles[props.variant]"
    :aria-busy="variant === 'loading' || undefined"
  >
    <svg
      class="m-tg-empty__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path v-for="d in iconPaths[variant]" :key="d" :d="d" />
    </svg>
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
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
  color: var(--tg-muted, #6a6e76);
}

.m-tg-empty--loading .m-tg-empty__icon {
  animation: m-tg-pulse 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .m-tg-empty--loading .m-tg-empty__icon {
    animation: none;
  }
}

@keyframes m-tg-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.m-tg-empty__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-ink, #15171b);
}

.m-tg-empty__description {
  margin: 0;
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--tg-muted, #6a6e76);
  max-width: 260px;
  line-height: 1.5;
}

.m-tg-empty__action {
  margin-top: 8px;
}
</style>
