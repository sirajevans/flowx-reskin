import { cn } from '../../lib/utils';

const dropdownMenuGradientBorder =
  '[--gradient-border:linear-gradient(180deg,oklch(25%_0_0)_0%,oklch(22.5%_0_0)_50%,oklch(20%_0_0)_100%)]';

export const dropdownMenuContentClass = cn(
  'z-50 box-border min-w-40 overflow-clip rounded-[10px]',
  'bg-[color-mix(in_srgb,var(--widget-chrome-bg)_80%,transparent)] backdrop-blur-[8px] p-1.5',
  "font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif]",
  'gradient-border',
  dropdownMenuGradientBorder,
  'text-[13px] leading-4 text-[var(--flowx-text)]',
  'animate-dropdown-in motion-reduce:animate-none',
  'data-[state=closed]:animate-dropdown-out',
);

export const dropdownMenuItemClass = cn(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-[6px] px-2 py-1.5 outline-none',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  'focus:bg-[var(--widget-row-selected)]',
  'data-[highlighted]:bg-[var(--widget-row-selected)]',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
);

export const dropdownMenuItemDestructiveClass = cn(
  'text-[var(--color-sell)]',
  'focus:bg-[color-mix(in_srgb,var(--color-sell)_12%,transparent)]',
  'data-[highlighted]:bg-[color-mix(in_srgb,var(--color-sell)_12%,transparent)]',
);

export const dropdownMenuLabelClass = cn(
  'px-2 py-1.5 text-[10px] leading-3 tracking-[0.05em] text-[var(--widget-tab-inactive)]',
);

export const dropdownMenuSeparatorClass = 'my-1 h-px bg-[var(--widget-icon-dim)]';

export const dropdownMenuShortcutClass = cn(
  'ml-auto text-[11px] leading-[14px] tracking-widest text-[var(--flowx-muted)]',
);
