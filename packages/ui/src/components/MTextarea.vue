<script setup lang="ts">
withDefaults(
  defineProps<{
    /** v-model value. */
    modelValue?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    invalid?: boolean;
    id?: string;
  }>(),
  { modelValue: '', placeholder: '', rows: 4, disabled: false, invalid: false, id: undefined },
);

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <textarea
    :id="id"
    class="m-textarea"
    :class="{ 'm-textarea--invalid': invalid }"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<style scoped>
.m-textarea {
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  line-height: var(--mctl-typography-line-height-body);
  color: var(--surface-fg);
  background: var(--surface-card);
  border: 1px solid var(--surface-line-strong);
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
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
}

.m-textarea--invalid {
  border-color: var(--status-bad);
}

.m-textarea--invalid:focus-visible {
  border-color: var(--status-bad);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--status-bad) 22%, transparent);
}

.m-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
