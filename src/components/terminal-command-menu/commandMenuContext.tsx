import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useCommandMenuTypeahead } from '../../hooks/useCommandMenuTypeahead';
import { isTerminalAssetCommand, resolveTerminalAssetSymbol, runTerminalCommand } from './terminalCommands';

export type CommandMenuVariant = 'default' | 'assets';

type CommandMenuContextValue = {
  open: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  variant: CommandMenuVariant;
  isTypeaheadSession: boolean;
  chatOpen: boolean;
  openMenu: () => void;
  openAssetPicker: (onSelect?: (symbol: string) => void) => void;
  closeMenu: () => void;
  openChat: () => void;
  closeChat: () => void;
  handleOpenChange: (nextOpen: boolean) => void;
  handleChatOpenChange: (nextOpen: boolean) => void;
  handleCommandSelect: (value: string) => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [variant, setVariant] = useState<CommandMenuVariant>('default');
  const assetOnSelectRef = useRef<((symbol: string) => void) | undefined>(undefined);

  const resetVariant = useCallback(() => {
    setVariant('default');
    assetOnSelectRef.current = undefined;
  }, []);

  const { openMenu: openMenuBase, closeMenu: closeMenuBase, isTypeaheadSession } =
    useCommandMenuTypeahead({
      open,
      setOpen,
      setSearch,
    });

  const closeMenu = useCallback(() => {
    closeMenuBase();
    resetVariant();
  }, [closeMenuBase, resetVariant]);

  const openMenu = useCallback(() => {
    resetVariant();
    openMenuBase();
  }, [openMenuBase, resetVariant]);

  const openAssetPicker = useCallback(
    (onSelect?: (symbol: string) => void) => {
      assetOnSelectRef.current = onSelect;
      setVariant('assets');
      openMenuBase();
    },
    [openMenuBase],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setOpen(true);
      else closeMenu();
    },
    [closeMenu],
  );

  const openChat = useCallback(() => {
    setChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  const handleChatOpenChange = useCallback((nextOpen: boolean) => {
    setChatOpen(nextOpen);
  }, []);

  const handleCommandSelect = useCallback(
    (value: string) => {
      if (isTerminalAssetCommand(value)) {
        const symbol = resolveTerminalAssetSymbol(value);
        assetOnSelectRef.current?.(symbol);
        closeMenu();
        return;
      }

      if (value === 'action-open-whale-room-chat') {
        closeMenu();
        openChat();
        return;
      }

      runTerminalCommand(value);
      closeMenu();
    },
    [closeMenu, openChat],
  );

  const value = useMemo<CommandMenuContextValue>(
    () => ({
      open,
      search,
      setSearch,
      variant,
      isTypeaheadSession,
      chatOpen,
      openMenu,
      openAssetPicker,
      closeMenu,
      openChat,
      closeChat,
      handleOpenChange,
      handleChatOpenChange,
      handleCommandSelect,
    }),
    [
      open,
      search,
      variant,
      isTypeaheadSession,
      chatOpen,
      openMenu,
      openAssetPicker,
      closeMenu,
      openChat,
      closeChat,
      handleOpenChange,
      handleChatOpenChange,
      handleCommandSelect,
    ],
  );

  return <CommandMenuContext.Provider value={value}>{children}</CommandMenuContext.Provider>;
}

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) {
    throw new Error('useCommandMenu must be used within CommandMenuProvider');
  }
  return context;
}
