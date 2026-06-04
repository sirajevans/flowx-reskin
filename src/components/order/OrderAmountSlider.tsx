import { useCallback, useMemo } from 'react';
import { PercentSlider } from '../ui/PercentSlider';
import type { OrderCurrency } from './types';
import {
  amountToEquityPercent,
  equityPercentToAmount,
  parseOrderStatAmount,
} from './orderUtils';

export type OrderAmountSliderProps = {
  amount: string;
  onAmountChange: (value: string) => void;
  equity?: string;
  price?: string;
  currency: OrderCurrency;
  className?: string;
};

/** Order panel slider: maps amount ↔ equity percent via {@link PercentSlider}. */
export function OrderAmountSlider({
  amount,
  onAmountChange,
  equity = '1,000.00 USDT',
  price = '0',
  currency,
  className,
}: OrderAmountSliderProps) {
  const equityValue = useMemo(() => parseOrderStatAmount(equity), [equity]);
  const priceValue = useMemo(() => parseOrderStatAmount(price), [price]);
  const disabled = equityValue <= 0;

  const percent = useMemo(
    () => amountToEquityPercent(amount, equityValue, currency, priceValue),
    [amount, equityValue, currency, priceValue],
  );

  const handlePercentChange = useCallback(
    (nextPercent: number) => {
      onAmountChange(equityPercentToAmount(nextPercent, equityValue, currency, priceValue));
    },
    [onAmountChange, equityValue, currency, priceValue],
  );

  return (
    <PercentSlider
      percent={percent}
      onPercentChange={handlePercentChange}
      ariaLabel="Order size as percentage of account equity"
      formatValueText={(value) => `${Math.round(value)}% of account`}
      formatTooltipText={(value) => `${Math.round(value)}%`}
      className={className}
      disabled={disabled}
    />
  );
}
