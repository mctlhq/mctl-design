<script lang="ts">
export interface MSelectOption {
  label: string;
  value: string;
}

export interface MSelectProps {
  /** v-model value. Without a v-model the field keeps its own value. */
  modelValue?: string;
  /** Option list — value strings or {label, value} objects. */
  options: Array<string | MSelectOption>;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  /** Shown while no value is chosen; not selectable again. */
  placeholder?: string;
}
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useField } from '../composables/useField';

// inheritAttrs:false so fallthrough attrs (e.g. aria-describedby from MField)
// reach the native <select>, not the wrapper div. Layout attrs (class/style)
// stay on the wrapper.
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Omit<MSelectProps, 'modelValue'>>(), {
  disabled: false,
  invalid: false,
  id: undefined,
  placeholder: '',
});

const model = defineModel<string>({ default: '' });

// Inside MField: its id and message wiring, unless set explicitly.
const field = useField(() => props.id);
const isInvalid = computed(() => props.invalid || Boolean(field?.invalid.value));

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

function normalize(opt: string | MSelectOption): MSelectOption {
  return typeof opt === 'string' ? { label: opt, value: opt } : opt;
}
</script>

<template>
  <div
    class="m-select"
    :class="[wrapperClass, { 'm-select--invalid': isInvalid, 'm-select--disabled': disabled }]"
    :style="wrapperStyle"
  >
    <select
      :id="props.id ?? field?.id.value"
      class="m-select__control"
      :value="model"
      :disabled="disabled"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="field?.describedBy.value"
      :aria-required="field?.required.value || undefined"
      v-bind="controlAttrs"
      @change="model = ($event.target as HTMLSelectElement).value"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options.map(normalize)" :key="opt.value" :value="opt.value">
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
  background: var(--control-bg);
  border: var(--mctl-border-width-hairline) solid var(--control-border);
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
  box-shadow: var(--control-focus-shadow);
}

.m-select--invalid .m-select__control {
  border-color: var(--status-bad);
}

.m-select--invalid .m-select__control:focus-visible {
  border-color: var(--status-bad);
  box-shadow: var(--control-focus-shadow-invalid);
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
  opacity: var(--mctl-opacity-disabled);
}

.m-select--disabled .m-select__control {
  background: var(--control-disabled-bg);
  cursor: not-allowed;
}
</style>
