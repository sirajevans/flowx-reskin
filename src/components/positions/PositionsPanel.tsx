import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import {
  EditPositionIcon,
  EntryMarketArrowIcon,
  FullCloseIcon,
  MoveToBreakevenIcon,
  PartialCloseIcon,
} from '../icons';
import {
  AnimatedCounterValue,
  CardModule,
  CardModuleTabContent,
  cardModuleBodyFlexFillClass,
  cardModuleTabClass,
  cardModuleTabListClass,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui';
import { cn } from '../../lib/utils';
import { MOCK_ROWS_BY_TAB } from './mockData';
import {
  positionsPanelActionBtnClass,
  positionsPanelActionBtnDangerClass,
  positionsPanelActionBtnMutedHoverClass,
  positionsPanelCellActionsClass,
  positionsPanelCellClass,
  positionsPanelCellPnlClass,
  positionsPanelCellSideClass,
  positionsPanelCellTextClass,
  positionsPanelCellTextExchangeClass,
  positionsPanelCellTextPnlNegativeClass,
  positionsPanelCellTextPnlPositiveClass,
  positionsPanelColActionsHeaderClass,
  positionsPanelColClass,
  positionsPanelColHeaderClass,
  positionsPanelColPnlHeaderClass,
  positionsPanelCellTextPnlClass,
  positionsPanelEntryMarketClass,
  positionsPanelGridClass,
  positionsPanelGridHeaderClass,
  positionsPanelMarketValueClass,
  positionsPanelRootClass,
  positionsPanelRowActionsClass,
  positionsPanelRowClass,
  positionsPanelRowsClass,
  positionsPanelSideBadgeBuyClass,
  positionsPanelSideBadgeClass,
  positionsPanelSideBadgeSellClass,
  positionsPanelTabPanelClass,
  positionsPanelTabViewportClass,
} from './positionsPanelClasses';
import type { HistoryRow, PositionRow, PositionsPanelProps, PositionsTab } from './types';
import { usePositionsStream } from './usePositionsStream';

const TABS: { id: PositionsTab; label: string }[] = [
  { id: 'positions', label: 'Positions' },
  { id: 'openOrders', label: 'Open orders' },
  { id: 'history', label: 'History' },
];

const TAB_IDS = TABS.map((tab) => tab.id);

const COLUMN_HEADERS_BASE: { key: string; label: string; className: string }[] = [
  { key: 'asset', label: 'ASSET', className: positionsPanelColClass },
  { key: 'side', label: 'SIDE', className: positionsPanelColClass },
  { key: 'amount', label: 'AMOUNT', className: positionsPanelColClass },
  { key: 'entry', label: 'ENTRY / MARKET', className: positionsPanelColClass },
  { key: 'sl', label: 'SL', className: positionsPanelColClass },
  { key: 'tp', label: 'TP', className: positionsPanelColClass },
  { key: 'fees', label: 'FEES', className: positionsPanelColClass },
  { key: 'pnl', label: 'PNL', className: positionsPanelColPnlHeaderClass },
];

const ACTIONS_COLUMN_HEADER = {
  key: 'actions',
  label: 'ACTIONS',
  className: positionsPanelColActionsHeaderClass,
};

const EXCHANGE_COLUMN_HEADER = {
  key: 'exchange',
  label: 'EXCHANGE',
  className: positionsPanelColActionsHeaderClass,
};

function getColumnHeaders(tab: PositionsTab) {
  const lastColumn = tab === 'history' ? EXCHANGE_COLUMN_HEADER : ACTIONS_COLUMN_HEADER;
  return [...COLUMN_HEADERS_BASE, lastColumn];
}

const ROW_ACTIONS = [
  {
    id: 'edit',
    label: 'Edit position',
    icon: EditPositionIcon,
    className: cn(positionsPanelActionBtnClass, positionsPanelActionBtnMutedHoverClass),
  },
  {
    id: 'breakeven',
    label: 'Move SL to BE',
    icon: MoveToBreakevenIcon,
    className: cn(positionsPanelActionBtnClass, positionsPanelActionBtnMutedHoverClass),
  },
  {
    id: 'partialClose',
    label: 'Partial close',
    icon: PartialCloseIcon,
    className: cn(positionsPanelActionBtnClass, positionsPanelActionBtnMutedHoverClass),
  },
  {
    id: 'fullClose',
    label: 'Full close',
    icon: FullCloseIcon,
    className: positionsPanelActionBtnDangerClass,
  },
] as const;

function RowActions({
  tabId,
  onAction,
}: {
  tabId: PositionsTab;
  onAction?: (action: string) => void;
}) {
  const actions =
    tabId === 'openOrders' ? ROW_ACTIONS.filter((action) => action.id !== 'breakeven') : ROW_ACTIONS;

  return (
    <div className={positionsPanelRowActionsClass} onClick={(e) => e.stopPropagation()}>
      {actions.map(({ id, label, icon: Icon, className }) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={className}
              aria-label={label}
              onClick={() => onAction?.(id)}
            >
              <Icon />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function PositionsSideBadge({ side }: { side: PositionRow['side'] }) {
  const isBuy = side === 'buy';
  return (
    <span
      className={cn(
        positionsPanelSideBadgeClass,
        isBuy ? positionsPanelSideBadgeBuyClass : positionsPanelSideBadgeSellClass,
      )}
    >
      {isBuy ? 'BUY' : 'SELL'}
    </span>
  );
}

function PositionRowView({
  row,
  tabId,
  onSelect,
  'aria-selected': ariaSelected,
}: {
  row: PositionRow;
  tabId: PositionsTab;
  onSelect?: () => void;
  'aria-selected'?: boolean;
}) {
  const isHistoryTab = tabId === 'history';

  return (
    <div
      role="row"
      tabIndex={0}
      aria-selected={ariaSelected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(positionsPanelGridClass, positionsPanelRowClass)}
    >
      <div className={positionsPanelCellClass}>
        <span className={positionsPanelCellTextClass}>{row.asset}</span>
      </div>
      <div className={cn(positionsPanelCellClass, positionsPanelCellSideClass)}>
        <PositionsSideBadge side={row.side} />
      </div>
      <div className={positionsPanelCellClass}>
        <span className={positionsPanelCellTextClass}>{row.amount}</span>
      </div>
      <div className={positionsPanelCellClass}>
        <span className={cn(positionsPanelCellTextClass, positionsPanelEntryMarketClass)}>
          <span>{row.entryPrice}</span>
          <EntryMarketArrowIcon />
          <AnimatedCounterValue
            value={row.marketPrice}
            format={{ mode: 'plain' }}
            className={positionsPanelMarketValueClass}
          />
        </span>
      </div>
      <div className={positionsPanelCellClass}>
        <span className={positionsPanelCellTextClass}>{row.stopLoss}</span>
      </div>
      <div className={positionsPanelCellClass}>
        <span className={positionsPanelCellTextClass}>{row.takeProfit}</span>
      </div>
      <div className={positionsPanelCellClass}>
        <span className={positionsPanelCellTextClass}>{row.fees}</span>
      </div>
      <div className={positionsPanelCellPnlClass}>
        {row.pnl === '—' ? (
          <span className={positionsPanelCellTextPnlClass}>{row.pnl}</span>
        ) : (
          <AnimatedCounterValue
            value={row.pnl}
            format={{ mode: 'signed-currency', decimalPlaces: 2 }}
            className={
              row.pnlPositive
                ? positionsPanelCellTextPnlPositiveClass
                : positionsPanelCellTextPnlNegativeClass
            }
          />
        )}
      </div>
      <div className={cn(positionsPanelCellClass, positionsPanelCellActionsClass)}>
        {isHistoryTab ? (
          <span className={cn(positionsPanelCellTextClass, positionsPanelCellTextExchangeClass)}>
            {(row as HistoryRow).exchange}
          </span>
        ) : (
          <RowActions tabId={tabId} />
        )}
      </div>
    </div>
  );
}

export function PositionsPanel({
  className = '',
  activeTab: activeTabProp,
  defaultTab = 'positions',
  onTabChange,
  rows,
  selectedRowId: selectedRowIdProp,
  onSelectRow,
  onClose,
  simulateStream = true,
  streamMinIntervalMs = 400,
  streamMaxIntervalMs = 1000,
}: PositionsPanelProps) {
  const [internalTab, setInternalTab] = useState<PositionsTab>(defaultTab);

  const activeTab = activeTabProp ?? internalTab;
  const staticRows = rows ?? MOCK_ROWS_BY_TAB[activeTab];
  const positionsStream = usePositionsStream({
    enabled: simulateStream && rows === undefined && activeTab === 'positions',
    minIntervalMs: streamMinIntervalMs,
    maxIntervalMs: streamMaxIntervalMs,
    initialRows: MOCK_ROWS_BY_TAB.positions,
  });
  const openOrdersStream = usePositionsStream({
    enabled: simulateStream && rows === undefined && activeTab === 'openOrders',
    minIntervalMs: streamMinIntervalMs,
    maxIntervalMs: streamMaxIntervalMs,
    initialRows: MOCK_ROWS_BY_TAB.openOrders,
  });

  const displayRows =
    rows ??
    (activeTab === 'positions'
      ? positionsStream.rows
      : activeTab === 'openOrders'
        ? openOrdersStream.rows
        : staticRows);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    displayRows[0]?.id ?? null,
  );
  const selectedRowId = selectedRowIdProp ?? internalSelectedId;

  const handleTabChange = (tab: PositionsTab) => {
    if (activeTabProp === undefined) setInternalTab(tab);
    if (selectedRowIdProp === undefined) {
      const nextRows = rows ?? MOCK_ROWS_BY_TAB[tab];
      setInternalSelectedId(nextRows[0]?.id ?? null);
    }
    onTabChange?.(tab);
  };

  const handleSelectRow = (id: string) => {
    if (selectedRowIdProp === undefined) setInternalSelectedId(id);
    onSelectRow?.(id);
  };

  return (
    <CardModule
      className={cn(positionsPanelRootClass, className)}
      bodyClassName={cardModuleBodyFlexFillClass}
      ariaLabel="Positions widget"
      onClose={onClose}
      header={
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => handleTabChange(key as PositionsTab)}
          className="min-w-0"
        >
          <TabList aria-label="Positions sections" className={cardModuleTabListClass}>
            {TABS.map((tab) => (
              <Tab key={tab.id} id={tab.id} className={cardModuleTabClass}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
          {TABS.map((tab) => (
            <TabPanel key={tab.id} id={tab.id} className="hidden" />
          ))}
        </Tabs>
      }
    >
      <div
        className={cn(positionsPanelGridClass, positionsPanelGridHeaderClass)}
        role="row"
      >
        {getColumnHeaders(activeTab).map((col) => (
          <div
            key={col.key}
            className={cn(col.className, positionsPanelColHeaderClass)}
            role="columnheader"
          >
            {col.label}
          </div>
        ))}
      </div>

      <CardModuleTabContent
        activeTab={activeTab}
        tabIds={TAB_IDS}
        viewportClassName={positionsPanelTabViewportClass}
        panelClassName={positionsPanelTabPanelClass}
      >
        {(tabId) => {
          const tabRows =
            rows ??
            (tabId === 'positions'
              ? positionsStream.rows
              : tabId === 'openOrders'
                ? openOrdersStream.rows
                : MOCK_ROWS_BY_TAB[tabId]);
          return (
            <div className={positionsPanelRowsClass} role="table">
              <div role="rowgroup">
                {tabRows.map((row) => (
                  <PositionRowView
                    key={row.id}
                    row={row}
                    tabId={tabId}
                    aria-selected={activeTab === tabId && selectedRowId === row.id}
                    onSelect={() => handleSelectRow(row.id)}
                  />
                ))}
              </div>
            </div>
          );
        }}
      </CardModuleTabContent>
    </CardModule>
  );
}
