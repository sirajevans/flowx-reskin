import { cn } from '../../lib/utils';

/** Edge inset (17px thumb → 8.5px half, rounded to 9px). */
export const percentSliderThumbInsetPx = 9;
export const percentSliderThumbWidthPx = 17;

export const percentSliderRootClass =
  'relative mt-[-4px] flex h-2.5 w-full shrink-0 touch-none items-center justify-center overflow-visible';

export const percentSliderRailGradient =
  'linear-gradient(in oklab 90deg, oklab(24.8% 0 0 / 0%) 0%, oklab(24.8% 0 0) 5.09%, oklab(24.8% 0 0) 94.83%, oklab(24.8% 0 0 / 0%) 100.01%)';

export const percentSliderRailFillGradient =
  'linear-gradient(in oklab 90deg, oklab(100% 0 0 / 0%) 0%, white 5.09%, white 94.83%, oklab(100% 0 0 / 0%) 100.01%)';

export const percentSliderRailWrapClass =
  'pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2';

export const percentSliderRailBaseClass = 'absolute inset-0';

export const percentSliderRailFillClipClass =
  'absolute inset-y-0 left-0 overflow-hidden';

export const percentSliderRailFillClass = 'absolute inset-y-0 left-0 h-full';

export const percentSliderThumbClass = cn(
  'pointer-events-none absolute top-0 h-2.5 w-[17px] shrink-0 overflow-clip rounded-sm border border-solid',
  'border-[#212121] bg-[#161616] transition-colors duration-150 ease-out motion-reduce:transition-none',
  'data-[active]:border-white',
);

export const percentSliderInputClass = cn(
  'pointer-events-none absolute top-0 bottom-0 left-[9px] right-[9px] z-[1] m-0 h-full w-auto appearance-none bg-transparent p-0 opacity-0',
  'disabled:cursor-not-allowed',
  '[&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-[17px] [&::-webkit-slider-thumb]:appearance-none',
  '[&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-[17px] [&::-moz-range-thumb]:appearance-none',
);
