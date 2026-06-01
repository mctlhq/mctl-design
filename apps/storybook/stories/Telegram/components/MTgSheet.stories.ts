import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MTgSheet } from '@mctlhq/ui';

const meta: Meta<typeof MTgSheet> = {
  title: 'Telegram/Components/MTgSheet',
  component: MTgSheet,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    safeArea: { control: 'boolean' },
  },
  args: { title: 'Sheet Title', safeArea: false },
};

export default meta;
type Story = StoryObj<typeof MTgSheet>;

export const Interactive: Story = {
  render: () => ({
    components: { MTgSheet },
    setup() {
      const open = ref(false);
      return { open };
    },
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; padding:20px;">
        <button
          @click="open = true"
          style="background:var(--tg-accent,#2d7df6); color:#fff; border:none;
            border-radius:12px; padding:12px 24px; font-family:'Onest',system-ui,sans-serif;
            font-size:15px; font-weight:600; cursor:pointer;">
          Open sheet
        </button>
        <MTgSheet v-model="open" title="Confirm action" :safe-area="false">
          <p style="font-size:15px; color:var(--tg-ink,#15171b); margin:0 0 16px; line-height:1.5;">
            Are you sure you want to claim this reward? You have 1,240 points
            and this costs 800 points.
          </p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button @click="open = false"
              style="background:var(--tg-accent,#2d7df6); color:#fff; border:none;
                border-radius:12px; padding:14px; font-family:'Onest',system-ui,sans-serif;
                font-size:15px; font-weight:600; cursor:pointer; width:100%;">
              Confirm (800 pts)
            </button>
            <button @click="open = false"
              style="background:var(--tg-surface-sub,#f3f2ec); color:var(--tg-muted,#6a6e76);
                border:none; border-radius:12px; padding:14px;
                font-family:'Onest',system-ui,sans-serif; font-size:15px; cursor:pointer; width:100%;">
              Cancel
            </button>
          </div>
        </MTgSheet>
      </div>
    `,
  }),
};

export const WithLongContent: Story = {
  render: () => ({
    components: { MTgSheet },
    setup() {
      const open = ref(false);
      return { open };
    },
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; padding:20px;">
        <button @click="open = true"
          style="background:var(--tg-accent,#2d7df6); color:#fff; border:none;
            border-radius:12px; padding:12px 24px; font-family:'Onest',system-ui,sans-serif;
            font-size:15px; font-weight:600; cursor:pointer;">
          Order details
        </button>
        <MTgSheet v-model="open" title="Order #a7f2c1" :safe-area="false">
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div v-for="row in [
              ['Direction', 'BUY EUR'],
              ['Rate', '93.50 RUB per EUR'],
              ['Volume', '500–5,000 EUR'],
              ['Payment', 'SWIFT, SEPA'],
              ['Posted', 'Today, 14:22'],
              ['Author', '@ivan_trader (⭐ 4.9 · 47 deals)'],
            ]" :key="row[0]"
              style="display:flex; justify-content:space-between; align-items:center;
              padding:12px 0; border-bottom:1px solid var(--tg-line,#e7e6e1);">
              <span style="font-size:13px; color:var(--tg-muted,#6a6e76);">{{ row[0] }}</span>
              <span style="font-size:14px; font-weight:500; color:var(--tg-ink,#15171b);">{{ row[1] }}</span>
            </div>
            <button style="background:var(--tg-accent,#2d7df6); color:#fff; border:none;
              border-radius:12px; padding:14px; font-family:'Onest',system-ui,sans-serif;
              font-size:15px; font-weight:600; cursor:pointer; width:100%; margin-top:4px;">
              Respond to order
            </button>
          </div>
        </MTgSheet>
      </div>
    `,
  }),
};
