export type TerminalStatsTab = 'terminal' | 'discord' | 'algo_trading';

export type TerminalStat = {
  id: string;
  label: string;
  value: string;
  valueTone?: 'default' | 'positive';
};

export type TerminalStatsModuleProps = {
  className?: string;
  tabs?: ReadonlyArray<{ id: TerminalStatsTab; label: string }>;
  activeTab?: TerminalStatsTab;
  defaultTab?: TerminalStatsTab;
  onTabChange?: (tab: TerminalStatsTab) => void;
  stats?: ReadonlyArray<TerminalStat>;
  userName?: string;
  onUserMenuClick?: () => void;
};
