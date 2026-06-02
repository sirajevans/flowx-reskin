import { describe, expect, it } from 'vitest';
import { DEFAULT_EXCHANGE_LIQUIDATIONS } from './mockData';
import { tickExchangeLiquidations } from './exchangeLiquidationsSimulator';
import { parseLiquidationValue } from '../liquidations/utils';

describe('tickExchangeLiquidations', () => {
  it('updates exactly one exchange side per tick', () => {
    const next = tickExchangeLiquidations(DEFAULT_EXCHANGE_LIQUIDATIONS);

    const changed = next.filter((entry, index) => {
      const prev = DEFAULT_EXCHANGE_LIQUIDATIONS[index];
      return entry.shorts !== prev.shorts || entry.longs !== prev.longs;
    });

    expect(changed).toHaveLength(1);
  });

  it('keeps amounts formatted and above the minimum floor', () => {
    for (let i = 0; i < 20; i += 1) {
      const next = tickExchangeLiquidations(DEFAULT_EXCHANGE_LIQUIDATIONS);

      for (const entry of next) {
        expect(entry.shorts).toMatch(/^\$[\d.]+[KMB]$/);
        expect(entry.longs).toMatch(/^\$[\d.]+[KMB]$/);
        expect(parseLiquidationValue(entry.shorts)).toBeGreaterThanOrEqual(500_000);
        expect(parseLiquidationValue(entry.longs)).toBeGreaterThanOrEqual(500_000);
      }
    }
  });
});
