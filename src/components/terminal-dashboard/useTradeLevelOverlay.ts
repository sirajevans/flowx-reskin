import { useEffect, useRef, type RefObject } from 'react';
import type { IChartApi, IPaneApi, ISeriesApi, Time } from 'lightweight-charts';
import type { ChartCandlePoint } from '../../lib/parseOhlcvCsv';
import {
  type ActivePosition,
  clampLevelPrice,
  isLevelPriceValid,
  normalizePosition,
  removeAllPreviewTradeLevels,
  renderTradeLevelOverlay,
  updateDraggableTradeLevel,
  type DraggableLevelKind,
} from './tradeLevelOverlay';

type UseTradeLevelOverlayOptions = {
  chartRef: RefObject<IChartApi | null>;
  candleSeriesRef: RefObject<ISeriesApi<'Candlestick', Time> | null>;
  candlePaneRef: RefObject<IPaneApi<Time> | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  chartParentRef: RefObject<HTMLElement | null>;
  position: ActivePosition | null;
  onPositionChange?: (position: ActivePosition) => void;
  candles: ChartCandlePoint[];
  isLogScale?: boolean;
  chartReady: boolean;
};

export function useTradeLevelOverlay({
  chartRef,
  candleSeriesRef,
  candlePaneRef,
  overlayRef,
  chartParentRef,
  position,
  onPositionChange,
  candles,
  isLogScale = false,
  chartReady,
}: UseTradeLevelOverlayOptions) {
  const positionRef = useRef(position);
  positionRef.current = position;

  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    const candlePane = candlePaneRef.current;
    const overlay = overlayRef.current;
    const chartParent = chartParentRef.current;

    if (!chartReady || !chart || !candleSeries || !overlay || !chartParent) return;

    let rafPending = false;
    let pointerRafId: number | null = null;
    let wheelRafId: number | null = null;
    let dblClickRafId: number | null = null;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;
    let dblClickTimer: ReturnType<typeof setTimeout> | null = null;

    let dragKind: DraggableLevelKind | null = null;
    let dragPointerId: number | null = null;
    let dragPrice: number | null = null;
    let isDragging = false;
    let dragMode: 'move' | 'create' | null = null;

    const getPanelHeight = () => candlePane?.getHeight() ?? chart.paneSize(0).height;

    const priceFromPointer = (clientY: number) => {
      const panelHeight = getPanelHeight();
      const y = clientY - overlay.getBoundingClientRect().top;
      const clampedY = Math.min(Math.max(y, 0), panelHeight - 1);
      const price = candleSeries.coordinateToPrice(clampedY);
      if (price === null || !Number.isFinite(price) || price <= 0) return null;
      return price;
    };

    const updateDragVisual = (
      kind: DraggableLevelKind,
      price: number,
      position: ActivePosition,
      preview: boolean,
    ) => {
      updateDraggableTradeLevel({
        overlay,
        candleSeries,
        panelHeight: getPanelHeight(),
        kind,
        price,
        position: {
          ...position,
          ...(kind === 'stop' ? { stopLoss: price } : { takeProfit: price }),
        },
        preview,
        onAmountPointerDown,
        onRemoveLevel,
      });
    };

    const render = () => {
      rafPending = false;
      if (isDragging) return;

      const panelHeight = getPanelHeight();
      const latestClose = candles[candles.length - 1]?.close ?? 0;

      renderTradeLevelOverlay({
        overlay,
        candleSeries,
        position: positionRef.current,
        latestClose,
        panelHeight,
        onAmountPointerDown,
        onRemoveLevel,
        onAddLevelPointerDown,
      });
    };

    const scheduleRender = () => {
      if (rafPending || isDragging) return;
      rafPending = true;
      requestAnimationFrame(render);
    };

    const startRafLoop = (rafIdRef: { current: number | null }) => {
      const loop = () => {
        scheduleRender();
        rafIdRef.current = requestAnimationFrame(loop);
      };

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    const stopRafLoop = (rafIdRef: { current: number | null }) => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const pointerRafRef = { current: pointerRafId };
    const wheelRafRef = { current: wheelRafId };
    const dblClickRafRef = { current: dblClickRafId };

    const onDragPointerMove = (event: PointerEvent) => {
      if (!isDragging || dragKind === null || event.pointerId !== dragPointerId) return;

      const currentPosition = positionRef.current;
      if (!currentPosition) return;

      const price = priceFromPointer(event.clientY);
      if (price === null) return;

      const clampedPrice = clampLevelPrice(dragKind, currentPosition, price);
      dragPrice = clampedPrice;
      updateDragVisual(
        dragKind,
        clampedPrice,
        {
          ...currentPosition,
          ...(dragKind === 'stop'
            ? { stopLoss: clampedPrice }
            : { takeProfit: clampedPrice }),
        },
        dragMode === 'create',
      );

      event.preventDefault();
    };

    const finishDrag = (event: PointerEvent) => {
      if (!isDragging || dragKind === null || event.pointerId !== dragPointerId) return;

      const currentPosition = positionRef.current;
      const commitPosition = onPositionChangeRef.current;
      if (!currentPosition || !commitPosition) return;

      window.removeEventListener('pointermove', onDragPointerMove);
      window.removeEventListener('pointerup', onDragPointerUp);
      window.removeEventListener('pointercancel', onDragPointerUp);
      overlay.classList.remove('is-dragging');
      removeAllPreviewTradeLevels(overlay);

      const rawPrice = dragPrice ?? priceFromPointer(event.clientY);
      if (rawPrice !== null) {
        const price = clampLevelPrice(dragKind, currentPosition, rawPrice);

        if (dragMode === 'create') {
          if (isLevelPriceValid(dragKind, currentPosition, price)) {
            const nextPosition = normalizePosition({
              ...currentPosition,
              ...(dragKind === 'stop' ? { stopLoss: price } : { takeProfit: price }),
            });
            positionRef.current = nextPosition;
            commitPosition(nextPosition);
          }
        } else {
          const nextPosition = normalizePosition({
            ...currentPosition,
            ...(dragKind === 'stop' ? { stopLoss: price } : { takeProfit: price }),
          });
          positionRef.current = nextPosition;
          commitPosition(nextPosition);
        }
      }

      isDragging = false;
      dragMode = null;
      dragKind = null;
      dragPointerId = null;
      dragPrice = null;
      scheduleRender();
    };

    function onDragPointerUp(event: PointerEvent) {
      finishDrag(event);
    }

    const onRemoveLevel = (kind: DraggableLevelKind, event: PointerEvent) => {
      const currentPosition = positionRef.current;
      const commitPosition = onPositionChangeRef.current;
      if (!currentPosition || !commitPosition) return;

      event.preventDefault();
      event.stopPropagation();

      const nextPosition = {
        ...currentPosition,
        ...(kind === 'stop' ? { stopLoss: null } : { takeProfit: null }),
      };
      positionRef.current = nextPosition;
      commitPosition(nextPosition);
      scheduleRender();
    };

    const onAddLevelPointerDown = (kind: DraggableLevelKind, event: PointerEvent) => {
      const currentPosition = positionRef.current;
      const commitPosition = onPositionChangeRef.current;
      if (!currentPosition || !commitPosition) return;

      isDragging = true;
      dragMode = 'create';
      dragKind = kind;
      dragPointerId = event.pointerId;

      const pointerPrice = priceFromPointer(event.clientY) ?? currentPosition.entryPrice;
      dragPrice = clampLevelPrice(kind, currentPosition, pointerPrice);

      overlay.classList.add('is-dragging');
      window.addEventListener('pointermove', onDragPointerMove);
      window.addEventListener('pointerup', onDragPointerUp);
      window.addEventListener('pointercancel', onDragPointerUp);

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      updateDragVisual(
        kind,
        dragPrice,
        {
          ...currentPosition,
          ...(kind === 'stop' ? { stopLoss: dragPrice } : { takeProfit: dragPrice }),
        },
        true,
      );
    };

    const onAmountPointerDown = (kind: DraggableLevelKind, event: PointerEvent) => {
      const currentPosition = positionRef.current;
      const commitPosition = onPositionChangeRef.current;
      if (!currentPosition || !commitPosition) return;

      isDragging = true;
      dragMode = 'move';
      dragKind = kind;
      dragPointerId = event.pointerId;
      dragPrice = priceFromPointer(event.clientY);

      overlay.classList.add('is-dragging');
      window.addEventListener('pointermove', onDragPointerMove);
      window.addEventListener('pointerup', onDragPointerUp);
      window.addEventListener('pointercancel', onDragPointerUp);

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (dragPrice !== null) {
        const clampedPrice = clampLevelPrice(kind, currentPosition, dragPrice);
        dragPrice = clampedPrice;
        updateDragVisual(
          kind,
          clampedPrice,
          {
            ...currentPosition,
            ...(kind === 'stop'
              ? { stopLoss: clampedPrice }
              : { takeProfit: clampedPrice }),
          },
          false,
        );
      }
    };

    const onPointerDown = (_event: PointerEvent) => {
      if (isDragging) return;

      startRafLoop(pointerRafRef);
      pointerRafId = pointerRafRef.current;

      const onPointerUp = () => {
        stopRafLoop(pointerRafRef);
        pointerRafId = pointerRafRef.current;
        window.removeEventListener('pointerup', onPointerUp);
        scheduleRender();
      };

      window.addEventListener('pointerup', onPointerUp);
    };

    const onWheel = () => {
      if (isDragging) return;

      startRafLoop(wheelRafRef);
      wheelRafId = wheelRafRef.current;

      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        stopRafLoop(wheelRafRef);
        wheelRafId = wheelRafRef.current;
        scheduleRender();
        wheelTimer = null;
      }, 260);
    };

    const onDoubleClick = () => {
      if (isDragging) return;

      startRafLoop(dblClickRafRef);
      dblClickRafId = dblClickRafRef.current;

      if (dblClickTimer) clearTimeout(dblClickTimer);
      dblClickTimer = setTimeout(() => {
        stopRafLoop(dblClickRafRef);
        dblClickRafId = dblClickRafRef.current;
        scheduleRender();
        dblClickTimer = null;
      }, 220);
    };

    const timeScale = chart.timeScale();
    const resizeObserver = new ResizeObserver(scheduleRender);

    timeScale.subscribeVisibleTimeRangeChange(scheduleRender);
    timeScale.subscribeVisibleLogicalRangeChange(scheduleRender);
    resizeObserver.observe(overlay);
    chartParent.addEventListener('pointerdown', onPointerDown);
    chartParent.addEventListener('wheel', onWheel, { passive: true });
    chartParent.addEventListener('dblclick', onDoubleClick);

    scheduleRender();

    return () => {
      timeScale.unsubscribeVisibleTimeRangeChange(scheduleRender);
      timeScale.unsubscribeVisibleLogicalRangeChange(scheduleRender);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onDragPointerMove);
      window.removeEventListener('pointerup', onDragPointerUp);
      window.removeEventListener('pointercancel', onDragPointerUp);
      overlay.classList.remove('is-dragging');
      removeAllPreviewTradeLevels(overlay);
      chartParent.removeEventListener('pointerdown', onPointerDown);
      chartParent.removeEventListener('wheel', onWheel);
      chartParent.removeEventListener('dblclick', onDoubleClick);

      stopRafLoop(pointerRafRef);
      stopRafLoop(wheelRafRef);
      stopRafLoop(dblClickRafRef);

      if (wheelTimer) clearTimeout(wheelTimer);
      if (dblClickTimer) clearTimeout(dblClickTimer);

      isDragging = false;
      dragMode = null;
      overlay.innerHTML = '';
      overlay.style.height = '';
    };
  }, [
    candles,
    chartParentRef,
    chartReady,
    chartRef,
    candlePaneRef,
    candleSeriesRef,
    isLogScale,
    overlayRef,
    position,
  ]);
}
