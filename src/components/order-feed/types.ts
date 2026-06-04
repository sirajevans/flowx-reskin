import type { OrderSide } from '../order/types';

export type OrderFeedSide = OrderSide;
export type OrderFeedFilter = 'all' | 'spot' | 'perp' | 'split' | 'quad';
export type OrderFeedProduct = Exclude<OrderFeedFilter, 'all'>;

export type OrderFeedEntry = {
  id: string;
  side: OrderFeedSide;
  product?: OrderFeedProduct;
  price: string;
  value: string;
};

export type OrderFeedVolume = {
  label: string;
  value: string;
};

export type OrderFeedPanelProps = {
  className?: string;
  onClose?: () => void;
  perpsVolume?: OrderFeedVolume;
  spotVolume?: OrderFeedVolume;
  leftColumn?: OrderFeedEntry[];
  rightColumn?: OrderFeedEntry[];
  /** Prepends random trades on a timer (default on when columns are not controlled). */
  simulateStream?: boolean;
  streamMaxRows?: number;
  streamMinIntervalMs?: number;
  streamMaxIntervalMs?: number;
};
