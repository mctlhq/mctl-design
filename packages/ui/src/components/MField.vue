<script setup lang="ts">
import { computed, provide, shallowRef, useId } from 'vue';
import { fieldKey } from '../composables/useField';

const props = withDefaults(
  defineProps<{
    label?: string;
    /**
     * Id of the control the label names. Optional for MInput, MTextarea and
     * MSelect, which wire themselves; a custom control takes `id` from the
     * slot props instead.
     */
    for?: string;
    /** Help text shown below the control. */
    hint?: string;
    /** Error message — replaces the hint and is announced to AT. */
    error?: string;
    required?: boolean;
  }>(),
  { label: '', for: '', hint: '', error: '', required: false },
);

// Without `for`, the field names its control itself: MInput, MTextarea and
// MSelect in the slot pick up this id, aria-describedby, aria-invalid and
// aria-required from the field, so the consumer does not have to wire them.
// A control with its own `id` lends it to the label instead.
// useId is stable between server and client render, unlike the instance uid.
const idBase = useId();
const explicitId = shallowRef<(() => string | undefined) | null>(null);
const controlId = computed(() => props.for || explicitId.value?.() || `m-field-control-${idBase}`);
// Only emitted when a message is actually shown.
const messageId = computed(() => (props.error || props.hint ? `m-field-msg-${idBase}` : undefined));

provide(fieldKey, {
  id: controlId,
  describedBy: messageId,
  invalid: computed(() => Boolean(props.error)),
  required: computed(() => props.required),
  register(getId) {
    explicitId.value = getId;
    return () => {
      if (explicitId.value === getId) explicitId.value = null;
    };
  },
});
</script>

<template>
  <div class="m-field">
    <label v-if="label" class="m-field__label" :for="controlId">
      {{ label }}
      <span v-if="required" class="m-field__required" aria-hidden="true">*</span>
    </label>
    <div class="m-field__control">
      <!-- Slot props stay for controls other than MInput, MTextarea, MSelect. -->
      <slot :id="controlId" :described-by="messageId" :required="required || undefined" />
    </div>
    <p v-if="error" :id="messageId" class="m-field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="messageId" class="m-field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.m-field {
  display: flex;
  flex-direction: column;
  gap: var(--mctl-space-2);
  font-family: var(--font-mono);
}

.m-field__label {
  font-size: var(--mctl-typography-font-size-marker);
  letter-spacing: var(--mctl-typography-letter-spacing-marker);
  text-transform: uppercase;
  color: var(--surface-fg-muted);
}

.m-field__required {
  color: var(--accent);
}

.m-field__hint {
  margin: 0;
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--surface-fg-subtle);
}

.m-field__error {
  margin: 0;
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--status-bad);
}
</style>
