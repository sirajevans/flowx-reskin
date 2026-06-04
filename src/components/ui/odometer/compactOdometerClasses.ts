import { cn } from '../../../lib/utils';

/** Matches liquidation / exchange-liquidations odometer sizing (13px text, 16px digit line). */
export const compactOdometerClass = 'inline-flex items-center align-top tabular-nums';

export const compactOdometerPrefixClass = 'shrink-0';
export const compactOdometerSuffixClass = 'shrink-0';
export const compactOdometerDecimalPointClass = 'shrink-0';

export const compactOdometerCommaClass = 'shrink-0';

export const compactOdometerDigitsClass = 'inline-flex items-center';

export const compactOdometerDigitSlotClass =
  'inline-block w-[0.62em] shrink-0 text-center';

export const compactOdometerDigitScrollClass = cn(
  'block h-4 overflow-hidden',
  '[-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_28%,#000_72%,transparent_100%)]',
  '[mask-image:linear-gradient(180deg,transparent_0%,#000_28%,#000_72%,transparent_100%)]',
  'motion-reduce:[-webkit-mask-image:none] motion-reduce:[mask-image:none]',
);

export const compactOdometerDigitTrackClass = 'flex flex-col will-change-transform';

export const compactOdometerDigitTrackSpanClass = 'block h-4 shrink-0 leading-4';
