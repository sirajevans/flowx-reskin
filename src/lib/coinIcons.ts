const STABLE_QUOTES = ['USDT', 'USDC', 'FDUSD', 'TUSD', 'DAI', 'USD'] as const;

export function getBaseAssetFromSymbol(symbol: string, quoteAsset?: string): string {
  const upper = symbol.toUpperCase();
  if (quoteAsset && upper.endsWith(quoteAsset.toUpperCase())) {
    return upper.slice(0, -quoteAsset.length);
  }

  const quote = STABLE_QUOTES.find((asset) => upper.endsWith(asset));
  return quote ? upper.slice(0, -quote.length) : upper;
}

export function getCoinIconUrl(coinId: string): string {
  return `/icons/coins/${coinId.toLowerCase()}.webp`;
}

export function getCoinIconUrlFromSymbol(symbol: string): string {
  return getCoinIconUrl(getBaseAssetFromSymbol(symbol));
}
