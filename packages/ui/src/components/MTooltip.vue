<script setup lang="ts">
import { getCurrentInstance } from 'vue';

withDefaults(
  defineProps<{
    /** Tooltip text. */
    text: string;
    placement?: 'top' | 'bottom';
  }>(),
  { placement: 'top' },
);

// Per-instance id via the component uid (works on Vue 3.4+, unlike useId which
// is 3.5-only and would break the peer range). Lets the bubble be referenced
// by id without adding a separate tab stop.
const tipId = `m-tooltip-${getCurrentInstance()?.uid ?? 0}`;
</script>

<template>
  <span class="m-tooltip" :class="`m-tooltip--${placement}`">
    <span class="m-tooltip__trigger">
      <!-- Expose tipId so the slotted control itself can carry
           aria-describedby (the wrapper isn't the focus target). -->
      <slot :tip-id="tipId" />
    </span>
    <span :id="tipId" class="m-tooltip__bubble" role="tooltip">{{ text }}</span>
  </span>
</template>

<style scoped>
.m-tooltip {
  position: relative;
  display: inline-flex;
}

.m-tooltip__trigger {
  display: inline-flex;
}

.m-tooltip__bubble {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  z-index: var(--mctl-z-index-overlay, 1000);
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--surface-fg);
  background: var(--surface-elevated);
  border: 1px solid var(--surface-line-strong);
  border-radius: var(--mctl-radius-md);
  padding: var(--mctl-space-1) var(--mctl-space-3);
  box-shadow: var(--mctl-shadow-overlay);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    transform var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-tooltip--top .m-tooltip__bubble {
  bottom: 100%;
  margin-bottom: var(--mctl-space-2);
}

.m-tooltip--bottom .m-tooltip__bubble {
  top: 100%;
  margin-top: var(--mctl-space-2);
}

/* Reveal on hover or when the slotted control inside gains focus — no extra
   tab stop, so the real trigger keeps its own focus + describedby. */
.m-tooltip:hover .m-tooltip__bubble,
.m-tooltip:focus-within .m-tooltip__bubble {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
