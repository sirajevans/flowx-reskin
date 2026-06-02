export type LiquidationTimeframe = '1h' | '4h' | '24h';

export type LiquidationSideStats = {
  percent: string;
  value: string;
};

export type LiquidationStats = {
  overall: string;
  shorts: LiquidationSideStats;
  longs: LiquidationSideStats;
};

export type LiquidationChartPoint = {
  label: string;
  shorts: number;
  longs: number;
};

export type LiquidationChartData = Record<LiquidationTimeframe, LiquidationChartPoint[]>;

export type LiquidationStatsByTimeframe = Record<LiquidationTimeframe, LiquidationStats>;

export type LiquidationsPanelProps = {
  className?: string;
  onClose?: () => void;
  timeframe?: LiquidationTimeframe;
  defaultTimeframe?: LiquidationTimeframe;
  onTimeframeChange?: (timeframe: LiquidationTimeframe) => void;
  statsByTimeframe?: LiquidationStatsByTimeframe;
};
