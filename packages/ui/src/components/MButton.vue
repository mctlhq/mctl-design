<script setup lang="ts">
import { computed, useAttrs, type Component } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost';
    size?: 'sm' | 'md';
    /** Render as a different element or component, e.g. 'a' or RouterLink. */
    as?: string | Component;
    /** Native button type. Defaults to "button" so it never submits a form by accident. */
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  { variant: 'primary', size: 'md', as: 'button', type: 'button', disabled: false },
);

const attrs = useAttrs();
const isNative = computed(() => props.as === 'button');

// A disabled non-button (a link, a RouterLink) cannot use the `disabled`
// attribute, and `pointer-events: none` alone leaves it focusable and
// Enter-activatable. Render it as a plain placeholder with no href/to, no
// event listeners, out of the tab order. Only a plain HTML tag is kept as is:
// a component -- passed as an object or by name, "RouterLink" -- may require
// the very prop being stripped (RouterLink throws without `to`), so it falls
// back to <a>.
const PLAIN_TAGS = new Set(['a', 'span', 'div']);
const tag = computed(() => {
  if (!props.disabled || isNative.value) return props.as;
  return typeof props.as === 'string' && PLAIN_TAGS.has(props.as) ? props.as : 'a';
});

const bindings = computed(() => {
  if (isNative.value) {
    return { ...attrs, type: props.type, disabled: props.disabled || undefined };
  }
  if (!props.disabled) return attrs;
  const rest = Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'href' && key !== 'to' && !/^on[A-Z]/.test(key)),
  );
  return { ...rest, tabindex: -1, 'aria-disabled': 'true' };
});
</script>

<template>
  <component
    :is="tag"
    v-bind="bindings"
    class="m-button"
    :class="[`m-button--${variant}`, `m-button--${size}`]"
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
  color: var(--accent-fg);
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
