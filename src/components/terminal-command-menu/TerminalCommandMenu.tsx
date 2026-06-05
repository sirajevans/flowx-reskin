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
  CommandItem,
  CommandList,
  CommandShortcut,
} from '../ui/command';
import {
  commandAssetFavouriteButtonClass,
  commandAssetKindClass,
  commandGroupClass,
  commandGroupHeadingCenterClass,
  commandGroupHeadingStartClass,
  commandItemIconClass,
  commandItemLabelClass,
  commandListClass,
  commandListOverflowFadeClass,
  commandListShellClass,
  commandSectionSpacerClass,
} from '../ui/commandClasses';
import { cn } from '../../lib/utils';
import { useOverflowBottomFade } from '../../hooks/useOverflowBottomFade';
import { useTerminalAssetFavourites } from '../../hooks/useTerminalAssetFavourites';
import { useCommandMenu } from './commandMenuContext';
import { getCoinIconUrl } from '../../lib/coinIcons';
import { CommandMenuFavourites } from './CommandMenuFavourites';
import { CommandMenuIcon, CommandMenuStarIcon } from './CommandMenuIcons';
import {
  TERMINAL_ASSET_SUGGESTIONS,
  TERMINAL_COMMAND_GROUPS,
  type TerminalAssetSuggestion,
} from './terminalCommands';

function placeCaretAtEnd(input: HTMLInputElement) {
  const end = input.value.length;
  input.setSelectionRange(end, end);
}

type AssetCommandItemProps = {
  asset: TerminalAssetSuggestion;
  isFavourite: boolean;
  onSelect: (value: string) => void;
  onToggleFavourite: (coinId: string) => void;
};

function AssetCommandItem({
  asset,
  isFavourite,
  onSelect,
  onToggleFavourite,
}: AssetCommandItemProps) {
  return (
    <CommandItem
      value={asset.value}
      keywords={asset.keywords}
      onSelect={() => onSelect(asset.value)}
    >
      <img
        src={getCoinIconUrl(asset.coinId)}
        alt=""
        className={cn(commandItemIconClass, 'rounded-full object-cover')}
      />
      <span className={commandItemLabelClass}>{asset.label}</span>
      <span className={commandAssetKindClass}>
        <button
          type="button"
          className={commandAssetFavouriteButtonClass}
          aria-label={
            isFavourite
              ? `Remove ${asset.label} from favourites`
              : `Add ${asset.label} to favourites`
          }
          aria-pressed={isFavourite}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavourite(asset.coinId);
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <CommandMenuStarIcon filled={isFavourite} />
        </button>
        <span>Perpetual</span>
      </span>
    </CommandItem>
  );
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
  const { favouriteCoinIds, isFavourite, toggleFavourite } = useTerminalAssetFavourites();
  const inputRef = useRef<HTMLInputElement>(null);
  const assetListRef = useRef<HTMLDivElement>(null);
  const showAssetSuggestions = variant === 'assets';
  const showFavourites = search.trim().length === 0;
  const showAssetListFade = useOverflowBottomFade(assetListRef, [
    open,
    showAssetSuggestions,
    search,
  ]);

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
      {showFavourites ? (
        <CommandMenuFavourites
          favouriteCoinIds={favouriteCoinIds}
          onSelect={handleCommandSelect}
        />
      ) : null}
      <div className={commandListShellClass}>
        <CommandList
          ref={assetListRef}
          label={showAssetSuggestions ? 'Markets and commands' : 'Commands'}
          className={cn(
            commandListClass,
            showAssetSuggestions && commandListOverflowFadeClass,
          )}
          data-overflow-fade={
            showAssetSuggestions && showAssetListFade ? true : undefined
          }
        >
          <CommandEmpty>No results found.</CommandEmpty>
          {showAssetSuggestions ? (
            <CommandGroup
              heading="ASSETS"
              className={cn(commandGroupClass, commandGroupHeadingStartClass)}
            >
              {TERMINAL_ASSET_SUGGESTIONS.map((asset) => (
                <AssetCommandItem
                  key={asset.value}
                  asset={asset}
                  isFavourite={isFavourite(asset.coinId)}
                  onSelect={handleCommandSelect}
                  onToggleFavourite={toggleFavourite}
                />
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
