import type { OrderFeedEntry, OrderFeedVolume } from './types';

export const DEFAULT_PERPS_VOLUME: OrderFeedVolume = {
  label: 'PERPS · 3M VOL',
  value: '$66.1M',
};

export const DEFAULT_SPOT_VOLUME: OrderFeedVolume = {
  label: 'SPOT · 3M VOL',
  value: '$4.48M',
};

export const DEFAULT_LEFT_COLUMN: OrderFeedEntry[] = [
  { id: 'l1', side: 'buy', product: 'spot', price: '73,248.2', value: '$42.5K' },
  { id: 'l2', side: 'sell', product: 'perp', price: '73,241.0', value: '$3.8K' },
  { id: 'l3', side: 'sell', product: 'split', price: '73,239.5', value: '$28.2K' },
  { id: 'l4', side: 'buy', product: 'quad', price: '73,238.1', value: '$11.3K' },
  { id: 'l5', side: 'sell', product: 'spot', price: '73,236.8', value: '$47.6K' },
  { id: 'l6', side: 'buy', product: 'perp', price: '73,235.4', value: '$6.9K' },
  { id: 'l7', side: 'sell', product: 'split', price: '73,234.0', value: '$19.4K' },
  { id: 'l8', side: 'buy', product: 'quad', price: '73,232.7', value: '$33.1K' },
  { id: 'l9', side: 'sell', product: 'spot', price: '73,231.3', value: '$9.6K' },
  { id: 'l10', side: 'buy', product: 'perp', price: '73,230.0', value: '$44.3K' },
  { id: 'l11', side: 'sell', product: 'split', price: '73,228.6', value: '$16.2K' },
  { id: 'l12', side: 'buy', product: 'quad', price: '73,227.3', value: '$5.5K' },
  { id: 'l13', side: 'sell', product: 'spot', price: '73,225.9', value: '$39.8K' },
  { id: 'l14', side: 'buy', product: 'perp', price: '73,224.5', value: '$24.1K' },
];

export const DEFAULT_RIGHT_COLUMN: OrderFeedEntry[] = [
  { id: 'r1', side: 'buy', product: 'spot', price: '73,245.8', value: '$5.1K' },
  { id: 'r2', side: 'buy', product: 'perp', price: '73,244.6', value: '$15.6K' },
  { id: 'r3', side: 'buy', product: 'split', price: '73,243.1', value: '$50.0K' },
  { id: 'r4', side: 'sell', product: 'quad', price: '73,242.0', value: '$8.7K' },
  { id: 'r5', side: 'buy', product: 'spot', price: '73,240.5', value: '$22.8K' },
  { id: 'r6', side: 'sell', product: 'perp', price: '73,239.2', value: '$4.2K' },
  { id: 'r7', side: 'buy', product: 'split', price: '73,237.9', value: '$38.5K' },
  { id: 'r8', side: 'sell', product: 'quad', price: '73,236.5', value: '$12.9K' },
  { id: 'r9', side: 'buy', product: 'spot', price: '73,235.1', value: '$31.7K' },
  { id: 'r10', side: 'sell', product: 'perp', price: '73,233.8', value: '$7.4K' },
  { id: 'r11', side: 'buy', product: 'split', price: '73,232.4', value: '$45.3K' },
  { id: 'r12', side: 'sell', product: 'quad', price: '73,231.0', value: '$13.6K' },
  { id: 'r13', side: 'buy', product: 'spot', price: '73,229.7', value: '$3.4K' },
  { id: 'r14', side: 'sell', product: 'perp', price: '73,228.3', value: '$29.9K' },
];
