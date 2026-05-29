<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    /** Associates the label/help with the control via id. */
    for?: string;
    /** Help text shown below the control. */
    hint?: string;
    /** Error message — replaces the hint and is announced to AT. */
    error?: string;
    required?: boolean;
  }>(),
  { label: '', for: '', hint: '', error: '', required: false },
);

// `for` is a reserved word, so it can't be referenced bare in the template;
// alias it through a computed for the label's `for` attribute.
const labelFor = computed(() => props.for || undefined);
</script>

<template>
  <div class="m-field">
    <label v-if="label" class="m-field__label" :for="labelFor">
      {{ label }}
      <span v-if="required" class="m-field__required" aria-hidden="true">*</span>
    </label>
    <div class="m-field__control">
      <slot />
    </div>
    <p v-if="error" class="m-field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="m-field__hint">{{ hint }}</p>
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
