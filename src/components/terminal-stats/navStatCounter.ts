import type { AnimatedCounterFormat } from '../ui/odometer/AnimatedCounterValue';

function getDecimalPlaces(value: string): number {
  const match = value.replace(/,/g, '').match(/\.(\d+)/);
  return match ? match[1].length : 0;
}

export function normalizeNavStatValue(value: string): string {
  return value.replace(/\$\s+/g, '$');
}

export function resolveNavStatCounter(value: string): {
  counterValue: string;
  format: AnimatedCounterFormat;
} {
  const normalized = normalizeNavStatValue(value).trim();

  if (normalized.includes('$')) {
    return {
      counterValue: normalized.replace(/,/g, ''),
      format: { mode: 'currency', decimalPlaces: getDecimalPlaces(normalized) },
    };
  }

  if (normalized.includes('%')) {
    return {
      counterValue: normalized.replace(/,/g, ''),
      format: {
        mode: 'percent',
        decimalPlaces: getDecimalPlaces(normalized),
        showSign: /^[+-]/.test(normalized),
      },
    };
  }

  return {
    counterValue: normalized.replace(/,/g, ''),
    format: { mode: 'plain', decimalPlaces: getDecimalPlaces(normalized) },
  };
}
