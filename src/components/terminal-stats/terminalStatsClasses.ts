import { cn } from '../../lib/utils';

const gradientBorder =
  '[--gradient-border:linear-gradient(180deg,oklch(25%_0_0)_0%,oklch(22.5%_0_0)_50%,oklch(20%_0_0)_100%)]';

export const terminalStatsRootClass = cn(
  'gradient-border box-border flex items-center justify-between gap-6 overflow-clip rounded-[10px]',
  'bg-[var(--widget-chrome-bg)] py-2.5 px-[19px]',
  "font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] [font-synthesis:none] antialiased",
  gradientBorder,
  'max-[1200px]:flex-col max-[1200px]:items-start max-[1200px]:gap-3',
);

export const terminalStatsTabsClass = 'flex min-w-0 items-center gap-[30px]';

export const terminalStatsTabClass = cn(
  'cursor-pointer border-0 bg-transparent p-0 font-inherit text-[13px] leading-4 text-[var(--flowx-text)] opacity-50',
  'transition-opacity duration-150 ease-in-out motion-reduce:transition-none',
  'data-[selected=true]:opacity-100',
  '[@media(hover:hover)]:hover:opacity-80',
  'focus-visible:rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)] focus-visible:outline-offset-[3px]',
);

export const terminalStatsStatsClass = cn(
  'flex min-w-0 items-center justify-end gap-9',
  'max-[1200px]:w-full max-[1200px]:flex-wrap max-[1200px]:justify-start max-[1200px]:gap-x-6 max-[1200px]:gap-y-4',
);

export const terminalStatsStatClass = 'flex shrink-0 flex-col items-end gap-1';

export const terminalStatsStatLabelClass =
  'text-right text-[10px] leading-3 tracking-[0.05em] text-[var(--widget-tab-inactive)]';

export const terminalStatsStatValueClass =
  'text-right text-[13px] leading-4 text-[var(--flowx-text)]';

export const terminalStatsStatValuePositiveClass = 'text-[#06b470]';
