import { cn } from '../../lib/utils';

const tooltipGradientBorder =
  '[--gradient-border:linear-gradient(180deg,oklch(25%_0_0)_0%,oklch(22.5%_0_0)_50%,oklch(20%_0_0)_100%)]';

export const tooltipContentClass = cn(
  'z-50 max-w-60 box-border overflow-clip animate-tooltip-in rounded-[8px]',
  'bg-[color-mix(in_srgb,var(--flowx-panel-strong)_75%,transparent)] backdrop-blur-[8px]',
  'gradient-border',
  tooltipGradientBorder,
  'px-1.5 py-1 font-sans text-[11px] leading-[14px] font-normal text-[var(--flowx-text)]',
  'shadow-[0_4px_12px_rgba(0,0,0,0.35)] select-none motion-reduce:animate-none',
  'data-[state=closed]:animate-tooltip-out',
);
