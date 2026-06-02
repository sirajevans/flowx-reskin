import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  terminalStatsAvatarClass,
  terminalStatsDividerClass,
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
  terminalStatsUserChevronClass,
  terminalStatsUserClass,
  terminalStatsUserMenuClass,
} from './terminalStatsClasses';
import type { TerminalStat, TerminalStatsModuleProps, TerminalStatsTab } from './types';

const DEFAULT_TABS: ReadonlyArray<{ id: TerminalStatsTab; label: string }> = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'discord', label: 'Discord' },
  { id: 'algo_trading', label: 'Algo trading' },
];

const DEFAULT_STATS: ReadonlyArray<TerminalStat> = [
  { id: 'return', label: 'RETURN', value: '+82.34%' },
  { id: 'win_rate', label: 'WIN RATE', value: '67.81%' },
  { id: 'max_dd', label: 'MAX DD', value: '5.27%' },
  { id: 'avg_fee', label: 'AVG FEE', value: '$43.10' },
  { id: 'equity', label: 'EQUITY', value: '$13,239.21' },
  { id: 'balance', label: 'BALANCE', value: '$3,000.00' },
  { id: 'pnl', label: 'PNL', value: '$10,239.21', valueTone: 'positive' },
];

function UserMenuChevron() {
  return (
    <span className={terminalStatsUserChevronClass} aria-hidden>
      <svg
        viewBox="0 0 3.17 7.27"
        width="3.17"
        height="7.27"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 3.635L3.171 0M0 3.633L3.171 7.268"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function TerminalStatsModule({
  className = '',
  tabs = DEFAULT_TABS,
  activeTab: activeTabProp,
  defaultTab = 'terminal',
  onTabChange,
  stats = DEFAULT_STATS,
  userName = 'Chento',
  onUserMenuClick,
}: TerminalStatsModuleProps) {
  const [internalTab, setInternalTab] = useState<TerminalStatsTab>(defaultTab);
  const activeTab = activeTabProp ?? internalTab;

  const handleTabChange = (tab: TerminalStatsTab) => {
    if (activeTabProp === undefined) setInternalTab(tab);
    onTabChange?.(tab);
  };

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

        <div className={terminalStatsDividerClass} aria-hidden />

        <div className={terminalStatsUserClass}>
          <button
            type="button"
            className={terminalStatsUserMenuClass}
            aria-haspopup="menu"
            aria-label={`${userName} account menu`}
            onClick={onUserMenuClick}
          >
            <span>{userName}</span>
            <UserMenuChevron />
          </button>
          <div className={terminalStatsAvatarClass} aria-hidden />
        </div>
      </div>
    </section>
  );
}
