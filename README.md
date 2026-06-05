# FlowX Reskin

Sandbox for the FlowX terminal UI chrome and trading widgets. The stack mirrors the main app: React 19, Vite 7, TypeScript, Tailwind CSS 4, CSS variable theming, `react-grid-layout`, `cmdk`, Radix primitives, and React Aria tabs.

## Getting Started

```bash
npm install
npm run dev
```

`npm run dev` generates the local coin catalog before starting Vite. Open the local Vite URL in a browser to use the terminal interface.

## Scripts

```bash
npm run dev       # generate coin catalog, then start Vite
npm run build     # generate coin catalog, type-check, then build
npm run preview   # preview the production build
npm test          # run Vitest
npm run lint      # run ESLint
npm run generate:coins
```

`npm run generate:coins` updates `src/generated/coinCatalog` from the generator in `scripts/generateCoinCatalog.mjs`. Run it after changing the source data for asset suggestions or coin icons.

## Using The Interface

The app mounts three top-level pieces in `src/App.tsx`: `TerminalDashboard`, `TerminalCommandMenu`, and `StartupOverlay`.

On load, a short FlowX shader splash screen appears and then fades away. The terminal dashboard is available underneath and does not require sign-in or network data.

The header contains the FlowX brand badge, the active market, market stats, account performance stats, and a user menu. Click the active market chip, such as `BTCUSDT`, to open the asset picker and switch the displayed symbol. The chart header and market icon update to match the selected asset.

The main dashboard is a responsive draggable grid. Drag widget cards from the handle in their header; the chart placeholder can be dragged from its surface. Resize modules from the lower left or lower right resize handles. The layout is persisted in `localStorage` under `flowx-terminal-dashboard-layout:v16`, so the browser keeps user layout changes between reloads.

Use **Reset dashboard layout** in the command menu to clear the saved layout and reload the default arrangement.

## Dashboard Modules

- `Liquidations` shows overall, short, and long liquidation totals with `1h`, `4h`, and `24h` timeframe toggles.
- `Exchange liquidations` compares long and short liquidation totals per exchange.
- `Money flow` displays simulated live money-flow tiers, sentiment, and small flow charts.
- `Chart` is a visual placeholder with active symbol metadata and OHLCV labels.
- `Positions` includes `Positions`, `Open Orders`, and `History` tabs with selectable rows and simulated value updates.
- `Trade panel` supports market and limit tabs, buy/long and sell/short side selection, amount entry, quote/base currency swapping, risk fields, and a place-order button.
- `Order feed` shows simulated tape rows with buy/sell coloring, product filters, and a minimum-value slider.

Most modules are currently mock or simulated UI states. Component props are available for wiring real data later.

## Command Menu

`TerminalCommandMenu` is the global command palette for search, quick actions, and asset selection. It is built with [cmdk](https://github.com/pacocoursey/cmdk) and styled primitives in `src/components/ui/command.tsx`.

Use the shortcuts below on any view where a text field is not focused.

| Input | Behavior |
| --- | --- |
| Type any letter, number, or symbol | Opens the menu and puts that character in the search field |
| `⌘K` on macOS or `Ctrl+K` on Windows/Linux | Opens the menu with an empty search field; press again to close |
| `Escape` | Closes the menu |
| Arrow keys and `Enter` | Navigate and run the highlighted item |

The menu does not open while focus is in an `input`, `textarea`, `select`, or contenteditable field, such as the order amount inputs.

The default command menu includes module labels and actions. Module entries under **Add Modules** are searchable labels until their `value` is wired in `runTerminalCommand`, while **Reset dashboard layout** is active and clears the stored grid layout.

The asset picker reuses the command menu with an asset-focused variant. It opens when the user clicks the market chip in the header and uses `TERMINAL_ASSET_SUGGESTIONS` from the generated coin catalog.

## Extending Commands

Edit `src/components/terminal-command-menu/terminalCommands.ts`.

1. Add an entry to `TERMINAL_COMMAND_GROUPS` with a stable `value`, display `label`, icon, `kind`, and optional `keywords` for fuzzy search.
2. Handle that `value` in `runTerminalCommand`.

```ts
// terminalCommands.ts
{
  value: 'action-toggle-theme',
  label: 'Toggle theme',
  icon: 'reset',
  kind: 'Command',
  keywords: ['dark', 'light'],
}
```

```ts
export function runTerminalCommand(value: string) {
  if (value === 'action-toggle-theme') {
    // Add command behavior here.
  }
}
```

For the same type-to-open behavior in another surface, use `useCommandMenuTypeahead` from `src/hooks/useCommandMenuTypeahead.ts` with your own open and search state plus `CommandDialog` markup.

## Component Map

- `src/components/terminal-dashboard/TerminalDashboard.tsx` owns the responsive grid, layout persistence, active symbol state, and module mounting.
- `src/components/terminal-stats/TerminalStatsModule.tsx` renders the nav stats, market switcher, and user dropdown.
- `src/components/terminal-command-menu/` contains the global command menu, provider, icons, command definitions, and asset picker behavior.
- `src/components/positions/PositionsPanel.tsx` renders positions, open orders, and history tables.
- `src/components/order/OrderPanel.tsx` renders the trade ticket.
- `src/components/order-feed/OrderFeedPanel.tsx` renders the trade tape and filters.
- `src/components/liquidations/` and `src/components/liquidations/exchange-liquidations/` render liquidation widgets.
- `src/components/money-flow/MoneyFlowPanel.tsx` renders money-flow tiers and simulated updates.
- `src/components/ui/` contains reusable cards, command primitives, dropdowns, sliders, tab content helpers, odometer counters, and shared class utilities.
- `src/index.css` contains global theme tokens, Tailwind setup, and app-wide styling.

## Data And State

The interface is designed as a UI sandbox. Default values and mock rows live next to each module, and several modules use local simulated streams to exercise animations and changing numeric states.

Persistent browser state is limited to dashboard layout in `localStorage`. Selecting an asset updates React state for the current session; it is not persisted across reloads.

## Building New Modules

New dashboard widgets must use `CardModule` from `src/components/ui/CardModule.tsx` (also exported from `src/components/ui`) as their shell. Do not build standalone module chrome with custom headers; `CardModule` provides the drag handle, title or tab header slot, optional close control, and body layout consistent with the rest of the terminal.

Follow existing panels such as `PositionsPanel`, `OrderPanel`, and `LiquidationsPanel` for structure: wrap content in `CardModule`, pass `ariaLabel` and `onClose`, and put module-specific UI in the body. Register the new panel in `TerminalDashboard.tsx` and add a command-menu entry in `terminalCommands.ts` when it should be discoverable.

## Reusing UI Primitives

Import shared primitives from `src/components/ui` or directly from a primitive module:

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../components/ui/command';
```

Follow the existing component patterns when adding modules: start from `CardModule`, keep mock data near the component, expose controlled props for future integration, and reuse dropdown, tab, slider, and counter primitives before adding new UI foundations.
