import { cn } from '../../lib/utils';

export const moneyFlowChartClass = cn(
  'relative box-border grid h-[51px] w-full items-stretch',
  '[grid-template-columns:repeat(var(--money-flow-bar-count,1),minmax(0,1fr))]',
  'gap-x-[1.91px]',
);

export const moneyFlowChartBaselineClass =
  'pointer-events-none absolute inset-x-0 top-1/2 z-0 h-px -translate-y-1/2 bg-[var(--widget-icon-dim)] opacity-0';

export const moneyFlowChartSlotClass = 'relative z-[1] h-full min-w-0';

export const moneyFlowChartBarBaseClass = cn(
  'absolute left-1/2 box-border min-h-0.5 w-[1.89px] min-w-[1.89px] max-w-[1.89px] -translate-x-1/2 rounded-[10px]',
  'transition-[height] duration-[320ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] motion-reduce:transition-none',
);

export const moneyFlowChartBarBullClass = 'bottom-1/2 bg-[#06b470]';
export const moneyFlowChartBarBearClass = 'top-1/2 bg-[#f23645]';
