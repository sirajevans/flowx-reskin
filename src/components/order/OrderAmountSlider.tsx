import { useCallback, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import {
  orderPanelAmountSliderInputClass,
  orderPanelAmountSliderRailBaseClass,
  orderPanelAmountSliderRailFillClass,
  orderPanelAmountSliderRailFillClipClass,
  orderPanelAmountSliderRailFillGradient,
  orderPanelAmountSliderRailGradient,
  orderPanelAmountSliderRailWrapClass,
  orderPanelAmountSliderRootClass,
  orderPanelAmountSliderThumbClass,
  orderPanelAmountSliderThumbInsetPx,
} from './orderPanelClasses';
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

/** Thumb center travels inset → (width − inset); edges sit ~9px inside at 0/100%. */
function thumbCenterLeftStyle(percent: number): string {
  const inset = orderPanelAmountSliderThumbInsetPx;
  const travel = `(100% - ${inset * 2}px)`;
  return `calc(${inset}px + ${travel} * ${percent / 100})`;
}

function railFillClipStyle(percent: number): { width: string; display?: string } {
  if (percent <= 0) return { width: '0', display: 'none' };
  if (percent >= 100) return { width: '100%' };
  return { width: thumbCenterLeftStyle(percent) };
}

function railFillInnerStyle(percent: number): { width: string } {
  if (percent <= 0) return { width: '0' };
  if (percent >= 100) return { width: '100%' };
  return { width: `calc(100% / ${percent / 100})` };
}

export function OrderAmountSlider({
  amount,
  onAmountChange,
  equity = '1,000.00 USDT',
  price = '0',
  currency,
  className,
}: OrderAmountSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const equityValue = useMemo(() => parseOrderStatAmount(equity), [equity]);
  const priceValue = useMemo(() => parseOrderStatAmount(price), [price]);

  const [dragging, setDragging] = useState(false);

  const percent = useMemo(
    () => amountToEquityPercent(amount, equityValue, currency, priceValue),
    [amount, equityValue, currency, priceValue],
  );

  const applyPercent = useCallback(
    (nextPercent: number) => {
      onAmountChange(equityPercentToAmount(nextPercent, equityValue, currency, priceValue));
    },
    [onAmountChange, equityValue, currency, priceValue],
  );

  const percentFromClientX = useCallback((clientX: number) => {
    const root = rootRef.current;
    if (!root) return 0;
    const { left, width } = root.getBoundingClientRect();
    const inset = orderPanelAmountSliderThumbInsetPx;
    const minCenter = inset;
    const maxCenter = width - inset;
    const travel = maxCenter - minCenter;
    if (travel <= 0) return 0;
    const x = clientX - left;
    const clamped = Math.min(maxCenter, Math.max(minCenter, x));
    return ((clamped - minCenter) / travel) * 100;
  }, []);

  const endDrag = useCallback(() => setDragging(false), []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || equityValue <= 0) return;
    event.preventDefault();
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    applyPercent(percentFromClientX(event.clientX));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    applyPercent(percentFromClientX(event.clientX));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endDrag();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (equityValue <= 0) return;
    let next = percent;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, percent - 1);
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(100, percent + 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    else return;
    event.preventDefault();
    applyPercent(next);
  };

  return (
    <div
      ref={rootRef}
      role="slider"
      tabIndex={equityValue <= 0 ? -1 : 0}
      className={cn(
        orderPanelAmountSliderRootClass,
        dragging ? 'cursor-grabbing' : 'cursor-grab',
        className,
      )}
      data-dragging={dragging || undefined}
      aria-label="Order size as percentage of account equity"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-valuetext={`${Math.round(percent)}% of account`}
      aria-disabled={equityValue <= 0 || undefined}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={endDrag}
    >
      <div className={orderPanelAmountSliderRailWrapClass} aria-hidden>
        <div
          className={orderPanelAmountSliderRailBaseClass}
          style={{ backgroundImage: orderPanelAmountSliderRailGradient }}
        />
        <div
          className={orderPanelAmountSliderRailFillClipClass}
          style={railFillClipStyle(percent)}
        >
          <div
            className={orderPanelAmountSliderRailFillClass}
            style={{
              backgroundImage: orderPanelAmountSliderRailFillGradient,
              ...railFillInnerStyle(percent),
            }}
          />
        </div>
      </div>
      <div
        className={orderPanelAmountSliderThumbClass}
        data-active={percent > 0 || dragging || undefined}
        aria-hidden
        style={{ left: thumbCenterLeftStyle(percent), transform: 'translateX(-50%)' }}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={percent}
        disabled={equityValue <= 0}
        tabIndex={-1}
        className={orderPanelAmountSliderInputClass}
        aria-hidden
      />
    </div>
  );
}
