import type { ReactNode } from 'react';
import { CloseModuleIcon, DragModuleIcon } from '../icons';
import './CardModule.css';

export type CardModuleProps = {
  className?: string;
  ariaLabel: string;
  header: ReactNode;
  onClose?: () => void;
  children: ReactNode;
};

export function CardModule({ className = '', ariaLabel, header, onClose, children }: CardModuleProps) {
  return (
    <section className={`card-module gradient-border ${className}`.trim()} aria-label={ariaLabel}>
      <header className="card-module__header">
        <div className="card-module__header-main">
          <span className="card-module__drag-handle" aria-hidden>
            <DragModuleIcon />
          </span>
          {header}
        </div>
        {onClose ? (
          <button
            type="button"
            className="card-module__close-btn"
            aria-label="Close module"
            onClick={onClose}
          >
            <CloseModuleIcon />
          </button>
        ) : (
          <CloseModuleIcon />
        )}
      </header>
      <div className="card-module__body">{children}</div>
    </section>
  );
}
