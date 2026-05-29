<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface Option {
  label: string;
  value: string;
}

// inheritAttrs:false so fallthrough attrs (e.g. aria-describedby from MField)
// reach the native <select>, not the wrapper div. Layout attrs (class/style)
// stay on the wrapper.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
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

const attrs = useAttrs();
const wrapperClass = computed(() => attrs.class);
const wrapperStyle = computed(() => attrs.style);
// Everything except class/style is forwarded to the native control.
const controlAttrs = computed(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

function normalize(opt: string | Option): Option {
  return typeof opt === 'string' ? { label: opt, value: opt } : opt;
}
</script>

<template>
  <div
    class="m-select"
    :class="[wrapperClass, { 'm-select--invalid': invalid, 'm-select--disabled': disabled }]"
    :style="wrapperStyle"
  >
    <select
      :id="props.id"
      class="m-select__control"
      :value="modelValue"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      v-bind="controlAttrs"
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

.m-select--invalid .m-select__control:focus-visible {
  border-color: var(--status-bad);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--status-bad) 22%, transparent);
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
