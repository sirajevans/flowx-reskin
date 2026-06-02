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
  cardModuleTabClass,
  cardModuleTabListClass,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui';
import { MOCK_ROWS_BY_TAB } from './mockData';
import './PositionsPanel.css';
import type { HistoryRow, PositionRow, PositionSide, PositionsPanelProps, PositionsTab } from './types';
import { usePositionsStream } from './usePositionsStream';

const TABS: { id: PositionsTab; label: string }[] = [
  { id: 'positions', label: 'Positions' },
  { id: 'openOrders', label: 'Open orders' },
  { id: 'history', label: 'History' },
];

const TAB_IDS = TABS.map((tab) => tab.id);

const COLUMN_HEADERS_BASE: { key: string; label: string; className: string }[] = [
  { key: 'asset', label: 'ASSET', className: 'positions-panel__col positions-panel__col--asset' },
  { key: 'side', label: 'SIDE', className: 'positions-panel__col positions-panel__col--side' },
  { key: 'amount', label: 'AMOUNT', className: 'positions-panel__col positions-panel__col--amount' },
  {
    key: 'entry',
    label: 'ENTRY / MARKET',
    className: 'positions-panel__col positions-panel__col--entry',
  },
  { key: 'sl', label: 'SL', className: 'positions-panel__col positions-panel__col--sl' },
  { key: 'tp', label: 'TP', className: 'positions-panel__col positions-panel__col--tp' },
  {
    key: 'filled',
    label: 'FILLED AT',
    className: 'positions-panel__col positions-panel__col--filled',
  },
  { key: 'fees', label: 'FEES', className: 'positions-panel__col positions-panel__col--fees' },
  { key: 'pnl', label: 'PNL', className: 'positions-panel__col positions-panel__col--pnl' },
];

const ACTIONS_COLUMN_HEADER = {
  key: 'actions',
  label: 'ACTIONS',
  className: 'positions-panel__col positions-panel__col--actions',
};

const EXCHANGE_COLUMN_HEADER = {
  key: 'exchange',
  label: 'EXCHANGE',
  className: 'positions-panel__col positions-panel__col--actions',
};

function getColumnHeaders(tab: PositionsTab) {
  const lastColumn = tab === 'history' ? EXCHANGE_COLUMN_HEADER : ACTIONS_COLUMN_HEADER;
  return [...COLUMN_HEADERS_BASE, lastColumn];
}

const ROW_ACTIONS = [
  {
    id: 'edit',
    label: 'Edit position',
    shortcut: 'E',
    icon: EditPositionIcon,
    className: 'positions-panel__action-btn',
  },
  {
    id: 'breakeven',
    label: 'Move SL to BE',
    shortcut: 'B',
    icon: MoveToBreakevenIcon,
    className: 'positions-panel__action-btn',
  },
  {
    id: 'partialClose',
    label: 'Partial close',
    shortcut: 'P',
    icon: PartialCloseIcon,
    className: 'positions-panel__action-btn',
  },
  {
    id: 'fullClose',
    label: 'Full close',
    shortcut: 'F',
    icon: FullCloseIcon,
    className: 'positions-panel__action-btn positions-panel__action-btn--danger',
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
    <div className="positions-panel__row-actions" onClick={(e) => e.stopPropagation()}>
      {actions.map(({ id, label, shortcut, icon: Icon, className }) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={className}
              aria-label={`${label} (${shortcut})`}
              onClick={() => onAction?.(id)}
            >
              <Icon />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span className="tooltip-content__inner">
              <span>{label}</span>
              <kbd className="tooltip-content__shortcut">{shortcut}</kbd>
            </span>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function parsePrice(value: string): number {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function isMarketFavorable(side: PositionSide, entryPrice: string, marketPrice: string): boolean {
  const entry = parsePrice(entryPrice);
  const market = parsePrice(marketPrice);
  return side === 'buy' ? market > entry : market < entry;
}

function PositionsSideBadge({ side }: { side: PositionRow['side'] }) {
  const isBuy = side === 'buy';
  return (
    <span
      className={`positions-panel__side-badge ${
        isBuy ? 'positions-panel__side-badge--buy' : 'positions-panel__side-badge--sell'
      }`}
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
      className="positions-panel__grid positions-panel__row"
    >
      <div className="positions-panel__cell positions-panel__cell--asset">
        <span className="positions-panel__cell-text">{row.asset}</span>
      </div>
      <div className="positions-panel__cell positions-panel__cell--side">
        <PositionsSideBadge side={row.side} />
      </div>
      <div className="positions-panel__cell positions-panel__cell--amount">
        <span className="positions-panel__cell-text">{row.amount}</span>
      </div>
      <div className="positions-panel__cell positions-panel__cell--entry">
        <span className="positions-panel__cell-text positions-panel__entry-market">
          <span>{row.entryPrice}</span>
          <EntryMarketArrowIcon />
          <AnimatedCounterValue
            value={row.marketPrice}
            format={{ mode: 'plain' }}
            className={`positions-panel__market-value ${
              isMarketFavorable(row.side, row.entryPrice, row.marketPrice)
                ? 'positions-panel__market-value--favorable'
                : 'positions-panel__market-value--unfavorable'
            }`}
          />
        </span>
      </div>
      <div className="positions-panel__cell positions-panel__cell--sl">
        <span className="positions-panel__cell-text">{row.stopLoss}</span>
      </div>
      <div className="positions-panel__cell positions-panel__cell--tp">
        <span className="positions-panel__cell-text">{row.takeProfit}</span>
      </div>
      <div className="positions-panel__cell positions-panel__cell--filled">
        <span className="positions-panel__cell-text">{row.filledAt}</span>
      </div>
      <div className="positions-panel__cell positions-panel__cell--fees">
        <span className="positions-panel__cell-text">{row.fees}</span>
      </div>
      <div className="positions-panel__cell positions-panel__cell--pnl">
        {row.pnl === '—' ? (
          <span className="positions-panel__cell-text">{row.pnl}</span>
        ) : (
          <AnimatedCounterValue
            value={row.pnl}
            format={{ mode: 'signed-currency', decimalPlaces: 2 }}
            className={`positions-panel__cell-text ${
              row.pnlPositive
                ? 'positions-panel__cell-text--pnl-positive'
                : 'positions-panel__cell-text--pnl-negative'
            }`}
          />
        )}
      </div>
      <div className="positions-panel__cell positions-panel__cell--actions">
        {isHistoryTab ? (
          <span className="positions-panel__cell-text positions-panel__cell-text--exchange">
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
      className={`positions-panel ${className}`.trim()}
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
      <div className="positions-panel__grid positions-panel__grid--header" role="row">
        {getColumnHeaders(activeTab).map((col) => (
          <div key={col.key} className={col.className} role="columnheader">
            {col.label}
          </div>
        ))}
      </div>

      <CardModuleTabContent activeTab={activeTab} tabIds={TAB_IDS}>
        {(tabId) => {
          const tabRows =
            rows ??
            (tabId === 'positions'
              ? positionsStream.rows
              : tabId === 'openOrders'
                ? openOrdersStream.rows
                : MOCK_ROWS_BY_TAB[tabId]);
          return (
            <div className="positions-panel__rows" role="table">
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
