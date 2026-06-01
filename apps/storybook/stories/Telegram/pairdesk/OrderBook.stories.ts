import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import { MTgOrderCard, MTgEmptyState } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Telegram/PairDesk/OrderBook',
};

export default meta;
type Story = StoryObj;

const orders = [
  { direction: 'BUY'  as const, pair: 'EUR / RUB',  rate: '93.50 RUB',  delta: 2.1,  methods: ['SWIFT', 'SEPA'],     volume: '500–5k EUR',  author: '@ivan_trader' },
  { direction: 'SELL' as const, pair: 'USDT / RUB', rate: '91.20 RUB',  delta: -1.4, methods: ['Tinkoff', 'SBP'],    volume: '1k–20k USDT', author: '@crypto_desk' },
  { direction: 'BUY'  as const, pair: 'EUR / USDT', rate: '1.084 USDT', delta: 0.3,  methods: ['SEPA'],             volume: '200–2k EUR',  author: '@eurobroker' },
  { direction: 'SELL' as const, pair: 'EUR / RUB',  rate: '92.80 RUB',  delta: -0.7, methods: ['SWIFT'],            volume: '1k–10k EUR',  author: '@oldtimer' },
  { direction: 'BUY'  as const, pair: 'USDT / RUB', rate: '90.50 RUB',  delta: 1.8,  methods: ['SBP', 'Tinkoff'],   volume: '5k–50k USDT', author: '@stablebuyer' },
];

export const Filtered: Story = {
  render: () => ({
    components: { MTgOrderCard, MTgEmptyState },
    setup() {
      const filter = ref<'ALL' | 'BUY' | 'SELL'>('ALL');
      const visible = computed(() =>
        filter.value === 'ALL' ? orders : orders.filter(o => o.direction === filter.value)
      );
      return { filter, visible };
    },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; font-family:'Onest',system-ui,sans-serif;
        border-radius:20px; overflow:hidden; border:1px solid var(--tg-line,#e7e6e1);">

        <!-- Filter chips -->
        <div style="padding:16px 16px 8px; display:flex; gap:8px;">
          <button v-for="f in ['ALL','BUY','SELL']" :key="f"
            @click="filter = f"
            :style="{
              background: filter === f ? 'var(--tg-accent,#2d7df6)' : 'var(--tg-surface-sub,#f3f2ec)',
              color: filter === f ? '#fff' : 'var(--tg-muted,#6a6e76)',
            }"
            style="border:none; border-radius:20px; padding:7px 18px;
              font-family:'Onest',system-ui,sans-serif; font-size:14px; font-weight:600;
              cursor:pointer; transition:all 0.15s;">
            {{ f }}
          </button>
        </div>

        <!-- Order list -->
        <div style="padding:8px 16px 16px; display:flex; flex-direction:column; gap:10px;">
          <MTgOrderCard
            v-for="o in visible" :key="o.author + o.pair"
            v-bind="o"
          />
          <MTgEmptyState v-if="!visible.length" variant="empty"
            title="No orders" description="No orders match this filter." />
        </div>
      </div>
    `,
  }),
};
