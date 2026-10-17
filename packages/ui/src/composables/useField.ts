import { inject, type InjectionKey, type Ref } from 'vue';

/** What MField hands to the control in its slot. */
export interface FieldContext {
  /** Id the label points at; the control uses it unless it has its own. */
  id: Ref<string>;
  /** Id of the hint or error message, when one is shown. */
  describedBy: Ref<string | undefined>;
  invalid: Ref<boolean>;
  required: Ref<boolean>;
}

export const fieldKey: InjectionKey<FieldContext> = Symbol('m-field');

/** The enclosing MField's context, or null outside one. */
export const useField = () => inject(fieldKey, null);
