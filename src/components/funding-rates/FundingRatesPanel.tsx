import {
  useEffect,
  useState,
} from 'react';
import {
  CardModule,
  cardModuleBodyFlexFillClass,
  cardModuleHeaderTextClass,
} from '../ui';
import { cn } from '../../lib/utils';
import { DEFAULT_FUNDING_RATE_SERIES } from './mockData';
import { FundingRatesChart } from './FundingRatesChart';
import {
  fundingRatesPanelBodyClass,
  fundingRatesPanelLegendClass,
  fundingRatesPanelLegendItemClass,
  fundingRatesPanelLegendLabelClass,
  fundingRatesPanelLegendRowClass,
  fundingRatesPanelLegendSwatchClass,
  fundingRatesPanelLegendValueClass,
  fundingRatesPanelRootClass,
} from './fundingRatesClasses';
import type { FundingRatesPanelProps } from './types';

function formatFundingRate(rate: number) {
  return `${rate.toFixed(4)}%`;
}

function getFundingRateColor(rate: number) {
  return rate < 0 ? '#f23645' : '#06b470';
}

export function FundingRatesPanel({
  className = '',
  onClose,
  series = DEFAULT_FUNDING_RATE_SERIES,
}: FundingRatesPanelProps) {
  const [selectedExchangeId, setSelectedExchangeId] = useState(series[0]?.id ?? '');

  useEffect(() => {
    if (series.some((exchange) => exchange.id === selectedExchangeId)) return;
    setSelectedExchangeId(series[0]?.id ?? '');
  }, [selectedExchangeId, series]);

  const activeSeries =
    series.find((exchange) => exchange.id === selectedExchangeId) ?? series[0];

  return (
    <CardModule
      className={cn(fundingRatesPanelRootClass, className)}
      bodyClassName={cn(cardModuleBodyFlexFillClass, fundingRatesPanelBodyClass)}
      ariaLabel="Funding rates"
      onClose={onClose}
      header={<span className={cardModuleHeaderTextClass}>Funding rates</span>}
    >
      {activeSeries ? (
        <FundingRatesChart
          series={series}
          selectedExchangeId={activeSeries.id}
        />
      ) : null}
      <ul className={fundingRatesPanelLegendClass} aria-label="Funding rate legend">
        {series.map((exchange) => {
          const latestRate = exchange.points[exchange.points.length - 1]?.rate ?? 0;
          const isSelected = exchange.id === activeSeries?.id;
          const fundingRateColor = getFundingRateColor(latestRate);

          return (
            <li key={exchange.id}>
              <button
                type="button"
                className={fundingRatesPanelLegendItemClass}
                data-selected={isSelected || undefined}
                aria-pressed={isSelected}
                onClick={() => setSelectedExchangeId(exchange.id)}
              >
                <div className={fundingRatesPanelLegendRowClass}>
                  <span
                    className={fundingRatesPanelLegendSwatchClass}
                    style={{ backgroundColor: fundingRateColor }}
                    aria-hidden
                  />
                  <span className={fundingRatesPanelLegendLabelClass}>{exchange.exchange}</span>
                </div>
                <span
                  className={cn(
                    fundingRatesPanelLegendValueClass,
                    latestRate < 0 ? 'text-[#f23645]' : 'text-[#06b470]',
                  )}
                >
                  {formatFundingRate(latestRate)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </CardModule>
  );
}
