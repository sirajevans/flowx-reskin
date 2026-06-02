import { formatLiquidationDisplay, parseLiquidationValue } from '../utils';
import type { ExchangeLiquidationEntry } from './types';

const MIN_AMOUNT = 500_000;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function bumpAmount(current: number): number {
  const delta = Math.max(current * randomBetween(0.01, 0.12), 200_000);
  const direction = Math.random() < 0.82 ? 1 : -1;
  return Math.max(MIN_AMOUNT, current + direction * delta);
}

export function tickExchangeLiquidations(
  entries: ExchangeLiquidationEntry[],
): ExchangeLiquidationEntry[] {
  if (entries.length === 0) return entries;

  const index = Math.floor(Math.random() * entries.length);
  const entry = entries[index];
  const side: 'shorts' | 'longs' = Math.random() < 0.5 ? 'shorts' : 'longs';

  const shortsAmt = parseLiquidationValue(entry.shorts);
  const longsAmt = parseLiquidationValue(entry.longs);

  const updated: ExchangeLiquidationEntry = {
    ...entry,
    shorts: formatLiquidationDisplay(
      side === 'shorts' ? bumpAmount(shortsAmt) : shortsAmt,
    ),
    longs: formatLiquidationDisplay(side === 'longs' ? bumpAmount(longsAmt) : longsAmt),
  };

  return entries.map((item, itemIndex) => (itemIndex === index ? updated : item));
}
