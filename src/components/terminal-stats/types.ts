export type TerminalNavStat = {
  id: string;
  label: string;
  value: string;
  valueTone?: 'default' | 'positive';
  align?: 'start' | 'end';
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
  symbolIconUrl?: string;
  marketType?: string;
  symbol?: string;
  stats?: ReadonlyArray<TerminalNavStat>;
  userName?: string;
  userAvatarSrc?: string;
  userMenuItems?: ReadonlyArray<TerminalStatsUserMenuItem>;
  onUserMenuSelect?: (itemId: string) => void;
};

/** @deprecated Use TerminalNavStat */
export type TerminalStat = TerminalNavStat;
