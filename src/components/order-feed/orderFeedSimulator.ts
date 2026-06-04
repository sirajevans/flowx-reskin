import type { OrderFeedEntry, OrderFeedProduct, OrderFeedSide } from './types';
import { formatOrderFeedPrice, formatOrderFeedValue, parseOrderFeedPrice } from './orderFeedUtils';

const SIDES: OrderFeedSide[] = ['buy', 'sell'];
const PRODUCTS: OrderFeedProduct[] = ['spot', 'perp', 'split', 'quad'];

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickSide(): OrderFeedSide {
  return SIDES[Math.floor(Math.random() * SIDES.length)];
}

function pickProduct(): OrderFeedProduct {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
}

export function createSimulatedOrderFeedEntry(referencePrice: number): OrderFeedEntry {
  const side = pickSide();
  const tick = randomBetween(-2.5, 2.5);
  const price = formatOrderFeedPrice(referencePrice + tick);
  const valueUsd = randomBetween(500, 50000);
  const value = formatOrderFeedValue(valueUsd);

  return {
    id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    side,
    product: pickProduct(),
    price,
    value,
  };
}

export function getReferencePriceFromEntries(entries: OrderFeedEntry[]): number {
  const first = entries[0];
  if (first) return parseOrderFeedPrice(first.price);

  return 73240;
}
