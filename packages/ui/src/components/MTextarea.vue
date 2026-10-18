<script lang="ts">
export interface MTextareaProps {
  /** v-model value. Without a v-model the field keeps its own value. */
  modelValue?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
}
</script>

<script setup lang="ts">
import { useField } from '../composables/useField';

const props = withDefaults(defineProps<Omit<MTextareaProps, 'modelValue'>>(), {
  placeholder: '',
  rows: 4,
  disabled: false,
  invalid: false,
  id: undefined,
});

const model = defineModel<string>({ default: '' });

// Inside MField: its id and message wiring, unless set explicitly.
const field = useField(() => props.id);
</script>

<template>
  <textarea
    :id="id ?? field?.id.value"
    class="m-textarea"
    :class="{ 'm-textarea--invalid': invalid || field?.invalid.value }"
    :value="model"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :aria-invalid="invalid || field?.invalid.value || undefined"
    :aria-describedby="field?.describedBy.value"
    :aria-required="field?.required.value || undefined"
    @input="model = ($event.target as HTMLTextAreaElement).value"
  />
</template>

<style scoped>
.m-textarea {
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  line-height: var(--mctl-typography-line-height-body);
  color: var(--surface-fg);
  background: var(--control-bg);
  border: var(--mctl-border-width-hairline) solid var(--control-border);
  border-radius: var(--mctl-radius-md);
  padding: var(--mctl-space-3) var(--mctl-space-4);
  resize: vertical;
  transition:
    border-color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    box-shadow var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-textarea::placeholder {
  color: var(--surface-fg-subtle);
}

.m-textarea:hover:not(:disabled) {
  border-color: var(--surface-fg-subtle);
}

.m-textarea:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--control-focus-shadow);
}

.m-textarea--invalid {
  border-color: var(--status-bad);
}

.m-textarea--invalid:focus-visible {
  border-color: var(--status-bad);
  box-shadow: var(--control-focus-shadow-invalid);
}

.m-textarea:disabled {
  background: var(--control-disabled-bg);
  opacity: var(--mctl-opacity-disabled);
  cursor: not-allowed;
}
</style>
