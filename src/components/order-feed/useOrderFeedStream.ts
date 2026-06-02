import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createSimulatedOrderFeedEntry,
  getReferencePriceFromEntries,
} from './orderFeedSimulator';
import { ROW_ENTER_MS } from './orderFeedUtils';
import type { OrderFeedEntry } from './types';

export type UseOrderFeedStreamOptions = {
  enabled?: boolean;
  maxRows?: number;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  initialLeft: OrderFeedEntry[];
  initialRight: OrderFeedEntry[];
};

function randomInterval(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs);
}

export function useOrderFeedStream({
  enabled = true,
  maxRows = 16,
  minIntervalMs = 66,
  maxIntervalMs = 207,
  initialLeft,
  initialRight,
}: UseOrderFeedStreamOptions) {
  const [leftColumn, setLeftColumn] = useState(initialLeft);
  const [rightColumn, setRightColumn] = useState(initialRight);
  const [newEntryIds, setNewEntryIds] = useState<ReadonlySet<string>>(() => new Set());
  const leftRef = useRef(leftColumn);
  const rightRef = useRef(rightColumn);

  leftRef.current = leftColumn;
  rightRef.current = rightColumn;

  const markEntryNew = useCallback((id: string) => {
    setNewEntryIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setNewEntryIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, ROW_ENTER_MS);
  }, []);

  const pushEntry = useCallback(
    (column: 'left' | 'right') => {
      const left = leftRef.current;
      const right = rightRef.current;
      const reference = getReferencePriceFromEntries(
        column === 'left' ? left : right.length > 0 ? right : left,
      );
      const entry = createSimulatedOrderFeedEntry(reference);
      markEntryNew(entry.id);

      if (column === 'left') {
        setLeftColumn((prev) => [entry, ...prev].slice(0, maxRows));
      } else {
        setRightColumn((prev) => [entry, ...prev].slice(0, maxRows));
      }
    },
    [markEntryNew, maxRows],
  );

  useEffect(() => {
    if (!enabled) return;

    let timeoutId = 0;

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        pushEntry(Math.random() < 0.5 ? 'left' : 'right');
        schedule();
      }, randomInterval(minIntervalMs, maxIntervalMs));
    };

    schedule();

    return () => window.clearTimeout(timeoutId);
  }, [enabled, minIntervalMs, maxIntervalMs, pushEntry]);

  return { leftColumn, rightColumn, newEntryIds };
}
