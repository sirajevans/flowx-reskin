export type TerminalStatsTab = 'terminal' | 'algo_trading';

export type TerminalStat = {
  id: string;
  label: string;
  value: string;
  valueTone?: 'default' | 'positive';
};

export type TerminalStatsUserMenuItem = {
  id: string;
  label: string;
  shortcut?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onSelect?: () => void;
};

export type TerminalStatsModuleProps = {
  className?: string;
  tabs?: ReadonlyArray<{ id: TerminalStatsTab; label: string }>;
  activeTab?: TerminalStatsTab;
  defaultTab?: TerminalStatsTab;
  onTabChange?: (tab: TerminalStatsTab) => void;
  stats?: ReadonlyArray<TerminalStat>;
  userName?: string;
  userAvatarSrc?: string;
  userMenuItems?: ReadonlyArray<TerminalStatsUserMenuItem>;
  onUserMenuSelect?: (itemId: string) => void;
};
