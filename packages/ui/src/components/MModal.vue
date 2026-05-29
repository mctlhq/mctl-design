<script lang="ts">
// Module-scoped (declared in a plain <script>, so it is evaluated once and
// shared across instances — unlike <script setup>, which re-runs per instance).
// Lets several stacked modals coordinate so only the topmost handles Escape.
const modalStack: symbol[] = [];
</script>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';

const props = withDefaults(
  defineProps<{
    /** v-model:open — controls visibility. */
    open?: boolean;
    title?: string;
    /** Hide the close affordance and disable backdrop/Esc dismissal. */
    dismissible?: boolean;
  }>(),
  { open: false, title: '', dismissible: true },
);

const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const instanceKey = Symbol('m-modal');

const dialogRef = ref<HTMLElement | null>(null);
// Remember the host's prior body overflow so closing restores it rather than
// clobbering a scroll policy set by the app or an outer modal.
let previousOverflow = '';
let overflowLocked = false;

function isTopmost(): boolean {
  return modalStack[modalStack.length - 1] === instanceKey;
}

function close() {
  if (props.dismissible) emit('update:open', false);
}

function focusable(): HTMLElement[] {
  if (!dialogRef.value) return [];
  return Array.from(
    dialogRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null || el === dialogRef.value);
}

function onKeydown(event: KeyboardEvent) {
  // Only the topmost open modal reacts to the shared document listener.
  if (!isTopmost()) return;
  if (event.key === 'Escape') {
    close();
    return;
  }
  // Trap Tab focus inside the dialog while it is open.
  if (event.key === 'Tab') {
    const items = focusable();
    if (items.length === 0) {
      event.preventDefault();
      dialogRef.value?.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const activeEl = document.activeElement;
    if (event.shiftKey && (activeEl === first || activeEl === dialogRef.value)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeEl === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

function activate() {
  if (typeof document === 'undefined' || overflowLocked) return;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  overflowLocked = true;
  modalStack.push(instanceKey);
  document.addEventListener('keydown', onKeydown);
  nextTick(() => dialogRef.value?.focus());
}

function deactivate() {
  if (typeof document === 'undefined' || !overflowLocked) return;
  document.body.style.overflow = previousOverflow;
  overflowLocked = false;
  const idx = modalStack.lastIndexOf(instanceKey);
  if (idx !== -1) modalStack.splice(idx, 1);
  document.removeEventListener('keydown', onKeydown);
}

// immediate so a modal mounted with open=true still locks scroll, traps Esc
// and moves focus.
watch(
  () => props.open,
  (isOpen) => (isOpen ? activate() : deactivate()),
  { immediate: true },
);

onBeforeUnmount(deactivate);
</script>

<template>
  <Teleport to="body">
    <Transition name="m-modal">
      <div v-if="open" class="m-modal" @click.self="close">
        <div
          ref="dialogRef"
          class="m-modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          tabindex="-1"
        >
          <header v-if="title || dismissible" class="m-modal__header">
            <h2 v-if="title" class="m-modal__title">{{ title }}</h2>
            <button
              v-if="dismissible"
              class="m-modal__close"
              type="button"
              aria-label="Close"
              @click="close"
            >
              ✕
            </button>
          </header>
          <div class="m-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="m-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.m-modal {
  position: fixed;
  inset: 0;
  z-index: var(--mctl-z-index-modal, 1100);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mctl-space-5);
  background: color-mix(in srgb, var(--mctl-color-ink) 70%, transparent);
}

.m-modal__dialog {
  width: 100%;
  max-width: 480px;
  background: var(--surface-elevated);
  border: 1px solid var(--surface-line-strong);
  border-radius: var(--mctl-radius-lg);
  box-shadow: var(--mctl-shadow-overlay);
  outline: none;
}

.m-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mctl-space-3);
  padding: var(--mctl-space-4) var(--mctl-space-5);
  border-bottom: 1px solid var(--surface-line);
}

.m-modal__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--mctl-typography-font-size-lede);
  font-weight: var(--mctl-typography-font-weight-semibold);
  color: var(--surface-fg);
}

.m-modal__close {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--mctl-space-1);
  line-height: 1;
  border-radius: var(--mctl-radius-sm);
  transition: color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-modal__close:hover {
  color: var(--surface-fg);
}

.m-modal__close:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.m-modal__body {
  padding: var(--mctl-space-5);
  font-family: var(--font-display);
  font-size: var(--mctl-typography-font-size-body);
  line-height: var(--mctl-typography-line-height-lede);
  color: var(--surface-fg-muted);
}

.m-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--mctl-space-3);
  padding: var(--mctl-space-4) var(--mctl-space-5);
  border-top: 1px solid var(--surface-line);
}

.m-modal-enter-active,
.m-modal-leave-active {
  transition: opacity var(--mctl-motion-duration-base) var(--mctl-motion-easing-standard);
}

.m-modal-enter-from,
.m-modal-leave-to {
  opacity: 0;
}
</style>
