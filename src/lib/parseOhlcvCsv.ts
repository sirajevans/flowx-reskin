import type { CandlestickData, Time, UTCTimestamp } from 'lightweight-charts';

import btcusdt5mCsv from '../data/btcusdt_5m_2026-05.csv?raw';

export type ChartCandlePoint = CandlestickData<Time> & { volume: number };

export function parseOhlcvCsv(csv: string): ChartCandlePoint[] {
  const lines = csv.trim().split('\n');
  const points: ChartCandlePoint[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const [timestamp, open, high, low, close, volume] = line.split(',');
    if (!timestamp || !open || !high || !low || !close || !volume) continue;

    points.push({
      time: Math.floor(Date.parse(timestamp) / 1000) as UTCTimestamp,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume),
    });
  }

  return points;
}

export const BTCUSDT_5M_MAY_2026 = parseOhlcvCsv(btcusdt5mCsv);
