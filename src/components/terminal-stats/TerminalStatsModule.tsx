import { Fragment, useId } from 'react';
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
import { TerminalStatsDivider } from './TerminalStatsDivider';
import {
  terminalStatsAvatarClass,
  terminalStatsAvatarShellClass,
  terminalStatsMetricsClass,
  terminalStatsRightClass,
  terminalStatsRootClass,
  terminalStatsStatAlignEndClass,
  terminalStatsStatAlignStartClass,
  terminalStatsStatClass,
  terminalStatsStatLabelClass,
  terminalStatsStatLabelEndClass,
  terminalStatsStatValueClass,
  terminalStatsStatValueDefaultClass,
  terminalStatsStatValueEndClass,
  terminalStatsStatValuePositiveClass,
  terminalStatsSymbolGroupClass,
  terminalStatsSymbolIconClass,
  terminalStatsSymbolMetaClass,
  terminalStatsSymbolNameClass,
  terminalStatsSymbolTypeClass,
  terminalStatsUserClass,
  terminalStatsUserTriggerClass,
} from './terminalStatsClasses';
import type {
  TerminalNavStat,
  TerminalStatsModuleProps,
  TerminalStatsUserMenuItem,
} from './types';

const DEFAULT_SYMBOL_ICON_URL =
  'https://app.paper.design/file-assets/01KSQ8AZ0MET5200XY523XT74Q/0REQFB7Q29MBVQ0V8P1FA42PGF.png';

const DEFAULT_STATS: ReadonlyArray<TerminalNavStat> = [
  { id: 'last_price', label: 'LAST PRICE', value: '63,237.9', valueTone: 'positive', align: 'end' },
  { id: 'change_24h', label: '24H CHANGE', value: '67.81 %', valueTone: 'positive', align: 'start' },
  { id: 'high_24h', label: '24H HIGH', value: '65,344.0', align: 'start' },
  { id: 'low_24h', label: '24H LOW', value: '61,350.1', align: 'start' },
  { id: 'return', label: 'RETURN', value: '+82.34 %', align: 'end' },
  { id: 'win_rate', label: 'WIN RATE', value: '67.81 %', align: 'end' },
  { id: 'max_dd', label: 'MAX DD', value: '5.27 %', align: 'end' },
  { id: 'equity', label: 'EQUITY', value: '$ 13,239.21', align: 'end' },
  { id: 'balance', label: 'BALANCE', value: '$ 3,000.00', align: 'end' },
  { id: 'pnl', label: 'PNL', value: '$ 10,239.21', valueTone: 'positive', align: 'end' },
];

const DEFAULT_USER_MENU_ITEMS: ReadonlyArray<TerminalStatsUserMenuItem> = [
  { id: 'profile', label: 'Profile', shortcut: '⇧⌘P' },
  { id: 'billing', label: 'Billing', shortcut: '⌘B' },
  { id: 'settings', label: 'Settings', shortcut: '⌘S' },
  { id: 'logout', label: 'Log out', shortcut: '⇧⌘Q', variant: 'destructive' },
];

function NavStatColumn({ stat }: { stat: TerminalNavStat }) {
  const alignEnd = stat.align !== 'start';

  return (
    <div
      role="listitem"
      className={cn(
        terminalStatsStatClass,
        alignEnd ? terminalStatsStatAlignEndClass : terminalStatsStatAlignStartClass,
      )}
    >
      <span className={alignEnd ? terminalStatsStatLabelEndClass : terminalStatsStatLabelClass}>
        {stat.label}
      </span>
      <span
        className={cn(
          alignEnd ? terminalStatsStatValueEndClass : terminalStatsStatValueClass,
          stat.valueTone === 'positive'
            ? terminalStatsStatValuePositiveClass
            : terminalStatsStatValueDefaultClass,
        )}
      >
        {stat.value}
      </span>
    </div>
  );
}

export function TerminalStatsModule({
  className = '',
  symbolIconUrl = DEFAULT_SYMBOL_ICON_URL,
  marketType = 'PERP',
  symbol = 'BTCUSDT',
  stats = DEFAULT_STATS,
  userName = 'Chento',
  userAvatarSrc = profilePlaceholder,
  userMenuItems = DEFAULT_USER_MENU_ITEMS,
  onUserMenuSelect,
}: TerminalStatsModuleProps) {
  const dividerBaseId = useId();

  const handleUserMenuSelect = (item: TerminalStatsUserMenuItem) => {
    item.onSelect?.();
    onUserMenuSelect?.(item.id);
  };

  const defaultItems = userMenuItems.filter((item) => item.variant !== 'destructive');
  const destructiveItems = userMenuItems.filter((item) => item.variant === 'destructive');

  return (
    <section
      aria-label="Terminal navigation bar"
      className={cn(terminalStatsRootClass, className)}
    >
      <div className={terminalStatsSymbolGroupClass}>
        <div
          className={terminalStatsSymbolIconClass}
          style={{ backgroundImage: `url(${symbolIconUrl})` }}
          aria-hidden
        />
        <div className={terminalStatsSymbolMetaClass}>
          <div className={terminalStatsSymbolTypeClass}>{marketType}</div>
          <div className={terminalStatsSymbolNameClass}>{symbol}</div>
        </div>
      </div>

      <div className={terminalStatsRightClass}>
        <div className={terminalStatsMetricsClass} role="list" aria-label="Market and account stats">
          {stats.map((stat, index) => (
            <Fragment key={stat.id}>
              {index > 0 ? (
                <TerminalStatsDivider gradientId={`${dividerBaseId}-${stat.id}`} />
              ) : null}
              <NavStatColumn stat={stat} />
            </Fragment>
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
                  <img src={userAvatarSrc} alt="" className={terminalStatsAvatarClass} />
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
