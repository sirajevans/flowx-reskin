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
      </div>
    </div>
  );
}
