import { cn } from '../../lib/utils';
import {
  orderPanelStatLabelClass,
  orderPanelStatLabelRightClass,
  orderPanelStatPairClass,
  orderPanelStatPairRightClass,
  orderPanelStatValueClass,
  orderPanelStatValueRightClass,
  orderPanelStatsRootClass,
  orderPanelStatsRowClass,
} from './orderPanelClasses';

export type OrderPanelStatsProps = {
  equity?: string;
  liqPrice?: string;
  max?: string;
  rrRatio?: string;
  cost?: string;
  margin?: string;
};

function StatPair({
  label,
  value,
  align = 'left',
}: {
  label: string;
  value: string;
  align?: 'left' | 'right';
}) {
  const isRight = align === 'right';

  return (
    <div className={cn(orderPanelStatPairClass, isRight && orderPanelStatPairRightClass)}>
      <span className={cn(orderPanelStatLabelClass, isRight && orderPanelStatLabelRightClass)}>
        {label}
      </span>
      <span className={cn(orderPanelStatValueClass, isRight && orderPanelStatValueRightClass)}>
        {value}
      </span>
    </div>
  );
}

function StatsRow({
  left,
  right,
}: {
  left: { label: string; value: string };
  right: { label: string; value: string };
}) {
  return (
    <div className={orderPanelStatsRowClass}>
      <StatPair label={left.label} value={left.value} />
      <StatPair label={right.label} value={right.value} align="right" />
    </div>
  );
}

export function OrderPanelStats({
  equity = '1,000.00 USDT',
  liqPrice = '25.00 USDT',
  max = '50 USDT',
  rrRatio = '1:3.5',
  cost = '10.00 USDT',
  margin = '20%',
}: OrderPanelStatsProps) {
  return (
    <div className={orderPanelStatsRootClass}>
      <StatsRow
        left={{ label: 'EQUITY', value: equity }}
        right={{ label: 'RR RATIO', value: rrRatio }}
      />
      <StatsRow
        left={{ label: 'LIQ. PRICE', value: liqPrice }}
        right={{ label: 'COST', value: cost }}
      />
      <StatsRow
        left={{ label: 'MAX', value: max }}
        right={{ label: 'MARGIN', value: margin }}
      />
    </div>
  );
}
