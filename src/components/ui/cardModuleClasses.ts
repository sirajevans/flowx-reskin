import { cn } from '../../lib/utils';

const cardModuleGradientBorder =
  '[--gradient-border:linear-gradient(180deg,oklch(25%_0_0)_0%,oklch(22.5%_0_0)_50%,oklch(20%_0_0)_100%)]';

/** Standard widget column width (matches legacy `--card-module-width: 365px`). */
export const cardModuleWidth365Class = '[--card-module-width:365px]';

export const cardModuleRootClass = cn(
  'box-border flex w-[var(--card-module-width,auto)] flex-col items-start gap-[18px] overflow-clip rounded-[10px]',
  'bg-[var(--widget-chrome-bg)] p-3',
  "font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] [font-synthesis:none] antialiased",
  'gradient-border',
  cardModuleGradientBorder,
);

export const cardModuleHeaderClass =
  'box-border flex min-w-0 items-center gap-2 self-stretch';

export const cardModuleHeaderMainClass =
  'box-border flex min-w-0 flex-1 items-center gap-2';

export const cardModuleDragHandleClass = cn(
  'flex shrink-0 cursor-grab items-center justify-center text-[var(--widget-icon-dim)] transition-colors duration-150 ease-in-out',
  '[&_svg]:text-inherit [&_svg]:transition-colors motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:text-[var(--widget-icon-muted)]',
);

export const cardModuleCloseBtnClass = cn(
  'relative flex h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center overflow-clip border-0 bg-transparent p-0',
  'text-[var(--widget-icon-dim)] transition-colors duration-150 ease-in-out',
  '[&_svg]:text-inherit [&_svg]:transition-colors motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:text-[var(--flowx-muted)]',
  'focus-visible:rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);

export const cardModuleBodyClass = 'box-border flex min-w-0 flex-col gap-3 self-stretch';

/** Panels that use 18px vertical rhythm between body children (default body gap is 12px). */
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
