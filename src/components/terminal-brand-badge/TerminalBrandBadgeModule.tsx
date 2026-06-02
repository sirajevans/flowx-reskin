import { DragModuleIcon } from '../icons';
import { TerminalBrandBadge } from './TerminalBrandBadge';
import {
  terminalBrandBadgeModuleClass,
  terminalBrandBadgeShellClass,
} from './terminalBrandBadgeClasses';

export function TerminalBrandBadgeModule() {
  return (
    <div className={terminalBrandBadgeModuleClass}>
      <div className={terminalBrandBadgeShellClass}>
        <TerminalBrandBadge />
        <span className="module-drag-handle terminal-dashboard-brand-badge__drag" aria-hidden>
          <DragModuleIcon />
        </span>
      </div>
    </div>
  );
}
