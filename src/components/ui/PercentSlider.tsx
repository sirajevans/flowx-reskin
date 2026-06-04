import { useCallback, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import {
  percentSliderInputClass,
  percentSliderRailBaseClass,
  percentSliderRailFillClass,
  percentSliderRailFillClipClass,
  percentSliderRailFillGradient,
  percentSliderRailGradient,
  percentSliderRailWrapClass,
  percentSliderRootClass,
  percentSliderThumbClass,
  percentSliderThumbInsetPx,
} from './percentSliderClasses';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export type PercentSliderProps = {
  percent: number;
  onPercentChange: (percent: number) => void;
  ariaLabel: string;
  formatValueText?: (percent: number) => string;
  formatTooltipText?: (percent: number) => string;
  className?: string;
  disabled?: boolean;
};

/** Thumb center travels inset → (width − inset); edges sit ~9px inside at 0/100%. */
function thumbCenterLeftStyle(percent: number): string {
  const inset = percentSliderThumbInsetPx;
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

export function PercentSlider({
  percent,
  onPercentChange,
  ariaLabel,
  formatValueText,
  formatTooltipText,
  className,
  disabled = false,
}: PercentSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const percentFromClientX = useCallback((clientX: number) => {
    const root = rootRef.current;
    if (!root) return 0;
    const { left, width } = root.getBoundingClientRect();
    const inset = percentSliderThumbInsetPx;
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
    if (event.button !== 0 || disabled) return;
    event.preventDefault();
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    onPercentChange(percentFromClientX(event.clientX));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    onPercentChange(percentFromClientX(event.clientX));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endDrag();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let next = percent;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, percent - 1);
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(100, percent + 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    else return;
    event.preventDefault();
    onPercentChange(next);
  };

  const valueText = formatValueText?.(percent) ?? `${Math.round(percent)}%`;
  const tooltipLabel =
    formatTooltipText?.(percent) ??
    formatValueText?.(percent) ??
    `${Math.round(percent)}%`;

  return (
    <div
      ref={rootRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        percentSliderRootClass,
        dragging ? 'cursor-grabbing' : 'cursor-grab',
        className,
      )}
      data-dragging={dragging || undefined}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-valuetext={valueText}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={endDrag}
    >
      <div className={percentSliderRailWrapClass} aria-hidden>
        <div
          className={percentSliderRailBaseClass}
          style={{ backgroundImage: percentSliderRailGradient }}
        />
        <div
          className={percentSliderRailFillClipClass}
          style={railFillClipStyle(percent)}
        >
          <div
            className={percentSliderRailFillClass}
            style={{
              backgroundImage: percentSliderRailFillGradient,
              ...railFillInnerStyle(percent),
            }}
          />
        </div>
      </div>
      <Tooltip
        open={dragging && !disabled}
        delayDuration={0}
        onOpenChange={(nextOpen) => {
          if (nextOpen && !dragging) return;
        }}
      >
        <TooltipTrigger asChild>
          <div
            className={percentSliderThumbClass}
            data-active={percent > 0 || dragging || undefined}
            aria-hidden
            style={{ left: thumbCenterLeftStyle(percent), transform: 'translateX(-50%)' }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={percent}
        disabled={disabled}
        tabIndex={-1}
        className={percentSliderInputClass}
        aria-hidden
      />
    </div>
  );
}
