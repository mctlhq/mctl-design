import { addons } from 'storybook/manager-api';

import { mctlDark } from './mctl-theme';

// Initial chrome theme — prevents a default-Storybook flash before the
// dark-mode addon takes over runtime theme switching.
addons.setConfig({ theme: mctlDark });
