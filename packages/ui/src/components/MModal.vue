<script lang="ts">
export interface MModalProps {
  /** v-model:open — controls visibility. */
  open?: boolean;
  title?: string;
  /** Accessible name when there is no visible title. Set it: the default is generic. */
  ariaLabel?: string;
  /** Hide the close affordance and disable backdrop/Esc dismissal. */
  dismissible?: boolean;
}
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { nextDialogId, useDialog } from '../composables/useDialog';

const props = withDefaults(defineProps<MModalProps>(), {
  open: false,
  title: '',
  ariaLabel: 'Dialog',
  dismissible: true,
});

const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const overlayRef = ref<HTMLElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const titleId = nextDialogId('m-modal-title');

function close() {
  if (props.dismissible) emit('update:open', false);
}

const { backdropHandlers } = useDialog({
  dialog: dialogRef,
  overlay: overlayRef,
  open: () => props.open,
  onDismiss: close,
  dismissible: () => props.dismissible,
});
</script>

<template>
  <Teleport to="body">
    <Transition name="m-modal">
      <div
        v-if="open"
        ref="overlayRef"
        class="m-modal"
        @pointerdown="backdropHandlers.onPointerdown"
        @pointerup="backdropHandlers.onPointerup"
        @click="backdropHandlers.onClick"
      >
        <div
          ref="dialogRef"
          class="m-modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-label="title ? undefined : ariaLabel"
          tabindex="-1"
        >
          <header v-if="title || dismissible" class="m-modal__header">
            <h2 v-if="title" :id="titleId" class="m-modal__title">{{ title }}</h2>
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
  z-index: var(--mctl-z-index-modal, 900);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mctl-space-5);
  background: var(--overlay-scrim);
}

.m-modal__dialog {
  width: 100%;
  max-width: 480px;
  background: var(--surface-elevated);
  border: var(--mctl-border-width-hairline) solid var(--surface-line-strong);
  border-radius: var(--mctl-radius-lg);
  box-shadow: var(--shadow-overlay);
  outline: none;
}

.m-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mctl-space-3);
  padding: var(--mctl-space-4) var(--mctl-space-5);
  border-bottom: var(--mctl-border-width-hairline) solid var(--surface-line);
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
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
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
  border-top: var(--mctl-border-width-hairline) solid var(--surface-line);
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
