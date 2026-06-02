import type { ExchangeLiquidationEntry } from './types';

export const DEFAULT_EXCHANGE_LIQUIDATIONS: ExchangeLiquidationEntry[] = [
  { id: 'binance', name: 'Binance', shorts: '$7.4M', longs: '$66.4M' },
  { id: 'blofin', name: 'Blofin', shorts: '$12.1M', longs: '$48.2M' },
  { id: 'bitget', name: 'Bitget', shorts: '$22.5M', longs: '$31.0M' },
  { id: 'htx', name: 'HTX', shorts: '$4.2M', longs: '$18.7M' },
];
