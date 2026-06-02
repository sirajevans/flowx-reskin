import { useCallback, useEffect, useState } from 'react';
import { tickMoneyFlowTier } from './moneyFlowSimulator';
import type { MoneyFlowTier } from './types';

export type UseMoneyFlowStreamOptions = {
  enabled?: boolean;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  initialTiers: MoneyFlowTier[];
};

function randomInterval(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs);
}

export function useMoneyFlowStream({
  enabled = true,
  minIntervalMs = 500,
  maxIntervalMs = 1200,
  initialTiers,
}: UseMoneyFlowStreamOptions) {
  const [tiers, setTiers] = useState(initialTiers);

  const tick = useCallback(() => {
    setTiers((prev) => prev.map((tier) => tickMoneyFlowTier(tier)));
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

  return { tiers };
}
