import { Fragment, useCallback, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../ui/command';
import { useCommandMenuTypeahead } from '../../hooks/useCommandMenuTypeahead';
import { runTerminalCommand, TERMINAL_COMMAND_GROUPS } from './terminalCommands';

export function TerminalCommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearch('');
  }, []);

  const openMenu = useCallback(() => {
    setSearch('');
    setOpen(true);
  }, []);

  const openMenuWithSeed = useCallback((char: string) => {
    setSearch(char);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setSearch('');
  }, []);

  useCommandMenuTypeahead({
    open,
    onOpen: openMenu,
    onOpenWithSeed: openMenuWithSeed,
    onClose: closeMenu,
  });

  const handleSelect = useCallback(
    (value: string) => {
      runTerminalCommand(value);
      closeMenu();
    },
    [closeMenu],
  );

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder="Type a command or search…"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList label="Commands">
        <CommandEmpty>No results found.</CommandEmpty>
        {TERMINAL_COMMAND_GROUPS.map((group, groupIndex) => (
          <Fragment key={group.heading}>
            {groupIndex > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  keywords={item.keywords}
                  onSelect={() => handleSelect(item.value)}
                >
                  <span>{item.label}</span>
                  {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
