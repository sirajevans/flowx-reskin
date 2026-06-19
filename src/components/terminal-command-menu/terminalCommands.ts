export type { TerminalAssetSuggestion } from '../../generated/coinCatalog';
export { TERMINAL_ASSET_SUGGESTIONS } from '../../generated/coinCatalog';

export const TERMINAL_FAVOURITE_COIN_IDS = ['btc', 'eth', 'sol', 'bnb', 'xrp'] as const;

export type TerminalCommandItem = {
  value: string;
  label: string;
  icon:
    | 'positions'
    | 'trade-panel'
    | 'order-feed'
    | 'liquidations'
    | 'money-flow'
    | 'chart'
    | 'chat'
    | 'reset';
  kind: 'Module' | 'Command';
  keywords?: string[];
};

export type TerminalCommandGroup = {
  heading: string;
  headingAlign?: 'start' | 'center';
  items: TerminalCommandItem[];
};

export const TERMINAL_COMMAND_GROUPS: TerminalCommandGroup[] = [
  {
    heading: 'ADD MODULES',
    headingAlign: 'start',
    items: [
      {
        value: 'module-positions',
        label: 'Positions',
        icon: 'positions',
        kind: 'Module',
        keywords: ['panel', 'portfolio'],
      },
      {
        value: 'module-order',
        label: 'Trade panel',
        icon: 'trade-panel',
        kind: 'Module',
        keywords: ['order', 'trade', 'buy', 'sell'],
      },
      {
        value: 'module-order-feed',
        label: 'Order feed',
        icon: 'order-feed',
        kind: 'Module',
        keywords: ['trades', 'tape'],
      },
      {
        value: 'module-liquidations',
        label: 'Liquidations',
        icon: 'liquidations',
        kind: 'Module',
        keywords: ['liq'],
      },
      {
        value: 'module-money-flow',
        label: 'Money flow',
        icon: 'money-flow',
        kind: 'Module',
        keywords: ['flow'],
      },
      { value: 'module-chart', label: 'Chart', icon: 'chart', kind: 'Module', keywords: ['price'] },
    ],
  },
  {
    heading: 'ACTIONS',
    headingAlign: 'center',
    items: [
      {
        value: 'action-open-whale-room-chat',
        label: 'Open whale room chat',
        icon: 'chat',
        kind: 'Command',
        keywords: ['chat', 'room', 'whale', 'message'],
      },
      {
        value: 'action-reset-layout',
        label: 'Reset dashboard layout',
        icon: 'reset',
        kind: 'Command',
        keywords: ['layout', 'grid', 'restore'],
      },
    ],
  },
];

const DASHBOARD_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v19';

export function isTerminalAssetCommand(value: string) {
  return value.startsWith('asset-');
}

export function resolveTerminalAssetSymbol(value: string) {
  if (!isTerminalAssetCommand(value)) return value;
  const coinId = value.slice('asset-'.length);
  return `${coinId.toUpperCase()}USDT`;
}

export function runTerminalCommand(value: string) {
  if (value === 'action-reset-layout') {
    window.localStorage.removeItem(DASHBOARD_LAYOUT_STORAGE_KEY);
    window.location.reload();
  }
}
