import { useCallback, useEffect, useRef } from 'react';
import type { LayoutItem, ResponsiveLayouts } from 'react-grid-layout/legacy';
import { isEditableElement } from '../../lib/isEditableElement';

const MAX_UNDO_ENTRIES = 50;

export type DashboardSnapshot = {
  layouts: ResponsiveLayouts;
  closedModules: string[];
};

function cloneLayoutItem(item: LayoutItem): LayoutItem {
  return { ...item };
}

function cloneLayouts(layouts: ResponsiveLayouts): ResponsiveLayouts {
  return Object.fromEntries(
    Object.entries(layouts).map(([breakpoint, layout]) => [
      breakpoint,
      (layout ?? []).map(cloneLayoutItem),
    ]),
  ) as ResponsiveLayouts;
}

export function createDashboardSnapshot(
  layouts: ResponsiveLayouts,
  closedModules: Set<string>,
): DashboardSnapshot {
  return {
    layouts: cloneLayouts(layouts),
    closedModules: [...closedModules],
  };
}

type UseDashboardUndoOptions = {
  layouts: ResponsiveLayouts;
  closedModules: Set<string>;
  onRestore: (snapshot: DashboardSnapshot) => void;
};

function trimHistoryStack(stack: DashboardSnapshot[]) {
  return stack.slice(-(MAX_UNDO_ENTRIES - 1));
}

export function useDashboardUndo({
  layouts,
  closedModules,
  onRestore,
}: UseDashboardUndoOptions) {
  const undoStackRef = useRef<DashboardSnapshot[]>([]);
  const redoStackRef = useRef<DashboardSnapshot[]>([]);
  const stateRef = useRef({ layouts, closedModules });
  const interactionSnapshotPushedRef = useRef(false);

  useEffect(() => {
    stateRef.current = { layouts, closedModules };
  }, [layouts, closedModules]);

  const snapshotCurrentState = useCallback(() => {
    return createDashboardSnapshot(
      stateRef.current.layouts,
      stateRef.current.closedModules,
    );
  }, []);

  const pushUndoSnapshot = useCallback(() => {
    redoStackRef.current = [];
    undoStackRef.current = [
      ...trimHistoryStack(undoStackRef.current),
      snapshotCurrentState(),
    ];
  }, [snapshotCurrentState]);

  const beginInteractionSnapshot = useCallback(() => {
    if (interactionSnapshotPushedRef.current) return;
    interactionSnapshotPushedRef.current = true;
    pushUndoSnapshot();
  }, [pushUndoSnapshot]);

  const endInteractionSnapshot = useCallback(() => {
    interactionSnapshotPushedRef.current = false;
  }, []);

  const undo = useCallback(() => {
    const stack = undoStackRef.current;
    if (stack.length === 0) return false;

    const snapshot = stack[stack.length - 1];
    undoStackRef.current = stack.slice(0, -1);
    redoStackRef.current = [
      ...trimHistoryStack(redoStackRef.current),
      snapshotCurrentState(),
    ];
    onRestore(snapshot);
    return true;
  }, [onRestore, snapshotCurrentState]);

  const redo = useCallback(() => {
    const stack = redoStackRef.current;
    if (stack.length === 0) return false;

    const snapshot = stack[stack.length - 1];
    redoStackRef.current = stack.slice(0, -1);
    undoStackRef.current = [
      ...trimHistoryStack(undoStackRef.current),
      snapshotCurrentState(),
    ];
    onRestore(snapshot);
    return true;
  }, [onRestore, snapshotCurrentState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (isEditableElement(document.activeElement)) return;

      const modKey = event.metaKey || event.ctrlKey;
      if (!modKey || event.key.toLowerCase() !== 'z') return;

      const handled = event.shiftKey ? redo() : undo();
      if (handled) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [redo, undo]);

  return {
    pushUndoSnapshot,
    beginInteractionSnapshot,
    endInteractionSnapshot,
  };
}
