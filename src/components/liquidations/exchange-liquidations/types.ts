export type ExchangeId = 'binance' | 'blofin' | 'bitget' | 'htx';

export type ExchangeLiquidationEntry = {
  id: ExchangeId;
  name: string;
  shorts: string;
  longs: string;
};

export type ExchangeLiquidationsPanelProps = {
  className?: string;
  onClose?: () => void;
  exchanges?: ExchangeLiquidationEntry[];
  /** Simulates live liquidation ticks when no `exchanges` prop is passed. */
  simulateStream?: boolean;
  streamMinIntervalMs?: number;
  streamMaxIntervalMs?: number;
};
