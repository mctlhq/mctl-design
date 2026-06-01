import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTgOrderCard } from '@mctlhq/ui';

const meta: Meta<typeof MTgOrderCard> = {
  title: 'Telegram/Components/MTgOrderCard',
  component: MTgOrderCard,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['BUY', 'SELL'] },
    status: {
      control: 'select',
      options: ['active', 'reserved', 'accepted', 'pending', 'completed', 'cancelled', 'rejected', 'expired'],
    },
    delta: { control: { type: 'number', step: 0.1 } },
  },
  args: {
    direction: 'BUY',
    pair: 'EUR / RUB',
    rate: '93.50 RUB',
    delta: 2.1,
    methods: ['SWIFT', 'SEPA'],
    volume: '500–5,000 EUR',
    status: 'active',
    author: '@ivan_trader',
  },
};

export default meta;
type Story = StoryObj<typeof MTgOrderCard>;

export const BuyOrder: Story = {};

export const SellOrder: Story = {
  args: {
    direction: 'SELL',
    pair: 'USDT / RUB',
    rate: '91.20 RUB',
    delta: -1.4,
    methods: ['Tinkoff', 'SBP'],
    volume: '1,000–20,000 USDT',
    author: '@crypto_desk',
  },
};

export const ReservedOrder: Story = {
  args: {
    direction: 'BUY',
    pair: 'EUR / USDT',
    rate: '1.084 USDT',
    delta: 0.3,
    methods: ['SEPA'],
    volume: '200–2,000 EUR',
    status: 'reserved',
    author: '@eurobroker',
  },
};

export const OrderList: Story = {
  render: () => ({
    components: { MTgOrderCard },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; padding:16px;
        display:flex; flex-direction:column; gap:10px; border-radius:16px;">
        <MTgOrderCard direction="BUY"  pair="EUR / RUB"  rate="93.50 RUB"  :delta="2.1"
          :methods="['SWIFT','SEPA']"   volume="500–5k EUR"   status="active"  author="@ivan_trader" />
        <MTgOrderCard direction="SELL" pair="USDT / RUB" rate="91.20 RUB"  :delta="-1.4"
          :methods="['Tinkoff','SBP']"  volume="1k–20k USDT" status="active"  author="@crypto_desk" />
        <MTgOrderCard direction="BUY"  pair="EUR / USDT" rate="1.084 USDT" :delta="0.3"
          :methods="['SEPA']"           volume="200–2k EUR"   status="reserved" author="@eurobroker" />
        <MTgOrderCard direction="SELL" pair="EUR / RUB"  rate="92.80 RUB"  :delta="-0.7"
          :methods="['SWIFT']"          volume="1k–10k EUR"   status="completed" author="@oldtimer" />
      </div>
    `,
  }),
};
