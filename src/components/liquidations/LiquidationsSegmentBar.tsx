import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './LiquidationsSegmentBar.css';

export type LiquidationsSegmentBarProps = {
  /** Longs share filled from the left (0–100). */
  fillPercent: number;
  /** True when longs dollar value is strictly greater than shorts. */
  longsDominate: boolean;
  segmentCount?: number;
  className?: string;
  'aria-label'?: string;
};

const MAX_ANIMATION_MS = 150;

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
    // Longs → shorts: drain filled-side color, then reveal unfilled-side color from the right.
    return fromCount + (segmentCount - toCount);
  }

  // Shorts → longs: drain unfilled-side color, then reveal filled-side color from the left.
  return segmentCount - fromCount + toCount;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function LiquidationsSegmentBar({
  fillPercent,
  longsDominate,
  segmentCount = 80,
  className = '',
  'aria-label': ariaLabel = 'Liquidation distribution',
}: LiquidationsSegmentBarProps) {
  const targetFilledCount = getFilledCount(fillPercent, segmentCount);
  const targetLongsDominate = longsDominate;

  const [displayFilledCount, setDisplayFilledCount] = useState(targetFilledCount);
  const [displayLongsDominate, setDisplayLongsDominate] = useState(targetLongsDominate);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepMs, setStepMs] = useState(0);

  const displayFilledRef = useRef(displayFilledCount);
  const displayLongsDominateRef = useRef(displayLongsDominate);

  displayFilledRef.current = displayFilledCount;
  displayLongsDominateRef.current = displayLongsDominate;

  useEffect(() => {
    const fromCount = displayFilledRef.current;
    const fromLongsDominate = displayLongsDominateRef.current;
    const toCount = targetFilledCount;
    const toLongsDominate = targetLongsDominate;

    if (fromCount === toCount && fromLongsDominate === toLongsDominate) {
      return;
    }

    if (prefersReducedMotion()) {
      setDisplayFilledCount(toCount);
      setDisplayLongsDominate(toLongsDominate);
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
      fromLongsDominate,
      toLongsDominate,
      segmentCount,
    );
    const intervalMs = totalSteps > 0 ? MAX_ANIMATION_MS / totalSteps : 0;

    setStepMs(intervalMs);
    setIsAnimating(true);

    const scheduleCount = (count: number) => {
      schedule(() => setDisplayFilledCount(count), elapsed);
      elapsed += intervalMs;
    };

    if (fromLongsDominate === toLongsDominate) {
      // Same dominance mode — step directly toward target
      if (toCount > fromCount) {
        for (let i = fromCount + 1; i <= toCount; i += 1) {
          scheduleCount(i);
        }
      } else {
        for (let i = fromCount - 1; i >= toCount; i -= 1) {
          scheduleCount(i);
        }
      }
    } else if (fromLongsDominate) {
      // Longs → shorts: drain red (filled) to zero, flip, then reveal green from the right.
      for (let i = fromCount - 1; i >= 0; i -= 1) {
        scheduleCount(i);
      }
      schedule(() => {
        setDisplayLongsDominate(false);
        setDisplayFilledCount(segmentCount);
      }, elapsed);
      elapsed += intervalMs;
      for (let i = segmentCount - 1; i >= toCount; i -= 1) {
        scheduleCount(i);
      }
    } else {
      // Shorts → longs: drain green (unfilled) to zero, flip, then reveal red from the left.
      for (let i = fromCount + 1; i <= segmentCount; i += 1) {
        scheduleCount(i);
      }
      schedule(() => {
        setDisplayLongsDominate(true);
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
  }, [targetFilledCount, targetLongsDominate, segmentCount]);

  return (
    <div
      className={`liquidations-segment-bar ${className}`.trim()}
      data-longs-dominate={displayLongsDominate}
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
          className="liquidations-segment-bar__segment"
          data-filled={index < displayFilledCount}
          aria-hidden
        />
      ))}
    </div>
  );
}

