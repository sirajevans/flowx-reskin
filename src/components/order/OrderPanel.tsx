import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { SwapCurrencyIcon, RiskCheckIcon, OrderWarningIcon } from '../icons';
import {
  CardModule,
  CardModuleTabContent,
  cardModuleTabClass,
  cardModuleTabListClass,
} from '../ui';
import { cn } from '../../lib/utils';
import {
  orderPanelAmountPrefixClass,
  orderPanelCurrencyClass,
  orderPanelCurrencyCodeClass,
  orderPanelFieldAmountClass,
  orderPanelFieldClass,
  orderPanelFieldPercentClass,
  orderPanelFieldShellAmountClass,
  orderPanelFieldShellLimitClass,
  orderPanelFieldShellRiskClass,
  orderPanelFieldSuffixClass,
  orderPanelLabelClass,
  orderPanelLimitFieldClass,
  orderPanelLimitFieldsClass,
  orderPanelRiskRowClass,
  orderPanelRiskToggleCheckClass,
  orderPanelRiskToggleClass,
  orderPanelRiskToggleIndicatorClass,
  orderPanelRiskToggleLabelClass,
  orderPanelRootClass,
  orderPanelSectionClass,
  orderPanelSectionHeaderClass,
  orderPanelSideBtnClass,
  orderPanelSideToggleClass,
  orderPanelStatClass,
  orderPanelStatRightClass,
  orderPanelStatsClass,
  orderPanelSubmitClass,
  orderPanelSubmitNoteClass,
  orderPanelSubmitNoteIconClass,
  orderPanelSubmitNoteTextClass,
  orderPanelSubmitWrapClass,
  orderPanelSwapBtnClass,
} from './orderPanelClasses';
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
  limitPrice: limitPriceProp,
  onLimitPriceChange,
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
  const [internalLimitPrice, setInternalLimitPrice] = useState('');
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
  const limitPrice = limitPriceProp ?? internalLimitPrice;
  const stopLossEnabled = stopLossEnabledProp ?? internalStopLossEnabled;
  const takeProfitEnabled = takeProfitEnabledProp ?? internalTakeProfitEnabled;
  const stopLossValue = stopLossValueProp ?? internalStopLossValue;
  const takeProfitValue = takeProfitValueProp ?? internalTakeProfitValue;
  const showRiskWarning = !stopLossEnabled;

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

  const handleLimitPriceChange = (value: string) => {
    if (limitPriceProp === undefined) setInternalLimitPrice(value);
    onLimitPriceChange?.(value);
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

  const currencyIsBtc = currency === 'BTC';

  const amountField = (
  <>
    <div className={orderPanelSectionHeaderClass}>
      <span className={orderPanelLabelClass}>AMOUNT</span>
      <button
        type="button"
        className={orderPanelCurrencyClass}
        aria-label={`Quote currency: ${currency}. Click to switch.`}
        onClick={handleSwapCurrency}
      >
        <span className={orderPanelSwapBtnClass} aria-hidden>
          <SwapCurrencyIcon className={cn(currencyIsBtc && 'rotate-180')} />
        </span>
        <span className={orderPanelCurrencyCodeClass}>{currency}</span>
      </button>
    </div>
    <div className={orderPanelFieldShellAmountClass}>
      <span className={orderPanelAmountPrefixClass} aria-hidden>
        {currencyIsBtc ? 'BTC' : '$'}
      </span>
      <input
        type="text"
        inputMode="decimal"
        className={cn(orderPanelFieldClass, orderPanelFieldAmountClass)}
        value={amount}
        placeholder="0.00"
        onChange={(event) => {
          let value = event.target.value;
          if (!currencyIsBtc) value = value.replace(/^\$+/, '');
          handleAmountChange(value);
        }}
        aria-label={currencyIsBtc ? 'Order amount in BTC' : 'Order amount in dollars'}
      />
    </div>
  </>
  );

  return (
    <CardModule
      className={cn(orderPanelRootClass, className)}
      ariaLabel="Order widget"
      onClose={onClose}
      header={
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => handleTabChange(key as OrderTab)}
          className="min-w-0"
        >
          <TabList aria-label="Order type" className={cardModuleTabListClass}>
            {TABS.map((tab) => (
              <Tab key={tab.id} id={tab.id} className={cardModuleTabClass}>
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
      <div className={orderPanelSideToggleClass} role="group" aria-label="Order side">
        <button
          type="button"
          className={orderPanelSideBtnClass}
          data-side="sell"
          data-selected={side === 'sell'}
          aria-pressed={side === 'sell'}
          onClick={() => handleSideChange('sell')}
        >
          Sell
        </button>
        <button
          type="button"
          className={orderPanelSideBtnClass}
          data-side="buy"
          data-selected={side === 'buy'}
          aria-pressed={side === 'buy'}
          onClick={() => handleSideChange('buy')}
        >
          Buy
        </button>
      </div>

      <CardModuleTabContent activeTab={activeTab} tabIds={TAB_IDS}>
        {(tabId) => (
          <div className={orderPanelSectionClass}>
            {tabId === 'limit' ? (
              <div className={orderPanelLimitFieldsClass}>
                <div className={orderPanelLimitFieldClass}>
                  <div className={orderPanelSectionHeaderClass}>
                    <span className={orderPanelLabelClass}>PRICE</span>
                  </div>
                  <div className={orderPanelFieldShellLimitClass}>
                    <input
                      type="text"
                      inputMode="decimal"
                      className={orderPanelFieldClass}
                      value={limitPrice}
                      placeholder="0.00"
                      onChange={(event) => handleLimitPriceChange(event.target.value)}
                      aria-label="Limit price"
                    />
                  </div>
                </div>
                <div className={orderPanelLimitFieldClass}>{amountField}</div>
              </div>
            ) : (
              amountField
            )}
          </div>
        )}
      </CardModuleTabContent>

      <div className={orderPanelSectionClass}>
        <div className={orderPanelSectionHeaderClass}>
          <span className={orderPanelLabelClass}>RISK MANAGEMENT</span>
        </div>
        <div className={orderPanelRiskRowClass}>
          <button
            type="button"
            className={orderPanelRiskToggleClass}
            data-enabled={stopLossEnabled}
            aria-pressed={stopLossEnabled}
            onClick={() => handleStopLossEnabledChange(!stopLossEnabled)}
          >
            <span className={orderPanelRiskToggleLabelClass}>Stop loss</span>
            <span className={orderPanelRiskToggleIndicatorClass} aria-hidden>
              <RiskCheckIcon className={orderPanelRiskToggleCheckClass} />
            </span>
          </button>
          <button
            type="button"
            className={orderPanelRiskToggleClass}
            data-enabled={takeProfitEnabled}
            aria-pressed={takeProfitEnabled}
            onClick={() => handleTakeProfitEnabledChange(!takeProfitEnabled)}
          >
            <span className={orderPanelRiskToggleLabelClass}>Take profit</span>
            <span className={orderPanelRiskToggleIndicatorClass} aria-hidden>
              <RiskCheckIcon className={orderPanelRiskToggleCheckClass} />
            </span>
          </button>
        </div>
        <div className={orderPanelRiskRowClass}>
          <div
            className={orderPanelFieldShellRiskClass}
            data-enabled={stopLossEnabled}
          >
            <input
              type="text"
              inputMode="decimal"
              className={cn(orderPanelFieldClass, orderPanelFieldPercentClass)}
              value={stopLossValue}
              placeholder="0.00"
              onChange={(event) =>
                handleStopLossChange(event.target.value.replace(/%/g, '').trim())
              }
              aria-label="Stop loss percentage"
              disabled={!stopLossEnabled}
            />
            <span className={orderPanelFieldSuffixClass} aria-hidden>
              {' %'}
            </span>
          </div>
          <div
            className={orderPanelFieldShellRiskClass}
            data-enabled={takeProfitEnabled}
          >
            <input
              type="text"
              inputMode="decimal"
              className={orderPanelFieldClass}
              value={takeProfitValue}
              onChange={(event) => handleTakeProfitChange(event.target.value)}
              aria-label="Take profit price"
              disabled={!takeProfitEnabled}
            />
          </div>
        </div>
      </div>

      <div className={orderPanelStatsClass}>
        <span className={orderPanelStatClass}>{riskReward}</span>
        <span className={cn(orderPanelStatClass, orderPanelStatRightClass)}>{margin}</span>
      </div>

      <div className={orderPanelSubmitWrapClass} data-warning-visible={showRiskWarning}>
        <button type="button" className={orderPanelSubmitClass} onClick={onPlaceOrder}>
          {formatPlaceOrderLabel(side, price)}
        </button>
        <div
          className={orderPanelSubmitNoteClass}
          aria-hidden={!showRiskWarning}
          aria-live="polite"
        >
          <OrderWarningIcon className={orderPanelSubmitNoteIconClass} />
          <span className={orderPanelSubmitNoteTextClass}>
            Your risk is high, trade with caution.
          </span>
        </div>
      </div>
    </CardModule>
  );
}
