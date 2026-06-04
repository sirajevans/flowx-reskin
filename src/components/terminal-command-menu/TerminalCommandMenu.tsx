import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type SyntheticEvent,
} from 'react';
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

function placeCaretAtEnd(input: HTMLInputElement) {
  const end = input.value.length;
  input.setSelectionRange(end, end);
}

function collapseInputSelection(input: HTMLInputElement) {
  const { selectionStart, selectionEnd, value } = input;
  if (
    value.length > 0 &&
    selectionStart === 0 &&
    selectionEnd !== null &&
    selectionEnd >= value.length
  ) {
    placeCaretAtEnd(input);
  }
}

export function TerminalCommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInputCaret = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    placeCaretAtEnd(input);
    requestAnimationFrame(() => placeCaretAtEnd(input));
  }, []);

  const { closeMenu, isTypeaheadSession } = useCommandMenuTypeahead({
    open,
    setOpen,
    setSearch,
    onTypeaheadSessionEnd: focusInputCaret,
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setOpen(true);
      else closeMenu();
    },
    [closeMenu],
  );

  useLayoutEffect(() => {
    if (!open || !isTypeaheadSession || !inputRef.current) return;
    collapseInputSelection(inputRef.current);
  }, [open, search, isTypeaheadSession]);

  const handleInputFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (isTypeaheadSession) {
        collapseInputSelection(event.currentTarget);
      }
    },
    [isTypeaheadSession],
  );

  const handleInputSelect = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      if (!isTypeaheadSession) return;
      collapseInputSelection(event.currentTarget);
    },
    [isTypeaheadSession],
  );

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
        ref={inputRef}
        readOnly={isTypeaheadSession}
        placeholder="Type a command or search for a module…"
        value={search}
        onValueChange={setSearch}
        onFocus={handleInputFocus}
        onSelect={handleInputSelect}
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
