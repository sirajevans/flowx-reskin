import {
  useRef,
  useState,
} from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { FundingRateSeries } from './types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const POSITIVE_COLOR = '#06b470';
const NEGATIVE_COLOR = '#f23645';
const DESATURATED_COLOR = '#7d7d7d';
const CROSSHAIR_COLOR = 'rgba(255, 255, 255, 0.22)';
const CROSSHAIR_DASH = [2, 4];
const ZERO_LINE_COLOR = 'rgba(255, 255, 255, 0.16)';
const ZERO_LINE_DASH = [2, 4];
const FUNDING_TOOLTIP_DATE = '19.06.26';
const TOOLTIP_WIDTH = 147;
const TOOLTIP_SIDE_PADDING = 8;
const TOOLTIP_CURSOR_GUTTER_LEFT = 12;
const TOOLTIP_CURSOR_GUTTER_RIGHT = 28;

function withAlpha(hexColor: string, alpha: number) {
  const normalized = hexColor.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function formatSignedFundingRate(rate: number) {
  return `${rate >= 0 ? '+' : ''}${rate.toFixed(4)}%`;
}

function getFundingRateRange(series: FundingRateSeries[]) {
  if (series.length === 0) {
    return {
      min: -0.01,
      max: 0.01,
    };
  }

  const allValues = series.flatMap((exchange) => exchange.points.map((point) => point.rate));
  const allMin = Math.min(...allValues);
  const allMax = Math.max(...allValues);
  const spread = Math.max(allMax - allMin, 0.0018);
  const padding = Math.max(spread * 0.1, 0.00024);

  return {
    min: Math.min(allMin - padding, 0),
    max: Math.max(allMax + padding, 0),
  };
}

function getFundingRateColor(rate: number) {
  return rate < 0 ? NEGATIVE_COLOR : POSITIVE_COLOR;
}

function createLineGradient(chart: ChartJS, color: string) {
  const { chartArea, ctx } = chart;
  if (!chartArea) return color;

  const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
  gradient.addColorStop(0, withAlpha(color, 0));
  gradient.addColorStop(0.22, withAlpha(color, 0.32));
  gradient.addColorStop(1, color);
  return gradient;
}

function createZeroAnchoredAreaGradient(
  chart: ChartJS,
  color: string,
  latestRate: number,
) {
  const { chartArea, ctx, scales } = chart;
  const yScale = scales.y;
  if (!chartArea || !yScale) return withAlpha(color, 0.18);

  const zeroY = yScale.getPixelForValue(0);

  if (latestRate >= 0) {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, zeroY);
    gradient.addColorStop(0, withAlpha(color, 0.22));
    gradient.addColorStop(0.72, withAlpha(color, 0.08));
    gradient.addColorStop(1, withAlpha(color, 0));
    return gradient;
  }

  const gradient = ctx.createLinearGradient(0, zeroY, 0, chartArea.bottom);
  gradient.addColorStop(0, withAlpha(color, 0));
  gradient.addColorStop(0.28, withAlpha(color, 0.08));
  gradient.addColorStop(1, withAlpha(color, 0.22));
  return gradient;
}

function createHorizontalFadeMaskGradient(chart: ChartJS) {
  const { chartArea, ctx } = chart;
  if (!chartArea) return 'rgba(0, 0, 0, 1)';

  const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.22, 'rgba(0, 0, 0, 0.32)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
  return gradient;
}

const fundingRatesAreaFillPlugin = {
  id: 'fundingRatesAreaFill',
  beforeDatasetsDraw(chart: ChartJS<'line'>) {
    const selectedDatasetIndex = chart.data.datasets.findIndex(
      (dataset) => dataset.pointHitRadius === 16,
    );
    const selectedDataset = chart.data.datasets[selectedDatasetIndex];
    const selectedMeta = chart.getDatasetMeta(selectedDatasetIndex);
    const yScale = chart.scales.y;
    const chartArea = chart.chartArea;

    if (
      selectedDatasetIndex < 0 ||
      !selectedDataset ||
      !selectedMeta ||
      !yScale ||
      !chartArea ||
      selectedMeta.hidden
    ) {
      return;
    }

    const points = selectedMeta.data;
    if (points.length < 2) return;

    const latestRate = Number(selectedDataset.data[points.length - 1] ?? 0);
    const fillColor = getFundingRateColor(latestRate);
    const zeroY = yScale.getPixelForValue(0);
    const verticalGradient = createZeroAnchoredAreaGradient(chart, fillColor, latestRate);
    const horizontalMask = createHorizontalFadeMaskGradient(chart);
    const { ctx } = chart;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0]!.x, zeroY);
    ctx.lineTo(points[0]!.x, points[0]!.y);

    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });

    ctx.lineTo(points[points.length - 1]!.x, zeroY);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = verticalGradient;
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.right - chartArea.left,
      chartArea.bottom - chartArea.top,
    );

    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = horizontalMask;
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.right - chartArea.left,
      chartArea.bottom - chartArea.top,
    );
    ctx.restore();
  },
};

const fundingRatesCrosshairPlugin = {
  id: 'fundingRatesCrosshair',
  afterDatasetsDraw(chart: ChartJS<'line'>) {
    const activeElements = chart.tooltip?.getActiveElements() ?? [];
    const chartArea = chart.chartArea;
    const selectedDatasetIndex = chart.data.datasets.findIndex(
      (dataset) => dataset.pointHitRadius === 16,
    );
    const activeElement =
      activeElements.find((element) => element.datasetIndex === selectedDatasetIndex) ??
      activeElements[0];
    if (!activeElement || !chartArea) return;

    const dataIndex = activeElement.index;
    const point = activeElement.element;
    const value = Number(
      chart.data.datasets[activeElement.datasetIndex]?.data?.[dataIndex] ?? 0,
    );
    const pointColor = getFundingRateColor(value);

    const { ctx } = chart;
    const { x, y } = point;

    ctx.save();
    ctx.setLineDash(CROSSHAIR_DASH);
    ctx.strokeStyle = CROSSHAIR_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};

const fundingRatesZeroLinePlugin = {
  id: 'fundingRatesZeroLine',
  afterDraw(chart: ChartJS<'line'>) {
    const yScale = chart.scales.y;
    const chartArea = chart.chartArea;
    if (!yScale || !chartArea || yScale.min > 0 || yScale.max < 0) return;

    const y = yScale.getPixelForValue(0);
    const { ctx } = chart;

    ctx.save();
    ctx.setLineDash(ZERO_LINE_DASH);
    ctx.strokeStyle = ZERO_LINE_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.restore();
  },
};

function buildChartData(
  series: FundingRateSeries[],
  selectedExchangeId: string,
): ChartData<'line'> {
  return {
    labels: series[0]?.points.map((point) => point.label) ?? [],
    datasets: series.map((exchange) => {
      const latestRate = exchange.points[exchange.points.length - 1]?.rate ?? 0;
      const isSelected = exchange.id === selectedExchangeId;
      const lineColor = isSelected ? getFundingRateColor(latestRate) : DESATURATED_COLOR;

      return {
        label: exchange.exchange,
        data: exchange.points.map((point) => point.rate),
        fill: false,
        borderColor: (context: { chart: ChartJS }) =>
          createLineGradient(context.chart, lineColor),
        backgroundColor: withAlpha(lineColor, 0),
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: isSelected ? 16 : 10,
        tension: 0,
      };
    }),
  };
}

function getTooltipRows(
  series: FundingRateSeries[],
  selectedExchangeId: string,
  dataIndex: number,
) {
  const selectedSeries = series.find((exchange) => exchange.id === selectedExchangeId);
  const remainingSeries = series.filter((exchange) => exchange.id !== selectedExchangeId);

  return [...(selectedSeries ? [selectedSeries] : []), ...remainingSeries].map((exchange) => ({
    id: exchange.id,
    exchange: exchange.exchange,
    rate: exchange.points[dataIndex]?.rate ?? 0,
    isSelected: exchange.id === selectedExchangeId,
  }));
}

type FundingTooltipState = {
  dataIndex: number;
  x: number;
  y: number;
};

export function FundingRatesChart({
  series,
  selectedExchangeId,
}: {
  series: FundingRateSeries[];
  selectedExchangeId: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tooltipState, setTooltipState] = useState<FundingTooltipState | null>(null);
  const yRange = getFundingRateRange(series);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    layout: {
      padding: {
        top: 6,
        bottom: 4,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: ({ tooltip }) => {
          if (tooltip.opacity === 0 || tooltip.dataPoints.length === 0) {
            setTooltipState((current) => (current ? null : current));
            return;
          }

          const nextState = {
            dataIndex: tooltip.dataPoints[0]?.dataIndex ?? 0,
            x: tooltip.caretX,
            y: tooltip.caretY,
          };

          setTooltipState((current) => {
            if (
              current?.dataIndex === nextState.dataIndex &&
              current.x === nextState.x &&
              current.y === nextState.y
            ) {
              return current;
            }

            return nextState;
          });
        },
        callbacks: {
          label: () => '',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        min: yRange.min,
        max: yRange.max,
        grid: {
          color: 'rgba(255, 255, 255, 0)',
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const tooltipRows = tooltipState
    ? getTooltipRows(series, selectedExchangeId, tooltipState.dataIndex)
    : [];
  const hoveredPoint = tooltipState
    ? series[0]?.points[tooltipState.dataIndex]
    : null;
  const tooltipHeight = 36 + 4 + tooltipRows.length * 16;
  const wrapperWidth = wrapperRef.current?.clientWidth ?? 0;
  const wrapperHeight = wrapperRef.current?.clientHeight ?? 0;
  const tooltipLeft = tooltipState
    ? (() => {
        const rightPlacement = tooltipState.x + TOOLTIP_CURSOR_GUTTER_RIGHT;
        const leftPlacement =
          tooltipState.x - TOOLTIP_WIDTH - TOOLTIP_CURSOR_GUTTER_LEFT;
        const maxLeft = Math.max(
          wrapperWidth - TOOLTIP_WIDTH - TOOLTIP_SIDE_PADDING,
          TOOLTIP_SIDE_PADDING,
        );

        if (rightPlacement <= maxLeft) {
          return rightPlacement;
        }

        if (leftPlacement >= TOOLTIP_SIDE_PADDING) {
          return leftPlacement;
        }

        return Math.min(
          Math.max(rightPlacement, TOOLTIP_SIDE_PADDING),
          maxLeft,
        );
      })()
    : 0;
  const tooltipTop = tooltipState
    ? (() => {
        const preferredTop = tooltipState.y - tooltipHeight - 12;
        if (preferredTop >= 6) return preferredTop;

        return Math.min(
          Math.max(tooltipState.y + 12, 6),
          Math.max(wrapperHeight - tooltipHeight - 6, 6),
        );
      })()
    : 0;

  return (
    <div
      ref={wrapperRef}
      className="relative -left-[10px] -top-[10px] -mb-[20px] h-[128px] min-w-0 w-[calc(100%+10px)] px-2 pb-2 pt-2.5"
      aria-hidden
    >
      {tooltipState && hoveredPoint ? (
        <div
          className="pointer-events-none absolute z-20 flex w-[147px] flex-col items-start gap-[3px] overflow-clip rounded-[10px] bg-[rgba(14,14,14,0.8)] px-[9px] py-2 antialiased backdrop-blur-[4px] [font-synthesis:none]"
          style={{
            left: tooltipLeft,
            top: tooltipTop,
          }}
        >
          <div className="flex min-w-0 self-stretch items-center justify-between">
            <div className="w-max shrink-0 font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] text-[10px]/3 tracking-[0.05em] text-[#FFFFFF80]">
              {FUNDING_TOOLTIP_DATE}
            </div>
            <div className="w-max shrink-0 text-right font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] text-[10px]/3 tracking-[0.05em] text-[#FFFFFF80]">
              {hoveredPoint.label}
            </div>
          </div>
          <div className="flex h-1.5 w-full shrink-0 flex-col items-center justify-center">
            <div className="h-px w-full bg-[#2B2B2B]" />
          </div>
          {tooltipRows.map((row) => (
            <div
              key={row.id}
              className="flex min-w-0 self-stretch items-center justify-between gap-4"
            >
              <div
                className="w-max shrink-0 font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] text-[10px]/3 tracking-[0.05em]"
                style={{
                  color: row.isSelected ? '#FFFFFF' : '#FFFFFF80',
                }}
              >
                {row.exchange}
              </div>
              <div
                className="w-max shrink-0 text-right font-['CoinbaseText-Regular','Coinbase_Text',system-ui,sans-serif] text-[10px]/3 tracking-[0.05em]"
                style={{
                  color: row.isSelected
                    ? row.rate < 0
                      ? NEGATIVE_COLOR
                      : POSITIVE_COLOR
                    : '#FFFFFF80',
                }}
              >
                {formatSignedFundingRate(row.rate)}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <Line
        data={buildChartData(series, selectedExchangeId)}
        options={options}
        plugins={[
          fundingRatesAreaFillPlugin,
          fundingRatesZeroLinePlugin,
          fundingRatesCrosshairPlugin,
        ]}
      />
    </div>
  );
}
