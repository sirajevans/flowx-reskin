import { cn } from '../../lib/utils';

export const tooltipContentClass = cn(
  'z-50 max-w-60 animate-tooltip-in rounded-[8px] border border-[color-mix(in_srgb,var(--flowx-border)_50%,#000)]',
  'bg-[var(--flowx-panel-strong)] px-1.5 py-1 font-sans text-[11px] leading-[14px] font-normal text-[var(--flowx-text)]',
  'shadow-[0_4px_12px_rgba(0,0,0,0.35)] select-none motion-reduce:animate-none',
  'data-[state=closed]:animate-tooltip-out',
);
