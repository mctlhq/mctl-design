import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTgStatusBadge } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Telegram/PairDesk/DealFlow',
};

export default meta;
type Story = StoryObj;

const steps = [
  { label: 'Order posted', done: true, desc: 'Maker posts order with rate and volume.' },
  { label: 'Taker responds', done: true, desc: 'Taker sends deal request with desired amount.' },
  { label: 'Maker accepts', done: true, desc: 'Maker accepts → deal status becomes accepted.' },
  { label: 'Payment sent', done: false, desc: 'Taker transfers funds via agreed method.' },
  { label: 'Maker confirms', done: false, desc: 'Maker confirms receipt → deal completed.' },
];

export const Lifecycle: Story = {
  render: () => ({
    components: { MTgStatusBadge },
    setup: () => ({ steps }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; font-family:'Onest',system-ui,sans-serif;
        border-radius:20px; padding:20px; border:1px solid var(--tg-line,#e7e6e1);
        display:flex; flex-direction:column; gap:16px;">

        <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">Deal lifecycle</div>

        <div v-for="(step, i) in steps" :key="step.label" style="display:flex; gap:12px;">
          <!-- Step indicator -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:0;">
            <div :style="{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: step.done ? 'var(--tg-success,#1f9d57)' : 'var(--tg-surface-sub,#f3f2ec)',
              border: step.done ? 'none' : '2px solid var(--tg-line,#e7e6e1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step.done ? '#fff' : 'var(--tg-faint,#9a9da3)',
              fontSize: step.done ? '16px' : '14px', fontWeight: '700',
            }">{{ step.done ? '✓' : i + 1 }}</div>
            <div v-if="i < steps.length - 1"
              :style="{ background: step.done ? 'var(--tg-success,#1f9d57)' : 'var(--tg-line,#e7e6e1)' }"
              style="width:2px; flex:1; min-height:24px; margin:4px 0;"></div>
          </div>
          <!-- Step content -->
          <div style="padding-top:4px; padding-bottom:16px;">
            <div style="font-size:15px; font-weight:600;"
              :style="{ color: step.done ? 'var(--tg-ink,#15171b)' : 'var(--tg-muted,#6a6e76)' }">
              {{ step.label }}
            </div>
            <div style="font-size:13px; color:var(--tg-muted,#6a6e76); margin-top:3px; line-height:1.4;">
              {{ step.desc }}
            </div>
          </div>
        </div>

        <!-- Status badges map -->
        <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
          border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:13px; font-weight:600; color:var(--tg-ink,#15171b); margin-bottom:4px;">
            Status progression
          </div>
          <div v-for="row in [
            ['active', 'Order is open for responses'],
            ['reserved', 'Taker responded, awaiting maker'],
            ['accepted', 'Maker accepted, payment pending'],
            ['completed', 'Deal concluded successfully'],
            ['cancelled', 'Cancelled before acceptance'],
            ['rejected', 'Maker rejected the response'],
            ['expired', 'TTL exceeded, auto-closed'],
          ]" :key="row[0]"
            style="display:flex; align-items:center; gap:10px;">
            <MTgStatusBadge :status="row[0]" />
            <span style="font-size:12px; color:var(--tg-muted,#6a6e76);">{{ row[1] }}</span>
          </div>
        </div>
      </div>
    `,
  }),
};
