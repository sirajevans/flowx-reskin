import { cn } from '../../lib/utils';
import { cardModuleGradientBorder } from './cardModuleClasses';

export const commandFontClass =
  "font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif]";

export const commandDialogOverlayClass = cn(
  'fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]',
  'data-[state=open]:animate-dropdown-in data-[state=closed]:animate-dropdown-out',
  'motion-reduce:animate-none',
);

/** Outer panel — matches Paper root frame (padding only, no inner gap). */
export const commandDialogContentClass = cn(
  'fixed top-[18%] left-1/2 z-50 w-[512px] max-w-[calc(100%-2rem)] -translate-x-1/2',
  'box-border flex select-none flex-col items-start overflow-clip rounded-[10px] p-3 outline-none',
  'bg-[color-mix(in_srgb,var(--widget-chrome-bg)_75%,transparent)] backdrop-blur-[4px]',
  'gradient-border',
  cardModuleGradientBorder,
  '[box-shadow:#00000073_0px_16px_48px]',
  commandFontClass,
  'data-[state=open]:animate-dropdown-in data-[state=closed]:animate-dropdown-out',
  'motion-reduce:animate-none',
);

/** cmdk root — inner column (input, divider, list) with 12px gap. */
export const commandRootClass = cn(
  'box-border flex min-w-0 flex-col items-start gap-3 self-stretch overflow-clip',
  commandFontClass,
  'text-[12px] leading-[15px] text-[#F4F4F5]',
  '[&_[cmdk-list]]:flex [&_[cmdk-list]]:max-h-[min(360px,50dvh)] [&_[cmdk-list]]:min-w-0',
  '[&_[cmdk-list]]:flex-col [&_[cmdk-list]]:items-start [&_[cmdk-list]]:self-stretch',
  '[&_[cmdk-list]]:overflow-x-hidden [&_[cmdk-list]]:overflow-y-auto',
  '[&_[cmdk-list-sizer]]:flex [&_[cmdk-list-sizer]]:min-w-0 [&_[cmdk-list-sizer]]:flex-col',
  '[&_[cmdk-list-sizer]]:items-start [&_[cmdk-list-sizer]]:self-stretch',
  '[&_[cmdk-group]]:flex [&_[cmdk-group]]:min-w-0 [&_[cmdk-group]]:flex-col [&_[cmdk-group]]:items-start',
  '[&_[cmdk-group]]:gap-2 [&_[cmdk-group]]:self-stretch [&_[cmdk-group]]:overflow-clip',
  '[&_[cmdk-group-heading]]:box-border [&_[cmdk-group-heading]]:w-max [&_[cmdk-group-heading]]:shrink-0',
  '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1',
  '[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:leading-[12px]',
  '[&_[cmdk-group-heading]]:tracking-[0.02em] [&_[cmdk-group-heading]]:text-[#FFFFFF80]',
  '[&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:min-w-0 [&_[cmdk-group-items]]:flex-col',
  '[&_[cmdk-group-items]]:items-start [&_[cmdk-group-items]]:self-stretch [&_[cmdk-group-items]]:overflow-clip',
);

export const commandInputClass = cn(
  'min-w-0 grow basis-0 bg-transparent p-0 font-inherit text-[12px] leading-[15px] text-white outline-none',
  'placeholder:text-white/25',
  'disabled:cursor-not-allowed disabled:opacity-50',
);

export const commandInputWrapperClass = cn(
  'box-border flex min-w-0 flex-col items-start self-stretch overflow-clip',
);

export const commandInputRowClass = cn(
  'box-border flex min-w-0 items-center gap-2 self-stretch overflow-clip px-2 pt-1.5',
);

export const commandInputDividerWrapperClass = cn(
  'mt-[14px] box-border flex min-w-0 self-stretch',
);

export const commandInputDividerClass = cn(
  'h-px min-h-px w-full min-w-0 shrink-0 self-stretch',
);

export const commandListShellClass =
  'box-border flex min-w-0 flex-col items-start self-stretch overflow-clip';

export const commandListClass = 'min-w-0 self-stretch overflow-visible p-0';

/** Bottom fade on the asset picker list when content overflows (see `data-overflow-fade`). */
export const commandListOverflowFadeClass = cn(
  '[--command-list-fade-height:14px]',
  '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  'data-[overflow-fade]:[-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_calc(100%-var(--command-list-fade-height)),transparent_100%)]',
  'data-[overflow-fade]:[mask-image:linear-gradient(to_bottom,#000_0%,#000_calc(100%-var(--command-list-fade-height)),transparent_100%)]',
);

export const commandEmptyClass = cn(
  'self-stretch py-6 text-center text-[12px] leading-[15px] text-[#FFFFFF80]',
);

export const commandGroupClass = 'overflow-visible p-0';

export const commandGroupHeadingClass = cn(
  'box-border w-max shrink-0 px-2 py-1',
  'text-[10px] leading-[12px] tracking-[0.02em] text-[#FFFFFF80]',
);

export const commandGroupHeadingStartClass =
  '[&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-start';

export const commandGroupHeadingCenterClass =
  '[&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-center';

export const commandSectionSpacerClass =
  'box-border flex h-[9px] min-w-0 shrink-0 flex-col items-start self-stretch overflow-clip py-1';

export const commandItemClass = cn(
  'relative box-border flex h-8 min-w-0 shrink-0 cursor-pointer select-none items-center gap-2',
  'self-stretch overflow-clip rounded-lg px-2 outline-none',
  'text-[12px] leading-[15px] text-[#F4F4F5]',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  'data-[selected=true]:bg-[#1D1D1D80] data-[selected=true]:text-white',
  'aria-selected:bg-[#1D1D1D80] aria-selected:text-white',
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
);

export const commandItemIconClass = 'relative size-3.5 shrink-0 overflow-clip';

export const commandItemLabelClass = cn(
  'min-w-0 grow basis-0 truncate font-inherit text-[12px] leading-[15px] text-inherit',
);

export const commandShortcutClass = cn(
  'w-max shrink-0 font-inherit text-[12px] leading-[15px] text-[#F4F4F580]',
);

export const commandFavouritesSectionClass = cn(
  'box-border flex min-w-0 flex-col items-start gap-2 self-stretch overflow-clip',
);

export const commandFavouritesHeadingClass = cn(
  'box-border w-max shrink-0 px-[8px] py-[4px]',
  'text-[10px] leading-[12px] tracking-[0.02em] text-[#FFFFFF80]',
);

export const commandFavouritesChipsClass =
  'flex min-w-0 flex-wrap items-center gap-1.5 self-stretch';

export const commandFavouriteChipClass = cn(
  'box-border flex h-8 min-w-0 shrink-0 cursor-pointer select-none items-center gap-1.5 overflow-clip rounded-lg',
  'bg-transparent px-2 outline-none',
  'text-[12px] leading-[15px] text-[#F4F4F5]',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:bg-[#1D1D1D80] [@media(hover:hover)]:hover:text-white',
);

export const commandAssetKindClass = cn(
  'flex w-max shrink-0 items-center gap-1.5',
  'font-inherit text-[12px] leading-[15px] text-[#F4F4F580]',
);

export const commandAssetFavouriteButtonClass = cn(
  'flex size-3.5 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none',
  'transition-opacity duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:opacity-70',
);
