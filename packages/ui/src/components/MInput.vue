<script setup lang="ts">
import { useField } from '../composables/useField';

const props = withDefaults(
  defineProps<{
    /** v-model value. */
    modelValue?: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    /** Mark the field as invalid (accent flips to the bad status colour). */
    invalid?: boolean;
    id?: string;
  }>(),
  { modelValue: '', type: 'text', placeholder: '', disabled: false, invalid: false, id: undefined },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

// Inside MField: its id and message wiring, unless set explicitly.
const field = useField(() => props.id);
</script>

<template>
  <input
    :id="id ?? field?.id.value"
    class="m-input"
    :class="{ 'm-input--invalid': invalid || field?.invalid.value }"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-invalid="invalid || field?.invalid.value || undefined"
    :aria-describedby="field?.describedBy.value"
    :aria-required="field?.required.value || undefined"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.m-input {
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg);
  background: var(--control-bg);
  border: var(--mctl-border-width-hairline) solid var(--control-border);
  border-radius: var(--mctl-radius-md);
  padding: var(--mctl-space-3) var(--mctl-space-4);
  transition:
    border-color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    box-shadow var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-input::placeholder {
  color: var(--surface-fg-subtle);
}

.m-input:hover:not(:disabled) {
  border-color: var(--surface-fg-subtle);
}

.m-input:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--control-focus-shadow);
}

.m-input--invalid {
  border-color: var(--status-bad);
}

.m-input--invalid:focus-visible {
  border-color: var(--status-bad);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--status-bad) 22%, transparent);
}

.m-input:disabled {
  background: var(--control-disabled-bg);
  opacity: var(--mctl-opacity-disabled);
  cursor: not-allowed;
}
</style>
