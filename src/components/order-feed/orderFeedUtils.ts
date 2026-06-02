export const GRADIENT_VALUE_MAX = 50000; // $50K = 100% row width
export const GRADIENT_ENTER_MS = 40;
export const ROW_PUSH_MS = 65;
export const ROW_FADE_MS = 140;
/** Keep in sync with longest enter animation in OrderFeedPanel.css */
export const ROW_ENTER_MS = ROW_FADE_MS;

export function parseOrderFeedValue(value: string): number {
  const cleaned = value.replace(/[$,\s]/g, '');
  const match = cleaned.match(/^([\d.]+)([KMB])?$/i);
  if (!match) return 0;

  const num = parseFloat(match[1]);
  const suffix = (match[2] ?? '').toUpperCase();
  const multipliers: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };

  return num * (multipliers[suffix] ?? 1);
}

export function getGradientWidthPercent(value: string): number {
  const parsed = parseOrderFeedValue(value);
  if (parsed <= 0) return 0;

  return Math.min(100, (parsed / GRADIENT_VALUE_MAX) * 100);
}

export function parseOrderFeedPrice(price: string): number {
  return parseFloat(price.replace(/,/g, '')) || 0;
}

export function formatOrderFeedPrice(price: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatOrderFeedValue(amountUsd: number): string {
  if (amountUsd >= 1000) {
    const k = amountUsd / 1000;
    const digits = k >= 10 ? 0 : 1;
    return `$${k.toFixed(digits)}K`;
  }

  return `$${Math.round(amountUsd)}`;
}
