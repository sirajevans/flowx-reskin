import chentoBrandBadge from '../../assets/chento-brand-badge.png';
import { cn } from '../../lib/utils';
import {
  terminalBrandBadgeBorderClass,
  terminalBrandBadgeImageClass,
  terminalBrandBadgeRootClass,
} from './terminalBrandBadgeClasses';

export type TerminalBrandBadgeProps = {
  className?: string;
};

export function TerminalBrandBadge({ className }: TerminalBrandBadgeProps) {
  return (
    <div className={cn(terminalBrandBadgeRootClass, className)} aria-label="Brand badge">
      <div
        className={terminalBrandBadgeImageClass}
        style={{ backgroundImage: `url(${chentoBrandBadge})` }}
        aria-hidden
      />
      <div className={terminalBrandBadgeBorderClass} aria-hidden />
    </div>
  );
}
