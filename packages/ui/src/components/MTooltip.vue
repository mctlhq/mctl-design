<script lang="ts">
export interface MTooltipProps {
  /** Tooltip text. */
  text: string;
  placement?: 'top' | 'bottom';
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, ref, useId, watch } from 'vue';

withDefaults(defineProps<MTooltipProps>(), { placement: 'top' });

// Per-instance id from useId, so server and client render agree. Lets the
// bubble be referenced by id without adding a separate tab stop.
const tipId = `m-tooltip-${useId()}`;

// WCAG 1.4.13: Escape hides the bubble without moving focus or the pointer,
// and it stays hidden until both hover and focus have left.
const hovered = ref(false);
const focused = ref(false);
const dismissed = ref(false);

const rootRef = ref<HTMLElement | null>(null);

// Escape from inside the trigger: the control handles it first, then the
// tooltip takes it in the bubble phase, so a dialog around it does not close
// on the same key press.
function onRootKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || dismissed.value) return;
  dismissed.value = true;
  event.stopPropagation();
}

// Escape from anywhere else while the bubble shows (it is hovered, focus is
// elsewhere): hide it, but leave the key to whatever it was meant for.
function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  if (rootRef.value?.contains(event.target as Node | null)) return;
  dismissed.value = true;
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
      document.addEventListener('keydown', onDocumentKeydown, true);
    } else {
      document.removeEventListener('keydown', onDocumentKeydown, true);
      dismissed.value = false;
    }
  },
);
onBeforeUnmount(() => {
  if (typeof document !== 'undefined')
    document.removeEventListener('keydown', onDocumentKeydown, true);
});
</script>

<template>
  <span
    ref="rootRef"
    class="m-tooltip"
    :class="[`m-tooltip--${placement}`, { 'm-tooltip--dismissed': dismissed }]"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
    @focusin="focused = true"
    @focusout="onFocusout"
    @keydown="onRootKeydown"
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
  z-index: var(--mctl-z-index-overlay, 800);
  /* Long text wraps instead of running off the viewport. */
  width: max-content;
  max-width: min(20rem, calc(100vw - 2 * var(--mctl-space-4)));
  overflow-wrap: break-word;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--surface-fg);
  background: var(--surface-elevated);
  border: var(--mctl-border-width-hairline) solid var(--surface-line-strong);
  border-radius: var(--mctl-radius-md);
  padding: var(--mctl-space-1) var(--mctl-space-3);
  box-shadow: var(--shadow-overlay);
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

/* The same bridge at the trigger's width, for a trigger wider than the
   bubble; only while hovered, so it never widens the hover target. */
.m-tooltip:hover:not(.m-tooltip--dismissed)::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: var(--mctl-space-2);
}

.m-tooltip--top::after {
  bottom: 100%;
}

.m-tooltip--bottom::after {
  top: 100%;
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
