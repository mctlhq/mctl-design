import { MButton, MInput, type MTgTab } from '../dist/index.js';

const button: InstanceType<typeof MButton>['$props'] = { variant: 'primary' };
const input: InstanceType<typeof MInput>['$props'] = { modelValue: 'hello' };
// @ts-expect-error Published props must retain their literal union.
const invalid: InstanceType<typeof MButton>['$props'] = { variant: 'invalid' };
void [button, input, invalid];
const tab: MTgTab = { key: 'home', label: 'Home' };
void tab;
