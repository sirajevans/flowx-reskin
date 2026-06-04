import { useEffect } from 'react';
import { isEditableElement } from '../lib/isEditableElement';

function isPrintableKey(event: KeyboardEvent) {
  return (
    event.key.length === 1 &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.repeat
  );
}

type UseCommandMenuTypeaheadOptions = {
  open: boolean;
  onOpen: () => void;
  onOpenWithSeed: (char: string) => void;
  onClose: () => void;
};

/** Opens the command menu on ⌘K / Ctrl+K, or when the user types with no text field focused. */
export function useCommandMenuTypeahead({
  open,
  onOpen,
  onOpenWithSeed,
  onClose,
}: UseCommandMenuTypeaheadOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (isEditableElement(document.activeElement)) return;

      if (event.key === 'Escape') {
        if (open) {
          event.preventDefault();
          onClose();
        }
        return;
      }

      const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isModK) {
        event.preventDefault();
        if (open) onClose();
        else onOpen();
        return;
      }

      if (open) return;

      if (!isPrintableKey(event)) return;

      event.preventDefault();
      onOpenWithSeed(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpen, onOpenWithSeed, onClose]);
}
