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
import { ResizeHandleLeftIcon, ResizeHandleRightIcon } from '../icons';
import { ExchangeLiquidationsPanel } from '../liquidations/exchange-liquidations';
import { LiquidationsPanel } from '../liquidations';
import { MoneyFlowPanel } from '../money-flow';
import { OrderFeedPanel } from '../order-feed';
import { OrderPanel } from '../order';
import { PositionsPanel } from '../positions';
import { TerminalBrandBadgeModule } from '../terminal-brand-badge';
import { terminalBrandBadgeSlotClass } from '../terminal-brand-badge/terminalBrandBadgeClasses';
import { TerminalStatsModule } from '../terminal-stats';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DASHBOARD_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v15';
const FIXED_HEADER_LAYOUT_ITEMS = new Set(['brand-badge', 'stats']);
const PREVIOUS_LAYOUT_STORAGE_KEY = 'flowx-terminal-dashboard-layout:v13';
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
  positions: { width: 794, height: 154 },
  order: { width: 315, height: 374 },
  'order-feed': { width: 315, height: 206 },
};

const DEFAULT_LAYOUTS: ResponsiveLayouts = {
  xxl: [
    { i: 'liquidations', x: 0, y: 0, w: 26, h: 17, minW: 24, minH: 17 },
    { i: 'exchange-liquidations', x: 0, y: 17, w: 26, h: 22, minW: 24, minH: 13 },
    { i: 'money-flow', x: 0, y: 39, w: 26, h: 39, minW: 26, minH: 15 },
    { i: 'chart', x: 26, y: 0, w: 60, h: 59, minW: 16, minH: 24 },
    { i: 'positions', x: 26, y: 59, w: 60, h: 19, minW: 60, minH: 15 },
    { i: 'order', x: 86, y: 0, w: 26, h: 36, minW: 25, minH: 36 },
    { i: 'order-feed', x: 86, y: 36, w: 26, h: 42, minW: 25, minH: 20 },
  ],
  lg: [
    { i: 'liquidations', x: 0, y: 0, w: 12, h: 12, minW: 12, minH: 12 },
    { i: 'exchange-liquidations', x: 0, y: 12, w: 12, h: 16, minW: 12, minH: 12 },
    { i: 'money-flow', x: 0, y: 28, w: 12, h: 28, minW: 12, minH: 20 },
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
  ],
  sm: [
    { i: 'chart', x: 0, y: 0, w: 1, h: 36, minW: 1, minH: 24 },
    { i: 'order', x: 0, y: 36, w: 1, h: 28, minW: 1, minH: 24 },
    { i: 'order-feed', x: 0, y: 64, w: 1, h: 28, minW: 1, minH: 20 },
    { i: 'positions', x: 0, y: 92, w: 1, h: 20, minW: 1, minH: 16 },
    { i: 'liquidations', x: 0, y: 112, w: 1, h: 12, minW: 1, minH: 12 },
    { i: 'exchange-liquidations', x: 0, y: 124, w: 1, h: 16, minW: 1, minH: 12 },
    { i: 'money-flow', x: 0, y: 140, w: 1, h: 40, minW: 1, minH: 40 },
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

function ChartPlaceholder() {
  return (
    <section
      className="module-drag-handle terminal-dashboard-chart gradient-border"
      aria-label="Chart module"
    />
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
      const stripped = stripFixedHeaderFromLayouts(nextLayouts);
      const constrained = applyModuleMinSizeConstraints(stripped, containerWidth, breakpoint);
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
    <main className="terminal-dashboard flex min-h-dvh flex-col gap-1 overflow-x-hidden px-2 py-2">
      <div className="terminal-dashboard__header flex min-w-0 flex-col gap-1 md:flex-row md:items-start">
        <div className={terminalBrandBadgeSlotClass}>
          <TerminalBrandBadgeModule />
        </div>
        <div className="terminal-dashboard-stats min-h-[49px] min-w-0 flex-1">
          <TerminalStatsModule className="h-full w-full" />
        </div>
      </div>
      <ResponsiveGridLayout
        className="terminal-dashboard__grid min-h-0 min-w-0 flex-1"
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
