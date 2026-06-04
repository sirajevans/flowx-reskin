import { Fragment, useCallback, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandInputDivider,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '../ui/command';
import {
  commandGroupClass,
  commandGroupHeadingCenterClass,
  commandGroupHeadingStartClass,
  commandItemLabelClass,
  commandListClass,
  commandListShellClass,
  commandSectionSpacerClass,
} from '../ui/commandClasses';
import { cn } from '../../lib/utils';
import { useCommandMenuTypeahead } from '../../hooks/useCommandMenuTypeahead';
import { CommandMenuIcon } from './CommandMenuIcons';
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
        placeholder="Type a command or search for a module…"
        value={search}
        onValueChange={setSearch}
      />
      <CommandInputDivider />
      <div className={commandListShellClass}>
        <CommandList label="Commands" className={commandListClass}>
          <CommandEmpty>No results found.</CommandEmpty>
          {TERMINAL_COMMAND_GROUPS.map((group, groupIndex) => (
            <Fragment key={group.heading}>
              {groupIndex > 0 ? <div className={commandSectionSpacerClass} aria-hidden /> : null}
              <CommandGroup
                heading={group.heading}
                className={cn(
                  commandGroupClass,
                  group.headingAlign === 'center'
                    ? commandGroupHeadingCenterClass
                    : commandGroupHeadingStartClass,
                )}
              >
                {group.items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    keywords={item.keywords}
                    onSelect={() => handleSelect(item.value)}
                  >
                    <CommandMenuIcon icon={item.icon} />
                    <span className={commandItemLabelClass}>{item.label}</span>
                    <CommandShortcut>{item.kind}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Fragment>
          ))}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
