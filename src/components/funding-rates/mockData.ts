import type { FundingRateSeries } from './types';

const STEP_MINUTES = 10;
const TOTAL_HOURS = 12;
const START_HOUR_UTC = 4;
const TOTAL_POINTS = (TOTAL_HOURS * 60) / STEP_MINUTES + 1;
const MICRO_PATTERN = [
  0.18,
  -0.24,
  0.11,
  0.26,
  -0.17,
  0.08,
  -0.14,
  0.2,
  -0.09,
  0.14,
  -0.19,
  0.07,
] as const;

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio;
}

function formatUtcTime(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function buildTimeLabels() {
  return Array.from({ length: TOTAL_POINTS }, (_, index) =>
    formatUtcTime(START_HOUR_UTC * 60 + index * STEP_MINUTES),
  );
}

const LAST_12H_LABELS = buildTimeLabels();

function roundRate(rate: number) {
  return Number(rate.toFixed(6));
}

function buildVolatileSegment(
  start: number,
  end: number,
  points: number,
  amplitude: number,
  phase: number,
  primaryCycles: number,
  secondaryCycles: number,
) {
  return Array.from({ length: points }, (_, index) => {
    if (index === 0) return roundRate(start);
    if (index === points - 1) return roundRate(end);

    const ratio = index / (points - 1);
    const baseline = lerp(start, end, ratio);
    const envelope = 0.24 + Math.sin(Math.PI * ratio) * 0.76;
    const primaryWave =
      Math.sin(ratio * Math.PI * 2 * primaryCycles + phase) * amplitude;
    const secondaryWave =
      Math.sin(ratio * Math.PI * 2 * secondaryCycles + phase * 1.7) *
      amplitude *
      0.52;
    const tertiaryWave =
      Math.sin(ratio * Math.PI * 2 * (secondaryCycles * 1.85) + phase * 0.6) *
      amplitude *
      0.22;
    const microJitter =
      MICRO_PATTERN[index % MICRO_PATTERN.length] * amplitude * 0.34;

    return roundRate(
      baseline + (primaryWave + secondaryWave + tertiaryWave + microJitter) * envelope,
    );
  });
}

function buildLiveSampleRates(
  at00Utc: number,
  at08Utc: number,
  at16Utc: number,
  amplitude: number,
  phase: number,
  primaryCycles: number,
  secondaryCycles: number,
) {
  const at04Utc = lerp(at00Utc, at08Utc, 0.5);
  const earlierSegment = buildVolatileSegment(
    at04Utc,
    at08Utc,
    25,
    amplitude * 0.82,
    phase * 0.92,
    Math.max(primaryCycles - 0.6, 1.8),
    Math.max(secondaryCycles - 1.2, 4.8),
  );
  const latestSegment = buildVolatileSegment(
    at08Utc,
    at16Utc,
    49,
    amplitude,
    phase,
    primaryCycles,
    secondaryCycles,
  );

  return [...earlierSegment.slice(0, -1), ...latestSegment];
}

function buildSeries(
  id: string,
  exchange: string,
  color: string,
  rates: number[],
): FundingRateSeries {
  return {
    id,
    exchange,
    color,
    points: LAST_12H_LABELS.map((label, index) => ({
      label,
      rate: rates[index] ?? 0,
    })),
  };
}

export const DEFAULT_FUNDING_RATE_SERIES: FundingRateSeries[] = [
  // Sample paths are anchored to BTC funding settlements fetched on 2026-06-19.
  buildSeries('binance', 'Binance', '#f0b90b', [
    ...buildLiveSampleRates(0.006039, 0.001984, 0.002823, 0.00066, 0.5, 2.8, 8.6),
  ]),
  buildSeries('blofin', 'Blofin', '#06b470', [
    ...buildLiveSampleRates(0.0052, -0.0032, -0.0058, 0.00092, 1.25, 3.1, 9.4),
  ]),
  buildSeries('bybit', 'Bybit', '#5da8ff', [
    ...buildLiveSampleRates(-0.00469, -0.003489, -0.005782, 0.00084, 2.05, 3.4, 10.2),
  ]),
  buildSeries('okx', 'OKX', '#ff6b9a', [
    ...buildLiveSampleRates(0.000134, 0.003245, -0.000499, 0.00074, 2.7, 2.9, 8.9),
  ]),
];
