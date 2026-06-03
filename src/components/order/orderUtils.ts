import type { OrderCurrency } from './types';

/** Parse numeric value from stat strings like "1,000.00 USDT". */
export function parseOrderStatAmount(value: string): number {
  const match = value.match(/[\d,]+\.?\d*/);
  if (!match) return 0;
  return Number.parseFloat(match[0].replace(/,/g, '')) || 0;
}

export function parseAmountInput(amount: string): number {
  const parsed = Number.parseFloat(amount.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatOrderAmount(value: number, currency: OrderCurrency = 'USDT'): string {
  if (value <= 0) return '';
  if (currency === 'BTC') {
    const fixed = value.toFixed(6);
    return fixed.replace(/\.?0+$/, '');
  }
  return value.toFixed(2);
}

/** Percent of account equity (0–100), independent of display currency. */
export function amountToEquityPercent(
  amount: string,
  equity: number,
  currency: OrderCurrency,
  price: number,
): number {
  const parsed = parseAmountInput(amount);
  if (parsed <= 0 || equity <= 0) return 0;
  const usdtNotional = currency === 'BTC' ? parsed * price : parsed;
  return Math.min(100, Math.max(0, (usdtNotional / equity) * 100));
}

export function equityPercentToAmount(
  percent: number,
  equity: number,
  currency: OrderCurrency,
  price: number,
): string {
  if (equity <= 0 || percent <= 0) return '';
  const usdtNotional = (percent / 100) * equity;
  const value = currency === 'BTC' ? (price > 0 ? usdtNotional / price : 0) : usdtNotional;
  return formatOrderAmount(value, currency);
}

export function convertAmountForCurrency(
  amount: string,
  from: OrderCurrency,
  to: OrderCurrency,
  price: number,
): string {
  if (from === to) return amount;
  const parsed = parseAmountInput(amount);
  if (parsed <= 0 || price <= 0) return '';
  const usdtNotional = from === 'BTC' ? parsed * price : parsed;
  const converted = to === 'BTC' ? usdtNotional / price : usdtNotional;
  return formatOrderAmount(converted, to);
}
