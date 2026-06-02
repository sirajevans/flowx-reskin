import { useRef } from 'react';

export type TabSlideDirection = 'forward' | 'backward';

export function useTabSlideDirection<T extends string>(
  tabIds: readonly T[],
  activeTab: T,
): TabSlideDirection {
  const prevTabRef = useRef(activeTab);
  const directionRef = useRef<TabSlideDirection>('forward');

  if (prevTabRef.current !== activeTab) {
    const prevIdx = tabIds.indexOf(prevTabRef.current);
    const nextIdx = tabIds.indexOf(activeTab);
    directionRef.current = nextIdx >= prevIdx ? 'forward' : 'backward';
    prevTabRef.current = activeTab;
  }

  return directionRef.current;
}
