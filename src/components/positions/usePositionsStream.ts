import { useCallback, useEffect, useState } from 'react';
import { tickPositionRows } from './positionsSimulator';
import type { PositionRow } from './types';

export type UsePositionsStreamOptions = {
  enabled?: boolean;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  initialRows: PositionRow[];
};

function randomInterval(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs);
}

export function usePositionsStream({
  enabled = true,
  minIntervalMs = 400,
  maxIntervalMs = 1000,
  initialRows,
}: UsePositionsStreamOptions) {
  const [rows, setRows] = useState(initialRows);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const tick = useCallback(() => {
    setRows((prev) => tickPositionRows(prev));
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let timeoutId = 0;

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        tick();
        schedule();
      }, randomInterval(minIntervalMs, maxIntervalMs));
    };

    schedule();

    return () => window.clearTimeout(timeoutId);
  }, [enabled, minIntervalMs, maxIntervalMs, tick]);

  return { rows };
}
