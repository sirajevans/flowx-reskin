import { useLayoutEffect, useState } from 'react';
import { OrderFeedAssetIcon } from '../icons';
import {
  CardModule,
  cardModuleBodyFlexFillClass,
  cardModuleHeaderTextClass,
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
import { getGradientWidthPercent } from './orderFeedUtils';
import type { OrderFeedEntry, OrderFeedPanelProps, OrderFeedVolume } from './types';
import { useOrderFeedStream } from './useOrderFeedStream';

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

  const leftColumn =
    simulateStream && leftColumnProp === undefined ? stream.leftColumn : initialLeft;
  const rightColumn =
    simulateStream && rightColumnProp === undefined ? stream.rightColumn : initialRight;
  const newEntryIds: ReadonlySet<string> =
    simulateStream && leftColumnProp === undefined ? stream.newEntryIds : new Set<string>();

  return (
    <CardModule
      className={cn(orderFeedPanelRootClass, className)}
      bodyClassName={cardModuleBodyFlexFillClass}
      ariaLabel="Order feed"
      onClose={onClose}
      header={<span className={cardModuleHeaderTextClass}>Order feed</span>}
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
