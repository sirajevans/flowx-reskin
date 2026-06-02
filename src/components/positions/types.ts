export type PositionsTab = 'positions' | 'openOrders' | 'history';

export type PositionSide = 'buy' | 'sell';

export type ExchangeName = 'Blofin' | 'Yubit' | 'Weex' | 'Bitget';

export type PositionRow = {
  id: string;
  asset: string;
  side: PositionSide;
  amount: string;
  entryPrice: string;
  marketPrice: string;
  stopLoss: string;
  takeProfit: string;
  fees: string;
  pnl: string;
  pnlPositive: boolean;
};

export type HistoryRow = PositionRow & {
  exchange: ExchangeName;
};

export type PositionsPanelProps = {
  className?: string;
  activeTab?: PositionsTab;
  defaultTab?: PositionsTab;
  onTabChange?: (tab: PositionsTab) => void;
  rows?: PositionRow[];
  selectedRowId?: string | null;
  onSelectRow?: (id: string) => void;
  onClose?: () => void;
  simulateStream?: boolean;
  streamMinIntervalMs?: number;
  streamMaxIntervalMs?: number;
};
