<script setup lang="ts">
interface Option {
  label: string;
  value: string;
}

withDefaults(
  defineProps<{
    /** v-model value. */
    modelValue?: string;
    /** Option list — value strings or {label, value} objects. */
    options: Array<string | Option>;
    disabled?: boolean;
    invalid?: boolean;
    id?: string;
  }>(),
  { modelValue: '', disabled: false, invalid: false, id: undefined },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

function normalize(opt: string | Option): Option {
  return typeof opt === 'string' ? { label: opt, value: opt } : opt;
}
</script>

<template>
  <div class="m-select" :class="{ 'm-select--invalid': invalid, 'm-select--disabled': disabled }">
    <select
      :id="id"
      class="m-select__control"
      :value="modelValue"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="opt in options.map(normalize)"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
    <span class="m-select__chevron" aria-hidden="true">▾</span>
  </div>
</template>

<style scoped>
.m-select {
  position: relative;
  display: block;
}

.m-select__control {
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg);
  background: var(--surface-card);
  border: 1px solid var(--surface-line-strong);
  border-radius: var(--mctl-radius-md);
  padding: var(--mctl-space-3) var(--mctl-space-7) var(--mctl-space-3) var(--mctl-space-4);
  cursor: pointer;
  appearance: none;
  transition:
    border-color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    box-shadow var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-select__control:hover:not(:disabled) {
  border-color: var(--surface-fg-subtle);
}

.m-select__control:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
}

.m-select--invalid .m-select__control {
  border-color: var(--status-bad);
}

.m-select__chevron {
  position: absolute;
  top: 50%;
  right: var(--mctl-space-4);
  transform: translateY(-50%);
  color: var(--surface-fg-muted);
  pointer-events: none;
  font-size: 0.75em;
}

.m-select--disabled {
  opacity: 0.5;
}

.m-select--disabled .m-select__control {
  cursor: not-allowed;
}
</style>
