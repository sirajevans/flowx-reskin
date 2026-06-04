export type TerminalCommandItem = {
  value: string;
  label: string;
  icon: 'positions' | 'trade-panel' | 'order-feed' | 'liquidations' | 'money-flow' | 'chart' | 'reset';
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
        value: 'action-reset-layout',
        label: 'Reset dashboard layout',
        icon: 'reset',
        kind: 'Command',
        keywords: ['layout', 'grid', 'restore'],
      },
    ],
  },
];

const DASHBOARD_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v16';

export function runTerminalCommand(value: string) {
  if (value === 'action-reset-layout') {
    window.localStorage.removeItem(DASHBOARD_LAYOUT_STORAGE_KEY);
    window.location.reload();
  }
}
