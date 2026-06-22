import type { ISeriesApi, Time } from 'lightweight-charts';
import {
  type ActivePosition,
  type DraggableLevelKind,
  buildTradeLevelRenderItems,
  formatLevelPrice,
  formatSignedUsdt,
  signedMoveFromEntry,
} from './tradeLevelConfig';

export type { ActivePosition, DraggableLevelKind, PositionSide } from './tradeLevelConfig';
export {
  TRADE_LEVEL_SIDE_CONFIG,
  buildTradeLevelRenderItems,
  clampLevelPrice,
  createDefaultLevels,
  createDemoPosition,
  formatLevelPrice,
  formatSignedUsdt,
  getTradeLevelSideConfig,
  isLevelPriceValid,
  normalizePosition,
  signedMoveFromEntry,
} from './tradeLevelConfig';

type TradeLevelKind = 'entry' | DraggableLevelKind;

const AMOUNT_CLOSE_ICON = (stroke: string) =>
  `<svg viewBox="0 0 8 8" width="8" height="8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path transform="matrix(0.707 -0.707 0.707 0.707 1.712 1.712)" d="M0.000 0.000C0.000 0.000 0.000 6.470 0.000 6.470" vector-effect="non-scaling-stroke" fill="none" stroke="${stroke}" stroke-linecap="round" /><path transform="matrix(0.707 0.707 -0.707 0.707 6.287 1.713)" d="M0.000 0.000C0.000 0.000 0.000 6.470 0.000 6.470" vector-effect="non-scaling-stroke" fill="none" stroke="${stroke}" stroke-linecap="round" /></svg>`;

const PILL_ICON_STROKE: Record<'entry' | 'stop' | 'take', string> = {
  entry: '#9B9B9B',
  stop: '#FF838D',
  take: '#95EFCB',
};

function createAddLevelChip(
  kind: DraggableLevelKind,
  onAddLevelPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void,
): HTMLDivElement {
  const chip = document.createElement('div');
  chip.className = `trade-level-add-chip ${kind}`;
  chip.setAttribute('data-no-drag', '');

  const label = document.createElement('span');
  label.className = 'trade-level-add-chip-label';
  label.textContent = kind === 'stop' ? 'SL' : 'TP';

  const tooltip = document.createElement('div');
  tooltip.className = 'trade-level-add-chip-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.textContent = kind === 'stop' ? 'Drag to add SL' : 'Drag to add TP';

  chip.append(label, tooltip);

  if (onAddLevelPointerDown) {
    chip.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      onAddLevelPointerDown(kind, event);
    });
  }

  return chip;
}

function createPillAmountBadge(
  kind: 'entry' | 'stop' | 'take',
  amount: string,
  onAmountPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void,
  onRemoveLevel?: (kind: DraggableLevelKind, event: PointerEvent) => void,
): HTMLDivElement {
  const amountBadge = document.createElement('div');
  amountBadge.className = `trade-level-amount ${kind}`;

  const text = document.createElement('div');
  text.className = 'trade-level-amount-text';
  text.textContent = amount;

  const icon = document.createElement('div');
  icon.className = 'trade-level-amount-icon';
  icon.innerHTML = AMOUNT_CLOSE_ICON(PILL_ICON_STROKE[kind]);

  amountBadge.append(text, icon);

  if (kind === 'stop' || kind === 'take') {
    amountBadge.setAttribute('data-no-drag', '');

    if (onRemoveLevel) {
      icon.setAttribute('role', 'button');
      icon.setAttribute('aria-label', kind === 'stop' ? 'Remove stop loss' : 'Remove take profit');
      icon.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemoveLevel(kind, event);
      });
    }

    if (onAmountPointerDown) {
      amountBadge.addEventListener('pointerdown', (event) => {
        if ((event.target as HTMLElement).closest('.trade-level-amount-icon')) return;
        onAmountPointerDown(kind, event);
      });
    }
  }

  return amountBadge;
}

function appendTradeLevel(
  overlay: HTMLDivElement,
  candleSeries: ISeriesApi<'Candlestick', Time>,
  panelHeight: number,
  kind: TradeLevelKind,
  price: number,
  amount: string,
  position: ActivePosition,
  onAmountPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void,
  onRemoveLevel?: (kind: DraggableLevelKind, event: PointerEvent) => void,
  onAddLevelPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void,
) {
  if (!Number.isFinite(price) || price <= 0) return;

  const rawY = candleSeries.priceToCoordinate(price);
  if (rawY === null || rawY < 0 || rawY > panelHeight) return;

  const y = Math.min(Math.max(rawY, 0), panelHeight - 1);

  const line = document.createElement('div');
  line.className = `trade-level ${kind}`;

  const label = document.createElement('div');
  label.className = `trade-level-label ${kind}`;
  label.textContent = formatLevelPrice(price);

  const amountBadge = createPillAmountBadge(kind, amount, onAmountPointerDown, onRemoveLevel);

  if (kind === 'entry') {
    const group = document.createElement('div');
    group.className = 'trade-level-entry-group';
    group.style.top = `${y}px`;
    line.style.top = '0';
    label.style.top = '0';
    amountBadge.style.top = '0';

    const leftCluster = document.createElement('div');
    leftCluster.className = 'trade-level-entry-left';

    if (position.takeProfit === null) {
      leftCluster.append(createAddLevelChip('take', onAddLevelPointerDown));
    }
    if (position.stopLoss === null) {
      leftCluster.append(createAddLevelChip('stop', onAddLevelPointerDown));
    }

    leftCluster.append(amountBadge);
    group.append(line, leftCluster, label);
    overlay.append(group);
    return;
  }

  if (kind === 'stop' || kind === 'take') {
    const group = document.createElement('div');
    group.className = `trade-level-group ${kind}`;
    group.style.top = `${y}px`;
    line.style.top = '0';
    label.style.top = '0';
    amountBadge.style.top = '0';
    group.append(line, label, amountBadge);
    overlay.append(group);
    return;
  }

  line.style.top = `${y}px`;
  label.style.top = `${y}px`;
  amountBadge.style.top = `${y}px`;
  overlay.append(line, label, amountBadge);
}

function buildTradeLevelGroup(
  kind: DraggableLevelKind,
  price: number,
  amount: string,
  options?: {
    preview?: boolean;
    onAmountPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void;
    onRemoveLevel?: (kind: DraggableLevelKind, event: PointerEvent) => void;
  },
): HTMLDivElement {
  const group = document.createElement('div');
  group.className = `trade-level-group ${kind}${options?.preview ? ' preview' : ''}`;

  const line = document.createElement('div');
  line.className = `trade-level ${kind}`;

  const label = document.createElement('div');
  label.className = `trade-level-label ${kind}`;
  label.textContent = formatLevelPrice(price);

  const amountBadge = createPillAmountBadge(
    kind,
    amount,
    options?.preview ? undefined : options?.onAmountPointerDown,
    options?.preview ? undefined : options?.onRemoveLevel,
  );

  line.style.top = '0';
  label.style.top = '0';
  amountBadge.style.top = '0';
  group.append(line, label, amountBadge);

  return group;
}

export function removePreviewTradeLevel(overlay: HTMLDivElement, kind: DraggableLevelKind) {
  overlay.querySelector(`.trade-level-group.preview.${kind}`)?.remove();
}

export function removeAllPreviewTradeLevels(overlay: HTMLDivElement) {
  overlay.querySelectorAll('.trade-level-group.preview').forEach((node) => node.remove());
}

export function updateTradeLevelDragFill({
  overlay,
  candleSeries,
  entryPrice,
  levelPrice,
  kind,
  panelHeight,
}: {
  overlay: HTMLDivElement;
  candleSeries: ISeriesApi<'Candlestick', Time>;
  entryPrice: number;
  levelPrice: number;
  kind: DraggableLevelKind;
  panelHeight: number;
}) {
  const entryRawY = candleSeries.priceToCoordinate(entryPrice);
  const levelRawY = candleSeries.priceToCoordinate(levelPrice);
  if (entryRawY === null || levelRawY === null) return;

  const entryY = Math.min(Math.max(entryRawY, 0), panelHeight - 1);
  const levelY = Math.min(Math.max(levelRawY, 0), panelHeight - 1);

  if (Math.abs(entryY - levelY) < 1) {
    removeTradeLevelDragFill(overlay, kind);
    return;
  }

  const top = Math.min(entryY, levelY);
  const height = Math.abs(entryY - levelY);

  let fill = overlay.querySelector<HTMLElement>(`.trade-level-drag-fill.${kind}`);
  if (!fill) {
    fill = document.createElement('div');
    fill.className = `trade-level-drag-fill ${kind}`;
    overlay.prepend(fill);
  }

  fill.style.top = `${top}px`;
  fill.style.height = `${height}px`;
}

export function removeTradeLevelDragFill(
  overlay: HTMLDivElement,
  kind?: DraggableLevelKind,
) {
  if (kind) {
    overlay.querySelector(`.trade-level-drag-fill.${kind}`)?.remove();
    return;
  }

  overlay.querySelectorAll('.trade-level-drag-fill').forEach((node) => node.remove());
}

export function upsertTradeLevelVisual({
  overlay,
  candleSeries,
  panelHeight,
  kind,
  price,
  position,
  preview = false,
  onAmountPointerDown,
  onRemoveLevel,
}: {
  overlay: HTMLDivElement;
  candleSeries: ISeriesApi<'Candlestick', Time>;
  panelHeight: number;
  kind: DraggableLevelKind;
  price: number;
  position: ActivePosition;
  preview?: boolean;
  onAmountPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void;
  onRemoveLevel?: (kind: DraggableLevelKind, event: PointerEvent) => void;
}) {
  if (!Number.isFinite(price) || price <= 0) return;

  const rawY = candleSeries.priceToCoordinate(price);
  if (rawY === null) return;

  const y = Math.min(Math.max(rawY, 0), panelHeight - 1);
  const amount = formatSignedUsdt(signedMoveFromEntry(position, price));
  const selector = preview ? `.trade-level-group.preview.${kind}` : `.trade-level-group.${kind}`;

  let group = overlay.querySelector<HTMLElement>(selector);
  if (!group) {
    const built = buildTradeLevelGroup(kind, price, amount, {
      preview,
      onAmountPointerDown,
      onRemoveLevel,
    });
    built.style.top = `${y}px`;
    overlay.append(built);
    return;
  }

  group.style.top = `${y}px`;
  const label = group.querySelector<HTMLElement>(`.trade-level-label.${kind}`);
  const amountText = group.querySelector<HTMLElement>(
    `.trade-level-amount.${kind} .trade-level-amount-text`,
  );
  if (label) label.textContent = formatLevelPrice(price);
  if (amountText) amountText.textContent = amount;
}

export function renderTradeLevelOverlay({
  overlay,
  candleSeries,
  position,
  latestClose,
  panelHeight,
  onAmountPointerDown,
  onRemoveLevel,
  onAddLevelPointerDown,
}: {
  overlay: HTMLDivElement;
  candleSeries: ISeriesApi<'Candlestick', Time>;
  position: ActivePosition | null;
  latestClose: number;
  panelHeight: number;
  onAmountPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void;
  onRemoveLevel?: (kind: DraggableLevelKind, event: PointerEvent) => void;
  onAddLevelPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void;
}) {
  overlay.innerHTML = '';
  overlay.style.height = `${panelHeight}px`;

  if (!position || panelHeight <= 0) return;

  const levels = buildTradeLevelRenderItems(position, latestClose, formatSignedUsdt);

  for (const level of levels) {
    appendTradeLevel(
      overlay,
      candleSeries,
      panelHeight,
      level.kind,
      level.price,
      level.amount,
      position,
      onAmountPointerDown,
      onRemoveLevel,
      onAddLevelPointerDown,
    );
  }
}

export function updateDraggableTradeLevel({
  overlay,
  candleSeries,
  panelHeight,
  kind,
  price,
  position,
  preview = false,
  onAmountPointerDown,
  onRemoveLevel,
}: {
  overlay: HTMLDivElement;
  candleSeries: ISeriesApi<'Candlestick', Time>;
  panelHeight: number;
  kind: DraggableLevelKind;
  price: number;
  position: ActivePosition;
  preview?: boolean;
  onAmountPointerDown?: (kind: DraggableLevelKind, event: PointerEvent) => void;
  onRemoveLevel?: (kind: DraggableLevelKind, event: PointerEvent) => void;
}) {
  upsertTradeLevelVisual({
    overlay,
    candleSeries,
    panelHeight,
    kind,
    price,
    position,
    preview,
    onAmountPointerDown,
    onRemoveLevel,
  });
}
