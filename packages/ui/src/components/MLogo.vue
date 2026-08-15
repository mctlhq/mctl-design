<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** CSS size for width and height. A number is treated as px. */
    size?: number | string;
    /** Soft accent glow via color-mix of currentColor. */
    glow?: boolean;
    /** Accessible name. Pass an empty string for a decorative mark. */
    label?: string;
  }>(),
  { size: 180, glow: false, label: 'MCTL' },
);

const sizeCss = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
);
</script>

<template>
  <span
    class="m-logo"
    :class="{ 'm-logo--glow': glow }"
    :style="{ width: sizeCss, height: sizeCss }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <!-- Hollow hex, vertex rays, bullseye. Paint via currentColor / --accent. -->
    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M256 60L435.263 158V354L256 452L76.7372 354V158L256 60Z"
        stroke="currentColor"
        stroke-width="24"
        stroke-linejoin="round"
      />
      <line
        x1="256"
        y1="60"
        x2="256"
        y2="158"
        stroke="currentColor"
        stroke-width="12"
        opacity="0.6"
      />
      <line
        x1="76.7372"
        y1="256"
        x2="180"
        y2="256"
        stroke="currentColor"
        stroke-width="12"
        opacity="0.6"
      />
      <line
        x1="435.263"
        y1="256"
        x2="332"
        y2="256"
        stroke="currentColor"
        stroke-width="12"
        opacity="0.6"
      />
      <circle cx="256" cy="256" r="90" stroke="currentColor" stroke-width="18" opacity="0.4" />
      <circle cx="256" cy="256" r="60" stroke="currentColor" stroke-width="20" />
      <circle cx="256" cy="256" r="28" fill="currentColor" />
    </svg>
  </span>
</template>

<style scoped>
.m-logo {
  display: inline-flex;
  color: var(--accent);
  line-height: 0;
}

.m-logo svg {
  display: block;
  width: 100%;
  height: 100%;
}

.m-logo--glow {
  filter: drop-shadow(0 0 28px color-mix(in srgb, currentColor 45%, transparent));
}
</style>
