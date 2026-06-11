import { useCallback, useRef } from 'react';
import { useCommandMenu } from '../terminal-command-menu';
import { ChatDialog } from './ChatDialog';
import { ChatPanel } from './ChatPanel';

export function TerminalChatDialog() {
  const { chatOpen, handleChatOpenChange } = useCommandMenu();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenAutoFocus = useCallback((event: Event) => {
    event.preventDefault();
    inputRef.current?.focus();
  }, []);

  return (
    <ChatDialog
      open={chatOpen}
      onOpenChange={handleChatOpenChange}
      label="Whale room chat"
      onOpenAutoFocus={handleOpenAutoFocus}
    >
      <ChatPanel
        inputRef={inputRef}
        onClose={() => handleChatOpenChange(false)}
      />
    </ChatDialog>
  );
}
