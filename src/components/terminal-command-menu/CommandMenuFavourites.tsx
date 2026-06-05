import { cn } from '../../lib/utils';
import { getCoinIconUrl } from '../../lib/coinIcons';
import {
  commandFavouriteChipClass,
  commandFavouritesChipsClass,
  commandFavouritesHeadingClass,
  commandFavouritesSectionClass,
  commandItemIconClass,
} from '../ui/commandClasses';
import {
  TERMINAL_ASSET_SUGGESTIONS,
  type TerminalAssetSuggestion,
} from './terminalCommands';

function resolveFavouriteAssets(coinIds: readonly string[]): TerminalAssetSuggestion[] {
  return coinIds.flatMap((coinId) => {
    const asset = TERMINAL_ASSET_SUGGESTIONS.find((entry) => entry.coinId === coinId);
    return asset ? [asset] : [];
  });
}

type CommandMenuFavouritesProps = {
  favouriteCoinIds: readonly string[];
  onSelect: (value: string) => void;
};

export function CommandMenuFavourites({
  favouriteCoinIds,
  onSelect,
}: CommandMenuFavouritesProps) {
  const favouriteAssets = resolveFavouriteAssets(favouriteCoinIds);

  return (
    <section aria-label="Favourites" className={commandFavouritesSectionClass}>
      <span className={commandFavouritesHeadingClass}>FAVOURITES</span>
      {favouriteAssets.length > 0 ? (
        <div className={commandFavouritesChipsClass}>
          {favouriteAssets.map((asset) => (
            <button
              key={asset.value}
              type="button"
              className={commandFavouriteChipClass}
              onClick={() => onSelect(asset.value)}
            >
              <img
                src={getCoinIconUrl(asset.coinId)}
                alt=""
                className={cn(commandItemIconClass, 'rounded-full object-cover')}
              />
              <span>{asset.label.replace(/USDT$/, '')}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
