import { useLayoutEffect, useState } from 'react';
import { FilterModuleIcon, OrderFeedAssetIcon } from '../icons';
import {
  CardModule,
  cardModuleBodyFlexFillClass,
  cardModuleHeaderTextClass,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  PercentSlider,
} from '../ui';
import { cn } from '../../lib/utils';
import {
  DEFAULT_LEFT_COLUMN,
  DEFAULT_PERPS_VOLUME,
  DEFAULT_RIGHT_COLUMN,
  DEFAULT_SPOT_VOLUME,
} from './mockData';
import {
  orderFeedAssetClass,
  orderFeedColumnClass,
  orderFeedFilterIndicatorClass,
  orderFeedFilterMenuItemClass,
  orderFeedFilterSliderHeaderClass,
  orderFeedFilterSliderSectionClass,
  orderFeedFilterSliderValueClass,
  orderFeedFilterTriggerClass,
  orderFeedGridClass,
  orderFeedPanelRootClass,
  orderFeedRowClass,
  orderFeedRowGradientLeftBuyClass,
  orderFeedRowGradientLeftClass,
  orderFeedRowGradientLeftSellClass,
  orderFeedRowGradientRightBuyClass,
  orderFeedRowGradientRightClass,
  orderFeedRowGradientRightSellClass,
  orderFeedRowMainClass,
  orderFeedRowPriceClass,
  orderFeedRowSlotClass,
  orderFeedRowValueClass,
  orderFeedVolumeClass,
  orderFeedVolumeDividerClass,
  orderFeedVolumeLabelClass,
  orderFeedVolumeLabelRightClass,
  orderFeedVolumesClass,
  orderFeedVolumeValueClass,
  orderFeedVolumeValueRightClass,
  orderFeedVolumeRightClass,
} from './orderFeedPanelClasses';
import {
  formatOrderFeedFilterThreshold,
  getGradientWidthPercent,
  ORDER_FEED_MIN_VALUE_MAX,
  parseOrderFeedValue,
} from './orderFeedUtils';
import type {
  OrderFeedEntry,
  OrderFeedFilter,
  OrderFeedPanelProps,
  OrderFeedVolume,
} from './types';
import { useOrderFeedStream } from './useOrderFeedStream';

function minValueUsdToPercent(minValueUsd: number) {
  return (minValueUsd / ORDER_FEED_MIN_VALUE_MAX) * 100;
}

function percentToMinValueUsd(percent: number) {
  return Math.round((percent / 100) * ORDER_FEED_MIN_VALUE_MAX);
}

const FILTER_OPTIONS: ReadonlyArray<{ id: OrderFeedFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'perp', label: 'Perp' },
  { id: 'spot', label: 'Spot' },
  { id: 'split', label: 'Split' },
  { id: 'quad', label: 'Quad' },
];

function filterEntries(
  entries: OrderFeedEntry[],
  activeFilter: OrderFeedFilter,
  minValueUsd: number,
) {
  let filtered = entries;

  if (activeFilter !== 'all') {
    filtered = filtered.filter((entry) => entry.product === activeFilter);
  }

  if (minValueUsd > 0) {
    filtered = filtered.filter(
      (entry) => parseOrderFeedValue(entry.value) >= minValueUsd,
    );
  }

  return filtered;
}

function VolumeBlock({
  volume,
  align,
}: {
  volume: OrderFeedVolume;
  align: 'left' | 'right';
}) {
  const isRight = align === 'right';

  return (
    <div className={cn(orderFeedVolumeClass, isRight && orderFeedVolumeRightClass)}>
      <span
        className={cn(orderFeedVolumeLabelClass, isRight && orderFeedVolumeLabelRightClass)}
      >
        {volume.label}
      </span>
      <span
        className={cn(orderFeedVolumeValueClass, isRight && orderFeedVolumeValueRightClass)}
      >
        {volume.value}
      </span>
    </div>
  );
}

function FeedRow({
  entry,
  align,
  isNew,
}: {
  entry: OrderFeedEntry;
  align: 'left' | 'right';
  isNew: boolean;
}) {
  const gradientWidth = getGradientWidthPercent(entry.value);
  const [expanded, setExpanded] = useState(!isNew);
  const isBuy = entry.side === 'buy';
  const isLeft = align === 'left';

  useLayoutEffect(() => {
    if (!isNew) {
      setExpanded(true);
      return;
    }

    setExpanded(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setExpanded(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [isNew, entry.id]);

  const gradientClass = cn(
    isLeft ? orderFeedRowGradientLeftClass : orderFeedRowGradientRightClass,
    isLeft
      ? isBuy
        ? orderFeedRowGradientLeftBuyClass
        : orderFeedRowGradientLeftSellClass
      : isBuy
        ? orderFeedRowGradientRightBuyClass
        : orderFeedRowGradientRightSellClass,
  );

  return (
    <div
      className={orderFeedRowSlotClass}
      data-expanded={expanded ? '' : undefined}
    >
      <div className={orderFeedRowClass} data-side={entry.side}>
        <div className={gradientClass} style={{ width: `${gradientWidth}%` }} aria-hidden />
        <div className={orderFeedRowMainClass}>
          <span className={orderFeedRowPriceClass}>{entry.price}</span>
          <span className={orderFeedRowValueClass}>{entry.value}</span>
        </div>
        <span className={orderFeedAssetClass} aria-hidden>
          <OrderFeedAssetIcon />
        </span>
      </div>
    </div>
  );
}

function FeedColumn({
  entries,
  align,
  newEntryIds,
}: {
  entries: OrderFeedEntry[];
  align: 'left' | 'right';
  newEntryIds: ReadonlySet<string>;
}) {
  return (
    <div className={orderFeedColumnClass}>
      {entries.map((entry) => (
        <FeedRow
          key={entry.id}
          entry={entry}
          align={align}
          isNew={newEntryIds.has(entry.id)}
        />
      ))}
    </div>
  );
}

function OrderFeedFilterDropdown({
  value,
  onChange,
  minValueUsd,
  onMinValueChange,
}: {
  value: OrderFeedFilter;
  onChange: (value: OrderFeedFilter) => void;
  minValueUsd: number;
  onMinValueChange: (value: number) => void;
}) {
  const activeLabel = FILTER_OPTIONS.find((option) => option.id === value)?.label ?? 'All';
  const thresholdLabel = formatOrderFeedFilterThreshold(minValueUsd);
  const minValuePercent = minValueUsdToPercent(minValueUsd);
  const filterActive = value !== 'all' || minValueUsd > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={orderFeedFilterTriggerClass}
          data-active={filterActive ? 'true' : undefined}
          aria-label={`Filter order feed: ${activeLabel}, min ${thresholdLabel}`}
        >
          <FilterModuleIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuGroup>
          {FILTER_OPTIONS.map((option) => {
            const selected = option.id === value;

            return (
              <DropdownMenuItem
                key={option.id}
                className={orderFeedFilterMenuItemClass}
                aria-checked={selected}
                role="menuitemradio"
                onSelect={() => onChange(option.id)}
              >
                {option.label}
                <span
                  className={orderFeedFilterIndicatorClass}
                  data-active={selected ? 'true' : undefined}
                  aria-hidden
                />
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div
          className={orderFeedFilterSliderSectionClass}
          onPointerDown={(event) => event.preventDefault()}
        >
          <div className={orderFeedFilterSliderHeaderClass}>
            <span>MIN NOTIONAL</span>
            <span className={orderFeedFilterSliderValueClass}>{thresholdLabel}</span>
          </div>
          <PercentSlider
            percent={minValuePercent}
            onPercentChange={(percent) => onMinValueChange(percentToMinValueUsd(percent))}
            ariaLabel="Minimum order value"
            formatValueText={(percent) =>
              formatOrderFeedFilterThreshold(percentToMinValueUsd(percent))
            }
            className="w-full"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OrderFeedPanel({
  className = '',
  onClose,
  perpsVolume = DEFAULT_PERPS_VOLUME,
  spotVolume = DEFAULT_SPOT_VOLUME,
  leftColumn: leftColumnProp,
  rightColumn: rightColumnProp,
  simulateStream = true,
  streamMaxRows = 16,
  streamMinIntervalMs = 66,
  streamMaxIntervalMs = 207,
}: OrderFeedPanelProps) {
  const [activeFilter, setActiveFilter] = useState<OrderFeedFilter>('all');
  const [minOrderValueUsd, setMinOrderValueUsd] = useState(0);
  const initialLeft = leftColumnProp ?? DEFAULT_LEFT_COLUMN;
  const initialRight = rightColumnProp ?? DEFAULT_RIGHT_COLUMN;

  const stream = useOrderFeedStream({
    enabled: simulateStream && leftColumnProp === undefined && rightColumnProp === undefined,
    maxRows: streamMaxRows,
    minIntervalMs: streamMinIntervalMs,
    maxIntervalMs: streamMaxIntervalMs,
    initialLeft,
    initialRight,
  });

  const leftColumnUnfiltered =
    simulateStream && leftColumnProp === undefined ? stream.leftColumn : initialLeft;
  const rightColumnUnfiltered =
    simulateStream && rightColumnProp === undefined ? stream.rightColumn : initialRight;
  const leftColumn = filterEntries(leftColumnUnfiltered, activeFilter, minOrderValueUsd);
  const rightColumn = filterEntries(rightColumnUnfiltered, activeFilter, minOrderValueUsd);
  const newEntryIds: ReadonlySet<string> =
    simulateStream && leftColumnProp === undefined ? stream.newEntryIds : new Set<string>();

  return (
    <CardModule
      className={cn(orderFeedPanelRootClass, className)}
      bodyClassName={cardModuleBodyFlexFillClass}
      ariaLabel="Order feed"
      onClose={onClose}
      header={<span className={cardModuleHeaderTextClass}>Order feed</span>}
      headerActions={
        <OrderFeedFilterDropdown
          value={activeFilter}
          onChange={setActiveFilter}
          minValueUsd={minOrderValueUsd}
          onMinValueChange={setMinOrderValueUsd}
        />
      }
    >
      <div className={orderFeedVolumesClass}>
        <VolumeBlock volume={perpsVolume} align="left" />
        <hr className={orderFeedVolumeDividerClass} aria-hidden />
        <VolumeBlock volume={spotVolume} align="right" />
      </div>

      <div className={orderFeedGridClass}>
        <FeedColumn entries={leftColumn} align="left" newEntryIds={newEntryIds} />
        <FeedColumn entries={rightColumn} align="right" newEntryIds={newEntryIds} />
      </div>
    </CardModule>
  );
}
