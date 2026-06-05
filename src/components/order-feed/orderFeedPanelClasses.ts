import { cn } from '../../lib/utils';
import { cardModuleWidth365Class } from '../ui/cardModuleClasses';

export const orderFeedPanelRootClass = cn(
  'box-border h-[488px]',
  cardModuleWidth365Class,
  '[--order-feed-fade-height:10px] [--order-feed-row-push-ms:65ms]',
  '[--order-feed-row-fade-ms:140ms]',
);

export const orderFeedVolumesClass =
  'box-border flex min-w-0 items-center justify-between self-stretch';

export const orderFeedVolumeClass = cn(
  'box-border flex w-[100px] shrink-0 flex-col gap-1',
);

export const orderFeedVolumeRightClass = 'items-end';

export const orderFeedVolumeLabelClass = cn(
  'min-w-0 w-[100px] self-stretch text-[10px] leading-3 tracking-[0.05em] text-[var(--widget-tab-inactive)]',
);

export const orderFeedVolumeLabelRightClass = 'text-right';

export const orderFeedVolumeValueClass =
  'min-w-0 w-[100px] self-stretch text-[13px] leading-4 text-[var(--flowx-text)]';

export const orderFeedVolumeValueRightClass = 'text-right';

export const orderFeedVolumeDividerClass =
  'm-0 h-[25.54px] w-px shrink-0 border-0 bg-[var(--widget-icon-dim)] p-0';

export const orderFeedFilterTriggerClass = cn(
  'relative flex h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center overflow-clip border-0 bg-transparent p-0',
  'text-[var(--widget-icon-dim)] opacity-0 transition-[opacity,color] duration-[300ms] ease-in-out',
  'data-[active=true]:opacity-100 data-[state=open]:opacity-100 motion-reduce:transition-none',
  '[&_svg]:text-inherit [&_svg]:transition-colors motion-reduce:[&_svg]:transition-none',
  '[@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:hover:text-[var(--flowx-muted)]',
  'outline-none focus:outline-none focus-visible:outline-none',
);

export const orderFeedFilterMenuItemClass = 'min-w-32';

export const orderFeedFilterIndicatorClass = cn(
  'ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-0',
  'data-[active=true]:opacity-100',
);

export const orderFeedFilterSliderSectionClass =
  'box-border flex min-w-0 flex-col gap-2 px-2 py-2';

export const orderFeedFilterSliderHeaderClass =
  'box-border flex min-w-0 items-center justify-between gap-2 text-[11px] leading-[14px] text-[var(--widget-tab-inactive)]';

export const orderFeedFilterSliderValueClass = 'text-[var(--flowx-text)]';

export const orderFeedGridClass = cn(
  'box-border grid min-h-0 min-w-0 flex-1 grid-cols-2 gap-x-[7px] self-stretch overflow-x-clip overflow-y-auto',
  '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  '[-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_calc(100%-var(--order-feed-fade-height)),transparent_100%)]',
  '[mask-image:linear-gradient(to_bottom,#000_0%,#000_calc(100%-var(--order-feed-fade-height)),transparent_100%)]',
);

export const orderFeedColumnClass = 'box-border flex min-w-0 flex-col gap-1';

export const orderFeedRowSlotClass = cn(
  'group/row-slot box-border grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--order-feed-row-push-ms)]',
  'ease-[cubic-bezier(0.25,0.46,0.45,0.94)] motion-reduce:grid-rows-[1fr] motion-reduce:transition-none',
  'data-expanded:grid-rows-[1fr]',
);

export const orderFeedRowClass = cn(
  'relative box-border flex min-h-0 min-w-0 shrink-0 items-center justify-between self-stretch overflow-clip',
  'rounded-md px-1.5 py-1 opacity-0 -translate-y-[calc(100%+4px)]',
  'transition-[opacity,transform] duration-[var(--order-feed-row-fade-ms),var(--order-feed-row-push-ms)]',
  'ease-[cubic-bezier(0.25,0.46,0.45,0.94),cubic-bezier(0.25,0.46,0.45,0.94)]',
  'group-data-expanded/row-slot:translate-y-0 group-data-expanded/row-slot:opacity-100',
  'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
  'data-[side=buy]:bg-[#06b4701a] data-[side=buy]:text-[#c3fbe5]',
  'data-[side=sell]:bg-[#f236451a] data-[side=sell]:text-[#ffd7da]',
);

export const orderFeedRowGradientBaseClass =
  'pointer-events-none absolute top-0 bottom-0 max-w-full box-border';

export const orderFeedRowGradientLeftClass = cn(
  orderFeedRowGradientBaseClass,
  'left-0 origin-left rounded-md',
);

export const orderFeedRowGradientRightClass = cn(
  orderFeedRowGradientBaseClass,
  'right-0 origin-right rounded-md',
);

export const orderFeedRowGradientLeftBuyClass = cn(
  'bg-[linear-gradient(in_oklab_90deg,oklab(74.6%_-0.162_0.066/50%)_0%,oklab(74.6%_-0.162_0.066/25%)_50%,oklab(74.6%_-0.162_0.066/0%)_100%)]',
);

export const orderFeedRowGradientLeftSellClass = cn(
  'bg-[linear-gradient(in_oklab_90deg,oklab(69.3%_0.224_0.094/50%)_0%,oklab(69.3%_0.224_0.094/25%)_50%,oklab(69.3%_0.224_0.094/0%)_100%)]',
);

export const orderFeedRowGradientRightBuyClass = cn(
  'bg-[linear-gradient(in_oklab_90deg,oklab(74.6%_-0.162_0.066/0%)_0%,oklab(74.6%_-0.162_0.066/25%)_50%,oklab(74.6%_-0.162_0.066/50%)_100%)]',
);

export const orderFeedRowGradientRightSellClass = cn(
  'bg-[linear-gradient(in_oklab_90deg,oklab(69.3%_0.224_0.094/0%)_0%,oklab(69.3%_0.224_0.094/25%)_50%,oklab(69.3%_0.224_0.094/50%)_100%)]',
);

export const orderFeedRowMainClass =
  'relative z-[1] box-border flex min-w-0 flex-1 shrink-0 items-center justify-between';

export const orderFeedRowPriceClass = 'shrink-0 text-xs leading-4';
export const orderFeedRowValueClass = 'shrink-0 text-right text-xs leading-4';

export const orderFeedAssetClass =
  'relative z-[1] ms-1 flex h-3 w-3 shrink-0 items-center justify-center';
