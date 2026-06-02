import { Fragment } from 'react';
import { MoneyFlowBearishIcon, MoneyFlowBullishIcon } from '../icons';
import { CardModule } from '../ui';
import { MoneyFlowChart } from './MoneyFlowChart';
import { DEFAULT_MONEY_FLOW_TIERS } from './mockData';
import './MoneyFlowPanel.css';
import type { MoneyFlowPanelProps, MoneyFlowSentiment, MoneyFlowTier } from './types';
import { useMoneyFlowStream } from './useMoneyFlowStream';

function SentimentIcon({ sentiment }: { sentiment: MoneyFlowSentiment }) {
  if (sentiment === 'very_bullish' || sentiment === 'bullish') {
    return <MoneyFlowBullishIcon />;
  }

  if (sentiment === 'bearish') {
    return <MoneyFlowBearishIcon />;
  }

  return null;
}

function MoneyFlowTierSection({ tier }: { tier: MoneyFlowTier }) {
  return (
    <section className="money-flow-panel__tier" aria-label={tier.rangeLabel}>
      <MoneyFlowChart values={tier.series} ariaLabel={`${tier.rangeLabel} flow chart`} />
      <div className="money-flow-panel__tier-footer">
        <span className="money-flow-panel__tier-label">{tier.rangeLabel}</span>
        <div className="money-flow-panel__tier-row">
          <div className="money-flow-panel__sentiment">
            <span className="money-flow-panel__sentiment-label">{tier.sentimentLabel}</span>
            <SentimentIcon sentiment={tier.sentiment} />
          </div>
          <span className="money-flow-panel__amount">{tier.amount}</span>
        </div>
      </div>
    </section>
  );
}

export function MoneyFlowPanel({
  className = '',
  onClose,
  tiers: tiersProp,
  simulateStream = true,
  streamMinIntervalMs = 500,
  streamMaxIntervalMs = 1200,
}: MoneyFlowPanelProps) {
  const initialTiers = tiersProp ?? DEFAULT_MONEY_FLOW_TIERS;

  const stream = useMoneyFlowStream({
    enabled: simulateStream && tiersProp === undefined,
    minIntervalMs: streamMinIntervalMs,
    maxIntervalMs: streamMaxIntervalMs,
    initialTiers,
  });

  const tiers =
    simulateStream && tiersProp === undefined ? stream.tiers : initialTiers;

  return (
    <CardModule
      className={`money-flow-panel ${className}`.trim()}
      ariaLabel="Money flow"
      onClose={onClose}
      header={<span className="card-module__header-text">Money flow</span>}
    >
      {tiers.map((tier, index) => (
        <Fragment key={tier.id}>
          {index > 0 ? <hr className="money-flow-panel__divider" aria-hidden /> : null}
          <MoneyFlowTierSection tier={tier} />
        </Fragment>
      ))}
    </CardModule>
  );
}
