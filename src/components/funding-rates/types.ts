export type FundingRatePoint = {
  label: string;
  rate: number;
};

export type FundingRateSeries = {
  id: string;
  exchange: string;
  color: string;
  points: FundingRatePoint[];
};

export type FundingRatesPanelProps = {
  className?: string;
  onClose?: () => void;
  series?: FundingRateSeries[];
};
