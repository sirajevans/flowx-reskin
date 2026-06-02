import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { LiquidationChartPoint } from './types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const SHORTS_COLOR = '#06b470';
const LONGS_COLOR = 'rgba(255, 255, 255, 0.35)';

function buildChartConfig(points: LiquidationChartPoint[]) {
  return {
    labels: points.map((point) => point.label),
    datasets: [
      {
        label: 'Shorts',
        data: points.map((point) => point.shorts),
        backgroundColor: SHORTS_COLOR,
        borderRadius: 2,
        borderSkipped: false,
      },
      {
        label: 'Longs',
        data: points.map((point) => point.longs),
        backgroundColor: LONGS_COLOR,
        borderRadius: 2,
        borderSkipped: false,
      },
    ],
  };
}

const CHART_OPTIONS: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1d1d1d',
      borderColor: '#2b2b2b',
      borderWidth: 1,
      titleColor: '#ffffff',
      bodyColor: 'rgba(255, 255, 255, 0.8)',
      titleFont: {
        family: "'CoinbaseText-Regular', 'Coinbase Text', system-ui, sans-serif",
        size: 11,
      },
      bodyFont: {
        family: "'CoinbaseText-Regular', 'Coinbase Text', system-ui, sans-serif",
        size: 11,
      },
      padding: 8,
      callbacks: {
        label: (context) => {
          const value = context.parsed.y;
          if (value == null) return `${context.dataset.label}: —`;

          return `${context.dataset.label}: $${value.toFixed(1)}M`;
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        font: {
          family: "'CoinbaseText-Regular', 'Coinbase Text', system-ui, sans-serif",
          size: 10,
        },
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 8,
      },
    },
    y: {
      stacked: true,
      grid: {
        color: '#2b2b2b',
      },
      border: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        font: {
          family: "'CoinbaseText-Regular', 'Coinbase Text', system-ui, sans-serif",
          size: 10,
        },
        callback: (value) => `$${value}M`,
        maxTicksLimit: 4,
      },
    },
  },
};

export function LiquidationsChart({ points }: { points: LiquidationChartPoint[] }) {
  return (
    <div className="box-border h-[140px] min-w-0 w-full self-stretch" aria-hidden>
      <Bar data={buildChartConfig(points)} options={CHART_OPTIONS} />
    </div>
  );
}
