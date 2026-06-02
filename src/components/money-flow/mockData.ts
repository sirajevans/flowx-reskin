import type { MoneyFlowTier } from './types';

/** Sample series derived from Paper mock — positive up, negative down from zero */
export const DEFAULT_MONEY_FLOW_SERIES: readonly number[] = [
  0.98, 0.94, 0.87, 0.73, 0.68, 0.51, 0.49, 0.45, 0.42, 0.26, 0.42, 0.4, 0.3, 0.18, 0.1, -0.11,
  -0.21, -0.28, -0.13, 0.1, 0.14, 0.2, 0.14, -0.24, -0.59, -0.69, -0.59, -0.37, -0.18, 0.1, 0.17,
  0.25, 0.32, 0.42, 0.51, 0.51, 0.64, 0.53, 0.76, 0.88, 1, 0.88, 0.76, 0.64, 0.51, 0.37, 0.28,
  -0.26, -0.43, -0.55, -0.69, -0.55, -0.52, -0.55, -0.65, -1, -0.69, -0.45, -0.31, -0.36, -0.51,
  -0.82, -0.81, -0.63, -0.47, -0.55, -0.63, -0.44, -0.69, -0.52, -0.29, -0.1, 0.11, 0.22, 0.33,
  0.44, 0.53, 0.33, 0.61, 0.72, 0.81, 0.65, 0.81, 0.81, 0.74, 0.87, 0.84, 0.74,
];

export const DEFAULT_MONEY_FLOW_TIERS: MoneyFlowTier[] = [
  {
    id: 'whales',
    rangeLabel: 'WHALES: + $1M',
    series: DEFAULT_MONEY_FLOW_SERIES,
    sentiment: 'very_bullish',
    sentimentLabel: 'Very Bullish',
    amount: '+ $8.5M',
  },
  {
    id: 'medium',
    rangeLabel: 'MEDIUM: $100K - $1M',
    series: DEFAULT_MONEY_FLOW_SERIES,
    sentiment: 'bearish',
    sentimentLabel: 'Bearish',
    amount: '+ $8.5M',
  },
  {
    id: 'retail',
    rangeLabel: 'RETAIL: - $100K',
    series: DEFAULT_MONEY_FLOW_SERIES,
    sentiment: 'neutral',
    sentimentLabel: 'Neutral',
    amount: '+ $8.5M',
  },
];
