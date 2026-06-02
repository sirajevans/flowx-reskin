import type { ReactNode } from 'react';
import { CloseModuleIcon, DragModuleIcon } from '../icons';
import { cn } from '../../lib/utils';
import {
  cardModuleBodyClass,
  cardModuleCloseBtnClass,
  cardModuleDragHandleClass,
  cardModuleHeaderClass,
  cardModuleHeaderMainClass,
  cardModuleRootClass,
} from './cardModuleClasses';

export type CardModuleProps = {
  className?: string;
  ariaLabel: string;
  header: ReactNode;
  onClose?: () => void;
  children: ReactNode;
};

export {
  cardModuleHeaderLabelsClass,
  cardModuleHeaderTextClass,
  cardModuleTabClass,
  cardModuleTabListClass,
} from './cardModuleClasses';

export function CardModule({ className = '', ariaLabel, header, onClose, children }: CardModuleProps) {
  return (
    <section className={cn(cardModuleRootClass, className)} aria-label={ariaLabel}>
      <header className={cardModuleHeaderClass}>
        <div className={cardModuleHeaderMainClass}>
          <span className={cardModuleDragHandleClass} aria-hidden>
            <DragModuleIcon />
          </span>
          {header}
        </div>
        {onClose ? (
          <button
            type="button"
            className={cardModuleCloseBtnClass}
            aria-label="Close module"
            onClick={onClose}
          >
            <CloseModuleIcon />
          </button>
        ) : (
          <CloseModuleIcon />
        )}
      </header>
      <div className={cardModuleBodyClass}>{children}</div>
    </section>
  );
}
