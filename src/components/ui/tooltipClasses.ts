import { cn } from '../../lib/utils';

export const tooltipContentClass = cn(
  'z-50 max-w-60 animate-tooltip-in rounded-md border border-[var(--flowx-border)]',
  'bg-[var(--flowx-panel-strong)] px-2 py-1 font-sans text-[11px] leading-[14px] font-normal text-[var(--flowx-text)]',
  'shadow-[0_4px_12px_rgba(0,0,0,0.35)] select-none motion-reduce:animate-none',
  'data-[state=closed]:animate-tooltip-out',
);

export const tooltipContentInnerClass = 'flex items-center gap-2';

export const tooltipContentShortcutClass = cn(
  'inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-[3px] border border-[var(--flowx-border)]',
  'bg-[color-mix(in_srgb,var(--flowx-text)_8%,transparent)] px-1',
  "font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] text-[10px] font-semibold leading-none text-[var(--flowx-muted)]",
);
