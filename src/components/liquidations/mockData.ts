import type { LiquidationChartData, LiquidationStats, LiquidationTimeframe } from './types';

export const DEFAULT_LIQUIDATION_STATS: LiquidationStats = {
  overall: '$198.6M',
  shorts: { percent: '7.2%', value: '$14.3M' },
  longs: { percent: '92.8%', value: '$184.3M' },
};

export const DEFAULT_LIQUIDATION_STATS_BY_TIMEFRAME: Record<LiquidationTimeframe, LiquidationStats> = {
  '1h': {
    overall: '$12.4M',
    shorts: { percent: '62.5%', value: '$7.8M' },
    longs: { percent: '37.5%', value: '$4.6M' },
  },
  '4h': {
    overall: '$48.2M',
    shorts: { percent: '11.3%', value: '$5.4M' },
    longs: { percent: '88.7%', value: '$42.8M' },
  },
  '24h': DEFAULT_LIQUIDATION_STATS,
};

export const DEFAULT_LIQUIDATION_CHART: LiquidationChartData = {
  '1h': [
    { label: '50m', shorts: 0.4, longs: 5.2 },
    { label: '45m', shorts: 0.6, longs: 8.1 },
    { label: '40m', shorts: 0.3, longs: 4.6 },
    { label: '35m', shorts: 0.9, longs: 11.3 },
    { label: '30m', shorts: 0.5, longs: 6.8 },
    { label: '25m', shorts: 0.7, longs: 9.4 },
    { label: '20m', shorts: 0.2, longs: 3.9 },
    { label: '15m', shorts: 1.1, longs: 14.2 },
    { label: '10m', shorts: 0.8, longs: 10.5 },
    { label: '5m', shorts: 0.4, longs: 5.7 },
    { label: 'Now', shorts: 0.6, longs: 7.8 },
  ],
  '4h': [
    { label: '3h30m', shorts: 1.2, longs: 16.4 },
    { label: '3h', shorts: 0.9, longs: 12.8 },
    { label: '2h30m', shorts: 1.4, longs: 19.6 },
    { label: '2h', shorts: 0.7, longs: 10.2 },
    { label: '1h30m', shorts: 1.8, longs: 24.1 },
    { label: '1h', shorts: 1.1, longs: 15.3 },
    { label: '30m', shorts: 0.8, longs: 11.7 },
    { label: 'Now', shorts: 1.3, longs: 18.9 },
  ],
  '24h': [
    { label: '00:00', shorts: 0.5, longs: 8.2 },
    { label: '04:00', shorts: 0.8, longs: 12.4 },
    { label: '08:00', shorts: 1.2, longs: 18.6 },
    { label: '12:00', shorts: 2.1, longs: 28.3 },
    { label: '16:00', shorts: 1.6, longs: 22.7 },
    { label: '20:00', shorts: 0.9, longs: 14.1 },
    { label: 'Now', shorts: 1.1, longs: 17.5 },
  ],
};
