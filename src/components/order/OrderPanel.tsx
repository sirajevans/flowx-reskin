import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { SwapCurrencyIcon, RiskCheckIcon } from '../icons';
import { CardModule, CardModuleTabContent } from '../ui';
import './OrderPanel.css';
import type { OrderPanelProps, OrderCurrency, OrderSide, OrderTab } from './types';

const TABS: { id: OrderTab; label: string }[] = [
  { id: 'market', label: 'Market' },
  { id: 'limit', label: 'Limit' },
];

const TAB_IDS = TABS.map((tab) => tab.id);

function formatPlaceOrderLabel(side: OrderSide, price: string) {
  return `Place ${side} order @ ${price}`;
}

export function OrderPanel({
  className = '',
  activeTab: activeTabProp,
  defaultTab = 'market',
  onTabChange,
  side: sideProp,
  defaultSide = 'buy',
  onSideChange,
  currency: currencyProp,
  defaultCurrency = 'USDT',
  onCurrencyChange,
  amount: amountProp,
  onAmountChange,
  stopLossEnabled: stopLossEnabledProp,
  defaultStopLossEnabled = false,
  onStopLossEnabledChange,
  takeProfitEnabled: takeProfitEnabledProp,
  defaultTakeProfitEnabled = false,
  onTakeProfitEnabledChange,
  stopLossValue: stopLossValueProp,
  onStopLossChange,
  takeProfitValue: takeProfitValueProp,
  onTakeProfitChange,
  riskReward = 'RR 1:3',
  margin = 'MARGIN $21.4 (21%)',
  price = '73,244.6',
  onClose,
  onPlaceOrder,
  onSwapCurrency,
}: OrderPanelProps) {
  const [internalTab, setInternalTab] = useState<OrderTab>(defaultTab);
  const [internalSide, setInternalSide] = useState<OrderSide>(defaultSide);
  const [internalAmount, setInternalAmount] = useState('');
  const [internalStopLossEnabled, setInternalStopLossEnabled] = useState(defaultStopLossEnabled);
  const [internalTakeProfitEnabled, setInternalTakeProfitEnabled] = useState(
    defaultTakeProfitEnabled,
  );
  const [internalStopLossValue, setInternalStopLossValue] = useState('');
  const [internalTakeProfitValue, setInternalTakeProfitValue] = useState('');
  const [internalCurrency, setInternalCurrency] = useState<OrderCurrency>(defaultCurrency);

  const activeTab = activeTabProp ?? internalTab;
  const side = sideProp ?? internalSide;
  const currency = currencyProp ?? internalCurrency;
  const amount = amountProp ?? internalAmount;
  const stopLossEnabled = stopLossEnabledProp ?? internalStopLossEnabled;
  const takeProfitEnabled = takeProfitEnabledProp ?? internalTakeProfitEnabled;
  const stopLossValue = stopLossValueProp ?? internalStopLossValue;
  const takeProfitValue = takeProfitValueProp ?? internalTakeProfitValue;

  const handleTabChange = (tab: OrderTab) => {
    if (activeTabProp === undefined) setInternalTab(tab);
    onTabChange?.(tab);
  };

  const handleSideChange = (nextSide: OrderSide) => {
    if (sideProp === undefined) setInternalSide(nextSide);
    onSideChange?.(nextSide);
  };

  const handleAmountChange = (value: string) => {
    if (amountProp === undefined) setInternalAmount(value);
    onAmountChange?.(value);
  };

  const handleStopLossEnabledChange = (enabled: boolean) => {
    if (stopLossEnabledProp === undefined) setInternalStopLossEnabled(enabled);
    onStopLossEnabledChange?.(enabled);
  };

  const handleTakeProfitEnabledChange = (enabled: boolean) => {
    if (takeProfitEnabledProp === undefined) setInternalTakeProfitEnabled(enabled);
    onTakeProfitEnabledChange?.(enabled);
  };

  const handleStopLossChange = (value: string) => {
    if (stopLossValueProp === undefined) setInternalStopLossValue(value);
    onStopLossChange?.(value);
  };

  const handleTakeProfitChange = (value: string) => {
    if (takeProfitValueProp === undefined) setInternalTakeProfitValue(value);
    onTakeProfitChange?.(value);
  };

  const handleSwapCurrency = () => {
    const next: OrderCurrency = currency === 'USDT' ? 'BTC' : 'USDT';
    if (currencyProp === undefined) setInternalCurrency(next);
    onCurrencyChange?.(next);
    onSwapCurrency?.();
  };

  return (
    <CardModule
      className={`order-panel ${className}`.trim()}
      ariaLabel="Order widget"
      onClose={onClose}
      header={
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => handleTabChange(key as OrderTab)}
          className="min-w-0"
        >
          <TabList aria-label="Order type" className="card-module__tabs">
            {TABS.map((tab) => (
              <Tab key={tab.id} id={tab.id} className="card-module__tab">
                {tab.label}
              </Tab>
            ))}
          </TabList>
          {TABS.map((tab) => (
            <TabPanel key={tab.id} id={tab.id} className="hidden" />
          ))}
        </Tabs>
      }
    >
      <CardModuleTabContent activeTab={activeTab} tabIds={TAB_IDS}>
        {() => (
          <>
        <div className="order-panel__side-toggle" role="group" aria-label="Order side">
        <button
          type="button"
          className="order-panel__side-btn"
          data-side="sell"
          data-selected={side === 'sell'}
          aria-pressed={side === 'sell'}
          onClick={() => handleSideChange('sell')}
        >
          Sell
        </button>
        <button
          type="button"
          className="order-panel__side-btn"
          data-side="buy"
          data-selected={side === 'buy'}
          aria-pressed={side === 'buy'}
          onClick={() => handleSideChange('buy')}
        >
          Buy
        </button>
      </div>

      <div className="order-panel__section">
        <div className="order-panel__section-header">
          <span className="order-panel__label">AMOUNT</span>
          <button
            type="button"
            className={`order-panel__currency ${
              currency === 'BTC' ? 'order-panel__currency--flipped' : ''
            }`.trim()}
            aria-label={`Quote currency: ${currency}. Click to switch.`}
            onClick={handleSwapCurrency}
          >
            <span className="order-panel__swap-btn" aria-hidden>
              <SwapCurrencyIcon />
            </span>
            <span className="order-panel__currency-code">{currency}</span>
          </button>
        </div>
        <div className="order-panel__field-shell order-panel__field-shell--amount gradient-border">
          <span className="order-panel__amount-prefix" aria-hidden>
            {currency === 'BTC' ? 'BTC' : '$'}
          </span>
          <input
            type="text"
            inputMode="decimal"
            className="order-panel__field order-panel__field--amount"
            value={amount}
            placeholder="0.00"
            onChange={(event) => {
              let value = event.target.value;
              if (currency === 'USDT') value = value.replace(/^\$+/, '');
              handleAmountChange(value);
            }}
            aria-label={currency === 'BTC' ? 'Order amount in BTC' : 'Order amount in dollars'}
          />
        </div>
      </div>

      <div className="order-panel__section">
        <div className="order-panel__section-header">
          <span className="order-panel__label">RISK MANAGEMENT</span>
        </div>
        <div className="order-panel__risk-row">
          <button
            type="button"
            className="order-panel__risk-toggle"
            data-enabled={stopLossEnabled}
            aria-pressed={stopLossEnabled}
            onClick={() => handleStopLossEnabledChange(!stopLossEnabled)}
          >
            <span className="order-panel__risk-toggle-label">Stop loss</span>
            <span className="order-panel__risk-toggle-indicator" aria-hidden>
              <RiskCheckIcon className="order-panel__risk-toggle-check" />
            </span>
          </button>
          <button
            type="button"
            className="order-panel__risk-toggle"
            data-enabled={takeProfitEnabled}
            aria-pressed={takeProfitEnabled}
            onClick={() => handleTakeProfitEnabledChange(!takeProfitEnabled)}
          >
            <span className="order-panel__risk-toggle-label">Take profit</span>
            <span className="order-panel__risk-toggle-indicator" aria-hidden>
              <RiskCheckIcon className="order-panel__risk-toggle-check" />
            </span>
          </button>
        </div>
        <div className="order-panel__risk-row">
          <div
            className="order-panel__field-shell order-panel__field-shell--risk gradient-border"
            data-enabled={stopLossEnabled}
          >
            <input
              type="text"
              inputMode="decimal"
              className="order-panel__field order-panel__field--percent"
              value={stopLossValue}
              placeholder="0.00"
              onChange={(event) =>
                handleStopLossChange(event.target.value.replace(/%/g, '').trim())
              }
              aria-label="Stop loss percentage"
              disabled={!stopLossEnabled}
            />
            <span className="order-panel__field-suffix" aria-hidden>
              {' %'}
            </span>
          </div>
          <div
            className="order-panel__field-shell order-panel__field-shell--risk gradient-border"
            data-enabled={takeProfitEnabled}
          >
            <input
              type="text"
              inputMode="decimal"
              className="order-panel__field"
              value={takeProfitValue}
              onChange={(event) => handleTakeProfitChange(event.target.value)}
              aria-label="Take profit price"
              disabled={!takeProfitEnabled}
            />
          </div>
        </div>
      </div>

      <div className="order-panel__stats">
        <span className="order-panel__stat order-panel__label--wide">{riskReward}</span>
        <span className="order-panel__stat order-panel__stat--right order-panel__label--wide">
          {margin}
        </span>
      </div>

      <button type="button" className="order-panel__submit" onClick={onPlaceOrder}>
        {formatPlaceOrderLabel(side, price)}
      </button>
          </>
        )}
      </CardModuleTabContent>
    </CardModule>
  );
}
