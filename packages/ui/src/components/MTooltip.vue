<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';

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

// WCAG 1.4.13: Escape hides the bubble without moving focus or the pointer,
// and it stays hidden until both hover and focus have left.
const hovered = ref(false);
const focused = ref(false);
const dismissed = ref(false);

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || dismissed.value) return;
  dismissed.value = true;
  // Capture phase on document: an open tooltip takes this Escape, so a
  // dialog around it does not close at the same time.
  event.stopPropagation();
}

function onFocusout(event: FocusEvent) {
  const root = event.currentTarget as HTMLElement;
  focused.value = root.contains(event.relatedTarget as Node | null);
}

watch(
  () => hovered.value || focused.value,
  (shown) => {
    if (typeof document === 'undefined') return;
    if (shown) {
      document.addEventListener('keydown', onKeydown, true);
    } else {
      document.removeEventListener('keydown', onKeydown, true);
      dismissed.value = false;
    }
  },
);
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('keydown', onKeydown, true);
});
</script>

<template>
  <span
    class="m-tooltip"
    :class="[`m-tooltip--${placement}`, { 'm-tooltip--dismissed': dismissed }]"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
    @focusin="focused = true"
    @focusout="onFocusout"
  >
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
  /* Long text wraps instead of running off the viewport. */
  width: max-content;
  max-width: min(20rem, calc(100vw - 2 * var(--mctl-space-4)));
  overflow-wrap: break-word;
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

/* Bridges the gap to the trigger, so the pointer can travel onto the bubble
   without leaving the hover area. */
.m-tooltip__bubble::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: var(--mctl-space-2);
}

.m-tooltip--top .m-tooltip__bubble::before {
  top: 100%;
}

.m-tooltip--bottom .m-tooltip__bubble::before {
  bottom: 100%;
}

/* Reveal on hover or when the slotted control inside gains focus — no extra
   tab stop, so the real trigger keeps its own focus + describedby. The bubble
   takes the pointer while shown, so it can be hovered (WCAG 1.4.13). */
.m-tooltip:hover:not(.m-tooltip--dismissed) .m-tooltip__bubble,
.m-tooltip:focus-within:not(.m-tooltip--dismissed) .m-tooltip__bubble {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
</style>
