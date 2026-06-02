import { describe, expect, it } from 'vitest';
import { DEFAULT_MONEY_FLOW_SERIES, DEFAULT_MONEY_FLOW_TIERS } from './mockData';
import { shiftSeries, tickMoneyFlowTier } from './moneyFlowSimulator';

describe('moneyFlowSimulator', () => {
  it('keeps series length when shifting', () => {
    const next = shiftSeries(DEFAULT_MONEY_FLOW_SERIES, 'whales');
    expect(next).toHaveLength(DEFAULT_MONEY_FLOW_SERIES.length);
    expect(next[0]).toBe(DEFAULT_MONEY_FLOW_SERIES[1]);
  });

  it('updates amount and sentiment on tick', () => {
    const tier = tickMoneyFlowTier(DEFAULT_MONEY_FLOW_TIERS[0]);
    expect(tier.series).not.toBe(DEFAULT_MONEY_FLOW_TIERS[0].series);
    expect(tier.amount).toMatch(/^[+-] \$[\d.]+M$/);
    expect(tier.sentimentLabel).toBeTruthy();
  });
});
