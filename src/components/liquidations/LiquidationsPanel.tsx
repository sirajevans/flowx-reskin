import { useState } from 'react';
import {
  CardModule,
  cardModuleBodyGap18Class,
  cardModuleHeaderTextClass,
} from '../ui';
import { cn } from '../../lib/utils';
import { DEFAULT_LIQUIDATION_STATS_BY_TIMEFRAME } from './mockData';
import { AnimatedLiquidationValue } from './AnimatedLiquidationValue';
import { LiquidationsSegmentBar } from './LiquidationsSegmentBar';
import {
  liquidationsPanelRootClass,
  liquidationsPanelRowClass,
  liquidationsPanelStatClass,
  liquidationsPanelStatLabelClass,
  liquidationsPanelStatLabelRightClass,
  liquidationsPanelStatRightClass,
  liquidationsPanelStatValueClass,
  liquidationsPanelStatValueDefaultClass,
  liquidationsPanelStatValueNegativeClass,
  liquidationsPanelStatValuePositiveClass,
  liquidationsPanelStatValueRightClass,
  liquidationsPanelTimeframeBtnClass,
  liquidationsPanelTimeframeClass,
} from './liquidationsPanelClasses';
import { getShortsSharePercent, longsLiquidationsDominate, shortsLiquidationsDominate } from './utils';
import type {
  LiquidationSideStats,
  LiquidationsPanelProps,
  LiquidationTimeframe,
} from './types';

const TIMEFRAMES: { id: LiquidationTimeframe; label: string }[] = [
  { id: '1h', label: '1h' },
  { id: '4h', label: '4h' },
  { id: '24h', label: '24h' },
];

function StatBlock({
  label,
  value,
  align = 'left',
  valueTone = 'default',
}: {
  label: string;
  value: string;
  align?: 'left' | 'right';
  valueTone?: 'default' | 'positive' | 'negative';
}) {
  const isRight = align === 'right';

  return (
    <div className={cn(liquidationsPanelStatClass, isRight && liquidationsPanelStatRightClass)}>
      <span
        className={cn(
          liquidationsPanelStatLabelClass,
          isRight && liquidationsPanelStatLabelRightClass,
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          liquidationsPanelStatValueClass,
          isRight && liquidationsPanelStatValueRightClass,
          valueTone === 'positive'
            ? liquidationsPanelStatValuePositiveClass
            : valueTone === 'negative'
              ? liquidationsPanelStatValueNegativeClass
              : liquidationsPanelStatValueDefaultClass,
        )}
      >
        <AnimatedLiquidationValue value={value} />
      </span>
    </div>
  );
}

function TimeframeToggle({
  value,
  onChange,
}: {
  value: LiquidationTimeframe;
  onChange: (timeframe: LiquidationTimeframe) => void;
}) {
  return (
    <div className={liquidationsPanelTimeframeClass} role="group" aria-label="Time range">
      {TIMEFRAMES.map((timeframe) => (
        <button
          key={timeframe.id}
          type="button"
          className={liquidationsPanelTimeframeBtnClass}
          data-selected={value === timeframe.id}
          aria-pressed={value === timeframe.id}
          onClick={() => onChange(timeframe.id)}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
}

function formatSideLabel(side: 'SHORTS' | 'LONGS', stats: LiquidationSideStats): string {
  return `${side} · ${stats.percent}`;
}

export function LiquidationsPanel({
  className = '',
  onClose,
  timeframe: timeframeProp,
  defaultTimeframe = '24h',
  onTimeframeChange,
  statsByTimeframe = DEFAULT_LIQUIDATION_STATS_BY_TIMEFRAME,
}: LiquidationsPanelProps) {
  const [internalTimeframe, setInternalTimeframe] = useState<LiquidationTimeframe>(defaultTimeframe);
  const timeframe = timeframeProp ?? internalTimeframe;
  const stats =
    statsByTimeframe[timeframe] ??
    DEFAULT_LIQUIDATION_STATS_BY_TIMEFRAME[timeframe] ??
    DEFAULT_LIQUIDATION_STATS_BY_TIMEFRAME['24h'];
  const barFillPercent = getShortsSharePercent(
    stats.longs.value,
    stats.shorts.value,
    stats.shorts.percent,
  );
  const longsDominate = longsLiquidationsDominate(stats.longs.value, stats.shorts.value);
  const shortsDominate = shortsLiquidationsDominate(stats.longs.value, stats.shorts.value);

  const handleTimeframeChange = (next: LiquidationTimeframe) => {
    if (timeframeProp === undefined) {
      setInternalTimeframe(next);
    }
    onTimeframeChange?.(next);
  };

  return (
    <CardModule
      className={cn(liquidationsPanelRootClass, className)}
      bodyClassName={cardModuleBodyGap18Class}
      ariaLabel="Liquidations"
      onClose={onClose}
      header={<span className={cardModuleHeaderTextClass}>Liquidations</span>}
    >
      <div className={liquidationsPanelRowClass}>
        <StatBlock label="OVERALL" value={stats.overall} />
        <TimeframeToggle value={timeframe} onChange={handleTimeframeChange} />
      </div>

      <div className={liquidationsPanelRowClass}>
        <StatBlock
          label={formatSideLabel('SHORTS', stats.shorts)}
          value={stats.shorts.value}
          valueTone={shortsDominate ? 'positive' : 'default'}
        />
        <StatBlock
          label={formatSideLabel('LONGS', stats.longs)}
          value={stats.longs.value}
          align="right"
          valueTone={longsDominate ? 'negative' : 'default'}
        />
      </div>

      <LiquidationsSegmentBar
        fillPercent={barFillPercent}
        aria-label={`Long liquidations ${stats.longs.percent}, short liquidations ${stats.shorts.percent}`}
      />
    </CardModule>
  );
}
