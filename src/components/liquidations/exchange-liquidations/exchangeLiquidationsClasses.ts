import { cn } from '../../../lib/utils';

import { cardModuleWidth365Class } from '../../ui/cardModuleClasses';

export const exchangeLiquidationsPanelRootClass = cn(
  cardModuleWidth365Class,
  'box-border h-full min-h-0 max-h-none w-full min-w-0',
  '[--exchange-liquidations-fade-height:14px]',
);

export const exchangeLiquidationsListClass = cn(
  'box-border flex min-h-0 min-w-0 flex-1 flex-col gap-[18px] self-stretch overflow-x-clip overflow-y-auto',
  '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  '[-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_calc(100%-var(--exchange-liquidations-fade-height)),transparent_100%)]',
  '[mask-image:linear-gradient(to_bottom,#000_0%,#000_calc(100%-var(--exchange-liquidations-fade-height)),transparent_100%)]',
);

export const exchangeLiquidationsRowClass =
  'box-border flex min-w-0 items-center justify-between self-stretch';

export const exchangeLiquidationsExchangeClass =
  'box-border flex shrink-0 items-center gap-3';

export const exchangeLiquidationsIconWrapClass = cn(
  'box-border flex h-7 w-7 shrink-0 items-center justify-center overflow-clip rounded-lg',
  'border border-[var(--widget-icon-dim)] [&_svg]:block',
);

export const exchangeLiquidationsNameClass =
  'shrink-0 whitespace-nowrap text-[13px] leading-4 text-[var(--flowx-text)]';

export const exchangeLiquidationsStatsClass =
  'box-border flex shrink-0 flex-wrap items-center justify-center gap-2.5';

export const exchangeLiquidationsAmountClass =
  'shrink-0 text-right text-[13px] leading-4 whitespace-nowrap';

export const exchangeLiquidationsAmountShortClass = 'text-[#f23645]';
export const exchangeLiquidationsAmountLongClass = 'text-[#06b470]';

export const exchangeLiquidationsBarsClass =
  'box-border flex h-5 w-[58.8px] shrink-0 items-center gap-1';

export const exchangeLiquidationsBarBaseClass = cn(
  'h-0.5 shrink-0 rounded-[1px] transition-[width] duration-[320ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]',
  'motion-reduce:transition-none',
);

export const exchangeLiquidationsBarShortClass = 'bg-[#f23645]';
export const exchangeLiquidationsBarLongClass = 'bg-[#06b470]';
