import {
  MButton,
  MInput,
  type MButtonProps,
  type MModalProps,
  type MSelectOption,
  type MTabsItem,
  type MTgTab,
} from '../dist/index.js';

const button: InstanceType<typeof MButton>['$props'] = { variant: 'primary' };
const input: InstanceType<typeof MInput>['$props'] = { modelValue: 'hello' };
// @ts-expect-error Published props must retain their literal union.
const invalid: InstanceType<typeof MButton>['$props'] = { variant: 'invalid' };
void [button, input, invalid];
const tab: MTgTab = { key: 'home', label: 'Home' };
void tab;

// The exported props types are the components' own, not a loose copy.
const buttonProps: MButtonProps = { variant: 'ghost' };
// @ts-expect-error The exported type keeps the literal union too.
const badButtonProps: MButtonProps = { variant: 'invalid' };
const modalProps: MModalProps = { open: true, title: 'Consent' };
const option: MSelectOption = { label: 'One', value: 'one' };
const tabsItem: MTabsItem = { label: 'Overview', value: 'overview' };
void [buttonProps, badButtonProps, modalProps, option, tabsItem];
