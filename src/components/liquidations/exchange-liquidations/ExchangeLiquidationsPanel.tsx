import { AnimatedLiquidationValue } from '../AnimatedLiquidationValue';
import { ExchangeLiquidationIcon } from '../../icons';
import { CardModule } from '../../ui';
import { getComparisonBarWidths } from './comparisonBars';
import { DEFAULT_EXCHANGE_LIQUIDATIONS } from './mockData';
import './ExchangeLiquidationsPanel.css';
import type { ExchangeLiquidationEntry, ExchangeLiquidationsPanelProps } from './types';
import { useExchangeLiquidationsStream } from './useExchangeLiquidationsStream';

function ComparisonBars({ shorts, longs }: { shorts: string; longs: string }) {
  const { shortPx, longPx } = getComparisonBarWidths(shorts, longs);

  return (
    <div className="exchange-liquidations-panel__bars" aria-hidden>
      <span
        className="exchange-liquidations-panel__bar exchange-liquidations-panel__bar--short"
        style={{ width: `${shortPx}px` }}
      />
      <span
        className="exchange-liquidations-panel__bar exchange-liquidations-panel__bar--long"
        style={{ width: `${longPx}px` }}
      />
    </div>
  );
}

function ExchangeRow({ entry }: { entry: ExchangeLiquidationEntry }) {
  return (
    <div className="exchange-liquidations-panel__row">
      <div className="exchange-liquidations-panel__exchange">
        <span className="exchange-liquidations-panel__icon-wrap">
          <ExchangeLiquidationIcon exchangeId={entry.id} />
        </span>
        <span className="exchange-liquidations-panel__name">{entry.name}</span>
      </div>
      <div className="exchange-liquidations-panel__stats">
        <AnimatedLiquidationValue
          value={entry.shorts}
          className="exchange-liquidations-panel__amount exchange-liquidations-panel__amount--short"
        />
        <ComparisonBars shorts={entry.shorts} longs={entry.longs} />
        <AnimatedLiquidationValue
          value={entry.longs}
          className="exchange-liquidations-panel__amount exchange-liquidations-panel__amount--long"
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
      className={`exchange-liquidations-panel ${className}`.trim()}
      ariaLabel="Exchange liquidations"
      onClose={onClose}
      header={<span className="card-module__header-text">Exchange liq.</span>}
    >
      <div className="exchange-liquidations-panel__list">
        {exchanges.map((entry) => (
          <ExchangeRow key={entry.id} entry={entry} />
        ))}
      </div>
    </CardModule>
  );
}
