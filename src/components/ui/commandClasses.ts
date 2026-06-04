import { cn } from '../../lib/utils';
import {
  cardModuleChromeClass,
  cardModuleHeaderTextClass,
} from './cardModuleClasses';

export const commandDialogOverlayClass = cn(
  'fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]',
  'data-[state=open]:animate-dropdown-in data-[state=closed]:animate-dropdown-out',
  'motion-reduce:animate-none',
);

export const commandDialogContentClass = cn(
  'fixed top-[18%] left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2',
  'box-border flex select-none flex-col gap-[18px] overflow-clip rounded-[10px] p-3 shadow-2xl outline-none',
  cardModuleChromeClass,
  'data-[state=open]:animate-dropdown-in data-[state=closed]:animate-dropdown-out',
  'motion-reduce:animate-none',
);

export const commandRootClass = cn(
  'box-border flex min-w-0 flex-col gap-3 self-stretch overflow-hidden',
  cardModuleHeaderTextClass,
  '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5',
  '[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:leading-[15px]',
  '[&_[cmdk-group-heading]]:tracking-[0.02em] [&_[cmdk-group-heading]]:text-[var(--widget-tab-inactive)]',
  '[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0',
);

export const commandInputClass = cn(
  'flex h-[18px] w-full bg-transparent p-0 font-inherit text-[13px] leading-4 text-[var(--flowx-text)]',
  'outline-none placeholder:text-[var(--flowx-muted)]',
  'disabled:cursor-not-allowed disabled:opacity-50',
);

export const commandInputWrapperClass = cn(
  'box-border flex min-w-0 items-center gap-2 self-stretch rounded-[6px]',
  'bg-[var(--widget-row-selected)] px-2 py-1.5',
  'focus-within:shadow-[0_0_0_1px_var(--flowx-border)]',
);

export const commandListClass = cn('max-h-[min(360px,50dvh)] overflow-y-auto overflow-x-hidden');

export const commandEmptyClass = cn('py-6 text-center text-[13px] text-[var(--flowx-muted)]');

export const commandGroupClass = 'overflow-hidden text-[var(--flowx-text)]';

export const commandSeparatorClass = 'my-1 h-px bg-[var(--widget-icon-dim)]';

export const commandItemClass = cn(
  'relative flex h-[34px] cursor-pointer select-none items-center gap-2 rounded-lg px-2 outline-none',
  'text-xs leading-[15px] text-[var(--flowx-text)]',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  'aria-selected:bg-[var(--widget-row-selected)]',
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
);

export const commandShortcutClass = cn(
  'ml-auto text-[11px] leading-[14px] tracking-widest text-[var(--flowx-muted)]',
);

export const commandInputIconClass = 'size-4 shrink-0 text-[var(--flowx-muted)]';
