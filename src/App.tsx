import { ExchangeLiquidationsPanel } from './components/liquidations/exchange-liquidations';
import { LiquidationsPanel } from './components/liquidations';
import { MoneyFlowPanel } from './components/money-flow';
import { OrderFeedPanel } from './components/order-feed';
import { OrderPanel } from './components/order';
import { PositionsPanel } from './components/positions';
import { TerminalStatsModule } from './components/terminal-stats';

export default function App() {
  return (
    <main className="flex min-h-dvh flex-wrap items-start justify-center gap-6 p-6 md:p-10">
      <TerminalStatsModule className="w-full max-w-[1120px]" />
      <OrderPanel onClose={() => undefined} />
      <OrderFeedPanel onClose={() => undefined} />
      <div className="flex flex-col gap-6">
        <LiquidationsPanel onClose={() => undefined} />
        <ExchangeLiquidationsPanel onClose={() => undefined} />
        <MoneyFlowPanel onClose={() => undefined} />
      </div>
      <PositionsPanel onClose={() => undefined} />
    </main>
  );
}
