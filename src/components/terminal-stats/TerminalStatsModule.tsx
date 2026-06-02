import { useState } from 'react';
import './TerminalStatsModule.css';
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
      className={`terminal-stats-module gradient-border ${className}`.trim()}
    >
      <div className="terminal-stats-module__tabs" role="tablist" aria-label="Trading channels">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className="terminal-stats-module__tab"
            data-selected={activeTab === tab.id ? 'true' : undefined}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="terminal-stats-module__stats" role="list" aria-label="Terminal performance stats">
        {stats.map((stat) => (
          <div key={stat.id} className="terminal-stats-module__stat" role="listitem">
            <span className="terminal-stats-module__stat-label">{stat.label}</span>
            <span
              className={`terminal-stats-module__stat-value ${
                stat.valueTone === 'positive' ? 'terminal-stats-module__stat-value--positive' : ''
              }`.trim()}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
