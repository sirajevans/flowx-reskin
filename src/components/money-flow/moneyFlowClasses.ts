import { cn } from '../../lib/utils';

export const moneyFlowPanelRootClass = 'w-[365px]';

export const moneyFlowTierClass =
  'box-border flex min-w-0 flex-col gap-2.5 self-stretch';

export const moneyFlowTierFooterClass =
  'box-border flex min-w-0 flex-col gap-px self-stretch';

export const moneyFlowTierLabelClass =
  'min-w-0 self-stretch text-[10px] leading-3 tracking-[0.02em] text-[var(--widget-tab-inactive)]';

export const moneyFlowTierRowClass =
  'box-border flex min-w-0 items-center justify-between self-stretch';

export const moneyFlowSentimentClass = 'box-border flex shrink-0 items-center gap-1';

export const moneyFlowSentimentLabelClass =
  'shrink-0 whitespace-nowrap text-[13px] leading-4 text-[var(--flowx-text)]';

export const moneyFlowAmountClass = cn(
  'shrink-0 text-right text-[13px] leading-4 text-[var(--flowx-text)] whitespace-nowrap tabular-nums',
  'transition-colors duration-[320ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] motion-reduce:transition-none',
);

export const moneyFlowDividerClass = cn(
  'm-0 h-px shrink-0 self-stretch border-0',
  'bg-[repeating-linear-gradient(90deg,var(--widget-icon-dim)_0,var(--widget-icon-dim)_2px,transparent_2px,transparent_6px)]',
);
