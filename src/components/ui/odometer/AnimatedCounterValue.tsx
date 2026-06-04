import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import {
  compactOdometerClass,
  compactOdometerDecimalPointClass,
  compactOdometerDigitScrollClass,
  compactOdometerDigitSlotClass,
  compactOdometerDigitTrackClass,
  compactOdometerDigitTrackSpanClass,
  compactOdometerDigitsClass,
  compactOdometerPrefixClass,
  compactOdometerSuffixClass,
} from './compactOdometerClasses';
import {
  alignOdometerDigitParts,
  decomposeOdometerAmount,
  getDigitScrollPath,
  type OdometerDigitParts,
} from './odometerDigits';
import './Odometer.css';

export type AnimatedCounterAppearance = 'default' | 'liquidation';

const COUNTER_DURATION_MS = 100;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export type AnimatedCounterFormat =
  | { mode: 'plain'; decimalPlaces?: number }
  | { mode: 'signed-currency'; decimalPlaces?: number }
  | { mode: 'currency'; decimalPlaces?: number }
  | { mode: 'percent'; decimalPlaces?: number; showSign?: boolean };

export type AnimatedCounterValueProps = {
  value: string;
  className?: string;
  format?: AnimatedCounterFormat;
  /** Use `liquidation` for 13px/leading-4 stats (liquidations, exchange, nav bar). */
  appearance?: AnimatedCounterAppearance;
};

function parsePlainValue(value: string): number | null {
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned || cleaned === '—') {
    return null;
  }

  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseSignedCurrencyValue(value: string): number | null {
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned || cleaned === '—') {
    return null;
  }

  const match = cleaned.match(/^([+-])?\s*\$?\s*([\d.]+)$/);
  if (!match) {
    return null;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const parsed = parseFloat(match[2]);
  return Number.isFinite(parsed) ? sign * parsed : null;
}

function parseCurrencyValue(value: string): number | null {
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned || cleaned === '—') {
    return null;
  }

  const match = cleaned.match(/^([+-])?\s*\$?\s*([\d.]+)$/);
  if (!match) {
    return null;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const parsed = parseFloat(match[2]);
  return Number.isFinite(parsed) ? sign * parsed : null;
}

function parsePercentValue(value: string): number | null {
  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned || cleaned === '—') {
    return null;
  }

  const match = cleaned.match(/^([+-])?\s*([\d.]+)\s*%?\s*$/);
  if (!match) {
    return null;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const parsed = parseFloat(match[2]);
  return Number.isFinite(parsed) ? sign * parsed : null;
}

function parseCounterValue(value: string, format: AnimatedCounterFormat): number | null {
  switch (format.mode) {
    case 'signed-currency':
      return parseSignedCurrencyValue(value);
    case 'currency':
      return parseCurrencyValue(value);
    case 'percent':
      return parsePercentValue(value);
    default:
      return parsePlainValue(value);
  }
}

function getDecimalPlaces(value: string): number {
  const match = value.replace(/,/g, '').match(/\.(\d+)/);
  return match ? match[1].length : 0;
}

function getFormatParts(
  amount: number,
  format: AnimatedCounterFormat,
): { prefix: string; suffix: string; decimalPlaces: number } {
  if (format.mode === 'signed-currency') {
    const decimalPlaces = format.decimalPlaces ?? 2;
    const prefix = amount < 0 ? '- $' : '+ $';
    return { prefix, suffix: '', decimalPlaces };
  }

  if (format.mode === 'currency') {
    const decimalPlaces = format.decimalPlaces ?? 2;
    const prefix = amount < 0 ? '-$' : '$';
    return { prefix, suffix: '', decimalPlaces };
  }

  if (format.mode === 'percent') {
    const decimalPlaces = format.decimalPlaces ?? 2;
    const prefix =
      amount < 0 ? '-' : format.showSign && amount > 0 ? '+' : '';
    return { prefix, suffix: ' %', decimalPlaces };
  }

  return {
    prefix: '',
    suffix: '',
    decimalPlaces: format.decimalPlaces ?? getDecimalPlaces(String(amount)),
  };
}

function formatDisplayValue(amount: number, format: AnimatedCounterFormat): string {
  if (format.mode === 'signed-currency') {
    const decimalPlaces = format.decimalPlaces ?? 2;
    const prefix = amount < 0 ? '- $' : '+ $';
    return `${prefix}${Math.abs(amount).toFixed(decimalPlaces)}`;
  }

  if (format.mode === 'currency') {
    const decimalPlaces = format.decimalPlaces ?? 2;
    const prefix = amount < 0 ? '-$' : '$';
    return `${prefix}${Math.abs(amount).toFixed(decimalPlaces)}`;
  }

  if (format.mode === 'percent') {
    const decimalPlaces = format.decimalPlaces ?? 2;
    const prefix =
      amount < 0 ? '-' : format.showSign && amount > 0 ? '+' : '';
    return `${prefix}${Math.abs(amount).toFixed(decimalPlaces)} %`;
  }

  const decimalPlaces = format.decimalPlaces ?? getDecimalPlaces(String(amount));
  return amount.toFixed(decimalPlaces);
}

function formatUsesSignPrefix(format: AnimatedCounterFormat): boolean {
  return (
    format.mode === 'signed-currency' ||
    (format.mode === 'percent' && Boolean(format.showSign))
  );
}

function DigitColumn({
  fromDigit,
  toDigit,
  progress,
  hidden,
  appearance,
}: {
  fromDigit: number;
  toDigit: number;
  progress: number;
  hidden: boolean;
  appearance: AnimatedCounterAppearance;
}) {
  if (hidden) {
    return null;
  }

  const from = fromDigit < 0 ? 0 : fromDigit;
  const to = toDigit < 0 ? 0 : toDigit;
  const path = getDigitScrollPath(from, to);
  const scrollIndex = path.length === 1 ? 0 : progress * (path.length - 1);
  const translateY = path.length === 1 ? 0 : -(scrollIndex / path.length) * 100;
  const isCompact = appearance === 'liquidation';

  return (
    <span
      className={isCompact ? compactOdometerDigitSlotClass : 'odometer__digit-slot'}
      aria-hidden
    >
      <span className={isCompact ? compactOdometerDigitScrollClass : 'odometer__digit-scroll'}>
        <span
          className={isCompact ? compactOdometerDigitTrackClass : 'odometer__digit-track'}
          style={{ transform: `translateY(${translateY}%)` }}
        >
          {path.map((digit, index) => (
            <span
              key={`${digit}-${index}`}
              className={isCompact ? compactOdometerDigitTrackSpanClass : undefined}
            >
              {digit}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

function OdometerDisplay({
  parts,
  fromParts,
  progress,
  className = '',
  ariaLabel,
  appearance = 'default',
}: {
  parts: OdometerDigitParts;
  fromParts: OdometerDigitParts;
  progress: number;
  className?: string;
  ariaLabel?: string;
  appearance?: AnimatedCounterAppearance;
}) {
  const isAnimating = progress < 1;
  const isCompact = appearance === 'liquidation';

  return (
    <span
      aria-label={ariaLabel}
      className={cn(
        isCompact ? compactOdometerClass : 'odometer',
        !isCompact && isAnimating && 'odometer--animating',
        !isCompact && className,
      )}
      data-prefix={parts.prefix || undefined}
    >
      {parts.prefix ? (
        <span className={isCompact ? compactOdometerPrefixClass : 'odometer__prefix'}>
          {parts.prefix}
        </span>
      ) : null}
      <span className={isCompact ? compactOdometerDigitsClass : 'odometer__digits'}>
        {parts.integerDigits.map((toDigit, index) => {
          const fromDigit = fromParts.integerDigits[index] ?? -1;
          const hidden = fromDigit < 0 && toDigit < 0;

          return (
            <DigitColumn
              key={`int-${index}`}
              fromDigit={fromDigit}
              toDigit={toDigit}
              progress={progress}
              hidden={hidden}
              appearance={appearance}
            />
          );
        })}
        {parts.decimalDigits.length > 0 ? (
          <>
            <span
              className={isCompact ? compactOdometerDecimalPointClass : 'odometer__decimal-point'}
              aria-hidden
            >
              .
            </span>
            {parts.decimalDigits.map((toDigit, index) => (
              <DigitColumn
                key={`dec-${index}`}
                fromDigit={fromParts.decimalDigits[index] ?? -1}
                toDigit={toDigit}
                progress={progress}
                hidden={false}
                appearance={appearance}
              />
            ))}
          </>
        ) : null}
      </span>
      {parts.suffix ? (
        <span className={isCompact ? compactOdometerSuffixClass : 'odometer__suffix'}>
          {parts.suffix}
        </span>
      ) : null}
    </span>
  );
}

export function AnimatedCounterValue({
  value,
  className = '',
  format = { mode: 'plain' },
  appearance = 'default',
}: AnimatedCounterValueProps) {
  const targetAmount = parseCounterValue(value, format);
  const amountRef = useRef(targetAmount);
  const formatRef = useRef(format);

  const initialParts =
    targetAmount === null
      ? null
      : decomposeOdometerAmount(targetAmount, getFormatParts(targetAmount, format));

  const [fromParts, setFromParts] = useState<OdometerDigitParts | null>(initialParts);
  const [toParts, setToParts] = useState<OdometerDigitParts | null>(initialParts);
  const [suffix, setSuffix] = useState(initialParts?.suffix ?? '');
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (targetAmount === null) {
      amountRef.current = null;
      setFromParts(null);
      setToParts(null);
      setSuffix('');
      setProgress(1);
      return;
    }

    const fromAmount = amountRef.current;
    const toAmount = targetAmount;
    const nextFormatParts = getFormatParts(toAmount, format);
    const signChanged =
      formatUsesSignPrefix(format) &&
      fromAmount !== null &&
      fromAmount !== toAmount &&
      Math.sign(fromAmount) !== Math.sign(toAmount);

    if (fromAmount === toAmount && formatRef.current.mode === format.mode) {
      formatRef.current = format;
      return;
    }

    formatRef.current = format;

    const rawFrom =
      fromAmount === null || signChanged
        ? decomposeOdometerAmount(toAmount, nextFormatParts)
        : decomposeOdometerAmount(fromAmount, getFormatParts(fromAmount, format));
    const rawTo = decomposeOdometerAmount(toAmount, nextFormatParts);
    const aligned = alignOdometerDigitParts(rawFrom, rawTo);

    setFromParts(aligned.from);
    setToParts(aligned.to);
    setSuffix(aligned.suffix);

    if (prefersReducedMotion() || signChanged) {
      amountRef.current = toAmount;
      setFromParts(aligned.to);
      setProgress(1);
      return;
    }

    setProgress(0);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNTER_DURATION_MS);
      setProgress(t);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        amountRef.current = toAmount;
        setFromParts(aligned.to);
        setProgress(1);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [format, targetAmount]);

  if (targetAmount === null || !toParts) {
    return (
      <span className={className} aria-label={value}>
        {value}
      </span>
    );
  }

  const displayValue = formatDisplayValue(targetAmount, format);
  const displayParts = { ...toParts, suffix };

  if (appearance === 'liquidation') {
    return (
      <span className={className} aria-label={displayValue}>
        <OdometerDisplay
          parts={displayParts}
          fromParts={fromParts ?? displayParts}
          progress={progress}
          appearance={appearance}
          ariaLabel={displayValue}
        />
      </span>
    );
  }

  return (
    <OdometerDisplay
      parts={displayParts}
      fromParts={fromParts ?? displayParts}
      progress={progress}
      className={className}
      appearance={appearance}
      ariaLabel={displayValue}
    />
  );
}
