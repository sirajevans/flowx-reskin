import { cn } from '../../lib/utils';
import { cardModuleWidth365Class } from '../ui/cardModuleClasses';

export const fundingRatesPanelRootClass = cardModuleWidth365Class;

export const fundingRatesPanelBodyClass = 'gap-2 min-h-0';

export const fundingRatesPanelLegendClass =
  'flex min-w-0 flex-col gap-1 pt-1';

export const fundingRatesPanelLegendItemClass = cn(
  'flex w-full min-w-0 items-center justify-between gap-3 rounded-[8px] border border-transparent px-2 py-1.5 text-left',
  'transition-[border-color,background-color] duration-150 ease-in-out motion-reduce:transition-none',
  'data-[selected=true]:border-[rgba(255,255,255,0.12)] data-[selected=true]:bg-[rgba(255,255,255,0.04)]',
  '[@media(hover:hover)]:hover:bg-[rgba(255,255,255,0.03)]',
  'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);

export const fundingRatesPanelLegendRowClass = 'flex min-w-0 items-center gap-2';

export const fundingRatesPanelLegendSwatchClass =
  'h-2 w-2 shrink-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.08)]';

export const fundingRatesPanelLegendLabelClass =
  'truncate text-[13px] leading-[16px] text-[var(--flowx-text)]';

export const fundingRatesPanelLegendValueClass = cn(
  'shrink-0 text-[13px] leading-[16px] text-right',
  '[font-variant-numeric:tabular-nums]',
);
