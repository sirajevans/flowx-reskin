import { cn } from '../../lib/utils';

export const TERMINAL_BRAND_BADGE_WIDTH_PX = 157;
export const TERMINAL_BRAND_BADGE_HEIGHT_PX = 49;

export const terminalBrandBadgeRootClass =
  'relative h-[49px] max-h-[49px] w-full max-w-[157px] shrink-0 overflow-clip rounded-[10px]';

export const terminalBrandBadgeImageClass =
  'absolute bottom-[-0.363px] left-[-6.99px] h-[58.03px] w-[174.09px] bg-cover bg-center bg-no-repeat';

export const terminalBrandBadgeBorderClass =
  'absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1px_#FFFFFF2E]';

export const terminalBrandBadgeModuleClass = cn(
  'terminal-dashboard-brand-badge relative h-[49px] w-full max-w-[157px] shrink-0 overflow-visible',
);

/** Grid item wrapper — fixed badge pixel size; grid cell may be slightly narrower. */
export const terminalBrandBadgeSlotClass =
  'terminal-dashboard-brand-badge-slot h-[49px] w-full max-w-[157px] shrink-0 overflow-visible';

export const terminalBrandBadgeShellClass = 'relative shrink-0';
