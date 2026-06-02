import type { PositionRow } from './types';

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function parsePrice(value: string): number {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPrice(amount: number, reference: string): string {
  const decimalPlaces = reference.includes('.') ? reference.split('.')[1]?.length ?? 1 : 0;
  return amount.toFixed(decimalPlaces);
}

function calcPnl(side: PositionRow['side'], entry: number, market: number, amount: number): number {
  const ratio = amount / entry;
  return side === 'buy' ? (market - entry) * ratio : (entry - market) * ratio;
}

function formatPnl(amount: number): { pnl: string; pnlPositive: boolean } {
  const pnlPositive = amount >= 0;
  const prefix = pnlPositive ? '+ $' : '- $';
  return {
    pnl: `${prefix}${Math.abs(amount).toFixed(2)}`,
    pnlPositive,
  };
}

function bumpMarketPrice(current: number): number {
  const deltaPct = randomBetween(-0.0015, 0.0015);
  return Math.max(current * 0.5, current * (1 + deltaPct));
}

export function tickPositionRows(rows: PositionRow[]): PositionRow[] {
  if (rows.length === 0) {
    return rows;
  }

  const index = Math.floor(Math.random() * rows.length);
  const row = rows[index];
  const entry = parsePrice(row.entryPrice);
  const market = parsePrice(row.marketPrice);
  const nextMarket = bumpMarketPrice(market);

  if (row.pnl === '—') {
    const updated: PositionRow = {
      ...row,
      marketPrice: formatPrice(nextMarket, row.marketPrice),
    };

    return rows.map((item, itemIndex) => (itemIndex === index ? updated : item));
  }

  const amount = parsePrice(row.amount);
  const nextPnl = calcPnl(row.side, entry, nextMarket, amount);
  const { pnl, pnlPositive } = formatPnl(nextPnl);

  const updated: PositionRow = {
    ...row,
    marketPrice: formatPrice(nextMarket, row.marketPrice),
    pnl,
    pnlPositive,
  };

  return rows.map((item, itemIndex) => (itemIndex === index ? updated : item));
}
