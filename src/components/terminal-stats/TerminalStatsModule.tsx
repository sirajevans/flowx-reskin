import { useState } from 'react';
import profilePlaceholder from '../../assets/profile-placeholder.png';
import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  terminalStatsAvatarClass,
  terminalStatsAvatarShellClass,
  terminalStatsRightClass,
  terminalStatsRootClass,
  terminalStatsStatClass,
  terminalStatsStatLabelClass,
  terminalStatsStatsClass,
  terminalStatsStatValueClass,
  terminalStatsStatValueDefaultClass,
  terminalStatsStatValuePositiveClass,
  terminalStatsTabClass,
  terminalStatsTabsClass,
  terminalStatsUserClass,
  terminalStatsUserTriggerClass,
} from './terminalStatsClasses';
import type {
  TerminalStat,
  TerminalStatsModuleProps,
  TerminalStatsTab,
  TerminalStatsUserMenuItem,
} from './types';

const DEFAULT_TABS: ReadonlyArray<{ id: TerminalStatsTab; label: string }> = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'algo_trading', label: 'Algo trading' },
];

const DEFAULT_STATS: ReadonlyArray<TerminalStat> = [
  { id: 'return', label: 'RETURN', value: '+82.34%', valueTone: 'positive' },
  { id: 'win_rate', label: 'WINS', value: '67.81%' },
  { id: 'max_dd', label: 'MAX DD', value: '5.27%' },
  { id: 'avg_fee', label: 'AVG FEE', value: '$43.10' },
  { id: 'equity', label: 'EQUITY', value: '$13,239.21' },
  { id: 'balance', label: 'BALANCE', value: '$3,000.00' },
  { id: 'pnl', label: 'PNL', value: '$10,239.21', valueTone: 'positive' },
];

const DEFAULT_USER_MENU_ITEMS: ReadonlyArray<TerminalStatsUserMenuItem> = [
  { id: 'profile', label: 'Profile', shortcut: '⇧⌘P' },
  { id: 'billing', label: 'Billing', shortcut: '⌘B' },
  { id: 'settings', label: 'Settings', shortcut: '⌘S' },
  { id: 'logout', label: 'Log out', shortcut: '⇧⌘Q', variant: 'destructive' },
];

export function TerminalStatsModule({
  className = '',
  tabs = DEFAULT_TABS,
  activeTab: activeTabProp,
  defaultTab = 'terminal',
  onTabChange,
  stats = DEFAULT_STATS,
  userName = 'Chento',
  userAvatarSrc = profilePlaceholder,
  userMenuItems = DEFAULT_USER_MENU_ITEMS,
  onUserMenuSelect,
}: TerminalStatsModuleProps) {
  const [internalTab, setInternalTab] = useState<TerminalStatsTab>(defaultTab);
  const activeTab = activeTabProp ?? internalTab;

  const handleTabChange = (tab: TerminalStatsTab) => {
    if (activeTabProp === undefined) setInternalTab(tab);
    onTabChange?.(tab);
  };

  const handleUserMenuSelect = (item: TerminalStatsUserMenuItem) => {
    item.onSelect?.();
    onUserMenuSelect?.(item.id);
  };

  const defaultItems = userMenuItems.filter((item) => item.variant !== 'destructive');
  const destructiveItems = userMenuItems.filter((item) => item.variant === 'destructive');

  return (
    <section
      aria-label="Terminal stats module"
      className={cn(terminalStatsRootClass, className)}
    >
      <div className={terminalStatsTabsClass} role="tablist" aria-label="Trading channels">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={terminalStatsTabClass}
            data-selected={activeTab === tab.id ? 'true' : undefined}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={terminalStatsRightClass}>
        <div className={terminalStatsStatsClass} role="list" aria-label="Terminal performance stats">
          {stats.map((stat) => (
            <div key={stat.id} className={terminalStatsStatClass} role="listitem">
              <span className={terminalStatsStatLabelClass}>{stat.label}</span>
              <span
                className={cn(
                  terminalStatsStatValueClass,
                  stat.valueTone === 'positive'
                    ? terminalStatsStatValuePositiveClass
                    : terminalStatsStatValueDefaultClass,
                )}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className={terminalStatsUserClass}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={terminalStatsUserTriggerClass}
                aria-label={`${userName} account menu`}
              >
                <span className={terminalStatsAvatarShellClass}>
                  <img
                    src={userAvatarSrc}
                    alt=""
                    className={terminalStatsAvatarClass}
                  />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-16}
              sideOffset={16}
              className="min-w-44"
            >
              <DropdownMenuGroup>
                {defaultItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    disabled={item.disabled}
                    onSelect={() => handleUserMenuSelect(item)}
                  >
                    {item.label}
                    {item.shortcut ? (
                      <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {destructiveItems.length > 0 ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {destructiveItems.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        variant="destructive"
                        disabled={item.disabled}
                        onSelect={() => handleUserMenuSelect(item)}
                      >
                        {item.label}
                        {item.shortcut ? (
                          <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                        ) : null}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
}
