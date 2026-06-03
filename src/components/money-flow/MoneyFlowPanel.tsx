import { Fragment } from 'react';
import { MoneyFlowBearishIcon, MoneyFlowBullishIcon, MoneyFlowNeutralIcon } from '../icons';
import {
  CardModule,
  cardModuleBodyGap18Class,
  cardModuleHeaderTextClass,
} from '../ui';
import { cn } from '../../lib/utils';
import { MoneyFlowChart } from './MoneyFlowChart';
import {
  moneyFlowAmountClass,
  moneyFlowDividerClass,
  moneyFlowPanelRootClass,
  moneyFlowSentimentClass,
  moneyFlowSentimentLabelClass,
  moneyFlowTierClass,
  moneyFlowTierFooterClass,
  moneyFlowTierLabelClass,
  moneyFlowTierRowClass,
} from './moneyFlowClasses';
import { DEFAULT_MONEY_FLOW_TIERS } from './mockData';
import type { MoneyFlowPanelProps, MoneyFlowSentiment, MoneyFlowTier } from './types';
import { useMoneyFlowStream } from './useMoneyFlowStream';

function SentimentIcon({ sentiment }: { sentiment: MoneyFlowSentiment }) {
  if (sentiment === 'very_bullish' || sentiment === 'bullish') {
    return <MoneyFlowBullishIcon />;
  }

  if (sentiment === 'bearish') {
    return <MoneyFlowBearishIcon />;
  }

  if (sentiment === 'neutral') {
    return <MoneyFlowNeutralIcon />;
  }

  return null;
}

function MoneyFlowTierSection({ tier }: { tier: MoneyFlowTier }) {
  return (
    <section className={moneyFlowTierClass} aria-label={tier.rangeLabel}>
      <MoneyFlowChart values={tier.series} ariaLabel={`${tier.rangeLabel} flow chart`} />
      <div className={moneyFlowTierFooterClass}>
        <span className={moneyFlowTierLabelClass}>{tier.rangeLabel}</span>
        <div className={moneyFlowTierRowClass}>
          <div className={moneyFlowSentimentClass}>
            <span className={moneyFlowSentimentLabelClass}>{tier.sentimentLabel}</span>
            <SentimentIcon sentiment={tier.sentiment} />
          </div>
          <span className={moneyFlowAmountClass}>{tier.amount}</span>
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
      className={cn(moneyFlowPanelRootClass, className)}
      bodyClassName={cardModuleBodyGap18Class}
      ariaLabel="Money flow"
      onClose={onClose}
      header={<span className={cardModuleHeaderTextClass}>Money flow</span>}
    >
      {tiers.map((tier, index) => (
        <Fragment key={tier.id}>
          {index > 0 ? <hr className={moneyFlowDividerClass} aria-hidden /> : null}
          <MoneyFlowTierSection tier={tier} />
        </Fragment>
      ))}
    </CardModule>
  );
}
