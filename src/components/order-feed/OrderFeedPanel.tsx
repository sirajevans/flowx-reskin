import { useLayoutEffect, useState } from 'react';
import { OrderFeedAssetIcon } from '../icons';
import { CardModule, cardModuleHeaderTextClass } from '../ui';
import {
  DEFAULT_LEFT_COLUMN,
  DEFAULT_PERPS_VOLUME,
  DEFAULT_RIGHT_COLUMN,
  DEFAULT_SPOT_VOLUME,
} from './mockData';
import { getGradientWidthPercent } from './orderFeedUtils';
import './OrderFeedPanel.css';
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
    <div
      className={`order-feed-panel__volume ${
        isRight ? 'order-feed-panel__volume--right' : ''
      }`.trim()}
    >
      <span className="order-feed-panel__volume-label">{volume.label}</span>
      <span className="order-feed-panel__volume-value">{volume.value}</span>
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

  return (
    <div
      className="order-feed-panel__row-slot"
      data-new={isNew ? '' : undefined}
      data-expanded={expanded ? '' : undefined}
    >
      <div className="order-feed-panel__row" data-side={entry.side}>
        <div
          className={`order-feed-panel__row-gradient order-feed-panel__row-gradient--${align}`.trim()}
          style={{ width: `${gradientWidth}%` }}
          aria-hidden
        />
        <div className="order-feed-panel__row-main">
          <span className="order-feed-panel__row-price">{entry.price}</span>
          <span className="order-feed-panel__row-value">{entry.value}</span>
        </div>
        <span className="order-feed-panel__asset" aria-hidden>
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
    <div className="order-feed-panel__column">
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
      className={`order-feed-panel ${className}`.trim()}
      ariaLabel="Order feed"
      onClose={onClose}
      header={<span className={cardModuleHeaderTextClass}>Order feed</span>}
    >
      <div className="order-feed-panel__volumes">
        <VolumeBlock volume={perpsVolume} align="left" />
        <hr className="order-feed-panel__volume-divider" aria-hidden />
        <VolumeBlock volume={spotVolume} align="right" />
      </div>

      <div className="order-feed-panel__grid">
        <FeedColumn entries={leftColumn} align="left" newEntryIds={newEntryIds} />
        <FeedColumn entries={rightColumn} align="right" newEntryIds={newEntryIds} />
      </div>
    </CardModule>
  );
}
