import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

const DEFAULT_INITIAL_DELAY_MS = 2500;
const DEFAULT_HOLD_MS = 2500;
const DEFAULT_TRANSITION_MS = 220;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export type AlternatingTextLabelProps = {
  labels: readonly [string, string];
  className?: string;
  initialDelayMs?: number;
  holdMs?: number;
  transitionMs?: number;
};

export function AlternatingTextLabel({
  labels,
  className,
  initialDelayMs = DEFAULT_INITIAL_DELAY_MS,
  holdMs = DEFAULT_HOLD_MS,
  transitionMs = DEFAULT_TRANSITION_MS,
}: AlternatingTextLabelProps) {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState<{
    outgoing: string;
    incoming: string;
  } | null>(null);
  const indexRef = useRef(0);
  const labelsRef = useRef(labels);

  labelsRef.current = labels;

  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    setTransition(null);

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let transitionTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const clearTimers = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      if (transitionTimeoutId !== undefined) {
        clearTimeout(transitionTimeoutId);
        transitionTimeoutId = undefined;
      }
    };

    const scheduleNext = (delayMs: number) => {
      if (cancelled) return;

      timeoutId = setTimeout(() => {
        if (cancelled) return;

        const currentLabels = labelsRef.current;
        const fromIndex = indexRef.current;
        const toIndex = (fromIndex + 1) % 2;
        const outgoing = currentLabels[fromIndex];
        const incoming = currentLabels[toIndex];

        const commit = () => {
          if (cancelled) return;
          indexRef.current = toIndex;
          setIndex(toIndex);
          setTransition(null);
          scheduleNext(holdMs);
        };

        if (prefersReducedMotion()) {
          commit();
          return;
        }

        setTransition({ outgoing, incoming });
        transitionTimeoutId = setTimeout(commit, transitionMs);
      }, delayMs);
    };

    scheduleNext(initialDelayMs);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [labels, initialDelayMs, holdMs, transitionMs]);

  const labelLayerClass =
    'absolute inset-0 flex items-center justify-center motion-reduce:animate-none';

  return (
    <span
      className={cn(
        'relative inline-flex h-4 items-center justify-center overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      {transition ? (
        <>
          <span className={cn(labelLayerClass, 'animate-order-side-label-out')}>
            {transition.outgoing}
          </span>
          <span className={cn(labelLayerClass, 'animate-order-side-label-in')}>
            {transition.incoming}
          </span>
        </>
      ) : (
        <span className="relative">{labels[index]}</span>
      )}
    </span>
  );
}
