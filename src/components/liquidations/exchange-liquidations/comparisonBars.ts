import { parseLiquidationValue } from '../utils';

/** Combined width of both comparison bars (excludes the 4px gap). */
const TOTAL_BAR_PX = 64.8;

const roundPx = (value: number) => Math.round(value * 10) / 10;

export function getComparisonBarWidths(
  shorts: string,
  longs: string,
): { shortPx: number; longPx: number } {
  const shortAmt = parseLiquidationValue(shorts);
  const longAmt = parseLiquidationValue(longs);
  const total = shortAmt + longAmt;

  if (total <= 0) {
    return { shortPx: 0, longPx: 0 };
  }

  return {
    shortPx: roundPx((shortAmt / total) * TOTAL_BAR_PX),
    longPx: roundPx((longAmt / total) * TOTAL_BAR_PX),
  };
}
