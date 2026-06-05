import { useCallback, useState } from 'react';
import { TERMINAL_FAVOURITE_COIN_IDS } from '../components/terminal-command-menu/terminalCommands';

const FAVOURITES_STORAGE_KEY = 'flowx-terminal-asset-favourites:v1';

function loadFavouriteCoinIds() {
  if (typeof window === 'undefined') {
    return [...TERMINAL_FAVOURITE_COIN_IDS];
  }

  try {
    const stored = window.localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!stored) return [...TERMINAL_FAVOURITE_COIN_IDS];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [...TERMINAL_FAVOURITE_COIN_IDS];

    return parsed.filter((coinId): coinId is string => typeof coinId === 'string');
  } catch {
    return [...TERMINAL_FAVOURITE_COIN_IDS];
  }
}

function persistFavouriteCoinIds(coinIds: string[]) {
  window.localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(coinIds));
}

export function useTerminalAssetFavourites() {
  const [favouriteCoinIds, setFavouriteCoinIds] = useState(loadFavouriteCoinIds);

  const isFavourite = useCallback(
    (coinId: string) => favouriteCoinIds.includes(coinId),
    [favouriteCoinIds],
  );

  const toggleFavourite = useCallback((coinId: string) => {
    setFavouriteCoinIds((previous) => {
      const next = previous.includes(coinId)
        ? previous.filter((id) => id !== coinId)
        : [...previous, coinId];
      persistFavouriteCoinIds(next);
      return next;
    });
  }, []);

  return { favouriteCoinIds, isFavourite, toggleFavourite };
}
