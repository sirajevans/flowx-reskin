import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { isEditableElement } from '../lib/isEditableElement';

const TYPEAHEAD_IDLE_MS = 80;

function isPrintableKey(event: KeyboardEvent) {
  return (
    event.key.length === 1 &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.repeat
  );
}

function isCommandMenuInput(element: Element | null): boolean {
  return element instanceof HTMLInputElement && element.hasAttribute('cmdk-input');
}

type UseCommandMenuTypeaheadOptions = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
  onTypeaheadSessionEnd?: () => void;
};

/** Opens the command menu on ⌘K / Ctrl+K, or when the user types with no text field focused. */
export function useCommandMenuTypeahead({
  open,
  setOpen,
  setSearch,
  onTypeaheadSessionEnd,
}: UseCommandMenuTypeaheadOptions) {
  const typeaheadSessionRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isTypeaheadSession, setIsTypeaheadSession] = useState(false);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== undefined) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = undefined;
    }
  }, []);

  const finishTypeaheadSession = useCallback(() => {
    clearIdleTimer();
    typeaheadSessionRef.current = false;
    setIsTypeaheadSession(false);
    onTypeaheadSessionEnd?.();
  }, [clearIdleTimer, onTypeaheadSessionEnd]);

  const scheduleTypeaheadSessionEnd = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(finishTypeaheadSession, TYPEAHEAD_IDLE_MS);
  }, [clearIdleTimer, finishTypeaheadSession]);

  const startTypeaheadSession = useCallback(() => {
    typeaheadSessionRef.current = true;
    setIsTypeaheadSession(true);
  }, []);

  const openMenu = useCallback(() => {
    finishTypeaheadSession();
    setSearch('');
    setOpen(true);
  }, [finishTypeaheadSession, setOpen, setSearch]);

  const closeMenu = useCallback(() => {
    finishTypeaheadSession();
    setOpen(false);
    setSearch('');
  }, [finishTypeaheadSession, setOpen, setSearch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const activeElement = document.activeElement;
      const inTypeaheadSession = typeaheadSessionRef.current;
      const commandInputFocused = isCommandMenuInput(activeElement);

      if (isEditableElement(activeElement) && !inTypeaheadSession) return;
      if (isEditableElement(activeElement) && inTypeaheadSession && !commandInputFocused) return;

      if (event.key === 'Escape') {
        if (open) {
          event.preventDefault();
          closeMenu();
        }
        return;
      }

      const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isModK) {
        event.preventDefault();
        if (open) closeMenu();
        else openMenu();
        return;
      }

      if (open && inTypeaheadSession) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
          finishTypeaheadSession();
          return;
        }

        if (event.key === 'Backspace') {
          event.preventDefault();
          setSearch((prev) => prev.slice(0, -1));
          scheduleTypeaheadSessionEnd();
          return;
        }

        if (isPrintableKey(event)) {
          event.preventDefault();
          setSearch((prev) => prev + event.key);
          scheduleTypeaheadSessionEnd();
          return;
        }
      }

      if (open) return;

      if (!isPrintableKey(event)) return;

      event.preventDefault();
      startTypeaheadSession();
      setSearch(event.key);
      setOpen(true);
      scheduleTypeaheadSessionEnd();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    open,
    setOpen,
    setSearch,
    openMenu,
    closeMenu,
    finishTypeaheadSession,
    scheduleTypeaheadSessionEnd,
    startTypeaheadSession,
  ]);

  useEffect(() => () => clearIdleTimer(), [clearIdleTimer]);

  return { openMenu, closeMenu, isTypeaheadSession };
}
