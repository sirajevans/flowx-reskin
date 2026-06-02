import { cn } from '../../lib/utils';

const fieldGradientBorder =
  '[--gradient-border:linear-gradient(180deg,oklch(25%_0_0)_0%,oklch(22.5%_0_0)_50%,oklch(20%_0_0)_100%)]';

const fieldShellBase = cn(
  'box-border flex h-7 min-w-0 items-center self-stretch overflow-clip rounded-lg bg-[#1d1d1d80]',
  'gradient-border',
  fieldGradientBorder,
);

export const orderPanelRootClass = 'w-[365px]';

export const orderPanelSideToggleClass =
  'box-border flex w-full min-w-0 items-center gap-[5px] self-stretch';

export const orderPanelSideBtnClass = cn(
  'box-border flex h-7 min-w-0 flex-1 cursor-pointer items-center justify-center overflow-clip rounded-lg border-0',
  'bg-[#1d1d1d80] p-0 font-inherit text-xs leading-4 text-[var(--flowx-text)] outline-none',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  'focus-visible:shadow-[0_0_0_1px_var(--flowx-border)]',
  'data-[selected=true]:data-[side=buy]:bg-[#06b470]',
  'data-[selected=true]:data-[side=sell]:bg-[var(--color-sell)]',
);

export const orderPanelSectionClass =
  'box-border flex min-w-0 flex-col gap-[5px] self-stretch';

export const orderPanelLimitFieldsClass =
  'box-border flex min-w-0 items-start gap-1.5 self-stretch';

export const orderPanelLimitFieldClass =
  'flex min-w-0 flex-1 flex-col gap-[5px]';

export const orderPanelSectionHeaderClass =
  'box-border flex min-h-3.5 min-w-0 items-center justify-between self-stretch';

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
  'min-w-0 flex-1 px-2.5 opacity-50 transition-opacity duration-150 ease-in-out',
  'data-[enabled=true]:opacity-100 motion-reduce:transition-none',
);

export const orderPanelAmountPrefixClass =
  'pointer-events-none shrink-0 select-none text-[11px] leading-[14px] text-[var(--flowx-text)]';

export const orderPanelFieldClass = cn(
  'box-border h-full min-w-0 flex-1 overflow-clip rounded-none border-0 bg-transparent p-0 font-inherit',
  'text-[11px] leading-[14px] text-[var(--flowx-text)] outline-none',
  'placeholder:text-[var(--widget-tab-inactive)] focus-visible:outline-none disabled:cursor-not-allowed',
);

export const orderPanelFieldAmountClass = 'pl-1';

export const orderPanelFieldPercentClass = 'w-0 min-w-[1.8rem] flex-[0_1_auto]';

export const orderPanelFieldSuffixClass =
  'pointer-events-none shrink-0 select-none text-[11px] leading-[14px] text-[var(--flowx-text)]';

export const orderPanelRiskRowClass =
  'box-border flex min-w-0 items-center gap-[5px] self-stretch';

export const orderPanelRiskToggleClass = cn(
  'group/risk relative h-7 min-w-0 flex-1 cursor-pointer overflow-clip rounded-lg border-0 bg-[#1d1d1d80] p-0 outline-none',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:bg-[color-mix(in_srgb,#1d1d1d80_98%,white)]',
  'focus-visible:shadow-[0_0_0_1px_var(--flowx-border)]',
);

export const orderPanelRiskToggleLabelClass =
  'pointer-events-none absolute top-1/2 left-[9.49px] -translate-y-1/2 font-inherit text-[11px] leading-[14px] text-[var(--flowx-text)]';

export const orderPanelRiskToggleIndicatorClass = cn(
  'absolute top-1/2 right-2.5 flex h-3.5 w-3.5 -translate-y-1/2 items-center justify-center rounded border border-[#212121]',
  'box-border bg-[var(--widget-chrome-bg)] text-[#fdfffe] transition-colors duration-150 ease-in-out',
  'motion-reduce:transition-none group-data-[enabled=true]/risk:bg-[#06b470]',
  '[&_svg]:translate-x-[0.3px]',
);

export const orderPanelRiskToggleCheckClass = cn(
  'opacity-0 scale-95 transition-[opacity,transform] duration-150 ease-out',
  'group-data-[enabled=true]/risk:scale-100 group-data-[enabled=true]/risk:opacity-100 motion-reduce:transition-none',
);

export const orderPanelStatsClass =
  'box-border flex min-w-0 items-center justify-between self-stretch';

export const orderPanelStatClass = cn(
  orderPanelLabelClass,
  orderPanelLabelWideClass,
);

export const orderPanelStatRightClass = 'text-right';

export const orderPanelSubmitWrapClass = cn(
  'group/submit box-border flex h-[30px] min-w-0 flex-col items-center gap-[7px] self-stretch overflow-clip rounded-lg',
  'bg-[#1d1d1d80] p-0 transition-[height,padding,border-radius] duration-[220ms] ease-in-out motion-reduce:transition-none',
  'data-[warning-visible=true]:h-16 data-[warning-visible=true]:rounded-[10px] data-[warning-visible=true]:p-[3px]',
);

export const orderPanelSubmitClass = cn(
  'box-border flex h-[30px] min-w-0 shrink-0 cursor-pointer items-center justify-center self-stretch overflow-clip rounded-lg',
  'border-0 bg-white px-[61px] py-1 font-inherit text-center text-xs leading-4 text-black outline-none',
  'transition-opacity duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:opacity-[0.92]',
  'focus-visible:shadow-[0_0_0_1px_var(--flowx-border)]',
);

export const orderPanelSubmitNoteClass = cn(
  'pointer-events-none box-border flex min-w-0 items-center justify-center gap-1 opacity-0',
  '-translate-y-[3px] transition-[opacity,transform] duration-[180ms,220ms] ease-in-out motion-reduce:transition-none',
  'group-data-[warning-visible=true]/submit:translate-y-0 group-data-[warning-visible=true]/submit:opacity-100',
);

export const orderPanelSubmitNoteIconClass = 'block h-[11px] w-3 shrink-0';

export const orderPanelSubmitNoteTextClass =
  'text-right text-[11px] leading-[14px] text-[var(--flowx-text)]';
