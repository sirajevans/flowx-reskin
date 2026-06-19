import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CloseModuleIcon, DragModuleIcon } from '../icons';
import { cn } from '../../lib/utils';
import {
  cardModuleBodyClass,
  cardModuleCloseBtnClass,
  cardModuleClosingClass,
  cardModuleDragHandleClass,
  cardModuleGridItemClosingClass,
  cardModuleHeaderClass,
  cardModuleHeaderMainClass,
  cardModuleRootClass,
} from './cardModuleClasses';

const MODULE_CLOSE_ANIMATION_NAME = 'card-module-close';

export type CardModuleProps = {
  className?: string;
  bodyClassName?: string;
  ariaLabel: string;
  header: ReactNode;
  headerActions?: ReactNode;
  onClose?: () => void;
  children: ReactNode;
};

export {
  cardModuleHeaderLabelsClass,
  cardModuleHeaderTextClass,
  cardModuleTabClass,
  cardModuleTabListClass,
} from './cardModuleClasses';

export function CardModule({
  className = '',
  bodyClassName,
  ariaLabel,
  header,
  headerActions,
  onClose,
  children,
}: CardModuleProps) {
  const [isClosing, setIsClosing] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gridItemRef = useRef<HTMLElement | null>(null);

  const handleCloseClick = useCallback(() => {
    if (!onClose || isClosing) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onClose();
      return;
    }

    const gridItem = sectionRef.current?.closest('.react-grid-item');
    if (!(gridItem instanceof HTMLElement)) {
      onClose();
      return;
    }

    gridItemRef.current = gridItem;
    gridItem.classList.add(cardModuleGridItemClosingClass);
    setIsClosing(true);
  }, [isClosing, onClose]);

  useEffect(() => {
    const gridItem = gridItemRef.current;
    if (!isClosing || !gridItem || !onClose) return;

    const handleCloseAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName !== MODULE_CLOSE_ANIMATION_NAME) return;
      onClose();
    };

    gridItem.addEventListener('animationend', handleCloseAnimationEnd);
    return () => gridItem.removeEventListener('animationend', handleCloseAnimationEnd);
  }, [isClosing, onClose]);

  return (
    <section
      ref={sectionRef}
      className={cn(cardModuleRootClass, isClosing && cardModuleClosingClass, className)}
      aria-label={ariaLabel}
      aria-hidden={isClosing || undefined}
    >
      <header className={cardModuleHeaderClass}>
        <div className={cardModuleHeaderMainClass}>
          <span
            className={cardModuleDragHandleClass}
            aria-hidden
          onMouseDown={(event) => {
            const gridItem = sectionRef.current?.closest('.react-grid-item');
            const target = event.target;
            const cancelSelectors =
              '.react-resizable-handle,button,input,textarea,select,a,[role=button],[role=tab],[data-no-drag]';
            let cancelMatch: string | null = null;
            if (target instanceof Element && gridItem instanceof HTMLElement) {
              let node: Element | null = target;
              while (node && node !== gridItem) {
                for (const sel of cancelSelectors.split(',')) {
                  if (node.matches(sel)) cancelMatch = sel;
                }
                node = node.parentElement;
              }
            }
            // #region agent log
            fetch('http://127.0.0.1:7713/ingest/5e13ff40-aefa-4d16-9906-b5e26ae12fd5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'fe40c4'},body:JSON.stringify({sessionId:'fe40c4',location:'CardModule.tsx:dragHandle',message:'drag handle mousedown',data:{ariaLabel,cancelMatch,gridItemClass:gridItem instanceof HTMLElement?gridItem.className:null,offsetParentTag:gridItem instanceof HTMLElement&&gridItem.offsetParent instanceof Element?gridItem.offsetParent.tagName:null,hasReactDraggable:gridItem instanceof HTMLElement?gridItem.classList.contains('react-draggable'):false,targetTag:target instanceof Element?target.tagName:null},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
            // #endregion
          }}
          >
            <DragModuleIcon />
          </span>
          {header}
        </div>
        {headerActions}
        {onClose ? (
          <button
            type="button"
            className={cardModuleCloseBtnClass}
            aria-label="Close module"
            onClick={handleCloseClick}
            disabled={isClosing}
          >
            <CloseModuleIcon />
          </button>
        ) : null}
      </header>
      <div className={cn(cardModuleBodyClass, bodyClassName)}>{children}</div>
    </section>
  );
}
