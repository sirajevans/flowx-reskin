import { useCallback, useEffect, useRef, useState, type Ref } from 'react';
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  HistogramSeries,
  type HistogramData,
  type Time,
} from 'lightweight-charts';
import { repairLayouts } from './layoutRepair';
import { setDashboardOpenModuleHandler } from './dashboardModuleBridge';
import { useDashboardUndo } from './useDashboardUndo';
import {
  Responsive,
  useContainerWidth,
  type Layout,
  type LayoutItem,
  type ResizeHandleAxis,
  type ResponsiveLayouts,
} from 'react-grid-layout';
import {
  containerBounds,
  defaultConstraints,
  getCompactor,
} from 'react-grid-layout/core';
import { ResizeHandleLeftIcon, ResizeHandleRightIcon } from '../icons';
import { ExchangeLiquidationsPanel } from '../liquidations/exchange-liquidations';
import { FundingRatesPanel } from '../funding-rates';
import { LiquidationsPanel } from '../liquidations';
import { MoneyFlowPanel } from '../money-flow';
import { OrderFeedPanel } from '../order-feed';
import { OrderPanel } from '../order';
import { PositionsPanel } from '../positions';
import { TerminalBrandBadgeModule } from '../terminal-brand-badge';
import { terminalBrandBadgeSlotClass } from '../terminal-brand-badge/terminalBrandBadgeClasses';
import { getCoinIconUrlFromSymbol } from '../../lib/coinIcons';
import {
  BTCUSDT_5M_MAY_2026,
  type ChartCandlePoint,
} from '../../lib/parseOhlcvCsv';
import { TerminalStatsModule } from '../terminal-stats';
import { cardModuleGradientBorder } from '../ui/cardModuleClasses';
import { cn } from '../../lib/utils';

const DASHBOARD_GRID_COMPACTOR = getCompactor(null, false, true);
const DASHBOARD_GRID_CONSTRAINTS = [...defaultConstraints, containerBounds];
const DASHBOARD_DRAG_CANCEL =
  'button,input,textarea,select,a,[role=button],[role=tab],[data-no-drag]';

const DASHBOARD_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v19';
const FIXED_HEADER_LAYOUT_ITEMS = new Set(['brand-badge', 'stats']);
const PREVIOUS_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v18';
const LEGACY_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v9';
const CHART_UP_COLOR = '#06b470';
const CHART_DOWN_COLOR = '#f23645';
const CHART_VOLUME_UP_COLOR = 'rgba(6, 180, 112, 0.25)';
const CHART_VOLUME_DOWN_COLOR = 'rgba(242, 54, 69, 0.25)';
const CHART_VOLUME_PANE_STRETCH = 0.22;
const CHART_CANDLE_PANE_STRETCH = 0.78;

function formatChartValue(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function getChartOhlcvItems(candle: ChartCandlePoint | undefined) {
  if (!candle) {
    return [
      ['O', '—'],
      ['H', '—'],
      ['L', '—'],
      ['C', '—'],
      ['V', '—'],
    ] as const;
  }

  return [
    ['O', formatChartValue(candle.open)],
    ['H', formatChartValue(candle.high)],
    ['L', formatChartValue(candle.low)],
    ['C', formatChartValue(candle.close)],
    ['V', formatChartValue(candle.volume)],
  ] as const;
}

function toVolumeSeriesData(candles: ChartCandlePoint[]): HistogramData<Time>[] {
  return candles.map(({ time, open, close, volume }) => ({
    time,
    value: volume,
    color: close >= open ? CHART_VOLUME_UP_COLOR : CHART_VOLUME_DOWN_COLOR,
  }));
}

const BREAKPOINTS = {
  xxl: 1280,
  lg: 1024,
  md: 768,
  sm: 0,
} as const;

/** Row pitch: rowHeight + marginY ≈ 10.5px. Match that horizontally via 2× column density. */
const ROW_GRID_DENSITY = 4;
const COL_GRID_DENSITY = ROW_GRID_DENSITY * 2;
/** Calibrated at 2px vertical margin (8.5 + 2). Keep pitch stable when margin changes. */
const ROW_PITCH_PX = 34 / ROW_GRID_DENSITY + 2;

function gridColWidth(containerWidth: number, cols: number, marginX: number) {
  return (containerWidth - marginX * (cols - 1)) / cols;
}

function gridItemWidthPx(w: number, unitSize: number, margin: number) {
  return w * unitSize + Math.max(0, w - 1) * margin;
}

function gridUnitsForPxMinAtLeast(px: number, unitSize: number, margin: number) {
  let units = 1;
  while (gridItemWidthPx(units, unitSize, margin) < px) {
    units += 1;
  }
  return units;
}

/** Pick the grid span closest to a target min height without overshooting (e.g. 154px → 15 rows, not 16). */
function gridUnitsForPxMinHeightTarget(px: number, unitSize: number, margin: number) {
  const atLeast = gridUnitsForPxMinAtLeast(px, unitSize, margin);
  if (atLeast <= 1) return atLeast;

  const oneLess = atLeast - 1;
  const heightAtLeast = gridItemWidthPx(atLeast, unitSize, margin);
  const heightOneLess = gridItemWidthPx(oneLess, unitSize, margin);

  return Math.abs(heightOneLess - px) <= Math.abs(heightAtLeast - px) ? oneLess : atLeast;
}

function clearModuleMaxSizeCaps(layout: Layout): LayoutItem[] {
  return [...layout].map((item) => {
    if (!MODULE_MIN_SIZES_PX[item.i]) return item;

    const next = { ...item };
    delete next.maxW;
    delete next.maxH;
    return next;
  });
}

function applyModuleMinSizeConstraints(
  layouts: ResponsiveLayouts,
  containerWidth: number,
  breakpoint: DashboardBreakpoint,
): ResponsiveLayouts {
  if (containerWidth <= 0) return layouts;

  const cols = COLS[breakpoint];
  const layout = layouts[breakpoint];
  if (!layout) return layouts;

  const marginX = GRID_MARGIN[0];
  const marginY = GRID_MARGIN[1];
  const colUnit = gridColWidth(containerWidth, cols, marginX);

  return {
    ...layouts,
    [breakpoint]: clearModuleMaxSizeCaps(
      layout.map((item) => {
        const minSize = MODULE_MIN_SIZES_PX[item.i];
        if (!minSize) return item;

        const minW = Math.min(
          item.w,
          cols,
          gridUnitsForPxMinAtLeast(minSize.width, colUnit, marginX),
        );
        const minH = gridUnitsForPxMinHeightTarget(minSize.height, ROW_HEIGHT, marginY);

        const next = {
          ...item,
          minW: Math.max(item.minW ?? 1, minW),
          minH,
        };
        delete next.maxW;
        delete next.maxH;
        return next;
      }),
    ),
  };
}

const COLS = {
  xxl: 14 * COL_GRID_DENSITY,
  lg: 12 * COL_GRID_DENSITY,
  md: 8 * COL_GRID_DENSITY,
  sm: 1,
} as const;

type DashboardBreakpoint = keyof typeof COLS;

/** Grid rows occupied by the fixed header before v13 (badge + stats in the grid). */
const LEGACY_HEADER_ROW_H: Record<DashboardBreakpoint, number> = {
  xxl: 5,
  lg: 5,
  md: 8,
  sm: 18,
};

const GRID_MARGIN: [number, number] = [4, 4];
const ROW_HEIGHT = ROW_PITCH_PX - GRID_MARGIN[1];

const MODULE_MIN_SIZES_PX: Partial<Record<string, { width: number; height: number }>> = {
  liquidations: { width: 302, height: 174 },
  'exchange-liquidations': { width: 302, height: 133 },
  'money-flow': { width: 302, height: 154 },
  'funding-rates': { width: 302, height: 206 },
  positions: { width: 794, height: 154 },
  order: { width: 315, height: 374 },
  'order-feed': { width: 315, height: 206 },
};

const DEFAULT_LAYOUTS: ResponsiveLayouts = {
  xxl: [
    { i: 'liquidations', x: 0, y: 0, w: 26, h: 17, minW: 24, minH: 17 },
    { i: 'exchange-liquidations', x: 0, y: 17, w: 26, h: 22, minW: 24, minH: 13 },
    { i: 'money-flow', x: 0, y: 39, w: 26, h: 39, minW: 26, minH: 15 },
    { i: 'funding-rates', x: 0, y: 78, w: 26, h: 20, minW: 24, minH: 20 },
    { i: 'chart', x: 26, y: 0, w: 60, h: 59, minW: 16, minH: 24 },
    { i: 'positions', x: 26, y: 59, w: 60, h: 19, minW: 60, minH: 15 },
    { i: 'order', x: 86, y: 0, w: 26, h: 36, minW: 25, minH: 36 },
    { i: 'order-feed', x: 86, y: 36, w: 26, h: 42, minW: 25, minH: 20 },
  ],
  lg: [
    { i: 'liquidations', x: 0, y: 0, w: 12, h: 12, minW: 12, minH: 12 },
    { i: 'exchange-liquidations', x: 0, y: 12, w: 12, h: 16, minW: 12, minH: 12 },
    { i: 'money-flow', x: 0, y: 28, w: 12, h: 28, minW: 12, minH: 20 },
    { i: 'funding-rates', x: 0, y: 56, w: 12, h: 20, minW: 12, minH: 20 },
    { i: 'chart', x: 12, y: 0, w: 24, h: 40, minW: 16, minH: 24 },
    { i: 'positions', x: 12, y: 40, w: 24, h: 16, minW: 16, minH: 12 },
    { i: 'order', x: 36, y: 0, w: 12, h: 28, minW: 12, minH: 24 },
    { i: 'order-feed', x: 36, y: 28, w: 12, h: 28, minW: 12, minH: 20 },
  ],
  md: [
    { i: 'chart', x: 0, y: 0, w: 20, h: 36, minW: 16, minH: 24 },
    { i: 'order', x: 20, y: 0, w: 12, h: 28, minW: 12, minH: 24 },
    { i: 'order-feed', x: 20, y: 28, w: 12, h: 28, minW: 12, minH: 20 },
    { i: 'positions', x: 0, y: 36, w: 20, h: 16, minW: 16, minH: 12 },
    { i: 'liquidations', x: 0, y: 52, w: 12, h: 12, minW: 12, minH: 12 },
    { i: 'exchange-liquidations', x: 12, y: 52, w: 12, h: 16, minW: 12, minH: 12 },
    { i: 'money-flow', x: 0, y: 68, w: 14, h: 40, minW: 14, minH: 40 },
    { i: 'funding-rates', x: 14, y: 68, w: 10, h: 20, minW: 10, minH: 20 },
  ],
  sm: [
    { i: 'chart', x: 0, y: 0, w: 1, h: 36, minW: 1, minH: 24 },
    { i: 'order', x: 0, y: 36, w: 1, h: 28, minW: 1, minH: 24 },
    { i: 'order-feed', x: 0, y: 64, w: 1, h: 28, minW: 1, minH: 20 },
    { i: 'positions', x: 0, y: 92, w: 1, h: 20, minW: 1, minH: 16 },
    { i: 'liquidations', x: 0, y: 112, w: 1, h: 12, minW: 1, minH: 12 },
    { i: 'exchange-liquidations', x: 0, y: 124, w: 1, h: 16, minW: 1, minH: 12 },
    { i: 'money-flow', x: 0, y: 140, w: 1, h: 40, minW: 1, minH: 40 },
    { i: 'funding-rates', x: 0, y: 180, w: 1, h: 20, minW: 1, minH: 20 },
  ],
};

function stripFixedHeaderFromLayouts(layouts: ResponsiveLayouts): ResponsiveLayouts {
  return Object.fromEntries(
    Object.entries(layouts).map(([breakpoint, layout]) => {
      const bp = breakpoint as DashboardBreakpoint;
      const items = layout ?? [];
      const hadFixedHeader = items.some((item) => FIXED_HEADER_LAYOUT_ITEMS.has(item.i));
      if (!hadFixedHeader) return [breakpoint, items];

      const headerRows = LEGACY_HEADER_ROW_H[bp];
      return [
        breakpoint,
        items
          .filter((item) => !FIXED_HEADER_LAYOUT_ITEMS.has(item.i))
          .map((item) => ({ ...item, y: Math.max(0, item.y - headerRows) })),
      ];
    }),
  ) as ResponsiveLayouts;
}

function prepareLayouts(layouts: ResponsiveLayouts): ResponsiveLayouts {
  const cleared = Object.fromEntries(
    Object.entries(stripFixedHeaderFromLayouts(layouts)).map(([breakpoint, layout]) => [
      breakpoint,
      clearModuleMaxSizeCaps(layout ?? []),
    ]),
  ) as ResponsiveLayouts;

  return repairLayouts(cleared, COLS, DEFAULT_LAYOUTS);
}

function loadStoredLayouts() {
  if (typeof window === 'undefined') return prepareLayouts(DEFAULT_LAYOUTS);

  try {
    const storedLayouts = window.localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY);
    if (storedLayouts) {
      const parsedLayouts = JSON.parse(storedLayouts) as ResponsiveLayouts;
      return prepareLayouts({
        ...DEFAULT_LAYOUTS,
        ...parsedLayouts,
      });
    }

    const previousLayouts = window.localStorage.getItem(PREVIOUS_LAYOUT_STORAGE_KEY);
    if (previousLayouts) {
      const parsedPrevious = JSON.parse(previousLayouts) as ResponsiveLayouts;
      return prepareLayouts({
        ...DEFAULT_LAYOUTS,
        ...parsedPrevious,
      });
    }

    const legacyLayouts = window.localStorage.getItem(LEGACY_LAYOUT_STORAGE_KEY);
    if (legacyLayouts) {
      const parsedLegacy = JSON.parse(legacyLayouts) as ResponsiveLayouts;
      return prepareLayouts({
        ...DEFAULT_LAYOUTS,
        ...parsedLegacy,
      });
    }

    return prepareLayouts(DEFAULT_LAYOUTS);
  } catch {
    return prepareLayouts(DEFAULT_LAYOUTS);
  }
}

function persistLayouts(layouts: ResponsiveLayouts) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, JSON.stringify(layouts));
}

function ChartModule({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const latestCandle = BTCUSDT_5M_MAY_2026[BTCUSDT_5M_MAY_2026.length - 1];
  const chartOhlcvItems = getChartOhlcvItems(latestCandle);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const backgroundColor = '#0A0A0A';
    const textColor = rootStyle.getPropertyValue('--flowx-muted').trim() || '#a1a1aa';
    const borderColor = 'rgba(255, 255, 255, 0.08)';

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: 11,
        attributionLogo: false,
        panes: {
          separatorColor: '#2b2b2b',
        },
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'rgba(255, 255, 255, 0.22)',
          labelBackgroundColor: 'rgba(14, 14, 14, 0.95)',
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.22)',
          labelBackgroundColor: 'rgba(14, 14, 14, 0.95)',
        },
      },
      rightPriceScale: {
        borderColor,
        scaleMargins: {
          top: 0.14,
          bottom: 0.04,
        },
      },
      timeScale: {
        borderColor,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 6,
        barSpacing: 12,
      },
    });

    const volumePane = chart.addPane();
    const [candlePane] = chart.panes();

    candlePane.setStretchFactor(CHART_CANDLE_PANE_STRETCH);
    volumePane.setStretchFactor(CHART_VOLUME_PANE_STRETCH);

    const candlestickSeries = chart.addSeries(
      CandlestickSeries,
      {
        upColor: CHART_UP_COLOR,
        downColor: CHART_DOWN_COLOR,
        borderUpColor: CHART_UP_COLOR,
        borderDownColor: CHART_DOWN_COLOR,
        wickUpColor: CHART_UP_COLOR,
        wickDownColor: CHART_DOWN_COLOR,
        priceLineColor: CHART_UP_COLOR,
        lastValueVisible: true,
        priceLineVisible: true,
      },
      0,
    );

    const volumeSeries = chart.addSeries(
      HistogramSeries,
      {
        color: CHART_VOLUME_UP_COLOR,
        priceFormat: { type: 'volume' },
        lastValueVisible: false,
        priceLineVisible: false,
      },
      1,
    );

    candlestickSeries.setData(BTCUSDT_5M_MAY_2026);
    volumeSeries.setData(toVolumeSeriesData(BTCUSDT_5M_MAY_2026));
    chart.timeScale().fitContent();

    const resizeChart = () => {
      chart.resize(container.clientWidth, container.clientHeight);
      chart.timeScale().fitContent();
    };

    const resizeObserver = new ResizeObserver(resizeChart);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  return (
    <section
      className="module-drag-handle terminal-dashboard-chart gradient-border p-[6px]"
      aria-label="Chart module"
    >
      <div
        ref={chartContainerRef}
        className="absolute inset-[6px] z-0 min-h-0 min-w-0"
        data-no-drag
        aria-hidden
      />
      <div
        className={cn(
          'gradient-border box-border absolute left-2 top-2 z-10 flex max-w-[calc(100%-16px)] items-center gap-6 overflow-clip rounded-lg px-2.5 py-[9px]',
          'bg-[color-mix(in_srgb,var(--widget-chrome-bg)_75%,transparent)] [backdrop-filter:blur(5px)] [box-shadow:#00000080_0px_2px_20px]',
          cardModuleGradientBorder,
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <div
            className="h-[18.25px] w-[18.25px] shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getCoinIconUrlFromSymbol(symbol)})` }}
            aria-hidden
          />
          <div className="flex min-w-0 items-center gap-0.5">
            <div className="shrink-0 text-[13px] leading-4 text-white">{symbol}</div>
            <div className="truncate text-[13px] leading-4 text-white">Blofin · 5m</div>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-5 [font-variant-numeric:tabular-nums]">
          {chartOhlcvItems.map(([label, value]) => (
            <div key={label} className="flex shrink-0 items-center gap-[5px]">
              <div className="text-[13px] leading-4 text-white">{label}</div>
              <div className="text-[13px] leading-4 text-[#06b470]">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderResizeHandle(axis: ResizeHandleAxis, ref: Ref<HTMLElement>) {
  const isLeft = axis === 'sw';

  return (
    <span
      ref={ref}
      className={`react-resizable-handle react-resizable-handle-${axis} terminal-dashboard__resize-handle`}
      aria-hidden
    >
      {isLeft ? <ResizeHandleLeftIcon /> : <ResizeHandleRightIcon />}
    </span>
  );
}

export function TerminalDashboard() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(loadStoredLayouts);
  const [closedModules, setClosedModules] = useState<Set<string>>(() => new Set());
  const { width: observedGridWidth, containerRef, mounted: gridMounted } = useContainerWidth();
  const [gridMetrics, setGridMetrics] = useState<{ width: number; breakpoint: DashboardBreakpoint }>({
    width: 0,
    breakpoint: 'xxl',
  });
  const isInteractingRef = useRef(false);
  const gridMetricsRef = useRef(gridMetrics);

  useEffect(() => {
    gridMetricsRef.current = gridMetrics;
    // #region agent log
    fetch('http://127.0.0.1:7713/ingest/5e13ff40-aefa-4d16-9906-b5e26ae12fd5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'fe40c4'},body:JSON.stringify({sessionId:'fe40c4',location:'TerminalDashboard.tsx:gridMetrics',message:'grid metrics updated',data:{width:gridMetrics.width,breakpoint:gridMetrics.breakpoint,observedGridWidth,gridMounted},timestamp:Date.now(),hypothesisId:'H2',runId:'post-fix'})}).catch(()=>{});
    // #endregion
  }, [gridMetrics, observedGridWidth, gridMounted]);

  useEffect(() => {
    if (observedGridWidth <= 0) return;
    setGridMetrics((prev) =>
      prev.width === observedGridWidth ? prev : { ...prev, width: observedGridWidth },
    );
  }, [observedGridWidth]);

  useEffect(() => {
    const bp = gridMetrics.breakpoint;
    const layout = layouts[bp] ?? [];
    // #region agent log
    fetch('http://127.0.0.1:7713/ingest/5e13ff40-aefa-4d16-9906-b5e26ae12fd5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'fe40c4'},body:JSON.stringify({sessionId:'fe40c4',location:'TerminalDashboard.tsx:layoutFlags',message:'layout item flags',data:{breakpoint:bp,items:layout.map((item)=>({i:item.i,static:item.static,isDraggable:item.isDraggable,isResizable:item.isResizable,x:item.x,y:item.y,w:item.w,h:item.h}))},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
  }, [layouts, gridMetrics.breakpoint]);

  const finalizeLayouts = useCallback(
    (nextLayouts: ResponsiveLayouts, containerWidth: number, breakpoint: DashboardBreakpoint) => {
      const stripped = stripFixedHeaderFromLayouts(nextLayouts);
      const constrained = applyModuleMinSizeConstraints(stripped, containerWidth, breakpoint);
      return repairLayouts(constrained, COLS, DEFAULT_LAYOUTS);
    },
    [],
  );

  const restoreDashboardSnapshot = useCallback(
    (snapshot: { layouts: ResponsiveLayouts; closedModules: string[] }) => {
      setClosedModules(new Set(snapshot.closedModules));

      if (gridMetrics.width <= 0) {
        setLayouts(snapshot.layouts);
        persistLayouts(snapshot.layouts);
        return;
      }

      const restored = finalizeLayouts(
        snapshot.layouts,
        gridMetrics.width,
        gridMetrics.breakpoint,
      );
      setLayouts(restored);
      persistLayouts(restored);
    },
    [finalizeLayouts, gridMetrics.width, gridMetrics.breakpoint],
  );

  const { pushUndoSnapshot, beginInteractionSnapshot, endInteractionSnapshot } = useDashboardUndo({
    layouts,
    closedModules,
    onRestore: restoreDashboardSnapshot,
  });

  const commitLayouts = useCallback(
    (nextLayouts: ResponsiveLayouts) => {
      if (gridMetrics.width <= 0) return;

      const finalized = finalizeLayouts(
        nextLayouts,
        gridMetrics.width,
        gridMetrics.breakpoint,
      );
      setLayouts(finalized);
      persistLayouts(finalized);
    },
    [finalizeLayouts, gridMetrics.width, gridMetrics.breakpoint],
  );

  useEffect(() => {
    if (gridMetrics.width <= 0 || isInteractingRef.current) return;

    setLayouts((prev) => finalizeLayouts(prev, gridMetrics.width, gridMetrics.breakpoint));
  }, [gridMetrics.width, gridMetrics.breakpoint, finalizeLayouts]);

  const handleLayoutChange = (_currentLayout: Layout, nextLayouts: ResponsiveLayouts) => {
    if (isInteractingRef.current) return;
    commitLayouts(nextLayouts);
  };

  const handleInteractionStart = (...args: unknown[]) => {
    isInteractingRef.current = true;
    beginInteractionSnapshot();
    // #region agent log
    fetch('http://127.0.0.1:7713/ingest/5e13ff40-aefa-4d16-9906-b5e26ae12fd5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'fe40c4'},body:JSON.stringify({sessionId:'fe40c4',location:'TerminalDashboard.tsx:interactionStart',message:'drag/resize started',data:{argCount:args.length,gridWidth:gridMetricsRef.current.width,breakpoint:gridMetricsRef.current.breakpoint},timestamp:Date.now(),hypothesisId:'H3',runId:'post-fix'})}).catch(()=>{});
    // #endregion
  };

  const handleInteractionStop = (currentLayout: Layout, ...rest: unknown[]) => {
    const bp = gridMetricsRef.current.breakpoint;
    const prevItem = layouts[bp]?.[0];
    const nextItem = currentLayout?.[0];
    isInteractingRef.current = false;
    endInteractionSnapshot();
    let reverted = false;
    setLayouts((prev) => {
      const nextLayouts = {
        ...prev,
        [bp]: currentLayout,
      };
      if (gridMetricsRef.current.width <= 0) {
        reverted = true;
        return prev;
      }
      const finalized = finalizeLayouts(
        nextLayouts,
        gridMetricsRef.current.width,
        gridMetricsRef.current.breakpoint,
      );
      const finalizedFirst = finalized[bp]?.[0];
      if (
        finalizedFirst &&
        nextItem &&
        (finalizedFirst.x !== nextItem.x ||
          finalizedFirst.y !== nextItem.y ||
          finalizedFirst.w !== nextItem.w ||
          finalizedFirst.h !== nextItem.h)
      ) {
        reverted = true;
      }
      persistLayouts(finalized);
      return finalized;
    });
    // #region agent log
    fetch('http://127.0.0.1:7713/ingest/5e13ff40-aefa-4d16-9906-b5e26ae12fd5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'fe40c4'},body:JSON.stringify({sessionId:'fe40c4',location:'TerminalDashboard.tsx:interactionStop',message:'drag/resize stopped',data:{argCount:rest.length+1,gridWidth:gridMetricsRef.current.width,breakpoint:bp,prevFirst:prevItem?{i:prevItem.i,x:prevItem.x,y:prevItem.y,w:prevItem.w,h:prevItem.h}:null,nextFirst:nextItem?{i:nextItem.i,x:nextItem.x,y:nextItem.y,w:nextItem.w,h:nextItem.h}:null,reverted},timestamp:Date.now(),hypothesisId:'H5',runId:'post-fix'})}).catch(()=>{});
    // #endregion
  };

  const handleWidthChange = (containerWidth: number) => {
    if (containerWidth <= 0) return;
    setGridMetrics((prev) => ({
      ...prev,
      width: containerWidth,
    }));
  };

  const handleBreakpointChange = (breakpoint: string) => {
    setGridMetrics((prev) => ({
      ...prev,
      breakpoint: breakpoint as DashboardBreakpoint,
    }));
  };

  const handleCloseModule = useCallback(
    (moduleId: string) => {
      pushUndoSnapshot();
      setClosedModules((prev) => new Set([...prev, moduleId]));
    setLayouts((prev) => {
      const nextLayouts = Object.fromEntries(
        Object.entries(prev).map(([breakpoint, layout]) => [
          breakpoint,
          (layout ?? []).filter((item) => item.i !== moduleId),
        ]),
      ) as ResponsiveLayouts;

      persistLayouts(nextLayouts);
      return nextLayouts;
    });
    },
    [pushUndoSnapshot],
  );

  const handleOpenModule = useCallback(
    (moduleId: string) => {
      pushUndoSnapshot();

      setClosedModules((prev) => {
        if (!prev.has(moduleId)) return prev;
        const next = new Set(prev);
        next.delete(moduleId);
        return next;
      });

      setLayouts((prev) => {
        const moduleIsOnGrid = Object.values(prev).some((layout) =>
          (layout ?? []).some((item) => item.i === moduleId),
        );
        if (moduleIsOnGrid) return prev;

        const nextLayouts = Object.fromEntries(
          Object.entries(DEFAULT_LAYOUTS).map(([breakpoint, defaultLayout]) => {
            const current = prev[breakpoint as DashboardBreakpoint] ?? [];
            const defaultItem = (defaultLayout ?? []).find((item) => item.i === moduleId);
            if (!defaultItem) return [breakpoint, current];
            return [breakpoint, [...current, { ...defaultItem }]];
          }),
        ) as ResponsiveLayouts;

        const { width, breakpoint } = gridMetricsRef.current;
        if (width > 0) {
          const finalized = finalizeLayouts(nextLayouts, width, breakpoint);
          persistLayouts(finalized);
          return finalized;
        }

        persistLayouts(nextLayouts);
        return nextLayouts;
      });
    },
    [finalizeLayouts, pushUndoSnapshot],
  );

  useEffect(() => {
    setDashboardOpenModuleHandler(handleOpenModule);
    return () => setDashboardOpenModuleHandler(null);
  }, [handleOpenModule]);

  useEffect(() => {
    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target;
      const overlayPresent = document.querySelector('.startup-overlay') !== null;
      const onDragHandle =
        target instanceof Element && target.closest('.module-drag-handle') !== null;
      const onResizeHandle =
        target instanceof Element && target.closest('.react-resizable-handle') !== null;
      if (!onDragHandle && !onResizeHandle) return;
      // #region agent log
      fetch('http://127.0.0.1:7713/ingest/5e13ff40-aefa-4d16-9906-b5e26ae12fd5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'fe40c4'},body:JSON.stringify({sessionId:'fe40c4',location:'TerminalDashboard.tsx:docMouseDown',message:'mousedown on grid chrome',data:{overlayPresent,onDragHandle,onResizeHandle,targetTag:target instanceof Element?target.tagName:null},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const isModuleOpen = useCallback(
    (moduleId: string) => !closedModules.has(moduleId),
    [closedModules],
  );

  return (
    <main className="terminal-dashboard flex min-h-dvh flex-col gap-1 overflow-x-hidden px-2 py-2">
      <div className="terminal-dashboard__header flex max-h-[52px] min-w-0 flex-col gap-1 md:flex-row md:items-start">
        <div className={terminalBrandBadgeSlotClass}>
          <TerminalBrandBadgeModule />
        </div>
        <div className="terminal-dashboard-stats max-h-[52px] min-h-[52px] min-w-0 flex-1">
          <TerminalStatsModule
            className="h-full w-full"
            symbol={symbol}
            onSymbolChange={setSymbol}
          />
        </div>
      </div>
      <div ref={containerRef} className="terminal-dashboard__grid min-h-0 min-w-0 flex-1">
        {gridMounted && observedGridWidth > 0 ? (
          <Responsive
            className="h-full min-h-0 min-w-0"
            width={observedGridWidth}
            layouts={layouts}
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={ROW_HEIGHT}
            margin={GRID_MARGIN}
            containerPadding={[0, 0]}
            compactor={DASHBOARD_GRID_COMPACTOR}
            constraints={DASHBOARD_GRID_CONSTRAINTS}
            dragConfig={{
              enabled: true,
              bounded: true,
              handle: '.module-drag-handle',
              cancel: DASHBOARD_DRAG_CANCEL,
              threshold: 0,
            }}
            resizeConfig={{
              enabled: true,
              handles: ['se', 'sw'],
              handleComponent: renderResizeHandle,
            }}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleInteractionStart}
            onResizeStart={handleInteractionStart}
            onDragStop={handleInteractionStop}
            onResizeStop={handleInteractionStop}
            onWidthChange={handleWidthChange}
            onBreakpointChange={handleBreakpointChange}
          >
        {isModuleOpen('liquidations') ? (
          <div key="liquidations">
            <LiquidationsPanel onClose={() => handleCloseModule('liquidations')} />
          </div>
        ) : null}
        {isModuleOpen('exchange-liquidations') ? (
          <div key="exchange-liquidations">
            <ExchangeLiquidationsPanel onClose={() => handleCloseModule('exchange-liquidations')} />
          </div>
        ) : null}
        {isModuleOpen('money-flow') ? (
          <div key="money-flow">
            <MoneyFlowPanel onClose={() => handleCloseModule('money-flow')} />
          </div>
        ) : null}
        {isModuleOpen('funding-rates') ? (
          <div key="funding-rates">
            <FundingRatesPanel onClose={() => handleCloseModule('funding-rates')} />
          </div>
        ) : null}
        {isModuleOpen('chart') ? (
          <div key="chart">
            <ChartModule symbol={symbol} />
          </div>
        ) : null}
        {isModuleOpen('positions') ? (
          <div key="positions">
            <PositionsPanel onClose={() => handleCloseModule('positions')} />
          </div>
        ) : null}
        {isModuleOpen('order') ? (
          <div key="order">
            <OrderPanel />
          </div>
        ) : null}
        {isModuleOpen('order-feed') ? (
          <div key="order-feed">
            <OrderFeedPanel onClose={() => handleCloseModule('order-feed')} />
          </div>
        ) : null}
          </Responsive>
        ) : null}
      </div>
    </main>
  );
}
