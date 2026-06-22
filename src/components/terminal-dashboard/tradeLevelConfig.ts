export type PositionSide = 'long' | 'short';

export type DraggableLevelKind = 'stop' | 'take';

export interface ActivePosition {
  side: PositionSide;
  entryPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
}

export interface TradeLevelSideConfig {
  side: PositionSide;
  /** Stop loss must sit below entry (long) or above entry (short). */
  stopLoss: 'below' | 'above';
  /** Take profit must sit above entry (long) or below entry (short). */
  takeProfit: 'below' | 'above';
}

export const TRADE_LEVEL_SIDE_CONFIG: Record<PositionSide, TradeLevelSideConfig> = {
  long: {
    side: 'long',
    stopLoss: 'below',
    takeProfit: 'above',
  },
  short: {
    side: 'short',
    stopLoss: 'above',
    takeProfit: 'below',
  },
};

export function getTradeLevelSideConfig(side: PositionSide): TradeLevelSideConfig {
  return TRADE_LEVEL_SIDE_CONFIG[side];
}

export function clampLevelPrice(
  kind: DraggableLevelKind,
  position: Pick<ActivePosition, 'side' | 'entryPrice'>,
  price: number,
): number {
  const { side, entryPrice } = position;
  const config = TRADE_LEVEL_SIDE_CONFIG[side];

  if (kind === 'stop') {
    return config.stopLoss === 'below'
      ? Math.min(price, entryPrice)
      : Math.max(price, entryPrice);
  }

  return config.takeProfit === 'above'
    ? Math.max(price, entryPrice)
    : Math.min(price, entryPrice);
}

export function isLevelPriceValid(
  kind: DraggableLevelKind,
  position: Pick<ActivePosition, 'side' | 'entryPrice'>,
  price: number,
): boolean {
  const config = TRADE_LEVEL_SIDE_CONFIG[position.side];

  if (kind === 'stop') {
    return config.stopLoss === 'below'
      ? price < position.entryPrice
      : price > position.entryPrice;
  }

  return config.takeProfit === 'above'
    ? price > position.entryPrice
    : price < position.entryPrice;
}

export function formatLevelPrice(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatSignedUsdt(value: number): string {
  return `${value >= 0 ? '+' : '-'} ${Math.abs(value).toFixed(2)} USDT`;
}

export function signedMoveFromEntry(
  position: Pick<ActivePosition, 'side' | 'entryPrice'>,
  price: number,
): number {
  return position.side === 'short'
    ? position.entryPrice - price
    : price - position.entryPrice;
}

function roundPrice(value: number): number {
  return Math.round(value * 10) / 10;
}

export function createDefaultLevels(
  side: PositionSide,
  entryPrice: number,
  options?: { stopOffsetPct?: number; takeOffsetPct?: number },
): { stopLoss: number; takeProfit: number } {
  const stopOffset = options?.stopOffsetPct ?? 0.014;
  const takeOffset = options?.takeOffsetPct ?? 0.018;

  if (side === 'long') {
    return {
      stopLoss: roundPrice(entryPrice * (1 - stopOffset)),
      takeProfit: roundPrice(entryPrice * (1 + takeOffset)),
    };
  }

  return {
    stopLoss: roundPrice(entryPrice * (1 + stopOffset)),
    takeProfit: roundPrice(entryPrice * (1 - takeOffset)),
  };
}

export function createDemoPosition(
  side: PositionSide,
  entryPrice: number,
): ActivePosition {
  const levels = createDefaultLevels(side, entryPrice);

  return {
    side,
    entryPrice,
    stopLoss: levels.stopLoss,
    takeProfit: levels.takeProfit,
  };
}

export function normalizePosition(position: ActivePosition): ActivePosition {
  const next = { ...position };

  if (next.stopLoss !== null) {
    next.stopLoss = clampLevelPrice('stop', next, next.stopLoss);
  }

  if (next.takeProfit !== null) {
    next.takeProfit = clampLevelPrice('take', next, next.takeProfit);
  }

  return next;
}

export type TradeLevelRenderItem = {
  kind: 'entry' | DraggableLevelKind;
  price: number;
  amount: string;
};

export function buildTradeLevelRenderItems(
  position: ActivePosition,
  latestClose: number,
  formatAmount: (value: number) => string,
): TradeLevelRenderItem[] {
  const items: TradeLevelRenderItem[] = [
    {
      kind: 'entry',
      price: position.entryPrice,
      amount: formatAmount(signedMoveFromEntry(position, latestClose)),
    },
  ];

  if (position.stopLoss !== null && isLevelPriceValid('stop', position, position.stopLoss)) {
    items.push({
      kind: 'stop',
      price: position.stopLoss,
      amount: formatAmount(signedMoveFromEntry(position, position.stopLoss)),
    });
  }

  if (position.takeProfit !== null && isLevelPriceValid('take', position, position.takeProfit)) {
    items.push({
      kind: 'take',
      price: position.takeProfit,
      amount: formatAmount(signedMoveFromEntry(position, position.takeProfit)),
    });
  }

  return items;
}
