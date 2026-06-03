import type { Layout, LayoutItem, ResponsiveLayouts } from 'react-grid-layout/legacy';

function collides(a: LayoutItem, b: LayoutItem): boolean {
  if (a.i === b.i) return false;
  if (a.x + a.w <= b.x) return false;
  if (a.x >= b.x + b.w) return false;
  if (a.y + a.h <= b.y) return false;
  if (a.y >= b.y + b.h) return false;
  return true;
}

function normalizeItemConstraints(item: LayoutItem): LayoutItem {
  let { minW = 1, maxW = Infinity, minH = 1, maxH = Infinity, w, h } = item;

  if (!Number.isFinite(maxW)) maxW = Infinity;
  if (!Number.isFinite(maxH)) maxH = Infinity;

  if (maxW < minW) {
    minW = Math.min(w, minW, maxW);
    maxW = Math.max(w, maxW, minW);
  }
  if (maxH < minH) {
    minH = Math.min(h, minH, maxH);
    maxH = Math.max(h, maxH, minH);
  }

  w = Math.max(minW, Math.min(maxW, w));
  h = Math.max(minH, Math.min(maxH, h));

  return { ...item, w, h, minW, maxW, minH, maxH };
}

/** Keep stats to the right of the brand badge when they share a row. */
function separateHeaderRow(layout: LayoutItem[]): LayoutItem[] {
  const badge = layout.find((item) => item.i === 'brand-badge');
  const stats = layout.find((item) => item.i === 'stats');
  if (!badge || !stats) return layout;

  const minStatsX = badge.x + badge.w;
  if (stats.x >= minStatsX) return layout;

  return layout.map((item) => {
    if (item.i !== 'stats') return item;
    const x = minStatsX;
    const maxW = item.maxW ?? Infinity;
    const w = Number.isFinite(maxW) ? Math.min(item.w, maxW) : item.w;
    return normalizeItemConstraints({ ...item, x, w: Math.max(1, w) });
  });
}

function repairCollisions(layout: LayoutItem[], defaults: LayoutItem[]): LayoutItem[] {
  const defaultById = new Map(defaults.map((item) => [item.i, item]));
  let repaired = layout.map((item) => {
    const fallback = defaultById.get(item.i);
    const merged = fallback ? { ...fallback, ...item } : item;
    return normalizeItemConstraints(merged);
  });

  repaired = separateHeaderRow(repaired);

  for (let pass = 0; pass < 4; pass += 1) {
    let fixedAny = false;
    for (let i = 0; i < repaired.length; i += 1) {
      for (let j = i + 1; j < repaired.length; j += 1) {
        const a = repaired[i];
        const b = repaired[j];
        if (!a || !b || !collides(a, b)) continue;

        const fallbackA = defaultById.get(a.i);
        const fallbackB = defaultById.get(b.i);
        if (fallbackA) {
          repaired[i] = normalizeItemConstraints({ ...fallbackA });
          fixedAny = true;
        }
        if (fallbackB) {
          repaired[j] = normalizeItemConstraints({ ...fallbackB });
          fixedAny = true;
        }
      }
    }
    repaired = separateHeaderRow(repaired);
    if (!fixedAny) break;
  }

  return repaired;
}

function clampToCols(layout: LayoutItem[], cols: number): LayoutItem[] {
  return layout.map((item) => {
    let { x, w } = item;
    if (x + w > cols) {
      x = Math.max(0, cols - w);
    }
    if (x < 0) x = 0;
    if (w > cols) w = cols;
    return normalizeItemConstraints({ ...item, x, w });
  });
}

export function repairBreakpointLayout(
  layout: Layout,
  cols: number,
  defaults: Layout,
): Layout {
  return clampToCols(repairCollisions([...layout], [...defaults]), cols);
}

export function repairLayouts(
  layouts: ResponsiveLayouts,
  colsByBreakpoint: Record<string, number>,
  defaults: ResponsiveLayouts,
): ResponsiveLayouts {
  return Object.fromEntries(
    Object.entries(layouts).map(([breakpoint, layout]) => {
      const cols = colsByBreakpoint[breakpoint] ?? 1;
      const defaultLayout = defaults[breakpoint] ?? [];
      const repaired = repairBreakpointLayout(layout ?? [], cols, defaultLayout);
      return [breakpoint, repaired];
    }),
  ) as ResponsiveLayouts;
}
