import { cn } from '../../lib/utils';

export const liquidationsSegmentBarClass = cn(
  'mb-1 box-border flex h-3 min-w-0 w-full items-stretch gap-0.5 self-stretch',
  'data-[above-threshold=true]:[&_[data-filled=true]]:bg-[#06b470]',
  'data-[above-threshold=false]:[&_[data-filled=false]]:bg-[#f23645]',
  'data-[animating=true]:[&_span]:![transition-duration:var(--liquidations-step-ms,8ms)]',
);

export const liquidationsSegmentBarSegmentClass = cn(
  'min-w-0 flex-1 rounded-full bg-[var(--widget-icon-dim)]',
  'transition-[background-color] duration-[320ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] motion-reduce:transition-none',
);
