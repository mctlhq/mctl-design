import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { motion } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Foundations/Motion',
};

export default meta;
type Story = StoryObj;

export const Durations: Story = {
  render: () => ({
    setup: () => ({ durations: Object.entries(motion.duration) }),
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:480px; font-family:var(--font-mono);">
        <h3 style="text-transform:uppercase; letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle); margin:0;">
          Duration
        </h3>
        <div v-for="[name, value] in durations" :key="name"
          style="display:flex; align-items:center; gap:16px;">
          <span style="width:80px; font-size:12px; color:var(--surface-fg-subtle);">{{ name }}</span>
          <span style="width:60px; font-size:12px; color:var(--surface-fg-muted);">{{ value }}</span>
          <div :style="{
            width: '32px',
            height: '32px',
            background: 'var(--accent)',
            borderRadius: '4px',
            animation: 'pulse ' + value + ' ease-in-out infinite alternate',
          }" />
        </div>
        <style>@keyframes pulse { to { opacity: 0.2; } }</style>
      </div>
    `,
  }),
};

export const Easings: Story = {
  render: () => ({
    setup: () => ({ easings: Object.entries(motion.easing) }),
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:560px; font-family:var(--font-mono);">
        <h3 style="text-transform:uppercase; letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle); margin:0;">
          Easing
        </h3>
        <div v-for="[name, value] in easings" :key="name"
          style="display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; align-items:baseline; gap:12px;">
            <span style="width:80px; font-size:12px; color:var(--surface-fg-subtle);">{{ name }}</span>
            <span style="font-size:11px; color:var(--surface-fg-subtle);">{{ value }}</span>
          </div>
          <div style="height:2px; background:var(--surface-line); position:relative; overflow:visible;">
            <div :style="{
              position: 'absolute',
              top: '-5px',
              left: 0,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'slide 1.4s ' + value + ' infinite alternate',
            }" />
          </div>
        </div>
        <style>@keyframes slide { to { left: calc(100% - 12px); } }</style>
      </div>
    `,
  }),
};
