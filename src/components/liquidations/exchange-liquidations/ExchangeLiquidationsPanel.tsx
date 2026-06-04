import { AnimatedLiquidationValue } from '../AnimatedLiquidationValue';
import { ExchangeLiquidationIcon } from '../../icons';
import { CardModule, cardModuleBodyGap18Class, cardModuleHeaderTextClass } from '../../ui';
import { cn } from '../../../lib/utils';
import { getComparisonBarWidths } from './comparisonBars';
import {
  exchangeLiquidationsAmountClass,
  exchangeLiquidationsAmountLongClass,
  exchangeLiquidationsAmountShortClass,
  exchangeLiquidationsBarBaseClass,
  exchangeLiquidationsBarLongClass,
  exchangeLiquidationsBarShortClass,
  exchangeLiquidationsBarsClass,
  exchangeLiquidationsExchangeClass,
  exchangeLiquidationsIconWrapClass,
  exchangeLiquidationsListClass,
  exchangeLiquidationsNameClass,
  exchangeLiquidationsPanelRootClass,
  exchangeLiquidationsRowClass,
  exchangeLiquidationsStatsClass,
} from './exchangeLiquidationsClasses';
import { DEFAULT_EXCHANGE_LIQUIDATIONS } from './mockData';
import type { ExchangeLiquidationEntry, ExchangeLiquidationsPanelProps } from './types';
import { useExchangeLiquidationsStream } from './useExchangeLiquidationsStream';

function ComparisonBars({ shorts, longs }: { shorts: string; longs: string }) {
  const { shortPx, longPx } = getComparisonBarWidths(shorts, longs);

  return (
    <div className={exchangeLiquidationsBarsClass} aria-hidden>
      <span
        className={cn(exchangeLiquidationsBarBaseClass, exchangeLiquidationsBarLongClass)}
        style={{ width: `${longPx}px` }}
      />
      <span
        className={cn(exchangeLiquidationsBarBaseClass, exchangeLiquidationsBarShortClass)}
        style={{ width: `${shortPx}px` }}
      />
    </div>
  );
}

function ExchangeRow({ entry }: { entry: ExchangeLiquidationEntry }) {
  return (
    <div className={exchangeLiquidationsRowClass}>
      <div className={exchangeLiquidationsExchangeClass}>
        <span className={exchangeLiquidationsIconWrapClass}>
          <ExchangeLiquidationIcon exchangeId={entry.id} />
        </span>
        <span className={exchangeLiquidationsNameClass}>{entry.name}</span>
      </div>
      <div className={exchangeLiquidationsStatsClass}>
        <AnimatedLiquidationValue
          value={entry.longs}
          className={cn(exchangeLiquidationsAmountClass, exchangeLiquidationsAmountLongClass)}
        />
        <ComparisonBars shorts={entry.shorts} longs={entry.longs} />
        <AnimatedLiquidationValue
          value={entry.shorts}
          className={cn(exchangeLiquidationsAmountClass, exchangeLiquidationsAmountShortClass)}
        />
      </div>
    </div>
  );
}

export function ExchangeLiquidationsPanel({
  className = '',
  onClose,
  exchanges: exchangesProp,
  simulateStream = true,
  streamMinIntervalMs = 400,
  streamMaxIntervalMs = 1000,
}: ExchangeLiquidationsPanelProps) {
  const initialExchanges = exchangesProp ?? DEFAULT_EXCHANGE_LIQUIDATIONS;

  const stream = useExchangeLiquidationsStream({
    enabled: simulateStream && exchangesProp === undefined,
    minIntervalMs: streamMinIntervalMs,
    maxIntervalMs: streamMaxIntervalMs,
    initialEntries: initialExchanges,
  });

  const exchanges =
    simulateStream && exchangesProp === undefined ? stream.exchanges : initialExchanges;

  return (
    <CardModule
      className={cn(exchangeLiquidationsPanelRootClass, className)}
      bodyClassName={cardModuleBodyGap18Class}
      ariaLabel="Exchange liquidations"
      onClose={onClose}
      header={<span className={cardModuleHeaderTextClass}>Exchange liq.</span>}
    >
      <div className={exchangeLiquidationsListClass}>
        {exchanges.map((entry) => (
          <ExchangeRow key={entry.id} entry={entry} />
        ))}
      </div>
    </CardModule>
  );
}
