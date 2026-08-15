<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Controls visibility — use with v-model. */
    modelValue?: boolean;
    /** Sheet title shown in the drag-indicator row. */
    title?: string;
    /** Apply safe-area-inset-bottom padding at the bottom. */
    safeArea?: boolean;
  }>(),
  { modelValue: false, title: '', safeArea: true },
);

defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <Teleport to="body">
    <Transition name="m-tg-sheet">
      <div v-if="modelValue" class="m-tg-sheet-root">
        <div
          class="m-tg-sheet-scrim"
          aria-hidden="true"
          @click="$emit('update:modelValue', false)"
        />
        <div class="m-tg-sheet" role="dialog" aria-modal="true" :aria-label="title || 'Sheet'">
          <div class="m-tg-sheet__handle-row">
            <span class="m-tg-sheet__handle" aria-hidden="true" />
            <span v-if="title" class="m-tg-sheet__title">{{ title }}</span>
            <button
              type="button"
              class="m-tg-sheet__close"
              aria-label="Close"
              @click="$emit('update:modelValue', false)"
            >
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
  z-index: 400;
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
  font-family: var(--font-display);
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
  transition: opacity 0.2s ease;
}

.m-tg-sheet-enter-active .m-tg-sheet,
.m-tg-sheet-leave-active .m-tg-sheet {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
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
