export type TerminalCommandItem = {
  value: string;
  label: string;
  keywords?: string[];
  shortcut?: string;
};

export type TerminalCommandGroup = {
  heading: string;
  items: TerminalCommandItem[];
};

export const TERMINAL_COMMAND_GROUPS: TerminalCommandGroup[] = [
  {
    heading: 'Modules',
    items: [
      { value: 'module-positions', label: 'Positions', keywords: ['panel', 'portfolio'] },
      { value: 'module-order', label: 'Order', keywords: ['trade', 'buy', 'sell'] },
      { value: 'module-order-feed', label: 'Order feed', keywords: ['trades', 'tape'] },
      { value: 'module-liquidations', label: 'Liquidations', keywords: ['liq'] },
      { value: 'module-money-flow', label: 'Money flow', keywords: ['flow'] },
      { value: 'module-chart', label: 'Chart', keywords: ['price'] },
    ],
  },
  {
    heading: 'Actions',
    items: [
      {
        value: 'action-reset-layout',
        label: 'Reset dashboard layout',
        keywords: ['layout', 'grid', 'restore'],
        shortcut: '↵',
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
