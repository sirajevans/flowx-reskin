import { cn } from '../../lib/utils';

import { cardModuleWidth365Class } from '../ui/cardModuleClasses';

export const liquidationsPanelRootClass = cardModuleWidth365Class;

export const liquidationsPanelRowClass =
  'box-border flex min-w-0 items-center justify-between self-stretch';

export const liquidationsPanelStatClass = cn(
  'box-border flex w-[100px] shrink-0 flex-col gap-1',
);

export const liquidationsPanelStatRightClass = 'items-end';

export const liquidationsPanelStatLabelClass = cn(
  'min-w-0 w-[100px] self-stretch text-[10px] leading-3 tracking-[0.05em] text-[var(--widget-tab-inactive)]',
);

export const liquidationsPanelStatLabelRightClass = 'text-right';

export const liquidationsPanelStatValueClass = cn(
  'min-w-0 w-[100px] self-stretch text-[13px] leading-4 text-[var(--flowx-text)]',
  'transition-colors duration-[320ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] motion-reduce:transition-none',
);

export const liquidationsPanelStatValueRightClass = 'text-right';

export const liquidationsPanelStatValuePositiveClass = 'text-[#06b470]';
export const liquidationsPanelStatValueNegativeClass = 'text-[#f23645]';

export const liquidationsPanelTimeframeClass = cn(
  'box-border flex shrink-0 gap-0.5 overflow-clip rounded-lg bg-[var(--widget-chrome-bg)] p-1',
  'outline outline-1 -outline-offset-1 outline-[var(--widget-icon-dim)] shadow-[0_2px_10px_rgba(0,0,0,0.25)]',
);

export const liquidationsPanelTimeframeBtnClass = cn(
  'flex h-6 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0',
  'font-inherit text-[11px] leading-[14px] text-[var(--flowx-text)] opacity-50 outline-none',
  'transition-[background-color,color,opacity] duration-150 ease-in-out motion-reduce:transition-none',
  'data-[selected=true]:bg-[#1d1d1d] data-[selected=true]:opacity-100',
  '[@media(hover:hover)]:data-[selected=false]:hover:bg-white/10',
  '[@media(hover:hover)]:data-[selected=false]:hover:text-white',
  'focus-visible:shadow-[0_0_0_1px_var(--flowx-border)]',
);
