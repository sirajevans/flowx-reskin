export type MoneyFlowSentiment = 'very_bullish' | 'bullish' | 'bearish' | 'neutral';

export type MoneyFlowTierId = 'whales' | 'medium' | 'retail';

export type MoneyFlowTier = {
  id: MoneyFlowTierId;
  rangeLabel: string;
  /** Signed net flow per bucket; positive = bullish, negative = bearish */
  series: readonly number[];
  sentiment: MoneyFlowSentiment;
  sentimentLabel: string;
  amount: string;
};

export type MoneyFlowPanelProps = {
  className?: string;
  onClose?: () => void;
  tiers?: MoneyFlowTier[];
  /** Roll the chart forward with mock ticks (default on) */
  simulateStream?: boolean;
  streamMinIntervalMs?: number;
  streamMaxIntervalMs?: number;
};
