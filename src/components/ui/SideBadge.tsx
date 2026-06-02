import type { PositionSide } from '../positions/types';

export type SideBadgeProps = {
  side: PositionSide;
};

export function SideBadge({ side }: SideBadgeProps) {
  const isBuy = side === 'buy';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-[5px] py-0.5 text-label-sm leading-[14px] font-medium uppercase ${
        isBuy ? 'bg-buy-5 text-buy' : 'bg-sell-5 text-sell'
      }`}
    >
      {isBuy ? 'BUY' : 'SELL'}
    </span>
  );
}
