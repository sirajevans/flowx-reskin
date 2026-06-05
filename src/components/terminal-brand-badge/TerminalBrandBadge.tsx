import chentoBrandBadge from '../../assets/chento-brand-badge.png';
import { cn } from '../../lib/utils';
import {
  terminalBrandBadgeBorderClass,
  terminalBrandBadgeImageClass,
  terminalBrandBadgeRootClass,
} from './terminalBrandBadgeClasses';

export type TerminalBrandBadgeProps = {
  className?: string;
  imageClassName?: string;
  imageSrc?: string;
  label?: string;
};

export function TerminalBrandBadge({
  className,
  imageClassName = terminalBrandBadgeImageClass,
  imageSrc = chentoBrandBadge,
  label = 'Brand badge',
}: TerminalBrandBadgeProps) {
  return (
    <div className={cn(terminalBrandBadgeRootClass, className)} aria-label={label}>
      <div
        className={imageClassName}
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-hidden
      />
      <div className={terminalBrandBadgeBorderClass} aria-hidden />
    </div>
  );
}
