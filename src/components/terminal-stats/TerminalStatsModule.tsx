import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  terminalStatsRootClass,
  terminalStatsStatClass,
  terminalStatsStatLabelClass,
  terminalStatsStatsClass,
  terminalStatsStatValueClass,
  terminalStatsStatValuePositiveClass,
  terminalStatsTabClass,
  terminalStatsTabsClass,
} from './terminalStatsClasses';
import type { TerminalStat, TerminalStatsModuleProps, TerminalStatsTab } from './types';

const DEFAULT_TABS: ReadonlyArray<{ id: TerminalStatsTab; label: string }> = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'discord', label: 'Discord' },
  { id: 'algo_trading', label: 'Algo trading' },
  { id: 'feedback', label: 'Feedback' },
];

const DEFAULT_STATS: ReadonlyArray<TerminalStat> = [
  { id: 'return', label: 'RETURN', value: '+82.34 %' },
  { id: 'win_rate', label: 'WIN RATE', value: '67.81 %' },
  { id: 'max_dd', label: 'MAX DD', value: '5.27 %' },
  { id: 'avg_fee', label: 'AVG FEE', value: '$ 43.10' },
  { id: 'equity', label: 'EQUITY', value: '$ 13,239.21' },
  { id: 'balance', label: 'BALANCE', value: '$ 3,000.00' },
  { id: 'pnl', label: 'PNL', value: '$ 10,239.21', valueTone: 'positive' },
];

export function TerminalStatsModule({
  className = '',
  tabs = DEFAULT_TABS,
  activeTab: activeTabProp,
  defaultTab = 'terminal',
  onTabChange,
  stats = DEFAULT_STATS,
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

      <div className={terminalStatsStatsClass} role="list" aria-label="Terminal performance stats">
        {stats.map((stat) => (
          <div key={stat.id} className={terminalStatsStatClass} role="listitem">
            <span className={terminalStatsStatLabelClass}>{stat.label}</span>
            <span
              className={cn(
                terminalStatsStatValueClass,
                stat.valueTone === 'positive' && terminalStatsStatValuePositiveClass,
              )}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
