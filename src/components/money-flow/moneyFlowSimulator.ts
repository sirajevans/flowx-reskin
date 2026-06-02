import type { MoneyFlowSentiment, MoneyFlowTier, MoneyFlowTierId } from './types';

const TIER_BIAS: Record<MoneyFlowTierId, number> = {
  whales: 0.12,
  medium: -0.05,
  retail: 0,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createNextSeriesValue(
  series: readonly number[],
  tierId: MoneyFlowTierId,
): number {
  const last = series[series.length - 1] ?? 0;
  const delta = (Math.random() - 0.5) * 0.55;
  return clamp(last + delta + TIER_BIAS[tierId], -1, 1);
}

export function shiftSeries(
  series: readonly number[],
  tierId: MoneyFlowTierId,
): number[] {
  return [...series.slice(1), createNextSeriesValue(series, tierId)];
}

export function formatFlowAmount(series: readonly number[]): string {
  const net = series.reduce((sum, value) => sum + value, 0);
  const millions = (net / series.length) * 8.5;
  const sign = millions >= 0 ? '+' : '-';
  return `${sign} $${Math.abs(millions).toFixed(1)}M`;
}

export function deriveSentiment(series: readonly number[]): {
  sentiment: MoneyFlowSentiment;
  sentimentLabel: string;
} {
  const window = series.slice(-16);
  const avg = window.reduce((sum, value) => sum + value, 0) / window.length;

  if (avg > 0.35) {
    return { sentiment: 'very_bullish', sentimentLabel: 'Very Bullish' };
  }

  if (avg > 0.1) {
    return { sentiment: 'bullish', sentimentLabel: 'Bullish' };
  }

  if (avg < -0.1) {
    return { sentiment: 'bearish', sentimentLabel: 'Bearish' };
  }

  return { sentiment: 'neutral', sentimentLabel: 'Neutral' };
}

export function tickMoneyFlowTier(tier: MoneyFlowTier): MoneyFlowTier {
  const series = shiftSeries(tier.series, tier.id);
  const { sentiment, sentimentLabel } = deriveSentiment(series);

  return {
    ...tier,
    series,
    amount: formatFlowAmount(series),
    sentiment,
    sentimentLabel,
  };
}
