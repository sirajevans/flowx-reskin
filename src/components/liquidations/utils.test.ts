import { describe, expect, it } from 'vitest';
import {
  formatLiquidationDisplay,
  getLongsSharePercent,
  getShortsSharePercent,
  longsLiquidationsDominate,
  parseLiquidationPercent,
  parseLiquidationValue,
  shortsLiquidationsDominate,
} from './utils';

describe('parseLiquidationValue', () => {
  it('parses dollar amounts with suffixes', () => {
    expect(parseLiquidationValue('$14.3M')).toBe(14_300_000);
    expect(parseLiquidationValue('$184.3M')).toBe(184_300_000);
    expect(parseLiquidationValue('$42.5K')).toBe(42_500);
  });

  it('returns 0 for invalid values', () => {
    expect(parseLiquidationValue('')).toBe(0);
    expect(parseLiquidationValue('—')).toBe(0);
    expect(parseLiquidationValue('N/A')).toBe(0);
  });
});

describe('parseLiquidationPercent', () => {
  it('parses and clamps percent strings', () => {
    expect(parseLiquidationPercent('92.8%')).toBe(92.8);
    expect(parseLiquidationPercent('150%')).toBe(100);
    expect(parseLiquidationPercent('-5%')).toBe(0);
    expect(parseLiquidationPercent('invalid')).toBe(0);
  });
});

describe('longsLiquidationsDominate', () => {
  it('returns true only when longs value is strictly greater', () => {
    expect(longsLiquidationsDominate('$184.3M', '$14.3M')).toBe(true);
    expect(longsLiquidationsDominate('$4.6M', '$7.8M')).toBe(false);
  });

  it('treats equal values as shorts dominate (not longs)', () => {
    expect(longsLiquidationsDominate('$10M', '$10M')).toBe(false);
  });
});

describe('shortsLiquidationsDominate', () => {
  it('returns true only when shorts value is strictly greater', () => {
    expect(shortsLiquidationsDominate('$184.3M', '$14.3M')).toBe(false);
    expect(shortsLiquidationsDominate('$4.6M', '$7.8M')).toBe(true);
  });

  it('treats equal values as no shorts dominance', () => {
    expect(shortsLiquidationsDominate('$10M', '$10M')).toBe(false);
  });
});

describe('formatLiquidationDisplay', () => {
  it('formats amounts with suffixes', () => {
    expect(formatLiquidationDisplay(14_300_000)).toBe('$14.3M');
    expect(formatLiquidationDisplay(184_300_000)).toBe('$184.3M');
    expect(formatLiquidationDisplay(42_500)).toBe('$42.5K');
  });
});

describe('getLongsSharePercent', () => {
  it('derives share from dollar values', () => {
    expect(getLongsSharePercent('$4.6M', '$7.8M')).toBeCloseTo(37.097, 2);
    expect(getLongsSharePercent('$184.3M', '$14.3M')).toBeCloseTo(92.797, 2);
  });

  it('falls back to percent when both values are zero', () => {
    expect(getLongsSharePercent('$0', '$0', '81.5%')).toBe(81.5);
  });
});

describe('getShortsSharePercent', () => {
  it('derives share from dollar values', () => {
    expect(getShortsSharePercent('$4.6M', '$7.8M')).toBeCloseTo(62.903, 2);
    expect(getShortsSharePercent('$184.3M', '$14.3M')).toBeCloseTo(7.203, 2);
  });

  it('falls back to percent when both values are zero', () => {
    expect(getShortsSharePercent('$0', '$0', '18.5%')).toBe(18.5);
  });

  it('returns 0 when values and fallback are missing', () => {
    expect(getShortsSharePercent('', '')).toBe(0);
  });
});
