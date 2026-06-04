import { cn } from '../../lib/utils';

const gradientBorder =
  '[--gradient-border:linear-gradient(180deg,oklch(25%_0_0)_0%,oklch(22.5%_0_0)_50%,oklch(20%_0_0)_100%)]';

export const terminalStatsRootClass = cn(
  'gradient-border box-border flex max-h-[52px] select-none items-center justify-between gap-3 overflow-clip rounded-[10px]',
  'bg-[#0A0A0A] py-2.5 px-4',
  "font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] [font-synthesis:none] antialiased",
  gradientBorder,
);

export const terminalStatsSymbolSectionClass =
  'flex min-w-0 items-center justify-start gap-6';

export const terminalStatsSymbolGroupClass = cn(
  'flex min-w-0 shrink-0 cursor-pointer items-center gap-3.5',
  'transition-opacity duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:opacity-50',
);

export const terminalStatsSymbolIconClass =
  'h-[18.25px] w-[18.25px] shrink-0 bg-cover bg-center bg-no-repeat';

export const terminalStatsSymbolMetaClass = 'flex w-[59px] shrink-0 flex-col items-start';

export const terminalStatsSymbolTypeClass =
  'w-max text-[10px] leading-3 tracking-[0.05em] text-[var(--widget-tab-inactive)]';

export const terminalStatsSymbolNameClass = 'w-max text-[13px] leading-4 text-[var(--flowx-text)]';

export const terminalStatsMetricsClass =
  'flex min-w-0 items-center justify-end gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

export const terminalStatsStatClass = 'flex shrink-0 flex-col gap-1';

export const terminalStatsStatAlignStartClass = 'items-start';

export const terminalStatsStatAlignEndClass = 'items-end';

export const terminalStatsStatLabelClass =
  'w-max text-[10px] leading-3 tracking-[0.05em] text-[var(--widget-tab-inactive)]';

export const terminalStatsStatLabelEndClass = cn(terminalStatsStatLabelClass, 'text-right');

export const terminalStatsStatValueClass =
  'min-w-0 self-stretch text-[13px] leading-4 [font-variant-numeric:tabular-nums]';

export const terminalStatsStatValueEndClass = cn(terminalStatsStatValueClass, 'text-right');

export const terminalStatsStatValueDefaultClass = 'text-[var(--flowx-text)]';

export const terminalStatsStatValuePositiveClass = 'text-[#06b470]';

export const terminalStatsRightClass = cn(
  'flex min-w-0 flex-1 items-center justify-end gap-6',
);

export const terminalStatsUserClass = 'flex shrink-0 items-center';

export const terminalStatsUserTriggerClass = cn(
  'flex cursor-pointer items-center gap-[14px] border-0 bg-transparent p-0 font-inherit text-[13px] leading-4 text-[var(--flowx-text)] outline-none',
  'transition-opacity duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:opacity-80',
  'data-[state=open]:opacity-80',
);

export const terminalStatsAvatarShellClass = cn(
  'box-border size-[28px] shrink-0 overflow-clip rounded-lg',
  'outline outline-1 -outline-offset-1 outline-[var(--widget-icon-dim)]',
);

export const terminalStatsAvatarClass = 'size-full rounded-lg object-cover';
