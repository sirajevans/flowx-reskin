import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import {
  cardModuleTabPanelBaseClass,
  cardModuleTabPanelEnterBackwardClass,
  cardModuleTabPanelEnterForwardClass,
  cardModuleTabPanelExitBackwardClass,
  cardModuleTabPanelExitForwardClass,
  cardModuleTabViewportClass,
} from './cardModuleClasses';
import { useTabSlideDirection } from './useTabSlideDirection';

const TAB_TRANSITION_MS = 200;

export type CardModuleTabContentProps<T extends string> = {
  activeTab: T;
  tabIds: readonly T[];
  children: (tabId: T) => ReactNode;
  className?: string;
  viewportClassName?: string;
  panelClassName?: string;
};

export function CardModuleTabContent<T extends string>({
  activeTab,
  tabIds,
  children,
  className = '',
  viewportClassName,
  panelClassName,
}: CardModuleTabContentProps<T>) {
  const prevTabRef = useRef(activeTab);
  const [exitingTab, setExitingTab] = useState<T | null>(null);
  const [enterReady, setEnterReady] = useState(false);
  const direction = useTabSlideDirection(tabIds, activeTab);
  const isTransitioning = exitingTab !== null;

  if (prevTabRef.current !== activeTab) {
    const previousTab = prevTabRef.current;
    prevTabRef.current = activeTab;
    if (exitingTab !== previousTab) {
      setExitingTab(previousTab);
    }
  }

  useLayoutEffect(() => {
    if (!isTransitioning) {
      setEnterReady(false);
      return;
    }

    setEnterReady(false);
    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setEnterReady(true));
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [isTransitioning, activeTab, direction]);

  useEffect(() => {
    if (exitingTab === null) return;

    const timer = window.setTimeout(() => setExitingTab(null), TAB_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [exitingTab]);

  const visibleTabs = new Set<T>([activeTab]);
  if (exitingTab !== null) visibleTabs.add(exitingTab);

  return (
    <div className={cn(cardModuleTabViewportClass, viewportClassName, className)}>
      {tabIds.map((tabId) => {
        if (!visibleTabs.has(tabId)) return null;

        const isExiting = tabId === exitingTab;
        const isEntering = tabId === activeTab && exitingTab !== null;
        const isActive = tabId === activeTab && exitingTab === null;

        const panelClass = cn(
          cardModuleTabPanelBaseClass,
          panelClassName,
          isExiting &&
            (direction === 'forward'
              ? cardModuleTabPanelExitForwardClass
              : cardModuleTabPanelExitBackwardClass),
          isEntering &&
            enterReady &&
            (direction === 'forward'
              ? cardModuleTabPanelEnterForwardClass
              : cardModuleTabPanelEnterBackwardClass),
        );

        const state = isActive ? 'active' : isEntering ? 'enter' : 'exit';

        return (
          <div
            key={tabId}
            className={panelClass}
            data-state={state}
            data-direction={isEntering ? direction : undefined}
            aria-hidden={!isActive && !isEntering}
          >
            {children(tabId)}
          </div>
        );
      })}
    </div>
  );
}
