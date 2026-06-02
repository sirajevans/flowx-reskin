import { cn } from '../../lib/utils';
import { cardModuleWidth960Class } from '../ui/cardModuleClasses';

export const positionsPanelRootClass = cn(
  'positions-panel box-border h-[255px] min-h-[255px] max-h-[255px]',
  cardModuleWidth960Class,
);

export const positionsPanelTabViewportClass = cn(
  'min-h-0 flex-1 overflow-hidden [grid-template-rows:minmax(0,1fr)] h-0',
);

export const positionsPanelTabPanelClass = 'min-h-0 overflow-hidden';

export const positionsPanelGridClass = cn(
  'box-border grid w-full items-center px-[9px]',
  'grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.95fr)_minmax(0,1.32fr)_minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,1.02fr)_minmax(0,0.765fr)_minmax(0,0.9fr)_minmax(0,1.155fr)]',
);

export const positionsPanelGridHeaderClass = 'min-h-[15px]';

export const positionsPanelColClass = cn(
  'box-border flex min-w-0 max-w-full justify-start overflow-x-auto overflow-y-hidden',
  'text-left text-[10px] leading-[15px] tracking-[0.02em] text-[var(--widget-tab-inactive)] whitespace-nowrap',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
);

export const positionsPanelColHeaderClass = 'overflow-y-visible';

/** Header-only: PNL column without left alignment (cn does not merge Tailwind conflicts). */
export const positionsPanelColPnlHeaderClass = cn(
  'box-border flex min-w-0 max-w-full justify-end overflow-x-auto overflow-y-hidden',
  'text-right text-[10px] leading-[15px] tracking-[0.02em] text-[var(--widget-tab-inactive)] whitespace-nowrap',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
);

/** Header-only: base col styles without left alignment (cn does not merge Tailwind conflicts). */
export const positionsPanelColActionsHeaderClass = cn(
  'box-border flex min-w-0 max-w-full justify-end overflow-x-auto overflow-y-hidden',
  'text-right text-[10px] leading-[15px] tracking-[0.02em] text-[var(--widget-tab-inactive)] whitespace-nowrap',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
);

export const positionsPanelRowsClass = cn(
  'box-border flex h-full min-h-0 flex-col self-stretch overflow-y-auto',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  '[&_[role=rowgroup]]:flex [&_[role=rowgroup]]:flex-col [&_[role=rowgroup]]:gap-0.5 [&_[role=rowgroup]]:self-stretch',
);

export const positionsPanelRowClass = cn(
  positionsPanelGridClass,
  'h-[34px] shrink-0 cursor-pointer overflow-hidden rounded-lg bg-[#1d1d1d80] outline-none',
  'even:bg-transparent focus-visible:shadow-[0_0_0_1px_var(--flowx-border)]',
);

export const positionsPanelCellClass = cn(
  'box-border flex min-w-0 max-w-full flex-col items-start justify-center overflow-x-auto overflow-y-hidden',
  '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
);

export const positionsPanelCellSideClass = 'overflow-visible';

/** PNL cell without left alignment (cn does not merge Tailwind conflicts). */
export const positionsPanelCellPnlClass = cn(
  'box-border flex min-w-0 max-w-full flex-col items-end justify-center overflow-visible',
  '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
);
export const positionsPanelCellActionsClass = cn(
  'flex-row items-end justify-end gap-3 overflow-visible',
);

export const positionsPanelCellTextBaseClass =
  'shrink-0 whitespace-nowrap text-xs leading-[15px]';

export const positionsPanelCellTextClass = cn(
  positionsPanelCellTextBaseClass,
  'text-left text-[var(--flowx-text)]',
);

export const positionsPanelCellTextPnlClass = cn(
  positionsPanelCellTextBaseClass,
  'text-right text-[var(--flowx-text)]',
);

export const positionsPanelCellTextPnlPositiveClass = cn(
  positionsPanelCellTextBaseClass,
  'text-right text-[#06b470]',
);

export const positionsPanelCellTextPnlNegativeClass = cn(
  positionsPanelCellTextBaseClass,
  'text-right text-[var(--color-sell)]',
);
export const positionsPanelCellTextExchangeClass = 'text-right text-[var(--flowx-text)]';

export const positionsPanelEntryMarketClass = 'inline-flex items-center gap-[0.25em]';

export const positionsPanelMarketValueClass = 'text-[length:inherit] leading-[inherit]';
export const positionsPanelMarketValueFavorableClass = 'text-[#06b470]';
export const positionsPanelMarketValueUnfavorableClass = 'text-[var(--color-sell)]';

export const positionsPanelSideBadgeClass = cn(
  'inline-flex shrink-0 items-center justify-center rounded-md px-[5px] py-0.5',
  'box-border text-xs leading-[15px] whitespace-nowrap',
);

export const positionsPanelSideBadgeBuyClass = 'bg-[#04b97d0d] text-[#04b97d]';
export const positionsPanelSideBadgeSellClass = 'bg-[rgba(241,60,84,0.05)] text-[#f13c54]';

export const positionsPanelRowActionsClass =
  'flex items-center justify-center gap-3 self-stretch';

export const positionsPanelActionBtnClass = cn(
  'relative flex h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center overflow-visible border-0 bg-transparent p-0',
  'text-[var(--widget-icon-muted)] transition-colors duration-150 ease-in-out',
  '[&_svg]:text-inherit [&_svg]:transition-colors motion-reduce:transition-none',
  'focus-visible:rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);

export const positionsPanelActionBtnMutedHoverClass =
  '[@media(hover:hover)]:hover:text-[var(--flowx-muted)]';

export const positionsPanelActionBtnDangerClass = cn(
  positionsPanelActionBtnClass,
  'text-sell [@media(hover:hover)]:hover:text-[color-mix(in_srgb,var(--color-sell)_78%,white)]',
);
