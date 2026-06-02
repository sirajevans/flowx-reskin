export function parseLiquidationPercent(value: string): number {
  const parsed = parseFloat(value.replace('%', '').trim());
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
}

export function parseLiquidationValue(value: string): number {
  const cleaned = value.replace(/[$,\s]/g, '');
  const match = cleaned.match(/^([\d.]+)([KMB])?$/i);
  if (!match) return 0;

  const num = parseFloat(match[1]);
  if (!Number.isFinite(num)) return 0;

  const suffix = (match[2] ?? '').toUpperCase();
  const multipliers: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };

  return num * (multipliers[suffix] ?? 1);
}

export function formatLiquidationDisplay(amount: number): string {
  const abs = Math.abs(amount);

  if (abs >= 1e9) {
    return `$${(amount / 1e9).toFixed(1)}B`;
  }

  if (abs >= 1e6) {
    return `$${(amount / 1e6).toFixed(1)}M`;
  }

  if (abs >= 1e3) {
    return `$${(amount / 1e3).toFixed(1)}K`;
  }

  return `$${amount.toFixed(1)}`;
}

export function longsLiquidationsDominate(longsValue: string, shortsValue: string): boolean {
  return parseLiquidationValue(longsValue) > parseLiquidationValue(shortsValue);
}

/** Longs share filled from the left of the bar. */
export function getLongsSharePercent(longsValue: string, shortsValue: string, fallbackPercent = '0%'): number {
  const longs = parseLiquidationValue(longsValue);
  const shorts = parseLiquidationValue(shortsValue);
  const total = longs + shorts;

  if (total > 0) {
    return (longs / total) * 100;
  }

  return parseLiquidationPercent(fallbackPercent);
}

/** Shorts share — derived from values so bar width matches dominance logic. */
export function getShortsSharePercent(longsValue: string, shortsValue: string, fallbackPercent = '0%'): number {
  const longs = parseLiquidationValue(longsValue);
  const shorts = parseLiquidationValue(shortsValue);
  const total = longs + shorts;

  if (total > 0) {
    return (shorts / total) * 100;
  }

  return parseLiquidationPercent(fallbackPercent);
}
