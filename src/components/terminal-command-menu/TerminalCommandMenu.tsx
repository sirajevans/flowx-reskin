import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
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
  commandItemIconClass,
  commandItemLabelClass,
  commandListClass,
  commandListShellClass,
  commandSectionSpacerClass,
} from '../ui/commandClasses';
import { cn } from '../../lib/utils';
import { useCommandMenu } from './commandMenuContext';
import { getCoinIconUrl } from '../../lib/coinIcons';
import { CommandMenuIcon } from './CommandMenuIcons';
import { TERMINAL_ASSET_SUGGESTIONS, TERMINAL_COMMAND_GROUPS } from './terminalCommands';

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
  const {
    open,
    search,
    setSearch,
    variant,
    isTypeaheadSession,
    handleOpenChange,
    handleCommandSelect,
  } = useCommandMenu();
  const inputRef = useRef<HTMLInputElement>(null);
  const showAssetSuggestions = variant === 'assets';

  const focusInputCaret = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    placeCaretAtEnd(input);
    requestAnimationFrame(() => placeCaretAtEnd(input));
  }, []);

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

  useLayoutEffect(() => {
    if (!open || isTypeaheadSession) return;
    const input = inputRef.current;
    if (!input) return;
    focusInputCaret();
    input.focus();
  }, [open, isTypeaheadSession, showAssetSuggestions, focusInputCaret]);

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        ref={inputRef}
        readOnly={isTypeaheadSession}
        placeholder={
          showAssetSuggestions
            ? 'Symbol, asset or coin…'
            : 'Type a command or search for a module…'
        }
        value={search}
        onValueChange={setSearch}
        onFocus={handleInputFocus}
        onSelect={handleInputSelect}
      />
      <CommandInputDivider />
      <div className={commandListShellClass}>
        <CommandList
          label={showAssetSuggestions ? 'Markets and commands' : 'Commands'}
          className={commandListClass}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          {showAssetSuggestions ? (
            <CommandGroup
              heading="ASSETS"
              className={cn(commandGroupClass, commandGroupHeadingStartClass)}
            >
              {TERMINAL_ASSET_SUGGESTIONS.map((asset) => (
                <CommandItem
                  key={asset.value}
                  value={asset.value}
                  keywords={asset.keywords}
                  onSelect={() => handleCommandSelect(asset.value)}
                >
                  <img
                    src={getCoinIconUrl(asset.coinId)}
                    alt=""
                    className={cn(commandItemIconClass, 'rounded-full object-cover')}
                  />
                  <span className={commandItemLabelClass}>{asset.label}</span>
                  <CommandShortcut>Perpetual</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {TERMINAL_COMMAND_GROUPS.map((group, groupIndex) => (
            <Fragment key={group.heading}>
              {groupIndex > 0 || showAssetSuggestions ? (
                <div className={commandSectionSpacerClass} aria-hidden />
              ) : null}
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
                    onSelect={() => handleCommandSelect(item.value)}
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
