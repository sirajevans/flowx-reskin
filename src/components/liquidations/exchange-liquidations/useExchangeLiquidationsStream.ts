import { useCallback, useEffect, useState } from 'react';
import { tickExchangeLiquidations } from './exchangeLiquidationsSimulator';
import type { ExchangeLiquidationEntry } from './types';

export type UseExchangeLiquidationsStreamOptions = {
  enabled?: boolean;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  initialEntries: ExchangeLiquidationEntry[];
};

function randomInterval(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs);
}

export function useExchangeLiquidationsStream({
  enabled = true,
  minIntervalMs = 400,
  maxIntervalMs = 1000,
  initialEntries,
}: UseExchangeLiquidationsStreamOptions) {
  const [exchanges, setExchanges] = useState(initialEntries);

  const tick = useCallback(() => {
    setExchanges((prev) => tickExchangeLiquidations(prev));
  }, []);

  useEffect(() => {
    if (!enabled) return;

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

  return { exchanges };
}
