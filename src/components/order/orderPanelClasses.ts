import { cn } from '../../lib/utils';
import { cardModuleWidth365Class } from '../ui/cardModuleClasses';

const fieldShellBase = cn(
  'order-panel-field-shell box-border flex h-[30px] min-w-0 items-center self-stretch overflow-clip rounded-lg bg-[#1d1d1d80]',
  'gradient-border',
);

export const orderPanelRootClass = cardModuleWidth365Class;

export const orderPanelBodyGapClass = 'gap-[16px]';

export const orderPanelSideToggleClass =
  'box-border flex w-full min-w-0 items-center gap-[5px] self-stretch';

export const orderPanelSideBtnClass = cn(
  'box-border flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-center overflow-clip rounded-lg border-0',
  'bg-[#1d1d1d80] p-0 font-inherit text-xs leading-4 text-[var(--flowx-text)] outline-none',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:data-[selected=false]:hover:bg-[#1d1d1dba]',
  'focus-visible:shadow-[0_0_0_1px_var(--flowx-border)]',
  'data-[selected=true]:data-[side=buy]:bg-[#06b470]',
  'data-[selected=true]:data-[side=sell]:bg-[var(--color-sell)]',
);

/** Prevents layout shift when Buy/Long and Sell/Short alternate. */
export const orderPanelSideBtnLabelClass = 'min-w-[5ch]';

export const orderPanelSectionClass =
  'box-border flex min-w-0 flex-col gap-[5px] self-stretch';

/** Edge inset (17px thumb → 8.5px half, rounded to 9px). */
export const orderPanelAmountSliderThumbInsetPx = 9;
export const orderPanelAmountSliderThumbWidthPx = 17;

export const orderPanelAmountSliderRootClass =
  'relative mt-[-4px] flex h-2.5 w-full shrink-0 touch-none items-center justify-center overflow-visible';

export const orderPanelAmountSliderRailGradient =
  'linear-gradient(in oklab 90deg, oklab(24.8% 0 0 / 0%) 0%, oklab(24.8% 0 0) 5.09%, oklab(24.8% 0 0) 94.83%, oklab(24.8% 0 0 / 0%) 100.01%)';

export const orderPanelAmountSliderRailFillGradient =
  'linear-gradient(in oklab 90deg, oklab(100% 0 0 / 0%) 0%, white 5.09%, white 94.83%, oklab(100% 0 0 / 0%) 100.01%)';

export const orderPanelAmountSliderRailWrapClass =
  'pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2';

export const orderPanelAmountSliderRailBaseClass = 'absolute inset-0';

export const orderPanelAmountSliderRailFillClipClass =
  'absolute inset-y-0 left-0 overflow-hidden';

export const orderPanelAmountSliderRailFillClass = 'absolute inset-y-0 left-0 h-full';

export const orderPanelAmountSliderThumbClass = cn(
  'pointer-events-none absolute top-0 h-2.5 w-[17px] shrink-0 overflow-clip rounded-sm border border-solid',
  'border-[#212121] bg-[#161616] transition-colors duration-150 ease-out motion-reduce:transition-none',
  'data-[active]:border-white',
);

export const orderPanelAmountSliderInputClass = cn(
  'pointer-events-none absolute top-0 bottom-0 left-[9px] right-[9px] z-[1] m-0 h-full w-auto appearance-none bg-transparent p-0 opacity-0',
  'disabled:cursor-not-allowed',
  '[&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-[17px] [&::-webkit-slider-thumb]:appearance-none',
  '[&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-[17px] [&::-moz-range-thumb]:appearance-none',
);

export const orderPanelLimitFieldsClass =
  'box-border flex min-w-0 items-start gap-1.5 self-stretch';

export const orderPanelLimitFieldClass =
  'flex min-w-0 flex-1 flex-col gap-[5px]';

export const orderPanelSectionHeaderClass =
  'box-border flex min-h-3.5 min-w-0 items-center justify-between self-stretch';

export const orderPanelRiskHeaderBtnClass = cn(
  orderPanelSectionHeaderClass,
  'group/risk-header w-full cursor-pointer border-0 bg-transparent p-0 font-inherit outline-none',
  'focus-visible:rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);

export const orderPanelRiskExpandIconClass = cn(
  'block h-3.5 w-3.5 shrink-0 text-[#868686] transition-transform duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] motion-reduce:transition-none',
  'group-data-[expanded=true]/risk-header:rotate-180',
);

export const orderPanelRiskFieldsSlotClass = cn(
  'grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] motion-reduce:transition-none',
  'data-[expanded]:grid-rows-[1fr] motion-reduce:grid-rows-[1fr]',
);

export const orderPanelRiskFieldsInnerClass = 'min-h-0 overflow-hidden';

export const orderPanelLabelClass =
  'shrink-0 text-[10px] leading-3 tracking-[0.02em] text-[var(--widget-tab-inactive)]';

export const orderPanelLabelWideClass = 'tracking-[0.05em]';

export const orderPanelCurrencyClass = cn(
  'group/currency flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-inherit outline-none',
  'focus-visible:rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);

export const orderPanelCurrencyCodeClass = cn(
  'text-right text-[10px] leading-3 tracking-[0.02em] text-[var(--widget-tab-inactive)] transition-colors duration-150 ease-in-out',
  'motion-reduce:transition-none',
  '[@media(hover:hover)]:group-hover/currency:text-[color-mix(in_srgb,var(--flowx-text)_72%,transparent)]',
);

export const orderPanelSwapBtnClass = cn(
  'flex h-3.5 w-3.5 shrink-0 items-center justify-center overflow-visible text-[#868686] transition-colors duration-150 ease-in-out',
  '[&_svg]:block [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out motion-reduce:[&_svg]:transition-none',
  'motion-reduce:transition-none',
  '[@media(hover:hover)]:group-hover/currency:text-[var(--flowx-muted)]',
);

export const orderPanelFieldShellLimitClass = cn(fieldShellBase, 'px-2.5');

export const orderPanelFieldShellAmountClass = cn(fieldShellBase, 'px-2.5');

export const orderPanelFieldShellRiskClass = cn(
  fieldShellBase,
  'min-w-0 flex-1 px-2.5 opacity-50 transition-opacity duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
  'data-[enabled=true]:opacity-100 motion-reduce:transition-none',
);

export const orderPanelAmountPrefixClass =
  'pointer-events-none shrink-0 select-none text-[11px] leading-[14px] text-[var(--flowx-text)]';

export const orderPanelFieldClass = cn(
  'box-border h-[30px] min-w-0 flex-1 overflow-clip rounded-none border-0 bg-transparent p-0 font-inherit',
  'text-[11px] leading-[14px] text-[var(--flowx-text)] outline-none',
  'placeholder:text-[var(--widget-tab-inactive)] focus-visible:outline-none disabled:cursor-not-allowed',
);

export const orderPanelFieldAmountClass = 'pl-1';

export const orderPanelRiskRowClass =
  'box-border flex min-w-0 items-center gap-[5px] self-stretch';

export const orderPanelStatsRootClass =
  'box-border flex min-w-0 flex-col gap-1 self-stretch';

export const orderPanelStatsRowClass =
  'box-border flex h-3.75 min-w-0 shrink-0 items-center justify-between self-stretch';

export const orderPanelStatPairClass = 'flex min-w-0 items-center gap-1';

export const orderPanelStatPairRightClass = 'justify-end';

export const orderPanelStatLabelClass = cn(
  orderPanelLabelClass,
  orderPanelLabelWideClass,
  'w-max',
);

export const orderPanelStatLabelRightClass = 'text-right';

export const orderPanelStatValueClass = cn(
  orderPanelLabelWideClass,
  'w-max shrink-0 text-[10px] leading-3 text-[var(--flowx-text)]',
);

export const orderPanelStatValueRightClass = 'text-right';

export const orderPanelSubmitWrapClass = cn(
  'group/submit box-border flex min-w-0 flex-col items-center gap-0 self-stretch overflow-clip rounded-lg',
  'bg-[#1d1d1d80] p-0 transition-[padding,gap,border-radius] duration-[220ms] ease-out motion-reduce:transition-none',
  'data-[warning-visible=true]:gap-[7px] data-[warning-visible=true]:rounded-[10px] data-[warning-visible=true]:p-[3px]',
);

export const orderPanelSubmitNoteSlotClass = cn(
  'mb-[5px] grid w-full min-w-0 grid-rows-[0fr] self-stretch transition-[grid-template-rows] duration-[220ms] ease-out motion-reduce:transition-none',
  'group-data-[warning-visible=true]/submit:grid-rows-[1fr]',
);

export const orderPanelSubmitNoteInnerClass = 'min-h-0 overflow-hidden';

export const orderPanelSubmitClass = cn(
  'box-border flex h-8 min-w-0 shrink-0 cursor-pointer items-center justify-center self-stretch overflow-clip rounded-lg',
  'border-0 bg-white px-[61px] py-1 font-inherit text-center text-xs leading-4 text-black outline-none',
  'opacity-80 transition-opacity duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:opacity-90',
  'focus-visible:shadow-[0_0_0_1px_var(--flowx-border)]',
);

export const orderPanelSubmitNoteClass = cn(
  'pointer-events-none box-border flex min-w-0 items-center justify-center gap-1 opacity-0',
  '-translate-y-[3px] transition-[opacity,transform] duration-[220ms] ease-out motion-reduce:transition-none',
  'group-data-[warning-visible=true]/submit:translate-y-0 group-data-[warning-visible=true]/submit:opacity-100',
);

export const orderPanelSubmitNoteIconClass = 'block h-[11px] w-3 shrink-0';

export const orderPanelSubmitNoteTextClass =
  'text-right text-[11px] leading-[14px] text-[var(--flowx-text)]';
