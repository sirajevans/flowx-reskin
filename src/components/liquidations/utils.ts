export function parseLiquidationPercent(value: string): number {
  const parsed = parseFloat(value.replace('%', '').trim());
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
}

export function parseLiquidationValue(value: string): number {
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned || cleaned === '—') return 0;

  const match = cleaned.match(/^([+-])?\s*\$?\s*([\d.]+)([KMB])?$/i);
  if (!match) return 0;

  const sign = match[1] === '-' ? -1 : 1;
  const num = parseFloat(match[2]);
  if (!Number.isFinite(num)) return 0;

  const suffix = (match[3] ?? '').toUpperCase();
  const multipliers: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };

  return sign * num * (multipliers[suffix] ?? 1);
}

export function formatLiquidationDisplay(
  amount: number,
  options?: { signedPrefix?: boolean },
): string {
  const abs = Math.abs(amount);
  let body = '';

  if (abs >= 1e9) {
    body = `$${(abs / 1e9).toFixed(1)}B`;
  } else if (abs >= 1e6) {
    body = `$${(abs / 1e6).toFixed(1)}M`;
  } else if (abs >= 1e3) {
    body = `$${(abs / 1e3).toFixed(1)}K`;
  } else {
    body = `$${abs.toFixed(1)}`;
  }

  if (!options?.signedPrefix) {
    return body;
  }

  return `${amount < 0 ? '- ' : '+ '}${body}`;
}

export function longsLiquidationsDominate(longsValue: string, shortsValue: string): boolean {
  return parseLiquidationValue(longsValue) > parseLiquidationValue(shortsValue);
}

export function shortsLiquidationsDominate(longsValue: string, shortsValue: string): boolean {
  return parseLiquidationValue(shortsValue) > parseLiquidationValue(longsValue);
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
