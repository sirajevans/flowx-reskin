import { cn } from '../../lib/utils';

export const liquidationOdometerClass = 'inline-flex items-center align-top tabular-nums';

export const liquidationOdometerPrefixClass = 'shrink-0';
export const liquidationOdometerSuffixClass = 'shrink-0';
export const liquidationDecimalPointClass = 'shrink-0';

export const liquidationOdometerDigitsClass = 'inline-flex items-center';

export const liquidationDigitSlotClass =
  'inline-block w-[0.62em] shrink-0 text-center';

export const liquidationDigitScrollClass = cn(
  'block h-4 overflow-hidden',
  '[-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_28%,#000_72%,transparent_100%)]',
  '[mask-image:linear-gradient(180deg,transparent_0%,#000_28%,#000_72%,transparent_100%)]',
  'motion-reduce:[-webkit-mask-image:none] motion-reduce:[mask-image:none]',
);

export const liquidationDigitTrackClass = 'flex flex-col will-change-transform';

export const liquidationDigitTrackSpanClass = 'block h-4 shrink-0 leading-4';
