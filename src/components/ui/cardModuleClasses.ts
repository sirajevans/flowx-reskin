import { cn } from '../../lib/utils';

export const cardModuleGradientBorder =
  '[--gradient-border:linear-gradient(180deg,oklch(25%_0_0)_0%,oklch(22.5%_0_0)_50%,oklch(20%_0_0)_100%)]';

/** Shared module shell — matches command dialog outer frame (blur, gradient border, padding). */
export const commandModuleParentClass = cn(
  'box-border flex select-none flex-col items-start overflow-clip rounded-[10px] p-3',
  'bg-[color-mix(in_srgb,var(--widget-chrome-bg)_75%,transparent)] backdrop-blur-[4px]',
  'gradient-border',
  cardModuleGradientBorder,
  "font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif]",
);

/** Standard widget column width (matches legacy `--card-module-width: 365px`). */
export const cardModuleWidth365Class = '[--card-module-width:365px]';

/** Wide bottom-row module (positions table). */
export const cardModuleWidth960Class = '[--card-module-width:960px]';

export const cardModuleRootClass = cn(
  'group w-[var(--card-module-width,auto)] gap-[18px]',
  commandModuleParentClass,
);

export const cardModuleClosingClass = 'card-module-is-closing pointer-events-none';

/** Applied to the react-grid-layout item so resize handles close in sync with the module. */
export const cardModuleGridItemClosingClass = 'card-module-grid-item-closing';

export const cardModuleHeaderClass =
  'box-border flex min-w-0 items-center gap-2 self-stretch';

export const cardModuleHeaderMainClass =
  'box-border flex min-w-0 flex-1 items-center gap-2';

export const cardModuleDragHandleClass = cn(
  'module-drag-handle flex shrink-0 cursor-grab items-center justify-center text-[var(--widget-icon-dim)] transition-colors duration-150 ease-in-out active:cursor-grabbing',
  '[&_svg]:text-inherit [&_svg]:transition-colors motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:text-[var(--widget-icon-muted)]',
);

export const cardModuleCloseIconClass = cn(
  'opacity-0 transition-[opacity,color] duration-[300ms] ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:group-hover:opacity-100',
);

export const cardModuleCloseBtnClass = cn(
  'relative flex h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center overflow-clip border-0 bg-transparent p-0',
  'text-[var(--widget-icon-dim)]',
  cardModuleCloseIconClass,
  '[&_svg]:text-inherit [&_svg]:transition-colors motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:text-[var(--flowx-muted)]',
  'focus-visible:rounded focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);

export const cardModuleBodyClass =
  'box-border flex min-w-0 flex-col gap-3 self-stretch';

export const cardModuleBodyGap18Class = 'gap-[18px]';

export const cardModuleBodyFlexFillClass = 'min-h-0 flex-1';

export const cardModuleTabListClass = 'box-border flex h-[18px] items-center gap-4';

export const cardModuleTabClass = cn(
  'cursor-pointer border-0 bg-transparent p-0 font-inherit text-[13px] leading-4 text-[var(--widget-tab-inactive)]',
  'outline-none transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  'data-[selected]:text-[var(--flowx-text)] aria-selected:text-[var(--flowx-text)]',
  'focus-visible:rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
  '[@media(hover:hover)]:[&:not([data-selected])]:[&:not([aria-selected=true])]:hover:text-[color-mix(in_srgb,var(--flowx-text)_88%,transparent)]',
);

export const cardModuleHeaderTextClass = 'text-[13px] leading-4 text-[var(--flowx-text)]';

export const cardModuleHeaderLabelsClass =
  'box-border flex min-w-0 items-center gap-5';

export const cardModuleTabViewportClass = 'grid min-w-0 self-stretch overflow-hidden';

export const cardModuleTabPanelBaseClass = cn(
  'col-start-1 row-start-1 box-border flex min-w-0 flex-col gap-3 opacity-0 pointer-events-none translate-x-0 z-0',
  'data-[state=active]:opacity-100 data-[state=active]:pointer-events-auto data-[state=active]:z-[1]',
  'data-[state=enter][data-direction=forward]:opacity-0 data-[state=enter][data-direction=forward]:translate-x-4',
  'data-[state=enter][data-direction=backward]:opacity-0 data-[state=enter][data-direction=backward]:-translate-x-4',
  'motion-reduce:data-[state=active]:translate-x-0 motion-reduce:data-[state=active]:opacity-100',
);

export const cardModuleTabPanelEnterForwardClass =
  'animate-card-tab-enter-forward pointer-events-auto z-[2] motion-reduce:animate-none';

export const cardModuleTabPanelEnterBackwardClass =
  'animate-card-tab-enter-backward pointer-events-auto z-[2] motion-reduce:animate-none';

export const cardModuleTabPanelExitForwardClass =
  'animate-card-tab-exit-forward pointer-events-none z-[1] motion-reduce:animate-none';

export const cardModuleTabPanelExitBackwardClass =
  'animate-card-tab-exit-backward pointer-events-none z-[1] motion-reduce:animate-none';
