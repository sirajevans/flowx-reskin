import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import {
  liquidationDecimalPointClass,
  liquidationDigitScrollClass,
  liquidationDigitSlotClass,
  liquidationDigitTrackClass,
  liquidationDigitTrackSpanClass,
  liquidationOdometerClass,
  liquidationOdometerDigitsClass,
  liquidationOdometerPrefixClass,
  liquidationOdometerSuffixClass,
} from './liquidationOdometerClasses';
import {
  alignLiquidationDigitParts,
  decomposeLiquidationAmount,
  getDigitScrollPath,
  type LiquidationDigitParts,
} from './liquidationDigits';
import { formatLiquidationDisplay, parseLiquidationValue } from './utils';

const COUNTER_DURATION_MS = 100;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export type AnimatedLiquidationValueProps = {
  value: string;
  className?: string;
};

function DigitColumn({
  fromDigit,
  toDigit,
  progress,
  hidden,
}: {
  fromDigit: number;
  toDigit: number;
  progress: number;
  hidden: boolean;
}) {
  if (hidden) {
    return null;
  }

  const from = fromDigit < 0 ? 0 : fromDigit;
  const to = toDigit < 0 ? 0 : toDigit;
  const path = getDigitScrollPath(from, to);
  const scrollIndex = path.length === 1 ? 0 : progress * (path.length - 1);
  const translateY = path.length === 1 ? 0 : -(scrollIndex / path.length) * 100;

  return (
    <span className={liquidationDigitSlotClass} aria-hidden>
      <span className={liquidationDigitScrollClass}>
        <span
          className={liquidationDigitTrackClass}
          style={{ transform: `translateY(${translateY}%)` }}
        >
          {path.map((digit, index) => (
            <span key={`${digit}-${index}`} className={liquidationDigitTrackSpanClass}>
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
}: {
  parts: LiquidationDigitParts;
  fromParts: LiquidationDigitParts;
  progress: number;
}) {
  return (
    <span className={liquidationOdometerClass}>
      <span className={liquidationOdometerPrefixClass}>{parts.prefix}</span>
      <span className={liquidationOdometerDigitsClass}>
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
            />
          );
        })}
        <span className={liquidationDecimalPointClass} aria-hidden>
          .
        </span>
        <DigitColumn
          fromDigit={fromParts.decimalDigit}
          toDigit={parts.decimalDigit}
          progress={progress}
          hidden={false}
        />
      </span>
      <span className={liquidationOdometerSuffixClass}>{parts.suffix}</span>
    </span>
  );
}

export function AnimatedLiquidationValue({ value, className = '' }: AnimatedLiquidationValueProps) {
  const targetAmount = parseLiquidationValue(value);
  const amountRef = useRef(targetAmount);
  const [fromParts, setFromParts] = useState(() => decomposeLiquidationAmount(targetAmount));
  const [toParts, setToParts] = useState(() => decomposeLiquidationAmount(targetAmount));
  const [suffix, setSuffix] = useState(toParts.suffix);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const fromAmount = amountRef.current;
    const toAmount = targetAmount;

    if (fromAmount === toAmount) {
      return;
    }

    const rawFrom = decomposeLiquidationAmount(fromAmount);
    const rawTo = decomposeLiquidationAmount(toAmount);
    const aligned = alignLiquidationDigitParts(rawFrom, rawTo);

    setFromParts(aligned.from);
    setToParts(aligned.to);
    setSuffix(aligned.suffix);

    if (prefersReducedMotion()) {
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
  }, [targetAmount]);

  const displayValue = formatLiquidationDisplay(targetAmount);
  const displayParts = { ...toParts, suffix };

  return (
    <span className={cn(className)} aria-label={displayValue}>
      <OdometerDisplay parts={displayParts} fromParts={fromParts} progress={progress} />
    </span>
  );
}
