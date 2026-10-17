import { inject, onBeforeUnmount, type InjectionKey, type Ref } from 'vue';

/** What MField hands to the control in its slot. */
export interface FieldContext {
  /** Id the label points at; the control uses it unless it has its own. */
  id: Ref<string>;
  /** Id of the hint or error message, when one is shown. */
  describedBy: Ref<string | undefined>;
  invalid: Ref<boolean>;
  required: Ref<boolean>;
  /** A control registers the id it was given explicitly; returns the undo. */
  register: (explicitId: () => string | undefined) => () => void;
}

export const fieldKey: InjectionKey<FieldContext> = Symbol('m-field');

/**
 * The enclosing MField's context, or null outside one. The control's own
 * `id`, when set, becomes the id the field's label points at.
 */
export function useField(explicitId: () => string | undefined) {
  const field = inject(fieldKey, null);
  if (field) onBeforeUnmount(field.register(explicitId));
  return field;
}
