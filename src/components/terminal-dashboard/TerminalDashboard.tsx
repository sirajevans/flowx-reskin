import { useCallback, useEffect, useRef, useState, type Ref } from 'react';
import { repairLayouts } from './layoutRepair';
import {
  Responsive,
  WidthProvider,
  type Layout,
  type LayoutItem,
  type ResizeHandleAxis,
  type ResponsiveLayouts,
} from 'react-grid-layout/legacy';
import { DragModuleIcon, ResizeHandleLeftIcon, ResizeHandleRightIcon } from '../icons';
import { ExchangeLiquidationsPanel } from '../liquidations/exchange-liquidations';
import { LiquidationsPanel } from '../liquidations';
import { MoneyFlowPanel } from '../money-flow';
import { OrderFeedPanel } from '../order-feed';
import { OrderPanel } from '../order';
import { PositionsPanel } from '../positions';
import { TerminalBrandBadgeModule } from '../terminal-brand-badge';
import {
  TERMINAL_BRAND_BADGE_HEIGHT_PX,
  TERMINAL_BRAND_BADGE_WIDTH_PX,
  terminalBrandBadgeSlotClass,
} from '../terminal-brand-badge/terminalBrandBadgeClasses';
import { TerminalStatsModule } from '../terminal-stats';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DASHBOARD_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v12';
const LEGACY_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v9';

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

/** Prefer the largest w whose reserved width still fits within target px. */
function gridUnitsForPxMaxAtMost(px: number, unitSize: number, margin: number) {
  let units = 1;
  while (gridItemWidthPx(units + 1, unitSize, margin) <= px) {
    units += 1;
  }
  return units;
}

function brandBadgeLayoutCaps(
  breakpoint: DashboardBreakpoint,
): Pick<LayoutItem, 'maxW' | 'maxH'> {
  const defaults = DEFAULT_LAYOUTS[breakpoint]?.find((entry) => entry.i === 'brand-badge');
  return { maxW: defaults?.maxW, maxH: defaults?.maxH };
}

function fitBrandBadgeItem(
  item: LayoutItem,
  containerWidth: number,
  cols: number,
  breakpoint: DashboardBreakpoint,
): LayoutItem {
  if (item.i !== 'brand-badge') return item;

  const marginX = GRID_MARGIN[0];
  const marginY = GRID_MARGIN[1];
  const colUnit = gridColWidth(containerWidth, cols, marginX);
  const { maxW: maxColsW, maxH: maxRowsH } = brandBadgeLayoutCaps(breakpoint);
  const fittedW = gridUnitsForPxMaxAtMost(TERMINAL_BRAND_BADGE_WIDTH_PX, colUnit, marginX);
  const fittedH = gridUnitsForPxMaxAtMost(TERMINAL_BRAND_BADGE_HEIGHT_PX, ROW_HEIGHT, marginY);
  const w = maxColsW === undefined ? fittedW : Math.min(fittedW, maxColsW);
  const h = maxRowsH === undefined ? fittedH : Math.min(fittedH, maxRowsH);

  return {
    ...item,
    w,
    h,
    minW: w,
    maxW: w,
    minH: h,
    maxH: h,
    static: true,
    isDraggable: false,
    isResizable: false,
  };
}

function fitBrandBadgeLayouts(
  layouts: ResponsiveLayouts,
  containerWidth: number,
  breakpoint: DashboardBreakpoint,
): ResponsiveLayouts {
  if (containerWidth <= 0 || breakpoint === 'sm') return layouts;

  const cols = COLS[breakpoint];
  const layout = layouts[breakpoint];
  if (!layout) return layouts;

  return {
    ...layouts,
    [breakpoint]: layout.map((item) => fitBrandBadgeItem(item, containerWidth, cols, breakpoint)),
  };
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

const GRID_MARGIN: [number, number] = [4, 4];
const ROW_HEIGHT = ROW_PITCH_PX - GRID_MARGIN[1];

const MODULE_MIN_SIZES_PX: Partial<Record<string, { width: number; height: number }>> = {
  liquidations: { width: 302, height: 174 },
  'exchange-liquidations': { width: 302, height: 133 },
  'money-flow': { width: 302, height: 154 },
  positions: { width: 794, height: 154 },
};

const DEFAULT_LAYOUTS: ResponsiveLayouts = {
  xxl: [
    {
      i: 'brand-badge',
      x: 0,
      y: 0,
      w: 11,
      h: 5,
      minW: 11,
      maxW: 11,
      minH: 5,
      maxH: 5,
      static: true,
      isDraggable: false,
      isResizable: false,
    },
    { i: 'stats', x: 11, y: 0, w: 101, h: 5, minW: 32, minH: 4, maxH: 8 },
    { i: 'liquidations', x: 0, y: 5, w: 26, h: 17, minW: 26, minH: 17 },
    { i: 'exchange-liquidations', x: 0, y: 22, w: 26, h: 22, minW: 26, minH: 13 },
    { i: 'money-flow', x: 0, y: 44, w: 26, h: 39, minW: 26, minH: 15 },
    { i: 'chart', x: 26, y: 5, w: 60, h: 59, minW: 16, minH: 24 },
    { i: 'positions', x: 26, y: 64, w: 60, h: 19, minW: 60, minH: 15 },
    { i: 'order', x: 86, y: 5, w: 26, h: 33, minW: 12, minH: 24 },
    { i: 'order-feed', x: 86, y: 38, w: 26, h: 45, minW: 12, minH: 20 },
  ],
  lg: [
    {
      i: 'brand-badge',
      x: 0,
      y: 0,
      w: 5,
      h: 5,
      minW: 5,
      maxW: 5,
      minH: 5,
      maxH: 5,
      static: true,
      isDraggable: false,
      isResizable: false,
    },
    { i: 'stats', x: 5, y: 0, w: 43, h: 4, minW: 24, minH: 4, maxH: 8 },
    { i: 'liquidations', x: 0, y: 4, w: 12, h: 12, minW: 12, minH: 12 },
    { i: 'exchange-liquidations', x: 0, y: 16, w: 12, h: 16, minW: 12, minH: 12 },
    { i: 'money-flow', x: 0, y: 32, w: 12, h: 28, minW: 12, minH: 20 },
    { i: 'chart', x: 12, y: 4, w: 24, h: 40, minW: 16, minH: 24 },
    { i: 'positions', x: 12, y: 44, w: 24, h: 16, minW: 16, minH: 12 },
    { i: 'order', x: 36, y: 4, w: 12, h: 28, minW: 12, minH: 24 },
    { i: 'order-feed', x: 36, y: 32, w: 12, h: 28, minW: 12, minH: 20 },
  ],
  md: [
    {
      i: 'brand-badge',
      x: 0,
      y: 0,
      w: 5,
      h: 5,
      minW: 5,
      maxW: 5,
      minH: 5,
      maxH: 5,
      static: true,
      isDraggable: false,
      isResizable: false,
    },
    { i: 'stats', x: 5, y: 0, w: 27, h: 8, minW: 16, minH: 4, maxH: 12 },
    { i: 'chart', x: 0, y: 8, w: 20, h: 36, minW: 16, minH: 24 },
    { i: 'order', x: 20, y: 8, w: 12, h: 28, minW: 12, minH: 24 },
    { i: 'order-feed', x: 20, y: 36, w: 12, h: 28, minW: 12, minH: 20 },
    { i: 'positions', x: 0, y: 44, w: 20, h: 16, minW: 16, minH: 12 },
    { i: 'liquidations', x: 0, y: 60, w: 12, h: 12, minW: 12, minH: 12 },
    { i: 'exchange-liquidations', x: 12, y: 60, w: 12, h: 16, minW: 12, minH: 12 },
    { i: 'money-flow', x: 0, y: 76, w: 12, h: 28, minW: 12, minH: 20 },
  ],
  sm: [
    {
      i: 'brand-badge',
      x: 0,
      y: 0,
      w: 1,
      h: 6,
      minW: 1,
      minH: 5,
      static: true,
      isDraggable: false,
      isResizable: false,
    },
    { i: 'stats', x: 0, y: 6, w: 1, h: 12, minW: 1, minH: 8 },
    { i: 'chart', x: 0, y: 18, w: 1, h: 36, minW: 1, minH: 24 },
    { i: 'order', x: 0, y: 54, w: 1, h: 28, minW: 1, minH: 24 },
    { i: 'order-feed', x: 0, y: 82, w: 1, h: 28, minW: 1, minH: 20 },
    { i: 'positions', x: 0, y: 110, w: 1, h: 20, minW: 1, minH: 16 },
    { i: 'liquidations', x: 0, y: 130, w: 1, h: 12, minW: 1, minH: 12 },
    { i: 'exchange-liquidations', x: 0, y: 142, w: 1, h: 16, minW: 1, minH: 12 },
    { i: 'money-flow', x: 0, y: 158, w: 1, h: 28, minW: 1, minH: 20 },
  ],
};

function normalizeBrandBadgeItem(item: LayoutItem, breakpoint: DashboardBreakpoint): LayoutItem {
  if (item.i !== 'brand-badge') return item;

  const defaults = DEFAULT_LAYOUTS[breakpoint]?.find((entry) => entry.i === 'brand-badge');

  return {
    ...item,
    x: defaults?.x ?? item.x,
    y: defaults?.y ?? item.y,
    static: true,
    isDraggable: false,
    isResizable: false,
  };
}

function normalizeLayouts(layouts: ResponsiveLayouts): ResponsiveLayouts {
  return Object.fromEntries(
    Object.entries(layouts).map(([breakpoint, layout]) => [
      breakpoint,
      (layout ?? []).map((item) =>
        normalizeBrandBadgeItem(item, breakpoint as DashboardBreakpoint),
      ),
    ]),
  ) as ResponsiveLayouts;
}

function prepareLayouts(layouts: ResponsiveLayouts): ResponsiveLayouts {
  const normalized = normalizeLayouts(layouts);
  const cleared = Object.fromEntries(
    Object.entries(normalized).map(([breakpoint, layout]) => [
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

function ChartPlaceholder() {
  return (
    <section className="terminal-dashboard-chart" aria-label="Chart module placeholder">
      <span className="module-drag-handle terminal-dashboard-chart__drag" aria-hidden>
        <DragModuleIcon />
      </span>
      <div className="terminal-dashboard-chart__content">
        <p className="terminal-dashboard-chart__eyebrow">Chart module</p>
        <p className="terminal-dashboard-chart__title">Reserved trading chart area</p>
      </div>
    </section>
  );
}

function StatsModuleShell() {
  return (
    <div className="terminal-dashboard-stats">
      <span className="module-drag-handle terminal-dashboard-stats__drag" aria-hidden>
        <DragModuleIcon />
      </span>
      <TerminalStatsModule className="h-full w-full" />
    </div>
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
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(loadStoredLayouts);
  const [gridMetrics, setGridMetrics] = useState<{ width: number; breakpoint: DashboardBreakpoint }>({
    width: 0,
    breakpoint: 'xxl',
  });
  const isInteractingRef = useRef(false);

  const finalizeLayouts = useCallback(
    (nextLayouts: ResponsiveLayouts, containerWidth: number, breakpoint: DashboardBreakpoint) => {
      const synced = fitBrandBadgeLayouts(normalizeLayouts(nextLayouts), containerWidth, breakpoint);
      const constrained = applyModuleMinSizeConstraints(synced, containerWidth, breakpoint);
      return repairLayouts(constrained, COLS, DEFAULT_LAYOUTS);
    },
    [],
  );

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

  const handleInteractionStart = () => {
    isInteractingRef.current = true;
  };

  const handleInteractionStop = (currentLayout: Layout) => {
    isInteractingRef.current = false;
    setLayouts((prev) => {
      const nextLayouts = {
        ...prev,
        [gridMetrics.breakpoint]: currentLayout,
      };
      if (gridMetrics.width <= 0) return prev;
      const finalized = finalizeLayouts(
        nextLayouts,
        gridMetrics.width,
        gridMetrics.breakpoint,
      );
      persistLayouts(finalized);
      return finalized;
    });
  };

  const handleWidthChange = (containerWidth: number) => {
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

  const noopClose = () => undefined;

  return (
    <main className="terminal-dashboard min-h-dvh overflow-x-hidden px-2 py-2">
      <ResponsiveGridLayout
        className="terminal-dashboard__grid"
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        margin={GRID_MARGIN}
        containerPadding={[0, 0]}
        compactType={null}
        preventCollision
        isBounded
        draggableHandle=".module-drag-handle"
        draggableCancel="button,input,textarea,select,a,[role='button'],[role='tab'],[data-no-drag]"
        resizeHandles={['se', 'sw']}
        resizeHandle={renderResizeHandle}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleInteractionStart}
        onResizeStart={handleInteractionStart}
        onDragStop={handleInteractionStop}
        onResizeStop={handleInteractionStop}
        onWidthChange={handleWidthChange}
        onBreakpointChange={handleBreakpointChange}
      >
        <div key="brand-badge" className={terminalBrandBadgeSlotClass}>
          <TerminalBrandBadgeModule />
        </div>
        <div key="stats">
          <StatsModuleShell />
        </div>
        <div key="liquidations">
          <LiquidationsPanel onClose={noopClose} />
        </div>
        <div key="exchange-liquidations">
          <ExchangeLiquidationsPanel onClose={noopClose} />
        </div>
        <div key="money-flow">
          <MoneyFlowPanel onClose={noopClose} />
        </div>
        <div key="chart">
          <ChartPlaceholder />
        </div>
        <div key="positions">
          <PositionsPanel onClose={noopClose} />
        </div>
        <div key="order">
          <OrderPanel onClose={noopClose} />
        </div>
        <div key="order-feed">
          <OrderFeedPanel onClose={noopClose} />
        </div>
      </ResponsiveGridLayout>
    </main>
  );
}
