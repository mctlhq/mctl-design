import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta: Meta = {
  title: 'Telegram/PairDesk/CreateOrder',
};

export default meta;
type Story = StoryObj;

export const Form: Story = {
  render: () => ({
    setup() {
      const direction = ref('BUY');
      const pair = ref('EUR / RUB');
      const rate = ref('93.50');
      const minVol = ref('500');
      const maxVol = ref('5000');
      const methods = ref(['SWIFT']);
      return { direction, pair, rate, minVol, maxVol, methods };
    },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; font-family:'Onest',system-ui,sans-serif;
        border-radius:20px; overflow:hidden; border:1px solid var(--tg-line,#e7e6e1);">

        <div style="padding:20px 20px 0;">
          <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b); margin-bottom:20px;">
            New order
          </div>

          <!-- Direction -->
          <div style="margin-bottom:16px;">
            <div style="font-size:13px; font-weight:500; color:var(--tg-muted,#6a6e76); margin-bottom:8px;">
              Direction
            </div>
            <div style="display:flex; gap:8px;">
              <button v-for="d in ['BUY','SELL']" :key="d" @click="direction = d"
                :style="{
                  background: direction === d ? 'var(--tg-accent,#2d7df6)' : 'var(--tg-surface-sub,#f3f2ec)',
                  color: direction === d ? '#fff' : 'var(--tg-muted,#6a6e76)',
                }"
                style="flex:1; border:none; border-radius:10px; padding:12px;
                  font-family:'Onest',system-ui,sans-serif; font-size:15px; font-weight:600; cursor:pointer;">
                {{ d }}
              </button>
            </div>
          </div>

          <!-- Pair -->
          <div style="margin-bottom:16px;">
            <div style="font-size:13px; font-weight:500; color:var(--tg-muted,#6a6e76); margin-bottom:8px;">
              Currency pair
            </div>
            <select v-model="pair" style="width:100%; background:var(--tg-surface,#fff);
              border:1px solid var(--tg-line,#e7e6e1); border-radius:12px; padding:13px 16px;
              font-family:'Onest',system-ui,sans-serif; font-size:15px; color:var(--tg-ink,#15171b);
              appearance:none; cursor:pointer;">
              <option v-for="p in ['EUR / RUB','USDT / RUB','EUR / USDT']" :key="p">{{ p }}</option>
            </select>
          </div>

          <!-- Rate -->
          <div style="margin-bottom:16px;">
            <div style="font-size:13px; font-weight:500; color:var(--tg-muted,#6a6e76); margin-bottom:8px;">
              Rate (RUB per unit)
            </div>
            <input v-model="rate" type="number" step="0.01"
              style="width:100%; background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
                border-radius:12px; padding:13px 16px; font-family:'Onest',system-ui,sans-serif;
                font-size:15px; color:var(--tg-ink,#15171b); box-sizing:border-box;" />
          </div>

          <!-- Volume range -->
          <div style="margin-bottom:20px;">
            <div style="font-size:13px; font-weight:500; color:var(--tg-muted,#6a6e76); margin-bottom:8px;">
              Volume range
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <input v-model="minVol" type="number" placeholder="Min"
                style="flex:1; background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
                  border-radius:12px; padding:13px 16px; font-family:'Onest',system-ui,sans-serif;
                  font-size:15px; color:var(--tg-ink,#15171b);" />
              <span style="color:var(--tg-faint,#9a9da3);">–</span>
              <input v-model="maxVol" type="number" placeholder="Max"
                style="flex:1; background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
                  border-radius:12px; padding:13px 16px; font-family:'Onest',system-ui,sans-serif;
                  font-size:15px; color:var(--tg-ink,#15171b);" />
            </div>
          </div>

          <button style="width:100%; background:var(--tg-accent,#2d7df6); color:#fff; border:none;
            border-radius:14px; padding:16px; font-family:'Onest',system-ui,sans-serif;
            font-size:16px; font-weight:700; cursor:pointer; margin-bottom:20px;">
            Post order
          </button>
        </div>
      </div>
    `,
  }),
};
