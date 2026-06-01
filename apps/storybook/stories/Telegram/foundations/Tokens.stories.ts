import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { telegramPalette, telegramThemeParamsMap } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Telegram/Foundations/Tokens',
};

export default meta;
type Story = StoryObj;

const lightEntries = Object.entries(telegramPalette.light);
const darkEntries = Object.entries(telegramPalette.dark);

export const DirectionCPalette: Story = {
  render: () => ({
    setup: () => ({ lightEntries, darkEntries }),
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:760px; display:flex; flex-direction:column; gap:32px;">
        <div v-for="[mode, entries] in [['Light', lightEntries], ['Dark', darkEntries]]" :key="mode">
          <h3 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em;
            color:var(--surface-fg-subtle); font-family:var(--font-mono); margin:0 0 12px;">
            Direction C · {{ mode }}
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
            gap:1px; background:var(--surface-line); border:1px solid var(--surface-line);">
            <div v-for="[name, value] in entries" :key="name"
              style="background:var(--surface-card); padding:12px;">
              <div :style="{ background: value, height:'44px', borderRadius:'8px',
                border:'1px solid rgba(0,0,0,0.06)' }"></div>
              <div style="font-family:'Onest',system-ui,sans-serif; font-size:11px;
                font-weight:500; margin-top:8px; color:var(--surface-fg);">{{ name }}</div>
              <div style="font-family:var(--font-mono); font-size:10px;
                color:var(--surface-fg-subtle);">{{ value }}</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ThemeParamsMapping: Story = {
  name: 'Telegram themeParams → CSS',
  render: () => ({
    setup: () => ({ map: Object.entries(telegramThemeParamsMap) }),
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:560px;">
        <p style="font-size:14px; color:var(--tg-muted,#6a6e76); margin:0 0 20px; line-height:1.6;">
          At runtime, read <code style="background:var(--tg-surface-sub,#f3f2ec);
          padding:1px 6px; border-radius:4px; font-family:var(--font-mono);">Telegram.WebApp.themeParams</code>
          and map each key to the corresponding CSS variable.
        </p>
        <div style="border:1px solid var(--tg-line,#e7e6e1); border-radius:12px; overflow:hidden;">
          <div style="display:grid; grid-template-columns:1fr 1fr; background:var(--tg-surface-sub,#f3f2ec);
            padding:10px 16px; font-size:11px; font-family:var(--font-mono);
            color:var(--surface-fg-muted); text-transform:uppercase; letter-spacing:0.08em;">
            <span>themeParams key</span>
            <span>CSS variable</span>
          </div>
          <div v-for="[key, cssVar] in map" :key="key"
            style="display:grid; grid-template-columns:1fr 1fr; padding:10px 16px;
            border-top:1px solid var(--tg-line,#e7e6e1);">
            <code style="font-family:var(--font-mono); font-size:12px; color:var(--tg-ink,#15171b);">{{ key }}</code>
            <code style="font-family:var(--font-mono); font-size:12px; color:var(--tg-accent,#2d7df6);">{{ cssVar }}</code>
          </div>
        </div>
      </div>
    `,
  }),
};

export const CSSVariables: Story = {
  render: () => ({
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:560px;">
        <p style="font-size:14px; color:var(--tg-muted,#6a6e76); margin:0 0 20px; line-height:1.6;">
          All variables defined by <code style="background:var(--tg-surface-sub,#f3f2ec);
          padding:1px 6px; border-radius:4px; font-family:var(--font-mono);">@mctlhq/css/telegram.css</code>.
          They flip automatically when <code style="background:var(--tg-surface-sub,#f3f2ec);
          padding:1px 6px; border-radius:4px; font-family:var(--font-mono);">data-theme="dark"</code>
          is set on <code style="background:var(--tg-surface-sub,#f3f2ec);
          padding:1px 6px; border-radius:4px; font-family:var(--font-mono);">&lt;html&gt;</code>.
        </p>
        <pre style="background:var(--tg-surface-sub,#f3f2ec); border-radius:12px; padding:16px;
          font-family:var(--font-mono); font-size:12px; color:var(--tg-ink,#15171b); overflow:auto; margin:0;">--tg-bg          /* page background     */
--tg-surface     /* card / section bg   */
--tg-surface-sub /* subtle bg           */
--tg-ink         /* primary text        */
--tg-muted       /* secondary text      */
--tg-faint       /* tertiary text       */
--tg-accent      /* blue action color   */
--tg-accent-soft /* accent tint         */
--tg-success     /* green               */
--tg-danger      /* red                 */
--tg-warn        /* amber               */
--tg-line        /* hairline border     */
--tg-safe-top    /* safe-area-inset-top */
--tg-safe-bottom /* safe-area-inset-bottom */</pre>
      </div>
    `,
  }),
};
