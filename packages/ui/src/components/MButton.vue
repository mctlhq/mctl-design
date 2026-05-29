<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost';
    size?: 'sm' | 'md';
    /** Render as a different element/component, e.g. 'a' for a link. */
    as?: string;
    disabled?: boolean;
  }>(),
  { variant: 'primary', size: 'md', as: 'button', disabled: false },
);
</script>

<template>
  <component
    :is="as"
    class="m-button"
    :class="[`m-button--${variant}`, `m-button--${size}`]"
    :disabled="as === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.m-button {
  display: inline-flex;
  align-items: center;
  gap: var(--mctl-space-2);
  font-family: var(--font-mono);
  font-weight: var(--mctl-typography-font-weight-medium);
  letter-spacing: 0.02em;
  border: 1px solid var(--surface-line-strong);
  border-radius: var(--mctl-radius-sm);
  cursor: pointer;
  text-decoration: none;
  transition: background var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    border-color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-button--sm {
  font-size: var(--mctl-typography-font-size-marker);
  padding: var(--mctl-space-2) var(--mctl-space-3);
}

.m-button--md {
  font-size: var(--mctl-typography-font-size-body);
  padding: var(--mctl-space-3) var(--mctl-space-5);
}

.m-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.m-button--primary {
  background: var(--accent);
  color: var(--mctl-color-ink);
  border-color: var(--accent);
}

.m-button--primary:hover {
  background: var(--accent-highlight);
  border-color: var(--accent-highlight);
}

.m-button--ghost {
  background: transparent;
  color: var(--surface-fg);
}

.m-button--ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.m-button[disabled],
.m-button[aria-disabled='true'] {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
