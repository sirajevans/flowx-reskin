import flowxLogo from '../../assets/flowx-shader-logo.png';
import { TerminalBrandBadge } from '../terminal-brand-badge';
import {
  terminalBrandBadgeModuleClass,
  terminalBrandBadgeShellClass,
} from '../terminal-brand-badge/terminalBrandBadgeClasses';

const terminalFlowxLogoImageClass =
  'absolute inset-x-[16px] top-1/2 h-[18px] -translate-y-1/2 bg-contain bg-center bg-no-repeat';

export function TerminalFlowxLogoModule() {
  return (
    <div className={terminalBrandBadgeModuleClass}>
      <div className={terminalBrandBadgeShellClass}>
        <TerminalBrandBadge
          className="bg-black"
          imageClassName={terminalFlowxLogoImageClass}
          imageSrc={flowxLogo}
          label="FlowX logo"
        />
      </div>
    </div>
  );
}
