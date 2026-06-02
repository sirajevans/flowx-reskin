import { describe, expect, it } from 'vitest';
import { getComparisonBarWidths } from './comparisonBars';

describe('getComparisonBarWidths', () => {
  it('splits bar width proportionally between short and long values', () => {
    const { shortPx, longPx } = getComparisonBarWidths('$7.4M', '$66.4M');

    expect(shortPx).toBeCloseTo(6.5, 1);
    expect(longPx).toBeCloseTo(58.3, 1);
    expect(shortPx + longPx).toBeCloseTo(64.8, 1);
  });

  it('gives each side equal width when values match', () => {
    const { shortPx, longPx } = getComparisonBarWidths('$10M', '$10M');

    expect(shortPx).toBe(32.4);
    expect(longPx).toBe(32.4);
  });

  it('returns zero widths when both values are empty', () => {
    expect(getComparisonBarWidths('', '')).toEqual({ shortPx: 0, longPx: 0 });
  });
});
