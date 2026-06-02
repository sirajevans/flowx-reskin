import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '../../lib/utils';
import {
  liquidationsSegmentBarClass,
  liquidationsSegmentBarSegmentClass,
} from './liquidationsSegmentBarClasses';

export type LiquidationsSegmentBarProps = {
  /** Longs share filled from the left (0–100). */
  fillPercent: number;
  segmentCount?: number;
  className?: string;
  'aria-label'?: string;
};

const MAX_ANIMATION_MS = 250;
const MAJORITY_THRESHOLD = 50;

function getFilledCount(fillPercent: number, segmentCount: number): number {
  const clamped = Math.min(100, Math.max(0, fillPercent));
  return Math.round((clamped / 100) * segmentCount);
}

function getAnimationStepCount(
  fromCount: number,
  toCount: number,
  fromThreshold: boolean,
  toThreshold: boolean,
  segmentCount: number,
): number {
  if (fromThreshold === toThreshold) {
    return Math.abs(toCount - fromCount);
  }

  if (fromThreshold) {
    return fromCount + (segmentCount - toCount);
  }

  return segmentCount - fromCount + toCount;
}

function isAboveThreshold(fillPercent: number): boolean {
  return fillPercent >= MAJORITY_THRESHOLD;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function LiquidationsSegmentBar({
  fillPercent,
  segmentCount = 80,
  className = '',
  'aria-label': ariaLabel = 'Liquidation distribution',
}: LiquidationsSegmentBarProps) {
  const targetFilledCount = getFilledCount(fillPercent, segmentCount);
  const targetAboveThreshold = isAboveThreshold(fillPercent);

  const [displayFilledCount, setDisplayFilledCount] = useState(targetFilledCount);
  const [displayAboveThreshold, setDisplayAboveThreshold] = useState(targetAboveThreshold);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepMs, setStepMs] = useState(0);

  const displayFilledRef = useRef(displayFilledCount);
  const displayThresholdRef = useRef(displayAboveThreshold);

  displayFilledRef.current = displayFilledCount;
  displayThresholdRef.current = displayAboveThreshold;

  useEffect(() => {
    const fromCount = displayFilledRef.current;
    const fromThreshold = displayThresholdRef.current;
    const toCount = targetFilledCount;
    const toThreshold = targetAboveThreshold;

    if (fromCount === toCount && fromThreshold === toThreshold) {
      return;
    }

    if (prefersReducedMotion()) {
      setDisplayFilledCount(toCount);
      setDisplayAboveThreshold(toThreshold);
      setIsAnimating(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    let elapsed = 0;

    const schedule = (fn: () => void, delayMs: number) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, delayMs),
      );
    };

    const totalSteps = getAnimationStepCount(
      fromCount,
      toCount,
      fromThreshold,
      toThreshold,
      segmentCount,
    );
    const intervalMs = totalSteps > 0 ? MAX_ANIMATION_MS / totalSteps : 0;

    setStepMs(intervalMs);
    setIsAnimating(true);

    const scheduleCount = (count: number) => {
      schedule(() => setDisplayFilledCount(count), elapsed);
      elapsed += intervalMs;
    };

    if (fromThreshold === toThreshold) {
      if (toCount > fromCount) {
        for (let i = fromCount + 1; i <= toCount; i += 1) {
          scheduleCount(i);
        }
      } else {
        for (let i = fromCount - 1; i >= toCount; i -= 1) {
          scheduleCount(i);
        }
      }
    } else if (fromThreshold) {
      for (let i = fromCount - 1; i >= 0; i -= 1) {
        scheduleCount(i);
      }
      schedule(() => {
        setDisplayAboveThreshold(false);
        setDisplayFilledCount(segmentCount);
      }, elapsed);
      elapsed += intervalMs;
      for (let i = segmentCount - 1; i >= toCount; i -= 1) {
        scheduleCount(i);
      }
    } else {
      for (let i = fromCount + 1; i <= segmentCount; i += 1) {
        scheduleCount(i);
      }
      schedule(() => {
        setDisplayAboveThreshold(true);
        setDisplayFilledCount(0);
      }, elapsed);
      elapsed += intervalMs;
      for (let i = 1; i <= toCount; i += 1) {
        scheduleCount(i);
      }
    }

    schedule(() => {
      setIsAnimating(false);
      setStepMs(0);
    }, elapsed);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      setIsAnimating(false);
      setStepMs(0);
    };
  }, [targetFilledCount, targetAboveThreshold, segmentCount]);

  return (
    <div
      className={cn(liquidationsSegmentBarClass, className)}
      data-above-threshold={displayAboveThreshold}
      data-animating={isAnimating}
      style={
        isAnimating
          ? ({ '--liquidations-step-ms': `${stepMs}ms` } as CSSProperties)
          : undefined
      }
      role="img"
      aria-label={ariaLabel}
    >
      {Array.from({ length: segmentCount }, (_, index) => (
        <span
          key={index}
          className={liquidationsSegmentBarSegmentClass}
          data-filled={index < displayFilledCount}
          aria-hidden
        />
      ))}
    </div>
  );
}

export { MAJORITY_THRESHOLD as LIQUIDATIONS_BAR_MAJORITY_THRESHOLD };
