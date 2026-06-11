import { cn } from '../../lib/utils';

export const chatPanelRootClass =
  'box-border flex min-h-0 min-w-0 flex-col items-start gap-3 self-stretch';

export const chatPanelHeaderClass =
  'box-border flex min-w-0 items-center gap-2 self-stretch';

export const chatPanelTitleClass = 'min-w-0 text-[13px] leading-4 text-[var(--flowx-text)]';

export const chatPanelCloseBtnClass = cn(
  'relative ml-auto flex size-3.5 shrink-0 cursor-pointer items-center justify-center overflow-clip border-0 bg-transparent p-0',
  'text-[var(--widget-icon-dim)] outline-none',
  'transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  '[&_svg]:text-inherit [&_svg]:transition-colors',
  '[@media(hover:hover)]:hover:text-[var(--flowx-muted)]',
  'focus-visible:rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);

export const chatPanelMessagesClass = cn(
  'box-border flex min-h-[min(360px,50dvh)] max-h-[min(360px,50dvh)] min-w-0 flex-1 flex-col gap-1 self-stretch overflow-y-auto',
  '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
);

export const chatPanelMessageRowClass =
  'box-border flex min-w-0 items-end gap-1.5 self-stretch';

export const chatPanelMessageRowRightClass = 'justify-end';

export const chatPanelAvatarClass =
  'box-border size-4 shrink-0 rounded-full bg-cover bg-center bg-no-repeat';

export const chatPanelBubbleClass = cn(
  'box-border flex min-w-0 max-w-[min(430px,100%)] shrink-0 flex-col items-start justify-center gap-0.75 overflow-clip rounded-lg px-2 py-1.5',
  'bg-[#1d1d1d80] [outline:1px_solid_#000000] -outline-offset-1',
);

export const chatPanelBubbleOwnClass = 'bg-[#38383880]';

export const chatPanelUsernameClass =
  'w-max text-[11px] leading-3.5 text-[var(--flowx-text)]';

export const chatPanelBodyClass =
  'min-w-0 self-stretch text-[12px] leading-[15px] text-[#ffffffb3]';

export const chatPanelComposerClass =
  'box-border flex min-w-0 items-center justify-between gap-2 self-stretch';

export const chatPanelSendBtnClass = cn(
  'box-border flex size-7 shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-lg border-0 bg-white p-0 outline-none',
  'transition-opacity duration-150 ease-in-out motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:opacity-90',
  'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--flowx-border)]',
);
