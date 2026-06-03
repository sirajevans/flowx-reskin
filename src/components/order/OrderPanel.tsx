import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { SwapCurrencyIcon, RiskManagementExpandIcon, OrderWarningIcon } from '../icons';
import {
  CardModule,
  CardModuleTabContent,
  cardModuleTabClass,
  cardModuleTabListClass,
} from '../ui';
import { cn } from '../../lib/utils';
import { OrderAmountSlider } from './OrderAmountSlider';
import { convertAmountForCurrency, parseOrderStatAmount } from './orderUtils';
import {
  orderPanelBodyGapClass,
  orderPanelAmountPrefixClass,
  orderPanelCurrencyClass,
  orderPanelCurrencyCodeClass,
  orderPanelFieldAmountClass,
  orderPanelFieldClass,
  orderPanelFieldShellAmountClass,
  orderPanelFieldShellLimitClass,
  orderPanelFieldShellRiskClass,
  orderPanelLabelClass,
  orderPanelLimitFieldClass,
  orderPanelLimitFieldsClass,
  orderPanelRiskExpandIconClass,
  orderPanelRiskFieldsInnerClass,
  orderPanelRiskFieldsSlotClass,
  orderPanelRiskHeaderBtnClass,
  orderPanelRiskRowClass,
  orderPanelRootClass,
  orderPanelSectionClass,
  orderPanelSectionHeaderClass,
  orderPanelSideBtnClass,
  orderPanelSideToggleClass,
  orderPanelSubmitClass,
  orderPanelSubmitNoteClass,
  orderPanelSubmitNoteIconClass,
  orderPanelSubmitNoteTextClass,
  orderPanelSubmitWrapClass,
  orderPanelSwapBtnClass,
} from './orderPanelClasses';
import { OrderPanelStats } from './OrderPanelStats';
import type { OrderPanelProps, OrderCurrency, OrderSide, OrderTab } from './types';

const TABS: { id: OrderTab; label: string }[] = [
  { id: 'market', label: 'Market' },
  { id: 'limit', label: 'Limit' },
];

const TAB_IDS = TABS.map((tab) => tab.id);

function formatPlaceOrderLabel(side: OrderSide, tab: OrderTab, price: string) {
  const orderType = tab === 'limit' ? 'limit' : 'order';
  return `Place ${side} ${orderType} @ ${price}`;
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
  stopLossValue: stopLossValueProp,
  onStopLossChange,
  takeProfitValue: takeProfitValueProp,
  onTakeProfitChange,
  equity,
  liqPrice,
  max,
  cost,
  margin,
  price = '73,244.6',
  onClose,
  onPlaceOrder,
  onSwapCurrency,
}: OrderPanelProps) {
  const [internalTab, setInternalTab] = useState<OrderTab>(defaultTab);
  const [internalSide, setInternalSide] = useState<OrderSide>(defaultSide);
  const [internalAmount, setInternalAmount] = useState('');
  const [internalLimitPrice, setInternalLimitPrice] = useState('');
  const [internalStopLossValue, setInternalStopLossValue] = useState('');
  const [internalTakeProfitValue, setInternalTakeProfitValue] = useState('');
  const [internalCurrency, setInternalCurrency] = useState<OrderCurrency>(defaultCurrency);
  const [riskExpanded, setRiskExpanded] = useState(false);

  const activeTab = activeTabProp ?? internalTab;
  const side = sideProp ?? internalSide;
  const currency = currencyProp ?? internalCurrency;
  const amount = amountProp ?? internalAmount;
  const limitPrice = limitPriceProp ?? internalLimitPrice;
  const stopLossValue = stopLossValueProp ?? internalStopLossValue;
  const takeProfitValue = takeProfitValueProp ?? internalTakeProfitValue;
  const showRiskWarning = !stopLossValue.trim();

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

  const handleLimitPriceChange = (value: string) => {
    if (limitPriceProp === undefined) setInternalLimitPrice(value);
    onLimitPriceChange?.(value);
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
    const priceValue = parseOrderStatAmount(price);

    if (amount.trim() && priceValue > 0) {
      handleAmountChange(convertAmountForCurrency(amount, currency, next, priceValue));
    }

    if (currencyProp === undefined) setInternalCurrency(next);
    onCurrencyChange?.(next);
    onSwapCurrency?.();
  };

  const currencyIsBtc = currency === 'BTC';

  const amountInputs = (
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

  const riskFieldsRow = (
    <div className={orderPanelRiskRowClass}>
      <div className={orderPanelFieldShellRiskClass} data-enabled={riskExpanded}>
        <input
          type="text"
          inputMode="decimal"
          className={orderPanelFieldClass}
          value={stopLossValue}
          placeholder="SL Price"
          onChange={(event) => handleStopLossChange(event.target.value)}
          aria-label="Stop loss price"
          disabled={!riskExpanded}
        />
      </div>
      <div className={orderPanelFieldShellRiskClass} data-enabled={riskExpanded}>
        <input
          type="text"
          inputMode="decimal"
          className={orderPanelFieldClass}
          value={takeProfitValue}
          placeholder="TP Price"
          onChange={(event) => handleTakeProfitChange(event.target.value)}
          aria-label="Take profit price"
          disabled={!riskExpanded}
        />
      </div>
    </div>
  );

  return (
    <CardModule
      className={cn(orderPanelRootClass, className)}
      bodyClassName={orderPanelBodyGapClass}
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
                <div className={orderPanelLimitFieldClass}>{amountInputs}</div>
              </div>
            ) : (
              <div className={orderPanelSectionClass}>{amountInputs}</div>
            )}
          </div>
        )}
      </CardModuleTabContent>

      <OrderAmountSlider
        amount={amount}
        onAmountChange={handleAmountChange}
        equity={equity}
        price={price}
        currency={currency}
      />

      <div className={orderPanelSectionClass}>
        <button
          type="button"
          className={orderPanelRiskHeaderBtnClass}
          data-expanded={riskExpanded}
          aria-expanded={riskExpanded}
          onClick={() => setRiskExpanded((expanded) => !expanded)}
        >
          <span className={orderPanelLabelClass}>RISK MANAGEMENT</span>
          <RiskManagementExpandIcon className={orderPanelRiskExpandIconClass} />
        </button>
        <div
          className={orderPanelRiskFieldsSlotClass}
          data-expanded={riskExpanded ? '' : undefined}
        >
          <div className={orderPanelRiskFieldsInnerClass}>{riskFieldsRow}</div>
        </div>
      </div>

      <OrderPanelStats
        liqPrice={liqPrice}
        max={max}
        cost={cost}
        margin={margin}
      />

      <div className={orderPanelSubmitWrapClass} data-warning-visible={showRiskWarning}>
        <button type="button" className={orderPanelSubmitClass} onClick={onPlaceOrder}>
          {formatPlaceOrderLabel(side, activeTab, price)}
        </button>
        <div
          className={orderPanelSubmitNoteClass}
          aria-hidden={!showRiskWarning}
          aria-live="polite"
        >
          <OrderWarningIcon className={orderPanelSubmitNoteIconClass} />
          <span className={orderPanelSubmitNoteTextClass}>
            You have no stop loss, trade with caution.
          </span>
        </div>
      </div>
    </CardModule>
  );
}
