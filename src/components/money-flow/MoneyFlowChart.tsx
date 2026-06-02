import './MoneyFlowChart.css';

const MAX_BAR_HEIGHT_PERCENT = 50;

function getMaxAbsValue(values: readonly number[]): number {
  let max = 0;

  for (const value of values) {
    const abs = Math.abs(value);
    if (abs > max) {
      max = abs;
    }
  }

  return max;
}

export type MoneyFlowChartProps = {
  values: readonly number[];
  className?: string;
  ariaLabel?: string;
};

/**
 * Signed-value sparkline: positive values render green bars above the baseline,
 * negative values render red bars below it. Magnitude is normalized to the
 * largest absolute value in the series.
 */
export function MoneyFlowChart({
  values,
  className = '',
  ariaLabel = 'Money flow over time',
}: MoneyFlowChartProps) {
  const maxAbs = getMaxAbsValue(values);

  return (
    <div
      className={`money-flow-chart ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
      style={{ ['--money-flow-bar-count' as string]: values.length }}
    >
      <div className="money-flow-chart__baseline" aria-hidden />
      {values.map((value, index) => {
        if (value === 0 || maxAbs === 0) {
          return <div key={index} className="money-flow-chart__slot" aria-hidden />;
        }

        const heightPercent = (Math.abs(value) / maxAbs) * MAX_BAR_HEIGHT_PERCENT;
        const tone = value > 0 ? 'bull' : 'bear';

        return (
          <div key={index} className="money-flow-chart__slot" aria-hidden>
            <span
              className={`money-flow-chart__bar money-flow-chart__bar--${tone}`}
              style={{ height: `${heightPercent}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
