<script lang="ts">
export interface MTgSheetProps {
  /** Controls visibility — use with v-model. */
  modelValue?: boolean;
  /** Sheet title shown in the drag-indicator row. */
  title?: string;
  /** Accessible name when there is no visible title. */
  ariaLabel?: string;
  /** Apply safe-area-inset-bottom padding at the bottom. */
  safeArea?: boolean;
}

export interface MTgSheetSlots {
  /** The sheet's content. */
  default?(): unknown;
}
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { nextDialogId, useDialog } from '../composables/useDialog';

const props = withDefaults(defineProps<MTgSheetProps>(), {
  modelValue: false,
  title: '',
  ariaLabel: 'Sheet',
  safeArea: true,
});
defineSlots<MTgSheetSlots>();

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const rootRef = ref<HTMLElement | null>(null);
const sheetRef = ref<HTMLElement | null>(null);
const titleId = nextDialogId('m-tg-sheet-title');

function close() {
  emit('update:modelValue', false);
}

useDialog({ dialog: sheetRef, overlay: rootRef, open: () => props.modelValue, onDismiss: close });
</script>

<template>
  <Teleport to="body">
    <Transition name="m-tg-sheet">
      <div v-if="modelValue" ref="rootRef" class="m-tg-sheet-root">
        <div class="m-tg-sheet-scrim" aria-hidden="true" @click="close" />
        <div
          ref="sheetRef"
          class="m-tg-sheet"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-label="title ? undefined : ariaLabel"
          tabindex="-1"
        >
          <div class="m-tg-sheet__handle-row">
            <span class="m-tg-sheet__handle" aria-hidden="true" />
            <span v-if="title" :id="titleId" class="m-tg-sheet__title">{{ title }}</span>
            <button type="button" class="m-tg-sheet__close" aria-label="Close" @click="close">
              ✕
            </button>
          </div>
          <div class="m-tg-sheet__body" :class="{ 'm-tg-sheet__body--safe': safeArea }">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.m-tg-sheet-root {
  position: fixed;
  inset: 0;
  z-index: var(--mctl-z-index-modal, 900);
  display: flex;
  align-items: flex-end;
}

.m-tg-sheet-scrim {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--tg-ink, #15171b) 40%, transparent);
}

.m-tg-sheet {
  position: relative;
  outline: none;
  width: 100%;
  background: var(--tg-surface, #ffffff);
  border-radius: var(--tg-radius-sheet, 22px) var(--tg-radius-sheet, 22px) 0 0;
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.m-tg-sheet__handle-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px 8px;
  position: relative;
  flex-shrink: 0;
}

.m-tg-sheet__handle {
  display: block;
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--tg-line, #e7e6e1);
}

.m-tg-sheet__title {
  font-family: var(--tg-font, 'Onest', system-ui, -apple-system, sans-serif);
  font-size: 17px;
  font-weight: 600;
  color: var(--tg-ink, #15171b);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.m-tg-sheet__close {
  position: absolute;
  right: 16px;
  background: var(--tg-surface-sub, #f3f2ec);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  color: var(--tg-muted, #6a6e76);
}

.m-tg-sheet__body {
  overflow-y: auto;
  padding: 8px 20px 20px;
  -webkit-overflow-scrolling: touch;
}

.m-tg-sheet__body--safe {
  padding-bottom: max(20px, env(safe-area-inset-bottom, 0px));
}

/* Slide-up / fade animation. */
.m-tg-sheet-enter-active,
.m-tg-sheet-leave-active {
  transition: opacity var(--mctl-motion-duration-base, 200ms)
    var(--mctl-motion-easing-standard, ease);
}

.m-tg-sheet-enter-active .m-tg-sheet,
.m-tg-sheet-leave-active .m-tg-sheet {
  transition: transform var(--mctl-motion-duration-base, 200ms) cubic-bezier(0.32, 0.72, 0, 1);
}

.m-tg-sheet-enter-from,
.m-tg-sheet-leave-to {
  opacity: 0;
}

.m-tg-sheet-enter-from .m-tg-sheet,
.m-tg-sheet-leave-to .m-tg-sheet {
  transform: translateY(100%);
}
</style>
